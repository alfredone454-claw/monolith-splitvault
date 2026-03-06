import { useWallet } from '@solana/wallet-adapter-react'

interface Balance {
  user: string
  amount: number
  owesYou: boolean
}

export default function BalanceScreen() {
  const { connected, publicKey } = useWallet()
  
  const balances: Balance[] = [
    { user: 'Alice', amount: 23.50, owesYou: true },
    { user: 'Bob', amount: 15.00, owesYou: false },
    { user: 'Charlie', amount: 32.25, owesYou: true },
  ]

  const totalOwed = balances.filter(b => b.owesYou).reduce((sum, b) => sum + b.amount, 0)
  const totalOwe = balances.filter(b => !b.owesYou).reduce((sum, b) => sum + b.amount, 0)
  const netBalance = totalOwed - totalOwe

  return (
    <div className="screen">
      <h1 style={{ marginBottom: '1.5rem' }}>Balances</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You are owed</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--solana-green)' }}>
            ${totalOwed.toFixed(2)}
          </p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You owe</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#FF6B6B' }}>
            ${totalOwe.toFixed(2)}
          </p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Net balance</p>
          <p style={{ 
            fontSize: '1.75rem', 
            fontWeight: 'bold', 
            color: netBalance >= 0 ? 'var(--solana-green)' : '#FF6B6B' 
          }}>
            {netBalance >= 0 ? '+' : ''}${netBalance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Detailed Balances</h3>
        {balances.map((balance, idx) => (
          <div 
            key={idx} 
            className="balance-item"
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem',
              borderBottom: idx < balances.length - 1 ? '1px solid #333' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--solana-purple), var(--solana-green))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {balance.user[0]}
              </div>
              <div>
                <p style={{ fontWeight: '600' }}>{balance.user}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {balance.owesYou ? 'Owes you' : 'You owe'}
                </p>
              </div>
            </div>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              color: balance.owesYou ? 'var(--solana-green)' : '#FF6B6B'
            }}>
              {balance.owesYou ? '+' : '-'}${balance.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {!connected && (
        <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Connect your wallet to view real balances on Solana
          </p>
        </div>
      )}
    </div>
  )
}
