import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  authorize,
  reauthorize,
  deauthorize,
  transact,
  AuthorizeAPI,
  ReauthorizeAPI,
  DeauthorizeAPI,
  Base64EncodedAddress,
  MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

interface SolanaContextState {
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedAccount: Base64EncodedAddress | null;
  publicKey: PublicKey | null;
  authorizeSession: () => Promise<void>;
  deauthorizeSession: () => Promise<void>;
  signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>;
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
}

const SolanaContext = createContext<SolanaContextState>({
  isAuthenticated: false,
  isLoading: false,
  selectedAccount: null,
  publicKey: null,
  authorizeSession: async () => {},
  deauthorizeSession: async () => {},
  signTransaction: async () => { throw new Error('Not initialized'); },
  signMessage: async () => { throw new Error('Not initialized'); },
});

export const useSolana = () => useContext(SolanaContext);

const APP_IDENTITY = {
  name: 'SplitVault',
  uri: 'https://splitvault.app',
  icon: 'favicon.ico',
};

interface SolanaProviderProps {
  children: React.ReactNode;
}

export const SolanaProvider: React.FC<SolanaProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Base64EncodedAddress | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session (can be extended for persistent storage)
    setIsAuthenticated(false);
  }, []);

  const publicKey = useMemo(() => {
    if (!selectedAccount) return null;
    try {
      return new PublicKey(Buffer.from(selectedAccount.address, 'base64'));
    } catch {
      return null;
    }
  }, [selectedAccount]);

  const authorizeSession = useCallback(async () => {
    setIsLoading(true);
    try {
      await transact(async (wallet: MobileWallet) => {
        const authorizationResult = await authorize({
          wallet,
          identity: APP_IDENTITY,
        });

        if (authorizationResult.accounts.length > 0) {
          setSelectedAccount(authorizationResult.accounts[0]);
          setAuthToken(authorizationResult.authToken);
          setIsAuthenticated(true);
        }
      });
    } catch (error) {
      console.error('Authorization failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deauthorizeSession = useCallback(async () => {
    if (!authToken) return;

    setIsLoading(true);
    try {
      await transact(async (wallet: MobileWallet) => {
        await deauthorize({
          wallet,
          authToken,
        });
      });
    } catch (error) {
      console.error('Deauthorization failed:', error);
    } finally {
      setSelectedAccount(null);
      setAuthToken(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, [authToken]);

  const signTransaction = useCallback(async (transaction: Transaction | VersionedTransaction) => {
    if (!authToken) {
      throw new Error('Wallet not authorized');
    }

    return await transact(async (wallet: MobileWallet) => {
      await reauthorize({
        wallet,
        authToken,
        identity: APP_IDENTITY,
      });

      const signedTransactions = await wallet.signTransactions({
        transactions: [transaction],
      });

      return signedTransactions[0];
    });
  }, [authToken]);

  const signMessage = useCallback(async (message: Uint8Array) => {
    if (!authToken) {
      throw new Error('Wallet not authorized');
    }

    return await transact(async (wallet: MobileWallet) => {
      await reauthorize({
        wallet,
        authToken,
        identity: APP_IDENTITY,
      });

      const signatures = await wallet.signMessages({
        addresses: [{ address: selectedAccount!.address }],
        payloads: [message],
      });

      return signatures[0];
    });
  }, [authToken, selectedAccount]);

  const value = useMemo(() => ({
    isAuthenticated,
    isLoading,
    selectedAccount,
    publicKey,
    authorizeSession,
    deauthorizeSession,
    signTransaction,
    signMessage,
  }), [
    isAuthenticated,
    isLoading,
    selectedAccount,
    publicKey,
    authorizeSession,
    deauthorizeSession,
    signTransaction,
    signMessage,
  ]);

  return (
    <SolanaContext.Provider value={value}>
      {children}
    </SolanaContext.Provider>
  );
};

export default SolanaProvider;
