import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {
  PublicKey,
  Transaction,
  VersionedTransaction,
  TransactionSignature,
} from '@solana/web3.js';
import { getConnection, COMMITMENT } from './solana';

const APP_IDENTITY = {
  name: 'SplitVault',
  uri: 'https://splitvault.app',
  icon: 'favicon.ico',
};

let cachedAuthorization: {
  accounts: PublicKey[];
  authToken: string;
} | null = null;

export interface WalletSession {
  accounts: PublicKey[];
  selectedAccount: PublicKey;
  authToken: string;
}

export async function connectWallet(): Promise<WalletSession> {
  try {
    const result = await transact(async (wallet: Web3MobileWallet) => {
      const authorization = await wallet.authorize({
        identity: APP_IDENTITY,
        auth_token: cachedAuthorization?.authToken,
        sign_in_payload: undefined,
      });

      return authorization;
    });

    const accounts = result.accounts.map((acc) => new PublicKey(acc.address));
    
    cachedAuthorization = {
      accounts,
      authToken: result.auth_token,
    };

    return {
      accounts,
      selectedAccount: accounts[0],
      authToken: result.auth_token,
    };
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw new Error('Wallet connection failed');
  }
}

export async function disconnectWallet(): Promise<void> {
  if (!cachedAuthorization) return;

  try {
    await transact(async (wallet: Web3MobileWallet) => {
      await wallet.deauthorize({
        auth_token: cachedAuthorization!.authToken,
      });
    });
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
  } finally {
    cachedAuthorization = null;
  }
}

export async function signAndSendTransaction(
  transaction: Transaction | VersionedTransaction,
  account?: PublicKey
): Promise<TransactionSignature> {
  if (!cachedAuthorization) {
    throw new Error('Wallet not connected');
  }

  const connection = getConnection();

  return await transact(async (wallet: Web3MobileWallet) => {
    const signedTransactions = await wallet.signTransactions({
      transactions: [transaction],
    });

    const rawTransaction = signedTransactions[0].serialize();
    const signature = await connection.sendRawTransaction(rawTransaction, {
      commitment: COMMITMENT,
      skipPreflight: false,
      preflightCommitment: COMMITMENT,
    });

    await connection.confirmTransaction(signature, COMMITMENT);

    return signature;
  });
}

export async function signTransaction(
  transaction: Transaction | VersionedTransaction
): Promise<Transaction | VersionedTransaction> {
  if (!cachedAuthorization) {
    throw new Error('Wallet not connected');
  }

  return await transact(async (wallet: Web3MobileWallet) => {
    const signedTransactions = await wallet.signTransactions({
      transactions: [transaction],
    });

    return signedTransactions[0];
  });
}

export async function signMessage(message: Uint8Array): Promise<Uint8Array> {
  if (!cachedAuthorization) {
    throw new Error('Wallet not connected');
  }

  return await transact(async (wallet: Web3MobileWallet) => {
    const signedMessages = await wallet.signMessages({
      addresses: [cachedAuthorization!.accounts[0].toBase58()],
      payloads: [message],
    });

    return signedMessages[0];
  });
}

export function getConnectedAccounts(): PublicKey[] {
  return cachedAuthorization?.accounts || [];
}

export function isWalletConnected(): boolean {
  return cachedAuthorization !== null;
}

export function getAuthToken(): string | null {
  return cachedAuthorization?.authToken || null;
}
