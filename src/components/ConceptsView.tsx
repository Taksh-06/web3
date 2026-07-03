/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ConceptItem } from '../types';
import { 
  Globe, 
  Coins, 
  KeyRound, 
  Database, 
  Check, 
  X, 
  HelpCircle
} from 'lucide-react';

export default function ConceptsView() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const concepts: ConceptItem[] = [
    {
      id: 'web2-web3',
      title: 'Web2 vs Web3',
      leftCategoryName: 'Web2 (Read & Write)',
      rightCategoryName: 'Web3 (Read, Write & Own)',
      leftSummary: 'Dominated by corporate platforms providing free services in exchange for your personal data, identity, and content ownership.',
      rightSummary: 'Built on open protocols where users control their digital identity, financial transactions, and data value via tokenomics.',
      colorTheme: 'indigo',
      explanation: 'The fundamental shift of Web3 is ownership. In Web2, you are the product; corporations monetize your data. In Web3, you use decentralized wallets to authenticate and participate as an owner in the platforms you use.',
      points: [
        { feature: 'User Identity', leftValue: 'OAuth (Sign-in with Google/Meta)', rightValue: 'Cryptographic Wallet (Private Key / Sign-in with Ethereum)' },
        { feature: 'Data Storage', leftValue: 'Centralized Servers (AWS, Google Cloud)', rightValue: 'Decentralized Networks (IPFS, Arweave, Ledger Nodes)' },
        { feature: 'Financial Systems', leftValue: 'Fiat Intermediaries (Paypal, Banks)', rightValue: 'Native Tokens & P2P Protocols (ETH, USDC)' },
        { feature: 'Governance', leftValue: 'Corporate Shareholders & Boards', rightValue: 'DAOs (Decentralized Autonomous Orgs) via Token Voting' }
      ]
    },
    {
      id: 'btc-eth',
      title: 'Bitcoin vs Ethereum',
      leftCategoryName: 'Bitcoin (BTC)',
      rightCategoryName: 'Ethereum (ETH)',
      leftSummary: 'A secure, decentralized ledger designed strictly to act as peer-to-peer electronic cash and a sovereign store of value.',
      rightSummary: 'A global programmable supercomputer that hosts self-executing smart contracts, decentralized apps (dApps), and financial networks.',
      colorTheme: 'amber',
      explanation: 'If Bitcoin is digital gold, Ethereum is digital oil. Bitcoin is engineered with a strict, simple scripting language to maximize security and serve as decentralized reserve money. Ethereum introduces Turing-complete smart contracts to build complex financial applications on-chain.',
      points: [
        { feature: 'Primary Purpose', leftValue: 'Store of Value (Sovereign Digital Gold)', rightValue: 'Programmable Smart Contract Infrastructure' },
        { feature: 'Core Capability', leftValue: 'Simple Transfer of Value (BTC transactions)', rightValue: 'Executes Arbitrary Logic (Solidarity / EVM)' },
        { feature: 'Consensus Engine', leftValue: 'Proof of Work (PoW - Hardware Miners)', rightValue: 'Proof of Stake (PoS - Validator Staking)' },
        { feature: 'Supply Limit', leftValue: 'Hardcapped strictly at 21 Million BTC', rightValue: 'Dynamic supply optimized for network security' }
      ]
    },
    {
      id: 'public-private-key',
      title: 'Public Key vs Private Key',
      leftCategoryName: 'Public Key (Your Address)',
      rightCategoryName: 'Private Key (Your Signature)',
      leftSummary: 'The cryptographically derived address you share with the world to receive transactions, similar to an IBAN bank number.',
      rightSummary: 'The ultra-secret master password that signs and authorizes transactions. Whoever holds this holds absolute custody of the assets.',
      colorTheme: 'rose',
      explanation: 'Think of a mailbox: anyone can look up your physical address (Public Key) and drop letters inside. However, only you hold the physical key (Private Key) required to open the box and retrieve or send contents. If you lose your private key, there is no "Forgot Password" button in Web3.',
      points: [
        { feature: 'Visibility', leftValue: 'Public (Everyone on the blockchain can view)', rightValue: 'Secret (Must NEVER be shared with anyone)' },
        { feature: 'Utility', leftValue: 'Represents your unique wallet address ID', rightValue: 'Signs and cryptographically proves ownership' },
        { feature: 'Recovery', leftValue: 'Non-issue (Can be shared/looked up anytime)', rightValue: 'If lost, your funds are permanently inaccessible' },
        { feature: 'Secured by', leftValue: 'Elliptic curve derivation', rightValue: 'Random 256-bit entropy (or 12-24 word Seed Phrase)' }
      ]
    },
    {
      id: 'db-blockchain',
      title: 'Traditional DB vs Blockchain',
      leftCategoryName: 'Traditional Database (SQL/NoSQL)',
      rightCategoryName: 'Blockchain Ledger',
      leftSummary: 'A fast, centralized storage solution owned by a single administrator who maintains full Create, Read, Update, Delete access.',
      rightSummary: 'A distributed, peer-to-peer append-only ledger where consensus must be reached by a network of nodes to record state updates.',
      colorTheme: 'emerald',
      explanation: 'Traditional databases are optimized for sheer speed and high-volume data manipulations, but they rely on trusting a single coordinator. Blockchains trade write latency for absolute tamper-resistance, ensuring that once data is mined into a block, it is cryptographically impossible to delete.',
      points: [
        { feature: 'Write Access', leftValue: 'Central Admin (CRUD permissions)', rightValue: 'Append-Only (Only written via protocol consensus)' },
        { feature: 'Immutability', leftValue: 'Low (Records can be edited or deleted by DBAs)', rightValue: 'Absolute (Cryptographically locked in history)' },
        { feature: 'Latency & Speed', leftValue: 'Microseconds (Extremely fast, high TPS)', rightValue: 'Milliseconds to Minutes (Depends on block validation)' },
        { feature: 'Trust Architecture', leftValue: 'Centralized Trust (Must trust the database host)', rightValue: 'Zero-Trust Cryptographic Verification (Verify, don\'t trust)' }
      ]
    }
  ];

  const filteredConcepts = activeTab === 'all' 
    ? concepts 
    : concepts.filter(c => c.id === activeTab);

  return (
    <div className="space-y-12 py-8" id="concepts-view">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-teal-400 font-semibold bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
          Core Curriculum
        </span>
        <h1 className="font-serif text-3xl font-medium text-stone-900 dark:text-white sm:text-4xl">
          Visual Web3 Comparison Guides
        </h1>
        <p className="text-stone-600 dark:text-stone-400 max-w-xl mx-auto text-sm font-sans">
          A side-by-side visual breakdown of foundational decentralized technologies, written clearly to help you transition from the Web2 paradigm.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-stone-200 dark:border-stone-900 pb-6" id="concepts-filters">
        <button
          onClick={() => setActiveTab('all')}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition cursor-pointer ${
            activeTab === 'all'
              ? 'bg-stone-100 dark:bg-stone-900 text-teal-600 dark:text-teal-400 border border-stone-200 dark:border-stone-800'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900/50'
          }`}
        >
          All Concepts
        </button>
        {concepts.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveTab(c.id)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition cursor-pointer ${
              activeTab === c.id
                ? 'bg-stone-100 dark:bg-stone-900 text-teal-600 dark:text-teal-400 border border-stone-200 dark:border-stone-800'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900/50'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Concept Grid/Cards */}
      <div className="space-y-12" id="concepts-list">
        {filteredConcepts.map((concept) => {
          // Color styles depending on theme
          let themeBorderColor = 'border-stone-200 dark:border-stone-800/80';
          let themeGlowColor = 'from-stone-900';
          let themeBadgeBg = 'bg-stone-100 dark:bg-stone-900/40 text-stone-700 dark:text-stone-300';
          let leftHeaderColor = 'text-stone-500 dark:text-stone-400';
          let rightHeaderColor = 'text-teal-600 dark:text-teal-400';

          if (concept.colorTheme === 'indigo') {
            themeBorderColor = 'hover:border-teal-500/30';
            themeGlowColor = 'bg-teal-500/5';
            themeBadgeBg = 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-500/20';
            rightHeaderColor = 'text-teal-600 dark:text-teal-400';
          } else if (concept.colorTheme === 'amber') {
            themeBorderColor = 'hover:border-amber-500/30';
            themeGlowColor = 'bg-amber-500/5';
            themeBadgeBg = 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20';
            rightHeaderColor = 'text-amber-600 dark:text-amber-400';
          } else if (concept.colorTheme === 'rose') {
            themeBorderColor = 'hover:border-stone-500/30';
            themeGlowColor = 'bg-stone-500/5';
            themeBadgeBg = 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800';
            rightHeaderColor = 'text-stone-700 dark:text-stone-300';
          } else if (concept.colorTheme === 'emerald') {
            themeBorderColor = 'hover:border-emerald-500/30';
            themeGlowColor = 'bg-emerald-500/5';
            themeBadgeBg = 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20';
            rightHeaderColor = 'text-emerald-600 dark:text-emerald-400';
          }

          return (
            <div
              key={concept.id}
              className={`rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0d0d0d] p-6 sm:p-8 transition-colors duration-300 relative overflow-hidden ${themeBorderColor}`}
              id={`concept-card-${concept.id}`}
            >
              {/* Decorative radial background glow */}
              <div className={`absolute -right-20 -top-20 h-48 w-48 rounded-full ${themeGlowColor} blur-3xl`} />

              {/* Title Block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 dark:border-stone-800">
                <h2 className="font-serif text-xl font-medium text-stone-900 dark:text-white sm:text-2xl flex items-center space-x-2.5">
                  <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                  <span>{concept.title}</span>
                </h2>
                <span className={`inline-flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border mt-2 sm:mt-0 ${themeBadgeBg}`}>
                  <span>Curated Guide</span>
                </span>
              </div>

              {/* Side-by-Side Introductions */}
              <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-2 lg:gap-8">
                <div className="space-y-2 rounded-xl bg-stone-50 dark:bg-stone-900/10 p-5 border border-stone-200 dark:border-stone-800/50">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold">
                    {concept.leftCategoryName}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                    {concept.leftSummary}
                  </p>
                </div>
                <div className="space-y-2 rounded-xl bg-stone-50 dark:bg-stone-900/10 p-5 border border-stone-200 dark:border-stone-800/50">
                  <h3 className={`font-mono text-xs uppercase tracking-wider font-bold ${rightHeaderColor}`}>
                    {concept.rightCategoryName}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                    {concept.rightSummary}
                  </p>
                </div>
              </div>

              {/* Deep Explainer Summary Paragraph */}
              <div className="rounded-xl bg-stone-50 dark:bg-stone-900/5 p-5 border border-stone-200 dark:border-stone-800/40 text-sm mb-6 flex gap-4 items-start">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20 text-xs font-bold">
                  i
                </div>
                <div>
                  <h4 className="font-serif italic text-stone-900 dark:text-stone-300">The Core Insight</h4>
                  <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1 leading-relaxed font-sans">
                    {concept.explanation}
                  </p>
                </div>
              </div>

              {/* Comparative Matrix Table */}
              <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0d0d0d]">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/20 font-mono text-[10px] uppercase tracking-wider text-stone-500">
                      <th className="py-3 px-4 font-semibold">Comparison Metric</th>
                      <th className="py-3 px-4 font-semibold">{concept.leftCategoryName.split('(')[0]}</th>
                      <th className="py-3 px-4 font-semibold text-teal-600 dark:text-teal-400">{concept.rightCategoryName.split('(')[0]}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800/60 text-xs text-stone-700 dark:text-stone-300">
                    {concept.points.map((point, index) => (
                      <tr key={index} className="hover:bg-stone-50 dark:hover:bg-stone-900/20 transition duration-150">
                        <td className="py-3.5 px-4 font-semibold text-stone-900 dark:text-stone-300">
                          {point.feature}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 dark:text-stone-400">
                          {point.leftValue}
                        </td>
                        <td className="py-3.5 px-4 text-stone-800 dark:text-stone-300 font-medium">
                          {point.rightValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
