# SplitVault - Pitch Deck

## 🎯 Vision

**SplitVault** envisions a world where splitting expenses with friends is instant, transparent, and borderless. No more chasing friends for money, no more waiting for bank transfers, no more "I'll pay you back later." Just scan, split, and settle—instantly.

> *"The future of money is instant, global, and programmable. SplitVault brings that future to your dinner table."*

---

## 😫 The Problem

### Current bill-splitting is broken:

| Issue | Real Impact |
|-------|-------------|
| **Centralized Control** | Companies store your financial data, transaction history, and social graph |
| **Slow Settlements** | Bank transfers take 1-3 business days (or longer internationally) |
| **Fiat-Only** | No crypto option for Web3-native users |
| **Geographic Restrictions** | Apps like Venmo work only in specific countries |
| **Trust Issues** | No transparent record of who owes what |

### The "Dinner Problem"
> 5 friends go to dinner. The bill is $240. One person pays. Now they need to:
> 1. Calculate splits manually
> 2. Ask everyone to download an app
> 3. Wait 2-3 days for bank transfers
> 4. Hope everyone actually pays

**This happens millions of times per day.**

---

## 💡 The Solution

### SplitVault: Decentralized Bill Splitting on Solana

**Core Features:**

1. **⚡ Instant Settlement**
   - Solana's 400ms block time = money moves now, not tomorrow

2. **🔗 On-Chain Groups**
   - Smart contract-managed groups with transparent member lists

3. **💰 Multi-Token Support**
   - Pay with SOL or USDC (more tokens coming)

4. **📱 Mobile-First**
   - Native React Native app with Mobile Wallet Adapter

5. **🔐 Seed Vault Security**
   - Hardware-backed signing (Samsung Galaxy devices / Saga)

---

## 🛠️ How It Works

### User Flow

```
1. Create Group → On-chain group created via Anchor program
2. Add Expense → Smart contract splits among members
3. View Balances → Real-time on-chain balance tracking
4. Settle Up → Instant USDC/SOL transfer via smart contract
```

### Smart Contract Architecture

```
┌─────────────────────────────────────────┐
│           SplitVault Programs            │
├─────────────────────────────────────────┤
│  group_manager    → Create/manage groups │
│  expense_splitter → Split logic        │
│  settlement_engine → Debt settlement    │
└─────────────────────────────────────────┘
```

---

## 📊 Why Solana?

| Feature | Solana | Traditional Banking |
|---------|--------|---------------------|
| Settlement Time | 400ms | 1-3 days |
| Transaction Cost | ~$0.00025 | $0.25-$35 |
| Global Access | ✅ Yes | ❌ Limited |
| Programmable | ✅ Yes | ❌ No |
| Mobile Wallet | ✅ Seed Vault | ❌ N/A |

---

## 🗺️ Roadmap

### Monolith Hackathon (March 2026)
- ✅ MVP smart contracts (3 programs)
- ✅ React Native mobile app
- ✅ Mobile Wallet Adapter integration
- 🎯 Submit by March 9, 2026

### Phase 1: Core Launch (Q2 2026)
- Recurring expense support
- Push notifications
- Expense categories

### Phase 2: DeFi Integration (Q3 2026)
- Auto-earn on unsettled balances
- USDC yield integration
- Cross-group credit scoring

### Phase 3: Global Expansion (Q4 2026)
- International remittance features
- Multi-sig group treasuries
- B2B expense management

---

## 🏆 Why SplitVault Wins

1. **Real Problem** → Everyone splits bills
2. **Unique Angle** → Mobile-first + Solana-native
3. **Demonstrable** → Working MVP in 7 days
4. **Scalable** → Smart contracts ready for growth
5. **Solana-Native** → Leverages Seed Vault, MWA, speed

---

*"Don't let payments ruin the friendship."*
