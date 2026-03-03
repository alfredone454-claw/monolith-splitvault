use anchor_lang::prelude::*;

declare_id!("GmMgr11111111111111111111111111111111111111");

#[program]
pub mod group_manager {
    use super::*;

    /// Create a new group for bill splitting
    pub fn create_group(
        ctx: Context<CreateGroup>,
        name: String,
        member_pubkeys: Vec<Pubkey>,
    ) -> Result<()> {
        let group = &mut ctx.accounts.group;
        group.creator = ctx.accounts.creator.key();
        group.name = name;
        group.members = member_pubkeys;
        group.created_at = Clock::get()?.unix_timestamp;
        group.active = true;
        
        // Add creator to members if not already included
        if !group.members.contains(&ctx.accounts.creator.key()) {
            group.members.push(ctx.accounts.creator.key());
        }
        
        msg!("Group created: {}", group.key());
        Ok(())
    }

    /// Add member to existing group
    pub fn add_member(ctx: Context<AddMember>, member: Pubkey) -> Result<()> {
        let group = &mut ctx.accounts.group;
        
        require!(
            group.creator == ctx.accounts.creator.key(),
            SplitVaultError::Unauthorized
        );
        
        require!(
            !group.members.contains(&member),
            SplitVaultError::MemberAlreadyExists
        );
        
        group.members.push(member);
        msg!("Member added: {}", member);
        Ok(())
    }

    /// Remove member from group
    pub fn remove_member(ctx: Context<RemoveMember>, member: Pubkey) -> Result<()> {
        let group = &mut ctx.accounts.group;
        
        require!(
            group.creator == ctx.accounts.creator.key(),
            SplitVaultError::Unauthorized
        );
        
        group.members.retain(|&m| m != member);
        msg!("Member removed: {}", member);
        Ok(())
    }

    /// Close/deactivate group
    pub fn close_group(ctx: Context<CloseGroup>) -> Result<()> {
        let group = &mut ctx.accounts.group;
        
        require!(
            group.creator == ctx.accounts.creator.key(),
            SplitVaultError::Unauthorized
        );
        
        group.active = false;
        msg!("Group closed: {}", group.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateGroup<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Group::MAX_SIZE
    )]
    pub group: Account<'info, Group>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddMember<'info> {
    #[account(mut)]
    pub group: Account<'info, Group>,
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct RemoveMember<'info> {
    #[account(mut)]
    pub group: Account<'info, Group>,
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseGroup<'info> {
    #[account(mut)]
    pub group: Account<'info, Group>,
    pub creator: Signer<'info>,
}

#[account]
pub struct Group {
    pub creator: Pubkey,
    pub name: String,
    pub members: Vec<Pubkey>,
    pub created_at: i64,
    pub active: bool,
}

impl Group {
    pub const MAX_SIZE: usize = 32 +       // creator
        4 + 50 +                           // name (max 50 chars)
        4 + (32 * 50) +                    // members (max 50 members)
        8 +                                // created_at
        1;                                  // active
}

#[error_code]
pub enum SplitVaultError {
    #[msg("Unauthorized action")]
    Unauthorized,
    #[msg("Member already exists")]
    MemberAlreadyExists,
    #[msg("Member not found")]
    MemberNotFound,
    #[msg("Group is not active")]
    GroupInactive,
}
