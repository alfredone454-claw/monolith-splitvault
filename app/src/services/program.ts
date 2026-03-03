import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  SYSVAR_CLOCK_PUBKEY,
} from '@solana/web3.js';
import * as borsh from 'borsh';
import { getConnection, PROGRAM_IDS } from './solana';
import { signAndSendTransaction } from './mwa';

export enum SplitType {
  Equal = 0,
  Percentage = 1,
  Exact = 2,
}

export interface Split {
  member: PublicKey;
  amount: bigint;
  paid: boolean;
}

export interface Group {
  creator: PublicKey;
  name: string;
  members: PublicKey[];
  createdAt: bigint;
  active: boolean;
}

export interface Expense {
  creator: PublicKey;
  group: PublicKey;
  description: string;
  totalAmount: bigint;
  splitType: SplitType;
  splitValues: bigint[];
  splits: Split[];
  createdAt: bigint;
  settled: boolean;
}

class CreateGroupArgs {
  name: string = '';
  memberPubkeys: Uint8Array[] = [];

  constructor(fields?: { name: string; memberPubkeys: Uint8Array[] }) {
    if (fields) {
      this.name = fields.name;
      this.memberPubkeys = fields.memberPubkeys;
    }
  }
}

const CreateGroupSchema = new Map([
  [
    CreateGroupArgs,
    {
      kind: 'struct',
      fields: [
        ['name', 'string'],
        ['memberPubkeys', [32]],
      ],
    },
  ],
]);

class AddMemberArgs {
  member: Uint8Array = new Uint8Array(32);

  constructor(fields?: { member: Uint8Array }) {
    if (fields) {
      this.member = fields.member;
    }
  }
}

const AddMemberSchema = new Map([
  [AddMemberArgs, { kind: 'struct', fields: [['member', [32]]] }],
]);

class CreateExpenseArgs {
  description: string = '';
  totalAmount: bigint = BigInt(0);
  splitType: number = 0;
  splitValues: bigint[] = [];

  constructor(fields?: {
    description: string;
    totalAmount: bigint;
    splitType: number;
    splitValues: bigint[];
  }) {
    if (fields) {
      this.description = fields.description;
      this.totalAmount = fields.totalAmount;
      this.splitType = fields.splitType;
      this.splitValues = fields.splitValues;
    }
  }
}

const CreateExpenseSchema = new Map([
  [
    CreateExpenseArgs,
    {
      kind: 'struct',
      fields: [
        ['description', 'string'],
        ['totalAmount', 'u64'],
        ['splitType', 'u8'],
        ['splitValues', ['u64']],
      ],
    },
  ],
]);

class PayDebtArgs {
  amount: bigint = BigInt(0);

  constructor(fields?: { amount: bigint }) {
    if (fields) {
      this.amount = fields.amount;
    }
  }
}

const PayDebtSchema = new Map([
  [PayDebtArgs, { kind: 'struct', fields: [['amount', 'u64']] }],
]);

