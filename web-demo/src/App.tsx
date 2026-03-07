import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '@solana/wallet-adapter-react-ui/styles.css'
import './App.css'
import GroupScreen from './screens/GroupScreen'
import ExpenseScreen from './screens/ExpenseScreen'
import BalanceScreen from './screens/BalanceScreen'
import SettleScreen from './screens/SettleScreen'
import Navbar from './components/Navbar'

function App() {
  // Using Cloudflare Tunnel for local validator RPC
  const endpoint = 'https://user-3k9v1np.trycloudflare.com'
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()]

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <div className="app">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<GroupScreen />} />
                  <Route path="/expense" element={<ExpenseScreen />} />
                  <Route path="/balance" element={<BalanceScreen />} />
                  <Route path="/settle" element={<SettleScreen />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App
