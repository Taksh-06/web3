/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ConceptsView from './components/ConceptsView';
import PricesView from './components/PricesView';
import SimulatorView from './components/SimulatorView';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
      if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    }
    return 'dark'; // default to dark
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const renderActiveView = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView setCurrentPage={setCurrentPage} />;
      case 'concepts':
        return <ConceptsView />;
      case 'prices':
        return <PricesView />;
      case 'simulator':
        return <SimulatorView />;
      default:
        return <HomeView setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 dark:bg-[#0a0a0a] text-stone-900 dark:text-stone-200 font-sans selection:bg-teal-500 selection:text-white dark:selection:text-black transition-colors duration-300" id="app-root">
      {/* Persistent Responsive Header & Nav */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} theme={theme} setTheme={setTheme} />

      {/* Main Educational Stage */}
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="py-6 sm:py-10"
              id="view-transition-wrapper"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Persistent Academic Footer */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
