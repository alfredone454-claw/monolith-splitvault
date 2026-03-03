# SplitVault - Solana Mobile dApp

## 🏆 Monolith Hackathon 2026 Submission

**Concept:** Mobile-first bill splitting dApp on Solana  
**Deadline:** 9 Marzo 2026  
**Prize Pool:** $250K USDC  
**Track:** Mobile dApps

---

## Problem Statement
Splitting bills with friends is annoying. Existing apps (Venmo, Splitwise) are:
- ❌ Centralized (company owns your data)
- ❌ Slow settlements (bank transfers take days)
- ❌ Fiat-only (no crypto option)
- ❌ No global access (regional restrictions)

## Solution
**SplitVault** - Instant, decentralized bill splitting on Solana:
- ✅ Group creation on-chain
- ✅ Expense splitting with SOL/USDC
- ✅ Instant settlement via smart contract
- ✅ Mobile Wallet Adapter integration
- ✅ Seed Vault security

---

## Tech Stack

### Frontend
- **Framework:** React Native (cross-platform Android/iOS)
- **UI:** React Native Paper (Material Design)
- **Solana:** @solana/web3.js + Mobile Wallet Adapter
- **Navigation:** React Navigation

### Smart Contract
- **Framework:** Anchor (Rust)
- **Programs:**
  - `group_manager` - Create/manage groups
  - `expense_splitter` - Create/split expenses
  - `settlement_engine` - Settle debts

### Infrastructure
- **RPC:** Helius
- **Wallet:** Mobile Wallet Adapter (Phantom/Solflare)
- **Security:** Seed Vault hardware-backed signing

---

## MVP Features (7-Day Scope)

### Core (Must-Have)
1. **Create Group** - On-chain group with members
2. **Add Expense** - Amount + split logic (equal/custom)
3. **View Balances** - Who owes what
4. **Settle Up** - Pay debts via smart contract

### Bonus (If Time Permits)
5. **Expense History** - Transaction log
6. **Push Notifications** - New expenses/debts
7. **Receipt Upload** - Image to expense (optional)

---

## Project Structure
```
monolith-splitvault/
├── app/                    # React Native app
│   ├── src/
│   │   ├── screens/       # UI screens
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # Solana/web3 services
│   │   └── utils/         # Utilities
│   ├── package.json
│   └── android/           # Android-specific
├── contracts/             # Anchor programs
│   ├── programs/
│   │   ├── group_manager/
│   │   ├── expense_splitter/
│   │   └── settlement_engine/
│   ├── tests/
│   └── Anchor.toml
├── docs/                  # Documentation
│   ├── PITCH.md
│   ├── DEMO_SCRIPT.md
│   └── SUBMISSION.md
└── assets/                # Images, demos
```

---

## Development Timeline

### Day 1 (Mar 2) ✅ Research Complete
- ✅ Hackathon strategy analyzed
- ✅ Tech stack selected
- ✅ Concept validated

### Day 2 (Mar 3) 🔄 Setup & Scaffold
- [ ] Environment setup (Android Studio, Solana CLI)
- [ ] React Native project init
- [ ] Mobile Wallet Adapter integration
- [ ] Basic navigation structure
- [ ] Anchor project init

### Day 3 (Mar 4) Smart Contracts
- [ ] Group manager program
- [ ] Expense splitter program
- [ ] Settlement engine program
- [ ] Basic tests

### Day 4 (Mar 5) Frontend Core
- [ ] Group creation screen
- [ ] Add expense screen
- [ ] Balance view screen
- [ ] Settle up flow

### Day 5 (Mar 6) Integration
- [ ] Frontend ↔ Contract integration
- [ ] Transaction signing with MWA
- [ ] Error handling
- [ ] UI polish

### Day 6 (Mar 7) Polish & Demo
- [ ] Final UI polish
- [ ] Demo video recording
- [ ] Documentation

### Day 7 (Mar 8) SUBMISSION
- [ ] Final testing
- [ ] Submit to Monolith portal

---

## Submission Checklist

- [ ] Functional Android APK
- [ ] Demo video (2-3 min)
- [ ] GitHub repo (public)
- [ ] Pitch deck (5 slides max)
- [ ] dApp Store ready resources

---

## Team
**Solo Developer:** OpenClaw (Badrone)

---

*Created: 2026-03-03 00:30 UTC*
*Status: Day 2 - Setup Phase 🚀*
