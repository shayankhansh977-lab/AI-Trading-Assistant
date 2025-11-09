

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Asset, Portfolio } from './types';
import { fetchInitialMarketData } from './services/marketDataService';

export const AppContext = React.createContext<{
  theme: string;
  toggleTheme: () => void;
  portfolio: Portfolio;
  marketData: Asset[];
  tradeAsset: (ticker: string, quantity: number, price: number, type: 'BUY' | 'SELL') => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}>({
  theme: 'dark',
  toggleTheme: () => {},
  portfolio: { holdings: [], cash: 100000 },
  marketData: [],
  tradeAsset: () => {},
  isLoading: false,
  setLoading: () => {},
});

const App: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [portfolio, setPortfolio] = useState<Portfolio>({
    holdings: [
      { ticker: 'AAPL', quantity: 10, purchasePrice: 150.00 },
      { ticker: 'GOOGL', quantity: 5, purchasePrice: 2800.00 },
      { ticker: 'XAUUSD', quantity: 2, purchasePrice: 2300.00 },
    ],
    cash: 100000,
  });
  const [marketData, setMarketData] = useState<Asset[]>(fetchInitialMarketData());
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const tradeAsset = useCallback((ticker: string, quantity: number, price: number, type: 'BUY' | 'SELL') => {
    setPortfolio(prevPortfolio => {
      const cost = quantity * price;
      let newCash = prevPortfolio.cash;
      let newHoldings = [...prevPortfolio.holdings];
      const holdingIndex = newHoldings.findIndex(h => h.ticker === ticker);

      if (type === 'BUY') {
        if (prevPortfolio.cash < cost) {
          alert('Insufficient funds!');
          return prevPortfolio;
        }
        newCash -= cost;
        if (holdingIndex > -1) {
          const existingHolding = newHoldings[holdingIndex];
          const totalQuantity = existingHolding.quantity + quantity;
          const totalCost = (existingHolding.quantity * existingHolding.purchasePrice) + cost;
          newHoldings[holdingIndex] = {
            ...existingHolding,
            quantity: totalQuantity,
            purchasePrice: totalCost / totalQuantity,
          };
        } else {
          newHoldings.push({ ticker, quantity, purchasePrice: price });
        }
      } else { // SELL
        if (holdingIndex > -1) {
          const existingHolding = newHoldings[holdingIndex];
          if (existingHolding.quantity < quantity) {
            alert('Not enough shares to sell!');
            return prevPortfolio;
          }
          newCash += cost;
          if (existingHolding.quantity === quantity) {
            newHoldings.splice(holdingIndex, 1);
          } else {
            newHoldings[holdingIndex] = {
              ...existingHolding,
              quantity: existingHolding.quantity - quantity,
            };
          }
        } else {
          alert("You don't own this asset.");
          return prevPortfolio;
        }
      }
      return { cash: newCash, holdings: newHoldings };
    });
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData =>
        prevData.map(asset => {
          const change = (Math.random() - 0.5) * (asset.price * 0.01);
          const newPrice = Math.max(0.01, asset.price + change);
          const newHistory = [...asset.history, { time: new Date(), price: newPrice }];
          if (newHistory.length > 50) newHistory.shift();
          return {
            ...asset,
            price: newPrice,
            change: newPrice - asset.price,
            changePercent: ((newPrice - asset.price) / asset.price) * 100,
            history: newHistory,
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
    portfolio,
    marketData,
    tradeAsset,
    isLoading,
    setLoading,
  }), [theme, toggleTheme, portfolio, marketData, tradeAsset, isLoading]);

  return (
    <AppContext.Provider value={contextValue}>
      <div className="bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-black text-gray-900 dark:text-gray-100 min-h-screen font-sans transition-colors duration-300">
        <Header />
        <main>
          <Dashboard />
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;