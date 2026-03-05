/**
 * SplitVault - Test del flusso completo
 * Simulazione locale del flusso di business
 */

const { PublicKey } = require('@solana/web3.js');
const BN = require('bn.js');

// Simulazione dello stato
class SplitVaultSimulator {
  constructor() {
    this.groups = new Map();
    this.expenses = new Map();
    this.balances = new Map();
    this.nextGroupId = 1;
    this.nextExpenseId = 1;
  }

  // 1. Crea gruppo
  createGroup(creator, name, members) {
    const groupId = `group_${this.nextGroupId++}`;
    
    // Aggiungi creator se non presente
    const allMembers = new Set(members.map(m => m.toString()));
    allMembers.add(creator.toString());
    
    const group = {
      id: groupId,
      creator: creator.toString(),
      name,
      members: Array.from(allMembers).map(m => new PublicKey(m)),
      createdAt: Date.now(),
      active: true,
      expenses: []
    };
    
    this.groups.set(groupId, group);
    
    // Inizializza balances per il gruppo
    for (const member of allMembers) {
      const key = `${groupId}_${member}`;
      this.balances.set(key, 0);
    }
    
    console.log('\n✅ GRUPPO CREATO');
    console.log(`   ID: ${groupId}`);
    console.log(`   Nome: ${name}`);
    console.log(`   Creator: ${creator.toString().slice(0, 8)}...`);
    console.log(`   Membri: ${allMembers.size}`);
    
    return groupId;
  }

  // 2. Aggiungi spesa
  createExpense(groupId, payer, description, totalAmount, splitType = 'equal', splitValues = null) {
    const group = this.groups.get(groupId);
    if (!group) throw new Error('Group not found');
    if (!group.active) throw new Error('Group is not active');
    if (!group.members.find(m => m.toString() === payer.toString())) {
      throw new Error('Payer is not a group member');
    }

    const expenseId = `exp_${this.nextExpenseId++}`;
    
    // Calcola splits
    const splits = this.calculateSplits(
      totalAmount,
      group.members,
      splitType,
      splitValues
    );
    
    const expense = {
      id: expenseId,
      groupId,
      creator: payer.toString(),
      description,
      totalAmount,
      splitType,
      splits,
      createdAt: Date.now(),
      settled: false,
      payments: new Map()
    };
    
    this.expenses.set(expenseId, expense);
    group.expenses.push(expenseId);
    
    // Aggiorna balances
    for (const split of splits) {
      const key = `${groupId}_${split.member.toString()}`;
      const current = this.balances.get(key) || 0;
      
      if (split.member.toString() === payer.toString()) {
        // Chi ha pagato "presta" agli altri
        const lent = totalAmount - split.amount;
        this.balances.set(key, current + lent);
      } else {
        // Gli altri "devono" al payer
        this.balances.set(key, current - split.amount);
      }
    }
    
    console.log('\n💰 SPESA AGGIUNTA');
    console.log(`   ID: ${expenseId}`);
    console.log(`   Descrizione: ${description}`);
    console.log(`   Totale: ${totalAmount / 1_000_000_000} SOL`);
    console.log(`   Tipo split: ${splitType}`);
    console.log(`   Splits: ${splits.length} membri`);
    
    return expenseId;
  }

  // 3. Calcola split
  calculateSplits(total, members, splitType, splitValues) {
    const splits = [];
    const memberCount = members.length;
    
    switch (splitType) {
      case 'equal': {
        const baseAmount = Math.floor(total / memberCount);
        const remainder = total - (baseAmount * memberCount);
        
        for (let i = 0; i < members.length; i++) {
          splits.push({
            member: members[i],
            amount: i === 0 ? baseAmount + remainder : baseAmount,
            paid: false
          });
        }
        break;
      }
        
      case 'percentage': {
        if (!splitValues || splitValues.length !== members.length) {
          throw new Error('Invalid percentage values');
        }
        const totalPct = splitValues.reduce((a, b) => a + b, 0);
        if (totalPct !== 100) throw new Error('Percentages must sum to 100');
        
        for (let i = 0; i < members.length; i++) {
          const amount = Math.floor((total * splitValues[i]) / 100);
          splits.push({
            member: members[i],
            amount,
            paid: false
          });
        }
        break;
      }
        
      case 'exact': {
        if (!splitValues || splitValues.length !== members.length) {
          throw new Error('Invalid exact values');
        }
        const totalSplit = splitValues.reduce((a, b) => a + b, 0);
        if (totalSplit !== total) throw new Error('Exact amounts must sum to total');
        
        for (let i = 0; i < members.length; i++) {
          splits.push({
            member: members[i],
            amount: splitValues[i],
            paid: false
          });
        }
        break;
      }
        
      default:
        throw new Error('Unknown split type');
    }
    
    return splits;
  }

