# SplitVault — Descrizione Schermate (Screenshot Alternativi)

> **Nota:** Gli screenshot automatici non sono disponibili a causa del browser relay disconnesso. Di seguito la descrizione dettagliata di ciascuna schermata, corrispondente al demo web attivo su `http://172.31.40.85:5173/`.

---

## 📱 Schermata 1: Groups (Home)

**Percorso:** `/` (root)

**Layout:**
- **Navbar in alto:** Logo "SplitVault" (gradiente purple/green), link di navigazione (Groups, Add Expense, Balances, Settle), pulsante "Select Wallet" (WalletMultiButton)
- **Titolo:** "Your Groups" con pulsante "+ Create Group" a destra
- **Griglia gruppi:** Card per ogni gruppo con:
  - Avatar circolare con lettera iniziale
  - Nome gruppo es. "Dinner Squad 🍕"
  - Info: "4 members • $340 total"
  - Data creazione: "Created 2026-03-05"
- **Stato wallet:** Se non connesso, card informativa: "Connect your wallet to create groups..."

**Funzionalità dimostrate:**
- ✅ Creazione nuovo gruppo (form popup con input nome)
- ✅ Lista gruppi esistenti
- ✅ Integrazione wallet connection

---

## 📱 Schermata 2: Add Expense

**Percorso:** `/expense`

**Layout:**
- **Titolo:** "Expenses" con pulsante "+ Add Expense" (visibile solo se wallet connesso)
- **Lista spese:** Card orizzontali con:
  - Sinistra: descrizione spesa (es. "Pizza night"), pagatore, data
  - Destra: importo totale ($45.00), quota per persona ($11.25)
- **Form aggiunta spesa:** Card espandibile con:
  - Input: "What was this for?"
  - Input: "Amount ($)" (numerico)
  - Input: "Split with (comma separated)"
  - Pulsanti: "Add to Group" (primary) / "Cancel" (secondary)

**Funzionalità dimostrate:**
- ✅ Aggiunta spesa con descrizione e importo
- ✅ Split automatico tra membri
- ✅ Visualizzazione calcolo per persona
- ✅ Timestamp transazione

---

## 📱 Schermata 3: Balances

**Percorso:** `/balance`

**Layout:**
- **Titolo:** "Balances"
- **Dashboard 3 card in grid:**
  1. "You are owed" — importo verde (+$XX.XX)
  2. "You owe" — importo rosso (-$XX.XX)  
  3. "Net balance" — saldo netto (verde se positivo, rosso se negativo)
- **Lista dettagliata:** Per ogni utente:
  - Avatar circolare con iniziale
  - Nome utente
  - Stato: "Owes you" / "You owe"
  - Importo (+$XX.XX in verde se ti deve, -$XX.XX in rosso se devi tu)

**Funzionalità dimostrate:**
- ✅ Calcolo automatico debiti/crediti
- ✅ Vista aggregata (totale dovuto/dovuto)
- ✅ Vista dettagliata per persona
- ✅ Indicatori visivi (colori verde/rosso)

---

## 📱 Schermata 4: Settle Up

**Percorso:** `/settle`

**Layout:**
- **Titolo:** "Settle Up"
- **Card summary in alto:** "Total pending settlements" con importo in rosso
- **Lista settlement:** Per ogni pagamento:
  - Avatar circolare (rosso se pending, verde con ✓ se completato)
  - "Pay [Nome]" (es. "Pay Alice")
  - Stato: "Pending on-chain settlement" / "Settled YYYY-MM-DD"
  - Importo ($XX.XX in rosso)
  - Pulsante: "Settle Now" (se pending) o checkmark verde (se completato)
- **Card informazioni:** "How it works" con spiegazione settlement on-chain

**Funzionalità dimostrate:**
- ✅ Visualizzazione pagamenti in sospeso
- ✅ Pulsante "Settle Now" per eseguire transazione
- ✅ Stato transazioni (pending → completed)
- ✅ Spiegazione meccanismo Solana

---

## 📱 Schermata 5: Wallet Connection

**Layout (overlay modale):**
- **Navbar:** Pulsante "Select Wallet" si apre modale
- **WalletModalProvider UI:**
  - Titolo: "Connect a wallet on Devnet"
  - Lista wallet: Phantom, Solflare, etc.
  - Icone wallet riconoscibili
  - Stato "Detected" / "Not detected" per ogni wallet

**Funzionalità dimostrate:**
- ✅ Wallet adapter multi-wallet
- ✅ Network Devnet
- ✅ Reac-native-web compatibility

---

## 🎨 Design System

**Color palette:**
- `--solana-purple`: #9945FF
- `--solana-green`: #14F195
- `--dark-bg`: #0A0A0A (sfondo)
- `--surface`: #1A1A1A (card)

**Caratteristiche UI:**
- Design dark theme
- Gradienti purple/green su logo e avatar
- Card con bordi sottili (#333)
- Border-radius: 12px (card), 8px (pulsanti)
- Font: system-ui stack

---

## ✅ Come Verificare il Demo

1. Apri browser e vai a: **http://172.31.40.85:5173/**
2. Clicca "Select Wallet" nella navbar
3. Scegli Phantom o Solflare (in modalità Devnet)
4. Naviga tra le 4 schermate tramite la navbar
5. Testa: crea gruppo → aggiungi spesa → controlla bilanci → simula settlement

**Server uptime:** Demo attivo da 2026-03-06 20:30 UTC
