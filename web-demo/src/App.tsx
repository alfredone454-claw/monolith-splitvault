import { useState } from 'react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import '@solana/wallet-adapter-react-ui/styles.css'
import './App.css'

import GroupScreen from './screens/GroupScreen'
import ExpenseScreen from './screens/ExpenseScreen'
import BalanceScreen from './screens/BalanceScreen'
import SettleScreen from './screens/SettleScreen'
import Navbar from './components/Navbar'

function App() {
  const network = WalletAdapterNetwork.Testnet
  const endpoint = clusterApiUrl(network)
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