  // 4. Verifica saldi
  getBalances(groupId) {
    const group = this.groups.get(groupId);
    if (!group) throw new Error('Group not found');
    
    const balances = [];
    let totalOwed = 0;
    let totalOwe = 0;
    
    console.log('\n📊 BILANCI GRUPPO');
    console.log('=' .repeat(50));
    
    for (const member of group.members) {
      const key = `${groupId}_${member.toString()}`;
      const balance = this.balances.get(key) || 0;
      const balanceSol = balance / 1_000_000_000;
      
      if (balance > 0) {
        totalOwed += balance;
        console.log(`   ${member.toString().slice(0, 12)}...: +${balanceSol.toFixed(4)} SOL (deve a lui)`);
      } else if (balance < 0) {
        totalOwe += Math.abs(balance);
        console.log(`   ${member.toString().slice(0, 12)}...: ${balanceSol.toFixed(4)} SOL (deve pagare)`);
      } else {
        console.log(`   ${member.toString().slice(0, 12)}...: 0.0000 SOL (in pari)`);
      }
      
      balances.push({
        member: member.toString(),
        balance
      });
    }
    
    console.log('=' .repeat(50));
    console.log(`   Totale crediti: ${(totalOwed / 1_000_000_000).toFixed(4)} SOL`);
    console.log(`   Totale debiti: ${(totalOwe / 1_000_000_000).toFixed(4)} SOL`);
    console.log(`   Netto: ${((totalOwed - totalOwe) / 1_000_000_000).toFixed(4)} SOL`);
    
    return balances;
  }

  // Simula pagamento debito
  payDebt(groupId, from, to, amount) {
    const fromKey = `${groupId}_${from.toString()}`;
    const toKey = `${groupId}_${to.toString()}`;
    
    const fromBalance = this.balances.get(fromKey) || 0;
    const toBalance = this.balances.get(toKey) || 0;
    
    // Chi deve pagare deve avere balance negativo
    if (fromBalance >= 0) {
      console.log(`⚠️  ${from.toString().slice(0, 8)}... non deve pagare`);
      return false;
    }
    
    // Aggiorna bilanci
    this.balances.set(fromKey, fromBalance + amount);
    this.balances.set(toKey, toBalance - amount);
    
    console.log(`\n💸 PAGAMENTO`);
    console.log(`   Da: ${from.toString().slice(0, 12)}...`);
    console.log(`   A: ${to.toString().slice(0, 12)}...`);
    console.log(`   Importo: ${amount / 1_000_000_000} SOL`);
    
    return true;
  }

  getGroupSummary(groupId) {
    const group = this.groups.get(groupId);
    if (!group) return null;
    
    return {
      id: group.id,
      name: group.name,
      memberCount: group.members.length,
      expenseCount: group.expenses.length,
      active: group.active
    };
  }
}

// =============================
// TEST DEL FLUSSO COMPLETO
// =============================

console.log('🏦 SplitVault - Test Flusso Completo');
console.log('=' .repeat(60));

const vault = new SplitVaultSimulator();

// Create mock keys
const creator = { toString: () => '5yJx...ABC123', length: 43 };
const alice = { toString: () => '5yJx...ABC124', length: 43 };
const bob = { toString: () => '5yJx...ABC125', length: 43 };
const charlie = { toString: () => '5yJx...ABC126', length: 43 };

// Mock PublicKey for simulation
class MockPublicKey {
  constructor(key) { this.key = key; }
  toString() { return this.key; }
  equals(other) { return this.key === other.key; }
}

// Override functions to work without real PublicKey
const members = [
  new MockPublicKey('5yJx...ABC123'),
  new MockPublicKey('5yJx...ABC124'),
  new MockPublicKey('5yJx...ABC125'),
  new MockPublicKey('5yJx...ABC126')
];

// FLUSSO COMPLETO
console.log('\n🚀 STEP 1: CREA GRUPPO');
const groupId = vault.createGroup(members[0], 'Viaggio Weekend', members);

console.log('\n🚀 STEP 2: AGGIUNGI SPESA');
const expenseId1 = vault.createExpense(
  groupId,
  members[0],
  'Hotel Milano',
  200_000_000, // 0.2 SOL in lamports
  'equal',
  null
);

console.log('\n🚀 STEP 3: AGGIUNGI ALTRA SPESA');
const expenseId2 = vault.createExpense(
  groupId,
  members[1],
  'Cena ristorante',
  150_000_000, // 0.15 SOL in lamports
  'equal',
  null
);

console.log('\n🚀 STEP 4: VERIFICA SALDI');
const balances = vault.getBalances(groupId);

console.log('\n🚀 STEP 5: SIMULA PAGAMENTO');
vault.payDebt(groupId, members[1], members[0], 75_000_000);

console.log('\n🚀 STEP 6: VERIFICA SALDI AGGIORNATI');
vault.getBalances(groupId);

console.log('\n🚀 STEP 7: AGGIUNGI SPESA CON PERCENTUALI');
const expenseId3 = vault.createExpense(
  groupId,
  members[2],
  'Biglietti museo',
  100_000_000,
  'percentage',
  [50, 25, 25, 0] // Charlie paga 50%, Alice 25%, tu 25%
);

console.log('\n🚀 STEP 8: VERIFICA FINALE SALDI');
vault.getBalances(groupId);

console.log('\n' + '='.repeat(60));
console.log('✅ FLUSSO COMPLETATO CON SUCCESSO');
console.log('='.repeat(60));
