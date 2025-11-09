import React, { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { getAssetPrice } from '../services/marketDataService';
import { TrendingUpIcon, TrendingDownIcon, CashIcon, ChartBarIcon, CubeIcon } from './icons/Icons';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 ${className}`}>
        {children}
    </div>
);

export const Portfolio: React.FC = () => {
  const { portfolio, marketData } = useContext(AppContext);

  const { totalValue, totalPNL, totalPNLPercent } = useMemo(() => {
    const holdingsValue = portfolio.holdings.reduce((acc, holding) => {
      const currentPrice = getAssetPrice(holding.ticker, marketData) || holding.purchasePrice;
      return acc + holding.quantity * currentPrice;
    }, 0);

    const totalCost = portfolio.holdings.reduce((acc, holding) => {
        return acc + holding.quantity * holding.purchasePrice;
    }, 0);
    
    const totalValue = holdingsValue + portfolio.cash;
    const totalPNL = holdingsValue - totalCost;
    const totalPNLPercent = totalCost > 0 ? (totalPNL / totalCost) * 100 : 0;

    return { totalValue, totalPNL, totalPNLPercent };
  }, [portfolio, marketData]);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4 text-white">My Portfolio</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-lg border border-white/10">
          <h3 className="text-sm font-medium text-gray-300">Total Value</h3>
          <p className="text-2xl font-semibold text-white">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-lg border border-white/10">
          <h3 className="text-sm font-medium text-gray-300">Profit / Loss</h3>
          <div className={`flex items-center text-2xl font-semibold ${totalPNL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPNL >= 0 ? <TrendingUpIcon className="h-6 w-6 mr-1" /> : <TrendingDownIcon className="h-6 w-6 mr-1" />}
            {formatCurrency(totalPNL)}
            <span className="text-sm ml-2">({totalPNLPercent.toFixed(2)}%)</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-lg border border-white/10">
          <h3 className="text-sm font-medium text-gray-300">Buying Power</h3>
          <div className="flex items-center text-2xl font-semibold text-white">
             <CashIcon className="h-6 w-6 mr-2 text-green-400"/>
            {formatCurrency(portfolio.cash)}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 px-4 font-semibold text-sm text-gray-400">Asset</th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-400 text-right">Quantity</th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-400 text-right">Avg. Cost</th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-400 text-right">Market Value</th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-400 text-right">P/L</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.holdings.length > 0 ? portfolio.holdings.map(holding => {
              const currentPrice = getAssetPrice(holding.ticker, marketData) || 0;
              const marketValue = holding.quantity * currentPrice;
              const pnl = (currentPrice - holding.purchasePrice) * holding.quantity;
              const isProfit = pnl >= 0;
              const assetInfo = marketData.find(a => a.ticker === holding.ticker);

              return (
                <tr key={holding.ticker} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50">
                  <td className="py-4 px-4 font-bold flex items-center space-x-3">
                     {assetInfo?.type === 'Commodity' ? <CubeIcon className="h-6 w-6 text-yellow-400"/> : <ChartBarIcon className="h-6 w-6 text-indigo-400"/>}
                     <span className="text-cyan-400">{holding.ticker}</span>
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-slate-300">{holding.quantity}</td>
                  <td className="py-4 px-4 text-right font-mono text-yellow-300">{formatCurrency(holding.purchasePrice)}</td>
                  <td className="py-4 px-4 text-right font-mono text-yellow-300">{formatCurrency(marketValue)}</td>
                  <td className={`py-4 px-4 text-right font-medium ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(pnl)}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">You have no holdings.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};