export function createGroupInstruction(
  creator: PublicKey,
  group: PublicKey,
  name: string,
  memberPubkeys: PublicKey[]
): TransactionInstruction {
  const args = new CreateGroupArgs({
    name,
    memberPubkeys: memberPubkeys.map((pk) => pk.toBytes()),
  });
  const data = Buffer.from([
    ...Buffer.from([0]), // Instruction discriminator
    ...borsh.serialize(CreateGroupSchema, args),
  ]);

  return new TransactionInstruction({
    keys: [
      { pubkey: group, isSigner: false, isWritable: true },
      { pubkey: creator, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_IDS.GROUP_MANAGER,
    data,
  });
}

export function addMemberInstruction(
  creator: PublicKey,
  group: PublicKey,
  member: PublicKey
): TransactionInstruction {
  const args = new AddMemberArgs({ member: member.toBytes() });
  const data = Buffer.from([
    ...Buffer.from([1]), // Instruction discriminator
    ...borsh.serialize(AddMemberSchema, args),
  ]);

  return new TransactionInstruction({
    keys: [
      { pubkey: group, isSigner: false, isWritable: true },
      { pubkey: creator, isSigner: true, isWritable: false },
    ],
    programId: PROGRAM_IDS.GROUP_MANAGER,
    data,
  });
}

export function removeMemberInstruction(
  creator: PublicKey,
  group: PublicKey,
  member: PublicKey
): TransactionInstruction {
  const args = new AddMemberArgs({ member: member.toBytes() });
  const data = Buffer.from([
    ...Buffer.from([2]), // Instruction discriminator
    ...borsh.serialize(AddMemberSchema, args),
  ]);

  return new TransactionInstruction({
    keys: [
      { pubkey: group, isSigner: false, isWritable: true },
      { pubkey: creator, isSigner: true, isWritable: false },
    ],
    programId: PROGRAM_IDS.GROUP_MANAGER,
    data,
  });
}

export function closeGroupInstruction(
  creator: PublicKey,
  group: PublicKey
): TransactionInstruction {
  const data = Buffer.from([3]); // Instruction discriminator

  return new TransactionInstruction({
    keys: [
      { pubkey: group, isSigner: false, isWritable: true },
      { pubkey: creator, isSigner: true, isWritable: false },
    ],
    programId: PROGRAM_IDS.GROUP_MANAGER,
    data,
  });
}

export function createExpenseInstruction(
  payer: PublicKey,
  expense: PublicKey,
  group: PublicKey,
  description: string,
  totalAmount: bigint,
  splitType: SplitType,
  splitValues: bigint[]
): TransactionInstruction {
  const args = new CreateExpenseArgs({
    description,
    totalAmount,
    splitType: splitType as number,
    splitValues,
  });
  const data = Buffer.from([
    ...Buffer.from([0]), // Instruction discriminator
    ...borsh.serialize(CreateExpenseSchema, args),
  ]);

  return new TransactionInstruction({
    keys: [
      { pubkey: expense, isSigner: false, isWritable: true },
      { pubkey: group, isSigner: false, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_IDS.EXPENSE_SPLITTER,
    data,
  });
}

export function settleExpenseInstruction(
  creator: PublicKey,
  expense: PublicKey
): TransactionInstruction {
  const data = Buffer.from([1]); // Instruction discriminator

  return new TransactionInstruction({
    keys: [
      { pubkey: expense, isSigner: false, isWritable: true },
      { pubkey: creator, isSigner: true, isWritable: false },
    ],
    programId: PROGRAM_IDS.EXPENSE_SPLITTER,
    data,
  });
}

export function payDebtInstruction(
    payer: PublicKey,
    expense: PublicKey,
    receiver: PublicKey,
    amount: bigint
  ): TransactionInstruction {
  const args = new PayDebtArgs({ amount });
  const data = Buffer.from([
    ...Buffer.from([0]), // Instruction discriminator
    ...borsh.serialize(PayDebtSchema, args),
  ]);

  return new TransactionInstruction({
    keys: [
      { pubkey: expense, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: receiver, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_IDS.SETTLEMENT_ENGINE,
    data,
  });
}

export async function sendCreateGroup(
  creator: PublicKey,
  group: PublicKey,
  name: string,
  memberPubkeys: PublicKey[]
): Promise<string> {
  const instruction = createGroupInstruction(creator, group, name, memberPubkeys);
  const transaction = new Transaction().add(instruction);
  return await signAndSendTransaction(transaction, creator);
}

export async function sendAddMember(
  creator: PublicKey,
  group: PublicKey,
  member: PublicKey
): Promise<string> {
  const instruction = addMemberInstruction(creator, group, member);
  const transaction = new Transaction().add(instruction);
  return await signAndSendTransaction(transaction, creator);
}

export async function sendRemoveMember(
  creator: PublicKey,
  group: PublicKey,
  member: PublicKey
): Promise<string> {
  const instruction = removeMemberInstruction(creator, group, member);
  const transaction = new Transaction().add(instruction);
  return await signAndSendTransaction(transaction, creator);
}

export async function sendCloseGroup(
  creator: PublicKey,
  group: PublicKey
): Promise<string> {
  const instruction = closeGroupInstruction(creator, group);
  const transaction = new Transaction().add(instruction);
  return await signAndSendTransaction(transaction, creator);
}

export async function sendCreateExpense(
  payer: PublicKey,
  expense: PublicKey,
  group: PublicKey,
  description: string,
  totalAmount: bigint,
  splitType: SplitType,
  splitValues: bigint[]
): Promise<string> {
  const instruction = createExpenseInstruction(
    payer,
    expense,
    group,
    description,
    totalAmount,
    splitType,
    splitValues
  );
  const transaction = new Transaction().add(instruction);
  return await signAndSendTransaction(transaction, payer);
}

export async function sendSettleExpense(
  creator: PublicKey,
  expense: PublicKey
): Promise<string> {
  const instruction = settleExpenseInstruction(creator, expense);
  const transaction = new Transaction().add(instruction);
  return await signAndSendTransaction(transaction, creator);
}

export async function sendPayDebt(
  payer: PublicKey,
  expense: PublicKey,
  receiver: PublicKey,
  amount: bigint
): Promise<string> {
  const instruction = payDebtInstruction(payer, expense, receiver, amount);
  const transaction = new Transaction().add(instruction);
  return await signAndSendTransaction(transaction, payer);
}