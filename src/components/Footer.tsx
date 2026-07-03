/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PageId } from '../types';
import { Github, Layers, ShieldCheck, Cpu } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: PageId) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#0a0a0a] px-4 py-12 text-stone-600 dark:text-stone-400 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand/Credits */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <span className="font-serif text-base font-bold text-stone-900 dark:text-white tracking-wider">NEXUS L2</span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-500 max-w-xs">
              Interactive Web3 educational explorer. Learn Layer-2 mechanics, crypto pricing, and blockchain hashing logic through hands-on simulators.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="font-serif italic text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-200">
              Explorer Sections
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  Home / L2 Arbitrum Introduction
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('concepts')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  Visual Web3 Concepts
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('prices')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  Live Prices Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('simulator')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  Cryptographic Block Simulator
                </button>
              </li>
            </ul>
          </div>

          {/* Assignment Metadata (Required name, github link, batch name) */}
          <div className="space-y-4">
            <h3 className="font-serif italic text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-200">
              Developer Info
            </h3>
            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/20 p-4 space-y-2.5 transition-colors duration-300">
              <div>
                <p className="text-xs text-stone-500">Student Developer</p>
                <p className="font-semibold text-stone-900 dark:text-stone-200">Taksh Kathiriya</p>
              </div>
              <div>
                <p className="text-xs text-stone-500">Assignment Batch</p>
                <p className="font-medium text-stone-700 dark:text-stone-300">Alpha Batch (Web3 Fellowship)</p>
              </div>
              <div className="pt-1.5">
                <a
                  href="https://github.com/Taksh-06"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition"
                  id="github-profile-link"
                >
                  <Github className="h-4 w-4" />
                  <span>Taksh-06</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-200 dark:border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-stone-600">
          <p>© {currentYear} Web3 Hub. Built for educational training purposes.</p>
          <p className="mt-2 sm:mt-0">Academic Assignment Delivery</p>
        </div>
      </div>
    </footer>
  );
}
