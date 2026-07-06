# NEXUS L2: Web3 Learning Hub & Block Simulator

**Live Demo:** [https://web3-block-chain.netlify.app/](https://web3-block-chain.netlify.app/)

Nexus L2 is a highly polished, interactive educational platform designed to introduce foundational Web3 concepts, demonstrate Layer 2 scaling mechanics, and make block-mining cryptographic systems tangible.

Built with React, Vite, Tailwind CSS, and Framer Motion, the application is structured as a modular single-page application (SPA) with smooth, state-based view transitions.

## 🌟 Visual & Educational Features

This cohesive assignment features four core connected pages:

### Page 1: L2 Hub (Home / Landing)
- **Theme**: Arbitrum & Ethereum Layer 2 Scaling.
- **Visuals**: A clean hero section and descriptive feature grid illustrating **Speed (Throughput)**, **Affordability (Cent gas costs)**, and **Security (Ethereum Root Trust)**.
- **Rollup Batch Simulator**: An interactive container allowing students to adjust transaction counts on a slider and execute a "Rollup Compression Batch" to witness gas fee reductions (up to 95%) and L1 state storage updates.

### Page 2: Web3 Concepts
- **Theme**: Visual comparison models in own words.
- **Layout**: Dynamic comparative tables housed in sleek, theme-colored cards (Indigo, Amber, Rose, Emerald).
- **Core Topics**:
  - Web2 vs Web3
  - Bitcoin vs Ethereum
  - Public Key vs Private Key
  - Traditional Databases vs Blockchain Ledgers
- **Core Insights**: Actionable, simplified takeaways detailing the shift from corporate-owned Read-Write setups to sovereign, user-owned Read-Write-Own protocols.

### Page 3: Live Prices Dashboard & Historical Charts
- **Theme**: Real-time asset indexing and historical charting.
- **Source**: Directly queries the **CoinGecko API**.
- **Assets Tracker**: Monitors live prices for 10 foundational Layer 1 and Layer 2 assets including Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Binance Coin (BNB), Ripple (XRP), Dogecoin (DOGE), Cardano (ADA), Avalanche (AVAX), Polygon (POL), and Arbitrum (ARB).
- **Google Finance Style Chart Modal**: Clicking on any asset opens a beautifully designed interactive modal displaying a real-time historical area chart. Users can switch between 8 timeframes (1D, 5D, 1M, 6M, YTD, 1Y, 5Y, Max) powered by CoinGecko's market chart endpoints.
- **Robustness**: Includes an **intelligent simulated auto-fallback feed** to protect against CoinGecko’s strict rate limits, ensuring the dashboard remains interactive with real-time micro-fluctuations even when rate-limited.
- **Interface**: Features a real-time asset search filter, Layer-1/Layer-2 selector tabs, 24-hour green/red change percentages, SVG trend sparklines, and an integrated currency converter inside the chart modal.

### Page 4: Interactive Block Simulator
- **Theme**: Hashing and blockchain integrity.
- **Technology**: Leverages the browser's native **Web Crypto API (SHA-256)** with a secure, deterministic fallback.
- **Capabilities**: Contains a linked 3-block cryptographic chain (Genesis $\rightarrow$ Block 2 $\rightarrow$ Block 3).
- **Proof of Work Mining**: Users can alter transaction contents, watch the hash recalculate, and click the "Mine" button to launch an asynchronous Proof of Work cycle that increments nonces until a double-zero prefix (`'00'`) is found.
- **Cascading Invalidation**: Demonstrates blockchain immutability. If any past block is tampered with, all subsequent blocks instantly transition to an invalid state due to link breaks, visualizing how tampering breaks trust in a distributed ledger.

---

## 🛠️ How to Run the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or newer)
- npm (v9.0 or newer)
- A CoinGecko API Key (Demo or Pro) to avoid rate limits on the charts.

### Installation & Startup
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd web3
   ```

2. **Environment Setup**:
   Create a `.env` file in the root directory and add your CoinGecko API key:
   ```env
   VITE_COINGECKO_API_KEY="your_api_key_here"
   ```

3. **Install project dependencies**:
   ```bash
   npm install
   ```

4. **Launch the local development server**:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173) in your favorite browser.

---

## 🧪 Deployment & Compilation Commands
- **Check Linter Integrity**: `npm run lint` (runs `tsc --noEmit` for pristine type verification).
- **Build Production Assets**: `npm run build` (outputs compiled files directly into `/dist`).

---

## 💡 Known Issues & Future Improvements
1. **CoinGecko API Limits**: Without an API key, CoinGecko strictly limits requests. A simulated fallback data generator seamlessly kicks in for both the main dashboard and the historical charts to prevent a broken UI experience. 
2. **Persistence**: Current state resets on a browser refresh. Integrating client-side `localStorage` or Firebase Firestore would allow mined chains and search profiles to persist across sessions.
3. **Advanced Mining Difficulties**: The current mining difficulty is fixed at `'00'` for speed and browser safety. A future release can make difficulty adjustable (e.g., `'000'` or `'0000'`) using Web Workers to prevent blocking threads at higher difficulties.
