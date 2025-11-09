import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { Asset } from '../types';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 ${className}`}>
        {children}
    </div>
);

export const TradePanel: React.FC<{ selectedAsset: Asset | null }> = ({ selectedAsset }) => {
  const { tradeAsset, portfolio } = useContext(AppContext);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState('');
  const [ticker, setTicker] = useState('');

  useEffect(() => {
    if (selectedAsset) {
      setTicker(selectedAsset.ticker);
    }
  }, [selectedAsset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numQuantity = parseFloat(quantity);
    if (!ticker || !selectedAsset || isNaN(numQuantity) || numQuantity <= 0) {
      alert('Please enter a valid ticker and quantity.');
      return;
    }
    tradeAsset(ticker, numQuantity, selectedAsset.price, tradeType);
    setQuantity('');
  };

  const totalCost = selectedAsset ? (parseFloat(quantity) || 0) * selectedAsset.price : 0;
  const sharesOwned = portfolio.holdings.find(h => h.ticker === ticker)?.quantity || 0;

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4 text-white">Trade</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex mb-4 rounded-md bg-gray-700/50 p-1">
          <button
            type="button"
            onClick={() => setTradeType('BUY')}
            className={`w-1/2 py-2 text-sm font-semibold rounded transition-all duration-300 ${tradeType === 'BUY' ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md' : 'text-gray-300'}`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setTradeType('SELL')}
            className={`w-1/2 py-2 text-sm font-semibold rounded transition-all duration-300 ${tradeType === 'SELL' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md' : 'text-gray-300'}`}
          >
            Sell
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="ticker" className="block text-sm font-medium text-gray-300">Ticker</label>
            <input
              type="text"
              id="ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="e.g., AAPL"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">Quantity</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              min="0.01"
              step="any"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              {tradeType === 'SELL' ? `You own: ${sharesOwned} shares` : ''}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Estimated Cost</span>
            <span className="font-semibold text-yellow-300">${totalCost.toFixed(2)}</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={!selectedAsset}
          className={`mt-6 w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-300 ${
            tradeType === 'BUY' ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600' : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-gray-600 disabled:from-gray-600`}
        >
          {tradeType === 'BUY' ? 'Place Buy Order' : 'Place Sell Order'}
        </button>
      </form>
    </Card>
  );
};