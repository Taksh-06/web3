# NEXUS L2: Web3 Learning Hub & Block Simulator

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

### Page 3: Live Prices Dashboard
- **Theme**: Real-time asset indexing.
- **Source**: Directly queries the public **CoinGecko API** (no API key needed).
- **Assets Tracker**: Monitors live prices for Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Polygon (POL), and Arbitrum (ARB).
- **Robustness**: Includes an **intelligent simulated auto-fallback feed** to protect against CoinGecko’s aggressive public rate limiting (HTTP 429), ensuring the dashboard remains interactive with real-time micro-fluctuations even when rate-limited.
- **Interface**: Features a real-time asset search filter, Layer-1/Layer-2 selector tabs, 24-hour green/red change percentages, and SVG trend sparklines.

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

### Installation & Startup
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd react-example
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Launch the local development server**:
   ```bash
   npm run dev
   ```

4. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your favorite browser.

---

## 🧪 Deployment & Compilation Commands
- **Check Linter Integrity**: `npm run lint` (runs `tsc --noEmit` for pristine type verification).
- **Build Production Assets**: `npm run build` (outputs compiled files directly into `/dist`).

---

## 💡 Known Issues & Future Improvements
1. **CoinGecko Public Limits**: Public environments sharing outbound IPs are frequently rate-limited by CoinGecko. We resolved this gracefully with our responsive local simulated backup, but integration of an API key (e.g., CoinGecko Pro or a server-side proxy route) is recommended for production scale.
2. **Persistence**: Current state resets on a browser refresh. Integrating client-side `localStorage` or Firebase Firestore would allow mined chains and search profiles to persist across sessions.
3. **Advanced Mining Difficulties**: The current mining difficulty is fixed at `'00'` for speed and browser safety. A future release can make difficulty adjustable (e.g., `'000'` or `'0000'`) using Web Workers to prevent blocking threads at higher difficulties.
