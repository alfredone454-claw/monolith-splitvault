import { Connection, Cluster, clusterApiUrl, Commitment, PublicKey } from '@solana/web3.js';

export const CLUSTER: Cluster = (process.env.SOLANA_CLUSTER as Cluster) || 'devnet';
export const COMMITMENT: Commitment = 'confirmed';

export const PROGRAM_IDS = {
  GROUP_MANAGER: new PublicKey('GmMgr11111111111111111111111111111111111111'),
  EXPENSE_SPLITTER: new PublicKey('ExpSpl111111111111111111111111111111111111'),
  SETTLEMENT_ENGINE: new PublicKey('SetEng111111111111111111111111111111111111'),
};

let connection: Connection | null = null;

export function getConnection(): Connection {
  if (!connection) {
    const endpoint = process.env.SOLANA_RPC_URL || clusterApiUrl(CLUSTER);
    connection = new Connection(endpoint, COMMITMENT);
  }
  return connection;
}

export function resetConnection(): void {
  connection = null;
}

export function setCustomRpc(rpcUrl: string): Connection {
  connection = new Connection(rpcUrl, COMMITMENT);
  return connection;
}

export function getExplorerUrl(signature: string): string {
  const baseUrl = CLUSTER === 'mainnet-beta'
    ? 'https://solscan.io'
    : `https://${CLUSTER}.solscan.io`;
  return `${baseUrl}/tx/${signature}`;
}

export function getAccountExplorerUrl(address: PublicKey): string {
  const baseUrl = CLUSTER === 'mainnet-beta'
    ? 'https://solscan.io'
    : `https://${CLUSTER}.solscan.io`;
  return `${baseUrl}/account/${address.toString()}`;
}

export const LAMPORTS_PER_SOL = 1_000_000_000;

export function lamportsToSol(lamports: number | bigint): number {
  return Number(lamports) / LAMPORTS_PER_SOL;
}

export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}
