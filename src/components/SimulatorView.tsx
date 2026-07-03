/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Block } from '../types';
import { calculateSha256 } from '../utils/crypto';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Pickaxe, 
  Cpu, 
  HelpCircle, 
  Link as LinkIcon, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function SimulatorView() {
  const GENESIS_PREV_HASH = '0000000000000000000000000000000000000000000000000000000000000000';
  
  // Set up the initial pre-mined chain state so users can see a "Valid" chain on first load
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 1,
      nonce: 104,
      data: 'L2 Rollup Genesis Batch - Arbitrum Network Boot',
      previousHash: GENESIS_PREV_HASH,
      hash: '003af6ab03db745b1356f916723b72c91a0c8b3f2eb35a3962b14cd6010ff785',
      isValid: true,
    },
    {
      id: 2,
      nonce: 317,
      data: 'Batch #001: 425 transactions off-chain, compressing gas...',
      previousHash: '003af6ab03db745b1356f916723b72c91a0c8b3f2eb35a3962b14cd6010ff785',
      hash: '00bf92cd712c9c73bf54b9d8858e390c91a0c8b3f2eb35a3962b14cd6010ff82a',
      isValid: true,
    },
    {
      id: 3,
      nonce: 49,
      data: 'State root published to Ethereum L1 mainnet block #2010492',
      previousHash: '00bf92cd712c9c73bf54b9d8858e390c91a0c8b3f2eb35a3962b14cd6010ff82a',
      hash: '00a581bc265e390ab3de5238cd23bf1a910c8b3f2eb35a3962b14cd6010ff91a',
      isValid: true,
    }
  ]);

  const [miningId, setMiningId] = useState<number | null>(null);
  const [simMessage, setSimMessage] = useState<string>('Blockchain state synchronized. Try modifying any block\'s data.');

  // Helper to format block hash input string: id-nonce-data-previousHash
  const createBlockInput = (id: number, nonce: number, data: string, prevHash: string) => {
    return `${id}-${nonce}-${data}-${prevHash}`;
  };

  // Re-evaluates hashes sequentially from Block 1 to 3
  const evaluateChain = async (currentBlocks: Block[]): Promise<Block[]> => {
    const updated = [...currentBlocks];
    
    for (let i = 0; i < updated.length; i++) {
      const block = updated[i];
      // Update previous hash from previous block's hash (except Genesis)
      const prevHash = i === 0 ? GENESIS_PREV_HASH : updated[i - 1].hash;
      block.previousHash = prevHash;
      
      // Calculate current hash
      const input = createBlockInput(block.id, block.nonce, block.data, block.previousHash);
      const computedHash = await calculateSha256(input);
      block.hash = computedHash;
      
      // Validity check: hash must start with '00' AND previous block must be valid (if not block 1)
      const hasValidPrefix = computedHash.startsWith('00');
      const isPrevValid = i === 0 || updated[i - 1].isValid;
      
      block.isValid = hasValidPrefix && isPrevValid;
    }
    
    return updated;
  };

  // Run on mount to make sure hashes are aligned
  useEffect(() => {
    const initChain = async () => {
      const evaluated = await evaluateChain(blocks);
      setBlocks(evaluated);
    };
    initChain();
  }, []);

  // Handler for text input edits
  const handleDataChange = async (id: number, newData: string) => {
    const nextBlocks = blocks.map(b => b.id === id ? { ...b, data: newData } : b);
    const evaluated = await evaluateChain(nextBlocks);
    setBlocks(evaluated);
    
    // Set custom explanation notice
    if (id === 1) {
      setSimMessage('Tampered Block 1 data! Observe how the hash changed, breaking the link and invalidating Block 2 and 3.');
    } else if (id === 2) {
      setSimMessage('Modified Block 2! Block 2 is now invalid, which cascaded and broke the cryptographic trust of Block 3.');
    } else {
      setSimMessage('Modified Block 3! This block has been invalidated, but previous blocks remain secure.');
    }
  };

  // Handler for manual nonce changes
  const handleNonceChange = async (id: number, newNonce: number) => {
    if (isNaN(newNonce)) return;
    const nextBlocks = blocks.map(b => b.id === id ? { ...b, nonce: newNonce } : b);
    const evaluated = await evaluateChain(nextBlocks);
    setBlocks(evaluated);
  };

  // Reset chain back to original pre-mined valid states
  const handleResetChain = async () => {
    setLoadingPreMined();
  };

  const setLoadingPreMined = async () => {
    const resetStates = [
      {
        id: 1,
        nonce: 104,
        data: 'L2 Rollup Genesis Batch - Arbitrum Network Boot',
        previousHash: GENESIS_PREV_HASH,
        hash: '',
        isValid: false,
      },
      {
        id: 2,
        nonce: 317,
        data: 'Batch #001: 425 transactions off-chain, compressing gas...',
        previousHash: '',
        hash: '',
        isValid: false,
      },
      {
        id: 3,
        nonce: 49,
        data: 'State root published to Ethereum L1 mainnet block #2010492',
        previousHash: '',
        hash: '',
        isValid: false,
      }
    ];
    const evaluated = await evaluateChain(resetStates);
    setBlocks(evaluated);
    setSimMessage('Blockchain reset to pre-mined valid states. Chain is fully verified!');
  };

  // Mining Proof of Work algorithm (asynchronous to allow UI updates)
  const handleMineBlock = async (id: number) => {
    if (miningId !== null) return; // Prevent concurrent mining
    setMiningId(id);
    setSimMessage(`Mining Block ${id}... Searching for a nonce that yields a SHA-256 hash starting with '00'...`);
    
    const targetBlockIndex = blocks.findIndex(b => b.id === id);
    if (targetBlockIndex === -1) return;

    let currentNonce = 0;
    const targetBlock = blocks[targetBlockIndex];
    
    // We fetch the current state to ensure we read the latest preceding hash
    let updatedChain = [...blocks];
    const prevHash = id === 1 ? GENESIS_PREV_HASH : updatedChain[targetBlockIndex - 1].hash;

    // Local asynchronous mining function to prevent UI lockup
    const mineIteration = async () => {
      // Run in chunks to maximize throughput while rendering UI updates
      const chunkSize = 150;
      let found = false;
      let finalHash = '';
      let testNonce = currentNonce;

      for (let i = 0; i < chunkSize; i++) {
        const input = createBlockInput(id, testNonce, targetBlock.data, prevHash);
        const computed = await calculateSha256(input);
        
        if (computed.startsWith('00')) {
          found = true;
          finalHash = computed;
          break;
        }
        testNonce++;
      }

      if (found) {
        // Update local block state
        const minedBlocks = updatedChain.map(b => b.id === id ? { 
          ...b, 
          nonce: testNonce, 
          hash: finalHash, 
          isValid: true 
        } : b);
        
        // Re-evaluate subsequent blocks in cascade
        const evaluated = await evaluateChain(minedBlocks);
        setBlocks(evaluated);
        setMiningId(null);
        setSimMessage(`Block ${id} successfully mined! Nonce ${testNonce} produced valid prefix '00'.`);
      } else {
        currentNonce = testNonce;
        // Update nonce in UI dynamically so users see it incrementing!
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, nonce: testNonce } : b));
        
        // Continue loop in next animation frame
        requestAnimationFrame(mineIteration);
      }
    };

    requestAnimationFrame(mineIteration);
  };

  return (
    <div className="space-y-12 py-8" id="simulator-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-teal-400 font-semibold bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
            Interactive Sandboxes
          </span>
          <h1 className="font-serif text-3xl font-medium text-stone-900 dark:text-white sm:text-4xl">
            Interactive Block Mine Simulator
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm max-w-xl font-sans">
            Learn cryptographic security firsthand. Tamper with block transaction data, view the cascading disruption, and click Mine to resolve the Proof of Work.
          </p>
        </div>

        <button
          onClick={handleResetChain}
          disabled={miningId !== null}
          className="flex items-center justify-center space-x-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900/40 px-4 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-white transition cursor-pointer active:scale-[0.98] disabled:opacity-50"
          id="reset-chain-btn"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Verified Chain</span>
        </button>
      </div>

      {/* Simulator Log Board */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0d0d0d] p-4 flex gap-3.5 items-start transition-colors duration-300">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20">
          <Cpu className="h-4.5 w-4.5" />
        </div>
        <div>
          <h4 className="font-mono text-xs uppercase tracking-wider text-stone-600 dark:text-stone-500 font-bold">Simulator Log Feed</h4>
          <p className="font-mono text-xs text-teal-600 dark:text-teal-300 mt-1 leading-relaxed" id="simulator-log-text">
            {simMessage}
          </p>
        </div>
      </div>

      {/* Visual Blockchain */}
      <div className="flex flex-col gap-10 xl:gap-8" id="simulator-chain-container">
        {blocks.map((block, index) => {
          const isMining = miningId === block.id;
          const prevBlockValid = index === 0 || blocks[index - 1].isValid;
          
          return (
            <div key={block.id} className="relative" id={`block-wrapper-${block.id}`}>
              
              {/* Connector Link Wire */}
              {index > 0 && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-10 w-1 flex flex-col items-center justify-center">
                  <div className={`h-full w-0.5 transition-colors duration-300 ${
                    block.previousHash.startsWith('00') && prevBlockValid ? 'bg-teal-500' : 'bg-red-500 animate-pulse'
                  }`} />
                  <div className={`absolute top-1/2 -translate-y-1/2 rounded-full p-1 border transition-colors ${
                    block.previousHash.startsWith('00') && prevBlockValid 
                      ? 'bg-stone-50 dark:bg-[#050505] border-teal-500 text-teal-500 dark:text-teal-400' 
                      : 'bg-stone-50 dark:bg-[#050505] border-red-500 text-red-500 dark:text-red-400'
                  }`}>
                    <LinkIcon className="h-3 w-3" />
                  </div>
                </div>
              )}

              {/* Block Body Card */}
              <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                block.isValid 
                  ? 'bg-white dark:bg-[#0d0d0d] border-stone-200 dark:border-stone-800 hover:border-teal-500/30 dark:hover:border-teal-500/20' 
                  : 'bg-white dark:bg-[#0d0d0d] border-red-200 dark:border-red-950/80 hover:border-red-300 dark:hover:border-red-900'
              } ${isMining ? 'mining-pulse border-teal-400 dark:border-teal-500/40' : ''}`}>
                
                {/* Block Header Tab */}
                <div className={`px-6 py-4 flex items-center justify-between border-b transition-colors duration-300 ${
                  block.isValid ? 'bg-teal-50 dark:bg-teal-950/10 border-stone-200 dark:border-stone-800/60' : 'bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-950/40'
                }`}>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-stone-500 dark:text-stone-500">#0{block.id}</span>
                    <span className="font-serif text-sm font-medium text-stone-900 dark:text-stone-200">
                      {index === 0 ? 'Genesis Block' : `Block ${block.id}`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {block.isValid ? (
                      <span className="inline-flex items-center space-x-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Block Valid</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Invalid State</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Block Content Inputs */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Form: Data input & Nonce */}
                  <div className="md:col-span-7 space-y-4">
                    {/* Data Field */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono font-bold text-stone-600 dark:text-stone-500 uppercase">
                        Transaction Data (Editable)
                      </label>
                      <textarea
                        rows={2}
                        value={block.data}
                        onChange={(e) => handleDataChange(block.id, e.target.value)}
                        disabled={isMining}
                        placeholder="Type any ledger transactions or batch statements here..."
                        className="w-full rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#070707] p-3 text-sm text-stone-900 dark:text-stone-300 placeholder-stone-400 dark:placeholder-stone-700 focus:border-teal-500 focus:outline-none transition disabled:opacity-50 font-sans"
                        id={`block-data-${block.id}`}
                      />
                    </div>

                    {/* Nonce Config & Mining Action */}
                    <div className="flex items-end gap-4">
                      {/* Nonce Input */}
                      <div className="w-1/3 space-y-1.5">
                        <label className="block text-xs font-mono font-bold text-stone-600 dark:text-stone-500 uppercase">
                          Nonce
                        </label>
                        <input
                          type="number"
                          value={block.nonce}
                          onChange={(e) => handleNonceChange(block.id, parseInt(e.target.value))}
                          disabled={isMining}
                          className="w-full rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#070707] px-3 py-2 text-sm font-mono text-teal-600 dark:text-teal-400 focus:border-teal-500 focus:outline-none transition text-center font-bold"
                          id={`block-nonce-${block.id}`}
                        />
                      </div>

                      {/* Mine Action */}
                      <button
                        onClick={() => handleMineBlock(block.id)}
                        disabled={isMining || (block.isValid && block.previousHash.startsWith('00') && prevBlockValid)}
                        className={`flex-1 flex items-center justify-center space-x-2 rounded-lg py-2.5 text-xs font-bold transition cursor-pointer active:scale-[0.98] ${
                          isMining 
                            ? 'bg-teal-600 cursor-wait text-white dark:text-black' 
                            : block.isValid && prevBlockValid
                            ? 'bg-stone-100 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed'
                            : 'bg-teal-600 hover:bg-teal-500 text-white dark:text-black hover:shadow-teal-500/10 uppercase tracking-wider'
                        }`}
                        id={`mine-btn-${block.id}`}
                      >
                        <Pickaxe className={`h-4 w-4 ${isMining ? 'animate-spin text-teal-900' : ''}`} />
                        <span>{isMining ? `Mining (${block.nonce})...` : block.isValid && prevBlockValid ? 'Already Valid' : 'Mine Block'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Form: Cryptographic Link Outputs */}
                  <div className="md:col-span-5 space-y-4 font-mono text-[11px]">
                    {/* Previous Hash Display */}
                    <div className="space-y-1.5">
                      <span className="block text-stone-500 font-bold uppercase">
                        Previous Hash Link
                      </span>
                      <div className={`p-2.5 rounded-lg border font-mono text-[10px] break-all leading-tight ${
                        block.previousHash === GENESIS_PREV_HASH
                          ? 'bg-stone-50 dark:bg-stone-900/20 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-500'
                          : block.previousHash.startsWith('00') && prevBlockValid
                          ? 'bg-teal-50 dark:bg-teal-950/5 border-teal-200 dark:border-teal-950/40 text-teal-700 dark:text-teal-400'
                          : 'bg-red-50 dark:bg-red-950/5 border-red-200 dark:border-red-950/40 text-red-700 dark:text-red-400'
                      }`}>
                        {block.previousHash}
                      </div>
                    </div>

                    {/* Calculated Hash Display */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="block text-stone-500 font-bold uppercase">
                          Computed Hash Output
                        </span>
                        {block.hash.startsWith('00') && (
                          <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                            Prefix matched (00)
                          </span>
                        )}
                      </div>
                      <div className={`p-2.5 rounded-lg border font-mono text-[10px] break-all leading-tight font-bold ${
                        block.isValid
                          ? 'bg-teal-50 dark:bg-teal-950/10 border-teal-200 dark:border-teal-900 text-teal-700 dark:text-teal-400 shadow-sm shadow-teal-100 dark:shadow-teal-950/50'
                          : 'bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400'
                      }`} id={`block-hash-${block.id}`}>
                        {block.hash || 'Evaluating initial state...'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulator Educational Insights FAQ */}
      <section className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/10 p-6 sm:p-8 transition-colors duration-300" id="simulator-faq">
        <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-white mb-4">Under the Hood: The Mechanics of Immutability</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400 font-sans">
          <div className="space-y-2">
            <h4 className="font-serif italic text-stone-800 dark:text-stone-300">1. Cryptographic Chaining</h4>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              Each block inputs its <strong>Previous Hash</strong> into its SHA-256 computation. This locks the sequence. If you edit even one comma in Block 1, its hash changes, meaning Block 2's input is altered, instantly breaking its validity. That breaks Block 3, and so on.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-serif italic text-stone-800 dark:text-stone-300">2. Proof of Work Mining</h4>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              A computer cannot predict a SHA-256 output. To find a hash starting with two zeros (<code>'00'</code>), the miner must systematically increment a dummy integer called the <strong>Nonce</strong> (Number used once) over and over until the matching signature is randomly discovered.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
