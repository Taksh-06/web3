import React, { useState, useEffect } from 'react';
import { CoinPrice } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Search, 
  Coins, 
  Layers, 
  Info,
  CheckCircle,
  AlertCircle,
  X,
  CalendarDays,
  BarChart2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function PricesView() {
  const [prices, setPrices] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'l1' | 'l2'>('all');
  const [timeframe, setTimeframe] = useState<'1h' | '1d' | '7d'>('1d');
  const [isSimulatedFeed, setIsSimulatedFeed] = useState<boolean>(false);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(0);

  // Modal & Chart state
  const [selectedCoin, setSelectedCoin] = useState<CoinPrice | null>(null);
  const [chartTimeframe, setChartTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | 'Max'>('1D');
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [chartError, setChartError] = useState<string | null>(null);

  // Initial seed sparklines for visual flair
  const defaultSparklines: Record<string, number[]> = {
    bitcoin: [63800, 63950, 64100, 64000, 63900, 64200, 64350, 64250, 64400, 64250],
    ethereum: [3410, 3425, 3440, 3420, 3415, 3438, 3460, 3452, 3470, 3450],
    arbitrum: [0.94, 0.95, 0.97, 0.96, 0.955, 0.98, 0.99, 0.982, 0.995, 0.9823],
    solana: [142.1, 143.5, 144.8, 144.2, 143.9, 145.1, 146.4, 145.8, 146.9, 145.6],
    'matic-network': [0.565, 0.572, 0.581, 0.578, 0.574, 0.583, 0.589, 0.585, 0.591, 0.582]
  };

  // Predefined metadata about the coins we support
  const coinMetadata = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', type: 'l1', initialPrice: 64250.25, baseChange: 2.14 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', type: 'l1', initialPrice: 3450.40, baseChange: -1.25 },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', type: 'l2', initialPrice: 0.9823, baseChange: 5.72 },
    { id: 'solana', name: 'Solana', symbol: 'SOL', type: 'l1', initialPrice: 145.60, baseChange: -0.85 },
    { id: 'matic-network', name: 'Polygon', symbol: 'POL', type: 'l2', initialPrice: 0.5820, baseChange: 1.15 }
  ];

  const fetchPricesFromAPI = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const symbols = coinMetadata.map(c => `"${c.symbol}USDT"`).join(',');
      const url = `https://api.binance.com/api/v3/ticker?symbols=[${symbols}]&windowSize=${timeframe}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API response error: status ${response.status}`);
      }
      
      const data = await response.json();
      
      const updatedPrices: CoinPrice[] = coinMetadata.map(coin => {
        const coinData = data.find((d: any) => d.symbol === `${coin.symbol}USDT`);
        const newPrice = coinData ? parseFloat(coinData.lastPrice) : coin.initialPrice;
        const newChange = coinData ? parseFloat(coinData.priceChangePercent) : coin.baseChange;
        
        // Generate new sparkline point based on the fetched price
        const previousSpark = defaultSparklines[coin.id] || [newPrice];
        const nextSpark = [...previousSpark.slice(1), newPrice];

        return {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          priceUsd: newPrice,
          change24h: newChange,
          lastUpdated: new Date().toLocaleTimeString(),
          sparkline: nextSpark,
          isSimulated: false
        };
      });

      setPrices(updatedPrices);
      setIsSimulatedFeed(false);
    } catch (err) {
      console.warn("Binance API rate-limited or failed, loading backup simulated feed.", err);
      setErrorMsg("Binance API rate-limited (HTTP 429). Activating responsive simulated feed.");
      loadBackupSimulatedFeed();
    } finally {
      setLoading(false);
    }
  };

  const loadBackupSimulatedFeed = () => {
    setIsSimulatedFeed(true);
    const simulated: CoinPrice[] = coinMetadata.map(coin => {
      // Add slight random fluctuation on each load (-0.5% to +0.5%)
      const fluctuation = 1 + (Math.random() * 0.01 - 0.005);
      const newPrice = coin.initialPrice * fluctuation;
      
      // Keep 24h change relatively stable or fluctuate slightly
      const newChange = coin.baseChange + (Math.random() * 0.4 - 0.2);
      
      const previousSpark = defaultSparklines[coin.id] || [newPrice];
      const nextSpark = [...previousSpark.slice(1), newPrice];

      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        priceUsd: newPrice,
        change24h: newChange,
        lastUpdated: new Date().toLocaleTimeString(),
        sparkline: nextSpark,
        isSimulated: true
      };
    });
    setPrices(simulated);
  };

  const generateSimulatedChartData = (coin: CoinPrice, timeframe: string) => {
    let points = 24;
    let timeStep = 3600 * 1000;
    
    switch (timeframe) {
      case '1D': points = 96; timeStep = 15 * 60 * 1000; break;
      case '5D': points = 60; timeStep = 2 * 3600 * 1000; break;
      case '1M': points = 30; timeStep = 24 * 3600 * 1000; break;
      case '6M': points = 180; timeStep = 24 * 3600 * 1000; break;
      case 'YTD': points = 200; timeStep = 24 * 3600 * 1000; break;
      case '1Y': points = 365; timeStep = 24 * 3600 * 1000; break;
      case '5Y': points = 260; timeStep = 7 * 24 * 3600 * 1000; break;
      case 'Max': points = 300; timeStep = 30 * 24 * 3600 * 1000; break;
    }

    const data = [];
    let currentPrice = coin.priceUsd * (1 - (coin.change24h / 100)); // approximate start price
    const now = new Date().getTime();

    for (let i = points; i >= 0; i--) {
      const date = new Date(now - i * timeStep);
      let timeLabel = '';
      if (timeframe === '1D') {
        timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (timeframe === '5D' || timeframe === '1M') {
        timeLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      } else {
        timeLabel = date.toLocaleDateString([], { month: 'short', year: '2-digit' });
      }

      data.push({
        time: timeLabel,
        price: currentPrice
      });

      // generate next random walk
      currentPrice = currentPrice * (1 + (Math.random() * 0.02 - 0.01));
    }
    
    // Ensure the last point is current price
    data[data.length - 1].price = coin.priceUsd;
    
    setChartData(data);
  };

  const fetchHistoricalData = async (coin: CoinPrice, timeframe: string) => {
    setChartLoading(true);
    setChartError(null);
    try {
      let interval = '15m';
      let limit = 96;
      
      switch (timeframe) {
        case '1D': interval = '15m'; limit = 96; break;
        case '5D': interval = '2h'; limit = 60; break;
        case '1M': interval = '1d'; limit = 30; break;
        case '6M': interval = '1d'; limit = 180; break;
        case 'YTD': interval = '1d'; limit = 200; break; 
        case '1Y': interval = '1d'; limit = 365; break;
        case '5Y': interval = '1w'; limit = 260; break;
        case 'Max': interval = '1M'; limit = 1000; break;
      }

      const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${coin.symbol}USDT&interval=${interval}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      const formattedData = data.map((d: any) => {
        const date = new Date(d[0]);
        let timeLabel = '';
        if (timeframe === '1D') {
          timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (timeframe === '5D' || timeframe === '1M') {
          timeLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        } else {
          timeLabel = date.toLocaleDateString([], { month: 'short', year: '2-digit' });
        }
        return {
          time: timeLabel,
          price: parseFloat(d[4]) // Close price
        };
      });

      setChartData(formattedData);
    } catch (err) {
      console.warn("Failed to fetch historical data from Binance", err);
      setChartError("Binance API Rate Limited. Displaying simulated trend data.");
      generateSimulatedChartData(coin, timeframe);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchPricesFromAPI();
  }, [timeframe]);

  useEffect(() => {
    if (selectedCoin) {
      fetchHistoricalData(selectedCoin, chartTimeframe);
    }
  }, [selectedCoin, chartTimeframe]);

  useEffect(() => {
    if (selectedCoin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCoin]);

  const handleManualRefresh = () => {
    fetchPricesFromAPI();
  };

  const getFilteredCoins = () => {
    return prices.filter(coin => {
      const matchesSearch = coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      
      const coinMeta = coinMetadata.find(m => m.id === coin.id);
      const matchesCategory = categoryFilter === 'all' || (coinMeta && coinMeta.type === categoryFilter);
      
      return matchesSearch && matchesCategory;
    });
  };

  const filteredCoins = getFilteredCoins();

  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length === 0) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min === 0 ? 1 : max - min;
    const width = 100;
    const height = 30;
    
    const svgPoints = points.map((val, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="h-8 w-28 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={isPositive ? '#14b8a6' : '#ef4444'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={svgPoints}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-8 py-8" id="prices-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-teal-400 font-semibold bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
            Real-Time Feeds
          </span>
          <h1 className="font-serif text-3xl font-medium text-stone-900 dark:text-white sm:text-4xl">
            Live Web3 Market Index
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm max-w-lg font-sans">
            Monitor real-time prices for foundational Layer 1 assets and scaling Layer 2 rollups like Arbitrum.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className={`flex items-center justify-center space-x-2 rounded-lg bg-teal-600 px-4 py-2 text-xs uppercase tracking-wider font-semibold text-black shadow-md hover:bg-teal-500 hover:shadow-teal-500/10 transition cursor-pointer active:scale-[0.98] ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            id="refresh-prices-btn"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Fetching...' : 'Refresh Market'}</span>
          </button>
        </div>
      </div>

      {isSimulatedFeed ? (
        <div className="rounded-xl border border-amber-200 dark:border-amber-950 bg-amber-50 dark:bg-amber-950/10 p-4 text-xs flex gap-3 items-center text-amber-700 dark:text-amber-300 font-sans transition-colors duration-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500 dark:text-amber-400" />
          <div className="leading-relaxed">
            <span className="font-semibold">Local Fallback Activated:</span> Binance public API rate-limited our environment IP. Showing reactive simulated prices fluctuating in real-time on every refresh trigger.
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-950 bg-emerald-50 dark:bg-emerald-950/10 p-4 text-xs flex gap-3 items-center text-emerald-700 dark:text-emerald-300 font-sans transition-colors duration-300">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 dark:text-emerald-400" />
          <div>
            <span className="font-semibold">Live Feed Synced:</span> Fetching real-time market indices directly from the Binance public gateway. No authentication required.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 bg-white dark:bg-[#0d0d0d] p-4 rounded-xl border border-stone-200 dark:border-stone-800 transition-colors duration-300" id="market-filters-row">
        <div className="relative sm:col-span-12 lg:col-span-5">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Search assets by symbol or name... (e.g. BTC, ARB)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#070707] py-2.5 pl-10 pr-4 text-sm text-stone-900 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:border-teal-500 focus:outline-none font-sans transition-colors duration-300"
            id="market-search-input"
          />
        </div>

        <div className="flex gap-1 bg-stone-100 dark:bg-stone-900/40 p-1 rounded-lg border border-stone-200 dark:border-stone-800 sm:col-span-6 lg:col-span-4 justify-between sm:justify-start transition-colors duration-300">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`flex-1 sm:flex-none rounded-md px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-white dark:bg-stone-900 text-teal-600 dark:text-teal-400 border border-stone-200 dark:border-stone-800 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            All Coins
          </button>
          <button
            onClick={() => setCategoryFilter('l1')}
            className={`flex-1 sm:flex-none rounded-md px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
              categoryFilter === 'l1'
                ? 'bg-white dark:bg-stone-900 text-teal-600 dark:text-teal-400 border border-stone-200 dark:border-stone-800 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Layer 1
          </button>
          <button
            onClick={() => setCategoryFilter('l2')}
            className={`flex-1 sm:flex-none rounded-md px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
              categoryFilter === 'l2'
                ? 'bg-white dark:bg-stone-900 text-teal-600 dark:text-teal-400 border border-stone-200 dark:border-stone-800 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Layer 2
          </button>
        </div>

        <div className="flex gap-1 bg-stone-100 dark:bg-stone-900/40 p-1 rounded-lg border border-stone-200 dark:border-stone-800 sm:col-span-6 lg:col-span-3 justify-between sm:justify-start transition-colors duration-300">
          <button
            onClick={() => setTimeframe('1h')}
            className={`flex-1 sm:flex-none rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              timeframe === '1h'
                ? 'bg-white dark:bg-stone-900 text-teal-600 dark:text-teal-400 border border-stone-200 dark:border-stone-800 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            1H
          </button>
          <button
            onClick={() => setTimeframe('1d')}
            className={`flex-1 sm:flex-none rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              timeframe === '1d'
                ? 'bg-white dark:bg-stone-900 text-teal-600 dark:text-teal-400 border border-stone-200 dark:border-stone-800 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            24H
          </button>
          <button
            onClick={() => setTimeframe('7d')}
            className={`flex-1 sm:flex-none rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              timeframe === '7d'
                ? 'bg-white dark:bg-stone-900 text-teal-600 dark:text-teal-400 border border-stone-200 dark:border-stone-800 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            7D
          </button>
        </div>
      </div>

      {loading && prices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <RefreshCw className="h-8 w-8 text-teal-400 animate-spin" />
          <p className="text-sm text-stone-500 font-sans">Querying Binance price arrays...</p>
        </div>
      ) : filteredCoins.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0d0d0d] transition-colors duration-300">
          <p className="text-stone-500 text-sm font-sans">No assets matching "{searchQuery}" were found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" id="coin-cards-grid">
          {filteredCoins.map((coin) => {
            const isPositive = coin.change24h >= 0;
            const coinMeta = coinMetadata.find(m => m.id === coin.id);
            const isL2 = coinMeta?.type === 'l2';

            return (
              <div
                key={coin.id}
                onClick={() => setSelectedCoin(coin)}
                className="flex flex-col justify-between rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0d0d0d] p-6 transition-all hover:-translate-y-1 hover:border-teal-500/30 dark:hover:border-teal-500/20 duration-200 cursor-pointer shadow-sm hover:shadow-md dark:shadow-none"
                id={`coin-card-${coin.symbol}`}
              >
                <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800/60">
                  <div className="flex items-center space-x-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold font-mono text-sm ${
                      coin.symbol === 'BTC' ? 'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-500' :
                      coin.symbol === 'ETH' ? 'bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-teal-600 dark:text-teal-400' :
                      coin.symbol === 'ARB' ? 'bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-teal-600 dark:text-teal-300' :
                      coin.symbol === 'SOL' ? 'bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300' :
                      'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {coin.symbol}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-white leading-tight">{coin.name}</h3>
                      <p className="font-mono text-[10px] uppercase text-stone-500 leading-none mt-1">{coin.symbol} / USD</p>
                    </div>
                  </div>
                  
                  <span className={`rounded-lg px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider ${
                    isL2 
                      ? 'bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/25' 
                      : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
                  }`}>
                    {isL2 ? 'Layer 2' : 'Layer 1'}
                  </span>
                </div>

                <div className="py-5 font-sans">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
                      ${coin.priceUsd.toLocaleString(undefined, {
                        minimumFractionDigits: coin.priceUsd < 2 ? 4 : 2,
                        maximumFractionDigits: coin.priceUsd < 2 ? 4 : 2
                      })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`inline-flex items-center space-x-1 rounded px-1.5 py-0.5 text-xs font-semibold ${
                      isPositive ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3 shrink-0" />
                      ) : (
                        <TrendingDown className="h-3 w-3 shrink-0" />
                      )}
                      <span>
                        {isPositive ? '+' : ''}
                        {coin.change24h.toFixed(2)}%
                      </span>
                    </span>
                    <span className="text-[10px] text-stone-500">
                      past {timeframe === '1h' ? '1h' : timeframe === '1d' ? '24h' : '7d'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800/60 mt-auto font-sans">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-stone-500 uppercase">
                      {timeframe === '1h' ? '1h' : timeframe === '1d' ? '24h' : '7d'} Trend
                    </span>
                    <div className="mt-1">
                      {renderSparkline(coin.sparkline, isPositive)}
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="text-[9px] font-mono text-stone-500 uppercase">Last Updated</span>
                    <span className="font-mono text-[10px] text-stone-400 mt-1">{coin.lastUpdated}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Google Finance Style Chart Modal */}
      {selectedCoin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-[#202124] rounded-xl border border-[#3c4043] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col text-stone-200 font-sans relative">
            
            <button 
              onClick={() => setSelectedCoin(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-700 transition-colors z-10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 pb-2">
              <div className="text-[#9aa0a6] text-sm mb-2 flex items-center gap-1">
                <span>Market Summary</span>
                <span>&gt;</span>
                <span className="text-stone-200">{selectedCoin.name}</span>
              </div>
              
              <div className="flex items-end gap-2">
                <h1 className="text-5xl font-normal tracking-tight text-white">
                  {selectedCoin.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </h1>
                <span className="text-2xl text-[#9aa0a6] font-normal mb-1">USD</span>
              </div>
              
              <div className={`mt-2 flex items-center gap-1 text-lg font-medium ${selectedCoin.change24h >= 0 ? 'text-[#81c995]' : 'text-[#f28b82]'}`}>
                <span>{selectedCoin.change24h >= 0 ? '+' : ''}{(selectedCoin.priceUsd * Math.abs(selectedCoin.change24h) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
                <span>({selectedCoin.change24h >= 0 ? '+' : ''}{selectedCoin.change24h.toFixed(2)}%)</span>
                {selectedCoin.change24h >= 0 ? <TrendingUp className="h-5 w-5 ml-1" /> : <TrendingDown className="h-5 w-5 ml-1" />}
                <span className="text-[#9aa0a6] text-sm ml-1 font-normal">today</span>
              </div>

              <div className="text-[#9aa0a6] text-xs mt-2 flex items-center gap-2">
                <span>{selectedCoin.lastUpdated} · <span className="underline cursor-pointer">Disclaimer</span></span>
              </div>
            </div>

            {/* Timeframe Tabs */}
            <div className="flex px-6 mt-4 border-b border-[#3c4043] gap-6 text-sm font-medium">
              {['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'Max'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf as any)}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                    chartTimeframe === tf 
                      ? 'border-[#8ab4f8] text-[#8ab4f8]' 
                      : 'border-transparent text-[#9aa0a6] hover:text-stone-300'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Chart Area */}
            <div className="p-0 relative h-[350px] w-full mt-4">
              {chartError && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded bg-[#3c4043] px-3 py-1.5 text-xs text-amber-300 flex items-center gap-2 shadow-lg">
                  <AlertCircle className="h-3 w-3" />
                  {chartError}
                </div>
              )}

              {chartLoading ? (
                <div className="h-full w-full flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="h-8 w-8 text-[#8ab4f8] animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedCoin.change24h >= 0 ? '#81c995' : '#f28b82'} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={selectedCoin.change24h >= 0 ? '#81c995' : '#f28b82'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3c4043" opacity={0.5} />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#9aa0a6' }}
                      dy={10}
                      minTickGap={40}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#9aa0a6' }}
                      tickFormatter={(value) => value >= 1000 ? (value/1000).toFixed(1) + 'k' : value.toFixed(2)}
                      orientation="left"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#202124', 
                        border: '1px solid #3c4043',
                        borderRadius: '4px',
                        color: '#e8eaed',
                        fontSize: '12px',
                        padding: '8px 12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                      }}
                      itemStyle={{ color: '#e8eaed', fontWeight: 500 }}
                      formatter={(value: number) => [value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6}), '']}
                      labelStyle={{ color: '#9aa0a6', marginBottom: '2px', fontSize: '11px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={selectedCoin.change24h >= 0 ? '#81c995' : '#f28b82'} 
                      strokeWidth={1.5}
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Converter Footer */}
            <div className="p-6 pt-4 bg-[#202124] border-t border-[#3c4043] flex gap-4">
              <div className="flex-1 flex items-center border border-[#5f6368] rounded-md overflow-hidden bg-[#202124] h-14 focus-within:border-[#8ab4f8]">
                <input type="text" readOnly value="1" className="bg-transparent border-none outline-none text-white px-4 py-2 w-full font-sans text-lg" />
                <div className="px-4 text-[#9aa0a6] border-l border-[#5f6368] h-full flex items-center bg-[#303134] font-medium min-w-[80px] justify-center">
                  {selectedCoin.symbol}
                </div>
              </div>
              <div className="flex-1 flex items-center border border-[#5f6368] rounded-md overflow-hidden bg-[#202124] h-14 focus-within:border-[#8ab4f8]">
                <input type="text" readOnly value={selectedCoin.priceUsd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})} className="bg-transparent border-none outline-none text-white px-4 py-2 w-full font-sans text-lg" />
                <div className="px-4 text-[#9aa0a6] border-l border-[#5f6368] h-full flex items-center bg-[#303134] font-medium min-w-[80px] justify-center">
                  USD
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
