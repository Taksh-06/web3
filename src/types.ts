/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId = 'home' | 'concepts' | 'prices' | 'simulator';

export interface ConceptComparisonPoint {
  feature: string;
  leftValue: string;
  rightValue: string;
}

export interface ConceptItem {
  id: string;
  title: string;
  leftCategoryName: string;
  rightCategoryName: string;
  leftSummary: string;
  rightSummary: string;
  points: ConceptComparisonPoint[];
  colorTheme: string; // 'indigo' | 'emerald' | 'amber' | 'rose' etc.
  explanation: string;
}

export interface CoinPrice {
  id: string;
  name: string;
  symbol: string;
  priceUsd: number;
  change24h: number;
  lastUpdated: string;
  sparkline: number[];
  isSimulated?: boolean;
}

export interface Block {
  id: number;
  nonce: number;
  data: string;
  previousHash: string;
  hash: string;
  isValid: boolean;
}
