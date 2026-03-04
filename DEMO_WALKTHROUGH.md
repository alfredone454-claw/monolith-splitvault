# SplitVault - Demo Walkthrough
**Date:** 2026-03-04  
**Duration:** ~5 minutes  
**Target:** Monolith Hackathon Judges

---

## 🎬 Opening (0:00-0:30)

### The Problem
> "Splitting bills with friends is annoying."
> 
Traditional solutions are:
- ❌ **Centralized** - Companies own your data
- ❌ **Slow** - Bank transfers take 1-3 days
- ❌ **Geographic restrictions** - Venmo only works in the US
- ❌ **No crypto** - Fiat-only for Web3 natives

---

## 💡 The Solution (0:30-0:45)

**SplitVault** - Decentralized bill splitting on Solana

Key features:
- ⚡ **Instant settlement** (~400ms blocks)
- 🔗 **On-chain transparency** - Every transaction verifiable
- 🌍 **Global** - No geographic restrictions
- 💰 **Crypto-native** - Pay with SOL/USDC

---

## 🏗️ Architecture Overview (0:45-1:15)

```
┌─────────────────────────────────────────────────────────┐
│                    MOBILE APP                           │
│              (React Native + Expo)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Group   │ │ Expense  │ │ Balance  │ │ Settle   │  │
│  │  Screen  │ │  Screen  │ │  Screen  │ │  Screen  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       └────────────┴────────────┴────────────┘         │
│                         │                              │
│              ┌──────────┴──────────┐                   │
│              │    Solana Web3.js    │                   │
│              │   Mobile Wallet      │                   │
│              │   Adapter (MWA)      │                   │
│              └──────────┬──────────┘                   │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 SOLANA DEVNET                           │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────┐ │
│  │ group_manager  │  │expense_splitter│  │settlement_│ │
│  │                │  │                │  │   engine  │ │
│  │ - create_group │  │ - create_exp  │  │ - pay_debt│ │
│  │ - add_members  │  │ - settle_exp   │  │           │ │
│  └────────────────┘  └────────────────┘  └───────────┘ │
│         │                     │              │         │
│         └─────────────────────┴──────────────┘         │
│                    Smart Contracts                    │
│                      (Anchor/Rust)                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 Screen Flow Demo (1:15-2:45)

### Screen 1: Groups List
```
┌─────────────────────┐
│  SplitVault    +    │
│─────────────────────│
│                     │
│  🍕 Dinner Squad    │
│     4 members • $0  │
│                     │
│  ✈️ Travel Buddies    │
│     3 members • $120│
│                     │
│  🏠 Roommates        │
│     2 members • $0  │
│                     │
└─────────────────────┘
    Tap a group to view
```

### Screen 2: Group Details + Expenses
```
┌─────────────────────┐
│  ◀ Dinner Squad 😋  │
│─────────────────────│
│                     │
│  💰 Total: $240     │
│  👥 4 members       │
│                     │
│─── Expenses ────────│
│                     │
│  🍕 Friday Dinner    │
│     $120 • Alice     │
│     Split: 4 ways    │
│     Status: Active   │
│                     │
│  🍻 Drinks           │
│     $60 • Bob        │
│     Split: Equal     │
│     Status: Settled  │
│                     │
│    [+ Add Expense]   │
└─────────────────────┘
```

### Screen 3: Add Expense
```
┌─────────────────────┐
│  ◀ Add Expense      │
│─────────────────────┐
│                     │
│  Amount: $120       │
│                     │
│  Description:       │
│  ┌─────────────────┐│
│  │ Friday Dinner 🍕 ││
│  └─────────────────┘│
│                     │
│  Split Type:        │
│  ○ Equal (4 ways)  │
│  ● Percentage        │
│  ○ Exact amounts     │
│                     │
│  ┌─────────────────┐│
│  │  Alice: 40%     ││
│  │  Bob: 30%       ││
│  │  Carol: 20%      ││
│  │  Dave: 10%       ││
│  └─────────────────┘│
│                     │
│     [Confirm Split] │
└─────────────────────┘
```

### Screen 4: Settle Debts
```
┌─────────────────────┐
│  ◀ Balances         │
│─────────────────────┐
│                     │
│  📊 Group Balances: │
│                     │
│  Alice: +$72  (owed)│
│  Bob: -$24   (owes) │
│  Carol: -$24 (owes) │
│  Dave: -$24  (owes) │
│                     │
│─── Your Debts ──────│
│                     │
│  You owe Alice $24  │
│                     │
│  ┌─────────────────┐│
│  │ Pay with USDC   ││  ◀── Mobile Wallet
│  └─────────────────┘│      Adapter (Phantom/
│                     │      Solflare integrated)
│  ┌─────────────────┐│
│  │ Pay with SOL    ││
│  └─────────────────┘│
└─────────────────────┘
```

---

## 🔧 Smart Contract Code (2:45-3:45)

### group_manager (Rust/Anchor)
```rust
#[program]
pub mod group_manager {
    use super::*;

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
        
