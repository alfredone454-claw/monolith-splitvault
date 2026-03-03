use anchor_lang::prelude::*;

// Import the Group struct from group_manager
use anchor_lang::solana_program::pubkey::Pubkey;

declare_id!("ExpSpl111111111111111111111111111111111111");

#[program]
pub mod expense_splitter {
    use super::*;

    /// Create a new expense in a group
    pub fn create_expense(
        ctx: Context<CreateExpense>,
        description: String,
        total_amount: u64,
        split_type: SplitType,
        split_values: Option<Vec<u64>>, // For custom split: percentages or amounts
    ) -> Result<()> {
        let expense = &mut ctx.accounts.expense;
        let group = &ctx.accounts.group;
        
        require!(group.active, SplitVaultError::GroupInactive);
        require!(
            group.members.contains(&ctx.accounts.payer.key()),
            SplitVaultError::NotGroupMember
        );
        
        // Calculate splits based on type
        let splits = calculate_splits(
            total_amount,
            &group.members,
            split_type,
            split_values.clone(),
        )?;
        
        expense.creator = ctx.accounts.payer.key();
        expense.group = ctx.accounts.group.key();
        expense.description = description;
        expense.total_amount = total_amount;
        expense.split_type = split_type;
        expense.split_values = split_values.unwrap_or_default();
        expense.splits = splits;
        expense.created_at = Clock::get()?.unix_timestamp;
        expense.settled = false;
        
        msg!("Expense created: {} - {} lamports", expense.key(), total_amount);
        Ok(())
    }

    /// Mark expense as settled
    pub fn settle_expense(ctx: Context<SettleExpense>) -> Result<()> {
        let expense = &mut ctx.accounts.expense;
        
        require!(
            expense.creator == ctx.accounts.creator.key(),
            SplitVaultError::Unauthorized
        );
        require!(!expense.settled, SplitVaultError::AlreadySettled);
        
        expense.settled = true;
        msg!("Expense settled: {}", expense.key());
        Ok(())
    }
}

fn calculate_splits(
    total: u64,
    members: &[Pubkey],
    split_type: SplitType,
    values: Option<Vec<u64>>,
) -> Result<Vec<Split>> {
    let mut splits = Vec::new();
    
    match split_type {
        SplitType::Equal => {
            let member_count = members.len() as u64;
            let amount_per_member = total / member_count;
            let remainder = total % member_count;
            
            for (i, member) in members.iter().enumerate() {
                let amount = if i == 0 {
                    amount_per_member + remainder // First member gets remainder
                } else {
                    amount_per_member
                };
                
                splits.push(Split {
                    member: *member,
                    amount,
                    paid: false,
                });
            }
        }
        SplitType::Percentage => {
            if let Some(percentages) = values {
                let total_percentage: u64 = percentages.iter().sum();
                require!(total_percentage == 100, SplitVaultError::InvalidPercentage);
                
                for (i, member) in members.iter().enumerate() {
                    let percentage = percentages.get(i).copied().unwrap_or(0);
                    let amount = (total * percentage) / 100;
                    
                    splits.push(Split {
                        member: *member,
                        amount,
                        paid: false,
                    });
                }
            } else {
                return Err(SplitVaultError::MissingSplitValues.into());
            }
        }
        SplitType::Exact => {
            if let Some(amounts) = values {
                let total_split: u64 = amounts.iter().sum();
                require!(total_split == total, SplitVaultError::AmountMismatch);
                
                for (i, member) in members.iter().enumerate() {
                    let amount = amounts.get(i).copied().unwrap_or(0);
                    
                    splits.push(Split {
                        member: *member,
                        amount,
                        paid: false,
                    });
                }
            } else {
                return Err(SplitVaultError::MissingSplitValues.into());
            }
        }
    }
    
    Ok(splits)
}

#[derive(Accounts)]
pub struct CreateExpense<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + Expense::MAX_SIZE
    )]
    pub expense: Account<'info, Expense>,
    /// CHECK: Group account from group_manager program
    pub group: AccountInfo<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SettleExpense<'info> {
    #[account(mut)]
    pub expense: Account<'info, Expense>,
    pub creator: Signer<'info>,
}

#[account]
pub struct Expense {
    pub creator: Pubkey,
    pub group: Pubkey,
    pub description: String,
    pub total_amount: u64,
    pub split_type: SplitType,
    pub split_values: Vec<u64>,        // Percentages or exact amounts
    pub splits: Vec<Split>,             // Final calculated splits
    pub created_at: i64,
    pub settled: bool,
}

impl Expense {
    pub const MAX_SIZE: usize = 32 +       // creator
        32 +                               // group
        4 + 100 +                          // description (max 100 chars)
        8 +                                // total_amount
        1 +                                // split_type
        4 + (8 * 50) +                     // split_values (max 50 values)
        4 + (Split::SIZE * 50) +           // splits (max 50 splits)
        8 +                                // created_at
        1;                                  // settled
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq)]
pub enum SplitType {
    Equal,       // Split equally among all members
    Percentage,  // Custom percentages
    Exact,       // Custom exact amounts
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Split {
    pub member: Pubkey,
    pub amount: u64,
    pub paid: bool,
}

impl Split {
    pub const SIZE: usize = 32 + 8 + 1; // pubkey + amount + paid flag
}

#[error_code]
pub enum SplitVaultError {
    #[msg("Unauthorized action")]
    Unauthorized,
    #[msg("Group is not active")]
    GroupInactive,
    #[msg("Not a group member")]
    NotGroupMember,
    #[msg("Expense already settled")]
    AlreadySettled,
    #[msg("Missing split values")]
    MissingSplitValues,
    #[msg("Percentage total must be 100")]
    InvalidPercentage,
    #[msg("Amount mismatch")]
    AmountMismatch,
}
