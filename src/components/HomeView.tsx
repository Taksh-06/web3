/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId } from '../types';
import { 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Coins, 
  TrendingUp, 
  Activity,
  Boxes,
  Layers3,
  HelpCircle,
  Cpu
} from 'lucide-react';

interface HomeViewProps {
  setCurrentPage: (page: PageId) => void;
}

export default function HomeView({ setCurrentPage }: HomeViewProps) {
  // State for the interactive rollup batched simulator
  const [txCount, setTxCount] = useState<number>(10);
  const [isRollingUp, setIsRollingUp] = useState<boolean>(false);
  const [showStatus, setShowStatus] = useState<string>('Idle - Waiting for transactions');

  const mainnetGasPrice = 12.50; // simulated average gas cost in USD
  const rollupGasFactor = 0.04; // Arbitrum gas is ~96% cheaper

  const handleSimulateRollup = () => {
    if (isRollingUp) return;
    setIsRollingUp(true);
    setShowStatus('Processing tx batch off-chain...');
    
    setTimeout(() => {
      setShowStatus('Compressing batch metadata...');
      setTimeout(() => {
        setShowStatus('Publishing single state commitment to L1!');
        setIsRollingUp(false);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="space-y-16 py-8" id="home-view">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0d0d0d] px-6 py-16 sm:px-12 sm:py-24 transition-colors duration-300" id="hero-section">
        {/* Glow effects */}
        <div className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-teal-500/5 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        
        <div className="relative mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-3.5 py-1.5 text-xs font-semibold text-teal-400">
            <Zap className="h-3.5 w-3.5" />
            <span>Scaling Ethereum's Future</span>
          </div>
          
          <h1 className="font-serif text-4xl font-normal tracking-tight text-stone-900 dark:text-white sm:text-5xl md:text-6xl">
            Demystifying Layer 2 &{' '}
            <span className="italic bg-gradient-to-r from-teal-400 via-stone-200 to-teal-200 bg-clip-text text-transparent font-medium">
              Arbitrum Rollups
            </span>
          </h1>
          
          <p className="mx-auto max-w-xl text-base text-stone-600 dark:text-stone-400 sm:text-lg font-sans">
            Ethereum is secure but congested. Layer 2 solutions bundle thousands of transactions off-chain, compressing costs while inheriting core blockchain security.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
              onClick={() => setCurrentPage('simulator')}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-black shadow-lg hover:bg-teal-500 hover:shadow-teal-500/10 transition-all duration-200 cursor-pointer"
              id="cta-simulator"
            >
              <span>Launch Simulator</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage('concepts')}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900/40 px-6 py-3.5 text-sm font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-white transition-all duration-200 cursor-pointer"
              id="cta-concepts"
            >
              Learn Core Concepts
            </button>
          </div>
        </div>
      </section>

      {/* Layer 2 Overview: Why, What, Benefit */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3" id="l2-overview-section">
        {/* Why L2 */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/20 p-8 flex flex-col justify-between transition-colors duration-300">
          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-white">Why did Ethereum need Layer 2?</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              Ethereum limits transaction speeds to roughly 15 transactions per second (TPS) to maintain true decentralization. During peak times, this limited throughput causes high gas bidding wars, pricing out everyday users with fees exceeding $50 per transaction.
            </p>
          </div>
          <div className="mt-6 border-t border-stone-800 pt-4 font-mono text-[11px] text-stone-500">
            CHALLENGE: THE SCALABILITY TRILEMMA
          </div>
        </div>

        {/* What is Arbitrum */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/20 p-8 flex flex-col justify-between transition-colors duration-300">
          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Layers3 className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-white">What is Arbitrum Rollup?</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              Arbitrum is an <strong>Optimistic Rollup</strong> Layer 2 scaling protocol. It executes transactions off-chain on its lightning-fast network, compresses the data, and posts the transaction batch back to Ethereum Mainnet (L1) to ensure uncompromised decentralization.
            </p>
          </div>
          <div className="mt-6 border-t border-stone-800 pt-4 font-mono text-[11px] text-stone-500">
            SOLUTION: COMPRESSED TRANSACTION BATCHES
          </div>
        </div>

        {/* The Real Benefit */}
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/20 p-8 flex flex-col justify-between transition-colors duration-300">
          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-white">The Real-World Benefit</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              <strong>Massive Cost Savings & Instant Finality.</strong> Transactions on Arbitrum take less than a second to execute and cost up to 95% less gas than Ethereum mainnet, allowing complex Decentralized Finance (DeFi) and Gaming apps to run smoothly.
            </p>
          </div>
          <div className="mt-6 border-t border-stone-800 pt-4 font-mono text-[11px] text-stone-500">
            BENEFIT: UP TO 95% GAS REDUCTION
          </div>
        </div>
      </section>

      {/* Interactive Rollup Batch Visualizer */}
      <section className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/5 p-6 sm:p-8 transition-colors duration-300" id="visualizer-section">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-teal-400 font-semibold">
                Interactive Concept Builder
              </span>
              <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-white mt-1">
                Optimistic Rollup Simulator
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 font-sans">
                Observe how off-chain scaling saves costs by adjusting the batch size slider and submitting transactions.
              </p>
            </div>

            {/* Slider */}
            <div className="space-y-2 rounded-xl bg-stone-50 dark:bg-[#0d0d0d] p-4 border border-stone-200 dark:border-stone-800/80">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-600 dark:text-stone-400 font-sans">Transactions to Batch</span>
                <span className="font-mono font-bold text-teal-400">{txCount} Transactions</span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                value={txCount}
                onChange={(e) => setTxCount(parseInt(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>3 Tx (Small Batch)</span>
                <span>30 Tx (Large Batch)</span>
              </div>
            </div>

            {/* Gas Calculations */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-stone-50 dark:bg-[#0d0d0d] p-4 border border-stone-200 dark:border-stone-800/80 text-center">
                <p className="text-[10px] font-mono text-stone-500 uppercase">Ethereum L1 Gas</p>
                <p className="text-xl font-bold text-rose-400 mt-1">
                  ${(txCount * mainnetGasPrice).toFixed(2)}
                </p>
                <p className="text-[9px] text-stone-500 mt-0.5 font-sans">(${mainnetGasPrice.toFixed(2)} per Tx)</p>
              </div>
              <div className="rounded-xl bg-stone-50 dark:bg-[#0d0d0d] p-4 border border-teal-200 dark:border-teal-950 text-center">
                <p className="text-[10px] font-mono text-teal-400 uppercase">Arbitrum L2 Gas</p>
                <p className="text-xl font-bold text-emerald-400 mt-1">
                  ${((txCount * mainnetGasPrice * rollupGasFactor) + 0.35).toFixed(2)}
                </p>
                <p className="text-[9px] text-emerald-500/80 mt-0.5 font-sans">
                  {~~(((1 - rollupGasFactor) * 100))}% Gas Savings!
                </p>
              </div>
            </div>

            <button
              onClick={handleSimulateRollup}
              disabled={isRollingUp}
              className={`w-full flex items-center justify-center space-x-2 rounded-xl py-3 text-sm font-semibold text-black transition-all duration-200 cursor-pointer ${
                isRollingUp 
                  ? 'bg-teal-600/50 cursor-wait' 
                  : 'bg-teal-600 hover:bg-teal-500 active:scale-[0.98]'
              }`}
            >
              <Cpu className={`h-4 w-4 ${isRollingUp ? 'animate-spin' : ''}`} />
              <span>{isRollingUp ? 'Rolling Up Transactions...' : 'Submit Transaction Batch'}</span>
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-stone-50 dark:bg-[#0d0d0d] p-6 border border-stone-200 dark:border-stone-800/80 relative min-h-[300px] transition-colors duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-stone-200 dark:border-stone-900">
              <span className="font-mono text-xs text-stone-400">Rollup State Visualizer</span>
              <span className="flex items-center space-x-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${isRollingUp ? 'bg-teal-500 animate-ping' : 'bg-emerald-500'}`} />
                <span className="font-mono text-[10px] text-stone-500 uppercase">
                  {isRollingUp ? 'SYNCING' : 'IDLE'}
                </span>
              </span>
            </div>

            {/* Animation Core */}
            <div className="flex flex-col items-center justify-center py-6 space-y-6">
              {/* Individual Tx Stage */}
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {Array.from({ length: txCount }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-7 px-2 flex items-center justify-center rounded-md font-mono text-[10px] border transition-all duration-300 ${
                      isRollingUp
                        ? 'bg-teal-100 dark:bg-teal-500/20 border-teal-500 text-teal-700 dark:text-teal-300 scale-95 translate-y-2 opacity-50'
                        : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    Tx #{i + 1}
                  </div>
                ))}
              </div>

              {/* Compressed Batch Connector */}
              <div className="flex flex-col items-center space-y-1">
                <div className={`h-8 w-0.5 bg-gradient-to-b from-teal-500 to-teal-600 ${isRollingUp ? 'opacity-100 scale-y-125 transition-transform duration-500' : 'opacity-40'}`} />
                <div className="rounded-full bg-teal-500/10 border border-teal-500/30 px-3 py-1 font-mono text-[9px] text-teal-400 uppercase tracking-widest">
                  Rollup Compression (96%)
                </div>
                <div className={`h-8 w-0.5 bg-gradient-to-b from-teal-600 to-emerald-500 ${isRollingUp ? 'opacity-100 scale-y-125 transition-transform duration-500' : 'opacity-40'}`} />
              </div>

              {/* L1 Block Stage */}
              <div className={`max-w-xs w-full rounded-xl border p-4 text-center transition-all duration-500 ${
                isRollingUp 
                  ? 'bg-teal-50 dark:bg-teal-950/20 border-teal-400 dark:border-teal-500/80 shadow-lg shadow-teal-500/10 dark:shadow-teal-500/5' 
                  : 'bg-emerald-50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/60'
              }`}>
                <p className="font-mono text-[10px] uppercase tracking-wider text-stone-500">Ethereum L1 Mainnet</p>
                <div className="flex items-center justify-center space-x-2 mt-1.5">
                  <Boxes className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                  <span className="font-serif font-medium text-sm text-stone-900 dark:text-stone-200">Ethereum Block #2010492</span>
                </div>
                <p className="text-[10px] font-mono text-stone-600 dark:text-stone-400 mt-2 bg-white dark:bg-stone-900 py-1 px-2 rounded border border-stone-200 dark:border-stone-800">
                  {isRollingUp ? 'New state root published...' : `Houses 1 Rollup proof = ${txCount} Tx`}
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="rounded-lg bg-white dark:bg-stone-900 p-2.5 text-center border border-stone-200 dark:border-stone-800 transition-colors duration-300">
              <span className="font-mono text-xs text-teal-300 font-medium">
                Status: {showStatus}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature/Benefits Grid */}
      <section className="space-y-6" id="features-section">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-medium text-stone-900 dark:text-white">
            Core Scaling Features
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-md mx-auto text-sm font-sans">
            Arbitrum achieves scaling by optimizing execution paths while maintaining Ethereum's decentralization.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Point 1 */}
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0d0d0d] p-6 space-y-4 transition-colors duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-white">40,000+ Transactions/Sec</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              By removing computations from the main Ethereum virtual machine, Arbitrum achieves near-instant finality and massively accelerated speeds, perfect for gaming and micropayments.
            </p>
          </div>

          {/* Point 2 */}
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0d0d0d] p-6 space-y-4 transition-colors duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Coins className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-white">Cent-Level Gas Pricing</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              Compressing transaction call data before publication reduces L1 storage costs, passing down enormous savings directly to active network users.
            </p>
          </div>

          {/* Point 3 */}
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0d0d0d] p-6 space-y-4 transition-colors duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-white">Ethereum Root Trust</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              Unlike independent sidechains, Arbitrum periodically posts raw proofs directly back to L1, guaranteeing your transactions inherit the complete decentralized security of Ethereum.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
