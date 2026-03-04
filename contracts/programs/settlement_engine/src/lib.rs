use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;

declare_id!("35SeWG8aR3qyhWdZRdHCHE8Mpg5fV2RTi8nyYP2XP2Q4");

#[program]
pub mod settlement_engine {
    use super::*;

    /// Pay a debt for a specific expense
    pub fn pay_debt(ctx: Context<PayDebt>, amount: u64) -> Result<()> {
        let expense = &mut ctx.accounts.expense;
        let payer = &ctx.accounts.payer;
        let receiver = &ctx.accounts.receiver;

        require!(!expense.settled, SettlementError::ExpenseAlreadySettled);
        
        // Find the split for this payer
        let split_index = expense.splits.iter().position(|s| s.member == payer.key())
            .ok_or(SettlementError::NotParticipant)?;
            
        let split = &mut expense.splits[split_index];
        require!(!split.paid, SettlementError::AlreadyPaid);
        require!(amount >= split.amount, SettlementError::InsufficientAmount);

        // Execute transfer
        let ix = system_instruction::transfer(
            &payer.key(),
            &receiver.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                payer.to_account_info(),
                receiver.to_account_info(),
            ],
        )?;

        split.paid = true;
        msg!("Debt paid: {} lamports from {} to {}", amount, payer.key(), receiver.key());
        
        // Check if all splits are paid
        if expense.splits.iter().all(|s| s.paid) {
            expense.settled = true;
            msg!("Expense fully settled!");
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct PayDebt<'info> {
    #[account(mut)]
    pub expense: Account<'info, Expense>,
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: Receiver is the creator of the expense (who is owed)
    #[account(mut, constraint = receiver.key() == expense.creator)]
    pub receiver: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Expense {
    pub creator: Pubkey,
    pub group: Pubkey,
    pub description: String,
    pub total_amount: u64,
    pub split_type: u8,
    pub split_values: Vec<u64>,
    pub splits: Vec<Split>,
    pub created_at: i64,
    pub settled: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Split {
    pub member: Pubkey,
    pub amount: u64,
    pub paid: bool,
}

#[error_code]
pub enum SettlementError {
    #[msg("Expense is already fully settled")]
    ExpenseAlreadySettled,
    #[msg("Payer is not a participant in this expense")]
    NotParticipant,
    #[msg("This debt has already been paid")]
    AlreadyPaid,
    #[msg("Insufficient amount to pay debt")]
    InsufficientAmount,
}
