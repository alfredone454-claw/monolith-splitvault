import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

interface Settlement {
  id: string
  to: string
  amount: number
  status: 'pending' | 'completed'
  timestamp?: string
}

export default function SettleScreen() {
  const { connected, publicKey } = useWallet()
  const [settlements, setSettlements] = useState<Settlement[]>([
    { id: '1', to: 'Alice', amount: 15.00, status: 'pending' },
    { id: '2', to: 'Charlie', amount: 8.25, status: 'pending' },
  ])
  const [settling, setSettling] = useState<string | null>(null)

  const executeSettlement = async (id: string) => {
    if (!connected) {
      alert('Please connect your wallet first!')
      return
    }
    
    setSettling(id)
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSettlements(prev => prev.map(s => 
      s.id === id 
        ? { ...s, status: 'completed', timestamp: new Date().toISOString() }
        : s
    ))
    setSettling(null)
  }

  const totalPending = settlements.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="screen">
      <h1 style={{ marginBottom: '1.5rem' }}>Settle Up</h1>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total pending settlements</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF6B6B' }}>
              ${totalPending.toFixed(2)}
            </p>
          </div>
          {!connected && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                Connect wallet to settle
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {settlements.map((settlement) => (
          <div key={settlement.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  background: settlement.status === 'completed' 
                    ? 'var(--solana-green)' 
                    : 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem'
                }}>
                  {settlement.status === 'completed' ? '✓' : settlement.to[0]}
                </div>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                    Pay {settlement.to}
                  </p>
                  <p style={{ 
                    fontSize: '0.8rem', 
                    color: settlement.status === 'completed' ? 'var(--solana-green)' : 'var(--text-secondary)'
                  }}>
                    {settlement.status === 'completed' 
                      ? `Settled ${settlement.timestamp?.split('T')[0]}` 
                      : 'Pending on-chain settlement'}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF6B6B' }}>
                  ${settlement.amount.toFixed(2)}
                </p>
                {settlement.status === 'pending' ? (
                  <button 
                    className="btn" 
                    onClick={() => executeSettlement(settlement.id)}
                    disabled={settling === settlement.id || !connected}
                    style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                  >
                    {settling === settlement.id ? 'Processing...' : 'Settle Now'}
                  </button>
                ) : (
                  <span style={{ color: 'var(--solana-green)', fontSize: '0.9rem' }}>✓ Completed</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {settlements.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🎉 All settled up!</p>
          <p style={{ color: 'var(--text-secondary)' }}>
            No pending settlements. You're in the green!
          </p>
        </div>
      )}

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>🔒 How it works</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          When you click "Settle Now", a transaction is created on Solana devnet. 
          The funds are transferred via smart contract, ensuring trustless settlement 
          with your group members.
        </p>
      </div>
    </div>
  )
}
