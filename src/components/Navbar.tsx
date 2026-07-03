/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId } from '../types';
import { Layers, BookOpen, Coins, Cpu, Menu, X, Box, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export default function Navbar({ currentPage, setCurrentPage, theme, setTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home' as PageId, label: 'L2 Hub', icon: Layers, desc: 'Arbitrum & Layer 2' },
    { id: 'concepts' as PageId, label: 'Web3 Concepts', icon: BookOpen, desc: 'Core Comparisons' },
    { id: 'prices' as PageId, label: 'Live Prices', icon: Coins, desc: 'Market Dashboard' },
    { id: 'simulator' as PageId, label: 'Block Simulator', icon: Cpu, desc: 'Interactive Mining' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <div 
            onClick={() => setCurrentPage('home')}
            className="flex cursor-pointer items-center space-x-3.5 transition-opacity hover:opacity-90"
            id="nav-logo"
          >
            <div className="w-8 h-8 border border-teal-500/50 flex items-center justify-center rotate-45 bg-teal-500/10">
              <div className="w-4 h-4 bg-teal-500 -rotate-45 flex items-center justify-center">
                <Box className="h-3 w-3 text-black" />
              </div>
            </div>
            <div>
              <span className="font-serif text-xl tracking-wider font-semibold text-stone-900 dark:text-white">
                NEXUS<span className="text-teal-500 dark:text-teal-400 italic">L2</span>
              </span>
              <p className="font-mono text-[9px] uppercase tracking-widest text-stone-500 leading-none mt-0.5">
                Web3 Learning Hub
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold" id="nav-desktop-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-stone-100 dark:bg-stone-900 text-teal-600 dark:text-teal-400 border border-stone-200 dark:border-stone-800/80 shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900/40 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-stone-400 dark:text-stone-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex items-center justify-center rounded-xl p-2 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-stone-200 focus:outline-none transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                id="mobile-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center rounded-xl p-2 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-stone-200 focus:outline-none transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-900 bg-white dark:bg-[#0a0a0a] px-2 pt-2 pb-4 space-y-1" id="nav-mobile-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-mobile-link-${item.id}`}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-base font-medium transition-all ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-500/10 border-l-4 border-teal-500 text-teal-700 dark:text-teal-300'
                    : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-serif italic leading-none text-stone-900 dark:text-stone-200">{item.label}</div>
                  <div className="text-xs text-stone-500 mt-0.5 font-normal">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
