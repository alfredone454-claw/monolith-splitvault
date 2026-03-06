import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

interface Group {
  id: string
  name: string
  memberCount: number
  totalExpenses: number
  createdAt: string
}

export default function GroupScreen() {
  const { connected } = useWallet()
  const [groups, setGroups] = useState<Group[]>([
    { id: '1', name: 'Dinner Squad 🍕', memberCount: 4, totalExpenses: 340, createdAt: '2026-03-05' },
    { id: '2', name: 'Weekend Trip 🏕️', memberCount: 6, totalExpenses: 1200, createdAt: '2026-03-03' },
    { id: '3', name: 'Roommates 🏠', memberCount: 3, totalExpenses: 850, createdAt: '2026-03-01' },
  ])
  const [showCreate, setShowCreate] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')

  const createGroup = () => {
    if (!newGroupName.trim()) return
    if (!connected) {
      alert('Please connect your wallet first!')
      return
    }
    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName,
      memberCount: 1,
      totalExpenses: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setGroups([...groups, newGroup])
    setNewGroupName('')
    setShowCreate(false)
  }

  return (
    <div className="screen">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Your Groups</h1>
        <button className="btn" onClick={() => setShowCreate(true)}>
          + Create Group
        </button>
      </div>

      {showCreate && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3>Create New Group</h3>
          <input
            type="text"
            className="input"
            placeholder="Group name..."
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            style={{ marginBottom: '1rem', marginTop: '0.5rem' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn" onClick={createGroup}>Create</button>
            <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="group-grid">
        {groups.map((group) => (
          <div key={group.id} className="group-card">
            <h3>{group.name}</h3>
            <p>{group.memberCount} members • ${group.totalExpenses} total</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Created {group.createdAt}
            </p>
          </div>
        ))}
      </div>

      {!connected && (
        <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Connect your wallet to create groups and split expenses on Solana
          </p>
        </div>
      )}
    </div>
  )
}