        msg!("Group created: {}", group.key());
        Ok(())
    }
}

#[account]
pub struct Group {
    pub creator: Pubkey,
    pub name: String,
    pub members: Vec<Pubkey>,
    pub created_at: i64,
    pub active: bool,
}

// Program ID: 33LuG9n23n8GgmGWyLUy7y1PHmEjAK1XGW66gV5cDmjL
```

### expense_splitter (Rust/Anchor)
```rust
pub fn create_expense(
    ctx: Context<CreateExpense>,
    description: String,
    total_amount: u64,
    split_type: SplitType,
    split_values: Option<Vec<u64>>,
) -> Result<()> {
    let expense = &mut ctx.accounts.expense;
    let group = &ctx.accounts.group;
    
    // Verify caller is group member
    require!(
        group.members.contains(&ctx.accounts.payer.key()),
        SplitVaultError::NotGroupMember
    );
    
    // Calculate splits (Equal, Percentage, or Exact)
    let splits = calculate_splits(
        total_amount,
        &group.members,
        split_type,
        split_values,
    )?;
    
    expense.splits = splits;
    expense.settled = false;
    
    msg!("Expense created: {}", expense.key());
    Ok(())
}

// Program ID: 3Jr6HyXcZecfZhNpP4r8ZaQerPuvpk5Qzkx4cgdX2VEE
```

### settlement_engine (Rust/Anchor)
```rust
pub fn pay_debt(ctx: Context<PayDebt>, amount: u64) -> Result<()> {
    let expense = &mut ctx.accounts.expense;
    let payer = &ctx.accounts.payer;
    let receiver = &ctx.accounts.receiver;
    
    // Transfer SOL via system program
    let ix = system_instruction::transfer(
        &payer.key(),
        &receiver.key(),
        amount,
    );
    
    invoke(&ix, &[payer.to_account_info(), receiver.to_account_info()])?;
    
    // Mark as paid
    split.paid = true;
    
    // Auto-settle if all paid
    if expense.splits.iter().all(|s| s.paid) {
        expense.settled = true;
        msg!("Expense fully settled!");
    }
    
    Ok(())
}

// Program ID: 35SeWG8aR3qyhWdZRdHCHE8Mpg5fV2RTi8nyYP2XP2Q4
```

---

## 📲 Mobile Wallet Adapter Integration (3:45-4:15)

```typescript
// services/mwa.ts
import { transact } from "@solana-mobile/mobile-wallet-adapter";

export async function connectWallet() {
  return await transact(async (wallet) => {
    const { accounts } = await wallet.authorize({
      cluster: "devnet",
      identity: {
        name: "SplitVault",
        uri: "https://splitvault.xyz",
        icon: "/icon.png",
      },
    }