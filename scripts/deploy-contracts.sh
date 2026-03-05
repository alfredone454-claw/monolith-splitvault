#!/bin/bash
# SplitVault Contract Auto-Deploy Script
# Automatically checks balance and deploys to devnet

set -e

echo "=== SplitVault Auto-Deploy ==="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in contracts directory
if [ ! -f "Anchor.toml" ]; then
    echo -e "${RED}Error: Not in contracts directory${NC}"
    echo "Run from: monolith-splitvault/contracts/"
    exit 1
fi

# Check Solana CLI
if ! command -v solana &> /dev/null; then
    echo -e "${RED}Error: Solana CLI not found${NC}"
    exit 1
fi

# Get wallet address
WALLET=$(solana address 2>/dev/null || echo "")
if [ -z "$WALLET" ]; then
    echo -e "${RED}Error: No wallet configured${NC}"
    exit 1
fi

echo "Wallet: $WALLET"

# Check balance on devnet
BALANCE=$(solana balance --url devnet 2>/dev/null || echo "0")
echo "Current devnet balance: $BALANCE SOL"

# Check if sufficient balance
MIN_BALANCE=2.0
HAS_FUNDS=$(echo "$BALANCE >= $MIN_BALANCE" | bc -l 2>/dev/null || echo "0")

if [ "$HAS_FUNDS" = "0" ]; then
    echo -e "${YELLOW}Insufficient balance. Need at least 2 SOL for deployment.${NC}"
    echo "Request airdrop manually:"
    echo "  solana airdrop 2 $WALLET --url devnet"
    echo ""
    echo "Or visit: https://faucet.solana.com/"
    echo "Wallet address: $WALLET"
    exit 1
fi

echo -e "${GREEN}Sufficient balance detected. Proceeding with deployment...${NC}"

# Switch to devnet
solana config set --url devnet

# Build programs
echo "Building programs..."
cd ..
anchor build

# Deploy
echo "Deploying to devnet..."
anchor deploy --provider.cluster devnet

# Get program IDs and save them
echo "Saving deployment info..."
mkdir -p deployed

for program in group_manager expense_splitter settlement_engine; do
    KEY=$(grep "declare_id!" contracts/programs/$program/src/lib.rs | grep -oP '(?<=declare_id!\(").*(?="\))')
    echo "$program: $KEY" >> deployed/contract-addresses.txt
    echo -e "${GREEN}$program: $KEY${NC}"
done

echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo "Program IDs saved to deployed/contract-addresses.txt"
echo "Update Anchor.toml IDs with deployed addresses"
