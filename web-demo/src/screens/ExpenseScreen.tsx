import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

interface Expense {
  id: string
  description: string
  amount: number
  paidBy: string
  splitWith: string[]
  timestamp: string
}

export default function ExpenseScreen() {
  const { connected, publicKey } = useWallet()
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', description: 'Pizza night', amount: 45, paidBy: 'You', splitWith: ['Alice', 'Bob', 'You'], timestamp: '2026-03-05' },
    { id: '2', description: 'Uber ride', amount: 23.50, paidBy: 'Alice', splitWith: ['Alice', 'You'], timestamp: '2026-03-04' },
  ])
  const [showAdd, setShowAdd] = useState(false)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [splitWith, setSplitWith] = useState('Alice, Bob')

  const addExpense = () => {
    if (!description.trim() || !amount || !connected) {
      if (!connected) alert('Connect wallet first!')
      return
    }
    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      paidBy: publicKey?.toString().slice(0, 8) + '...' || 'You',
      splitWith: splitWith.split(',').map(s => s.trim()).filter(Boolean),
      timestamp: new Date().toISOString().split('T')[0],
    }
    setExpenses([newExpense, ...expenses])
    setDescription('')
    setAmount('')
    setShowAdd(false)
  }

  return (
    <div className="screen">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Expenses</h1>
        {connected && (
          <button className="btn" onClick={() => setShowAdd(true)}>
            + Add Expense
          </button>
        )}
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3>Add New Expense</h3>
          <input
            type="text"
            className="input"
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}
          />
          <input
            type="number"
            className="input"
            placeholder="Amount ($)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ marginBottom: '0.5rem' }}
          />
          <input
            type="text"
            className="input"
            placeholder="Split with (comma separated)"
            value={splitWith}
            onChange={(e) => setSplitWith(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn" onClick={addExpense}>Add to Group</button>
            <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="expense-list">
        {expenses.map((expense) => (
          <div key={expense.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '0.25rem' }}>{expense.description}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Paid by {expense.paidBy} • Split with {expense.splitWith.join(', ')}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {expense.timestamp}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--solana-green)' }}>
                ${expense.amount.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                ${(expense.amount / expense.splitWith.length).toFixed(2)} each
              </div>
            </div>
          </div>
        ))}
      </div>

      {!connected && (
        <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Connect your wallet to add expenses on Solana
          </p>
        </div>
      )}
    </div>
  )
}
