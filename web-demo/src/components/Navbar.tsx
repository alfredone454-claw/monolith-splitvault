import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { connected } = useWallet()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="logo">SplitVault</div>
      
      <div className="nav-links">
        <Link to="/" className={isActive('/') ? 'active' : ''}>
          Groups
        </Link>
        <Link to="/expense" className={isActive('/expense') ? 'active' : ''}>
          Add Expense
        </Link>
        <Link to="/balance" className={isActive('/balance') ? 'active' : ''}>
          Balances
        </Link>
        <Link to="/settle" className={isActive('/settle') ? 'active' : ''}>
          Settle Up
        </Link>
      </div>

      <div className="wallet-btn">
        <WalletMultiButton />
      </div>
    </nav>
  )
}
