import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { Asset } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 ${className}`}>
        {children}
    </div>
);

const PriceChange: React.FC<{ change: number; percent: number }> = ({ change, percent }) => {
    const isPositive = change >= 0;
    return (
        <span className={`font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {change.toFixed(2)} ({percent.toFixed(2)}%)
        </span>
    );
};

export const MarketWatch: React.FC<{ onAssetSelect: (asset: Asset) => void }> = ({ onAssetSelect }) => {
  const { marketData } = useContext(AppContext);
  const [activeAsset, setActiveAsset] = useState<Asset | null>(marketData[0] || null);
  const [filter, setFilter] = useState<'All' | 'Stocks' | 'Commodities'>('All');

  const filteredData = useMemo(() => {
    if (filter === 'Stocks') return marketData.filter(a => a.type === 'Stock');
    if (filter === 'Commodities') return marketData.filter(a => a.type === 'Commodity');
    return marketData;
  }, [marketData, filter]);

  const handleRowClick = (asset: Asset) => {
    setActiveAsset(asset);
    onAssetSelect(asset);
  };
  
  const chartData = useMemo(() => activeAsset?.history.map(h => ({ name: h.time.toLocaleTimeString(), price: h.price })), [activeAsset]);

  return (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Market Watch</h2>
            <div className="flex space-x-1 p-1 rounded-lg bg-gray-700/50">
                {(['All', 'Stocks', 'Commodities'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-sm font-semibold rounded-md ${filter === f ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-600/50'}`}>
                        {f}
                    </button>
                ))}
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                 <div className="overflow-x-auto max-h-[300px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="py-3 px-4 font-semibold text-sm text-gray-400">Ticker</th>
                                <th className="py-3 px-4 font-semibold text-sm text-gray-400 text-right">Price</th>
                                <th className="py-3 px-4 font-semibold text-sm text-gray-400 text-right">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(asset => (
                                <tr 
                                    key={asset.ticker} 
                                    className={`border-b border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-700/50 ${activeAsset?.ticker === asset.ticker ? 'bg-gray-700' : ''}`}
                                    onClick={() => handleRowClick(asset)}
                                >
                                    <td className="py-3 px-4 font-bold text-cyan-400">{asset.ticker}</td>
                                    <td className="py-3 px-4 text-right font-mono text-yellow-300">${asset.price.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-right"><PriceChange change={asset.change} percent={asset.changePercent} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="md:col-span-1">
                {activeAsset && (
                    <div>
                        <h3 className="text-xl font-bold">{activeAsset.name} ({activeAsset.ticker})</h3>
                        <p className="text-2xl font-mono text-yellow-300">${activeAsset.price.toFixed(2)}</p>
                        <PriceChange change={activeAsset.change} percent={activeAsset.changePercent} />
                        <div className="h-40 mt-4">
                           <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={activeAsset.change >= 0 ? '#34d399' : '#f87171'} stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor={activeAsset.change >= 0 ? '#34d399' : '#f87171'} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" tick={false} axisLine={false} />
                                    <YAxis domain={['dataMin - (dataMax-dataMin)*0.1', 'dataMax + (dataMax-dataMin)*0.1']} hide />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.7)', border: 'none', borderRadius: '0.5rem', backdropFilter: 'blur(4px)' }} 
                                        labelStyle={{ color: '#F9FAFB' }}
                                        itemStyle={{ color: activeAsset.change >= 0 ? '#34d399' : '#f87171' }}
                                        formatter={(value: number) => `$${value.toFixed(2)}`}
                                    />
                                    <Area type="monotone" dataKey="price" stroke={activeAsset.change >= 0 ? '#34d399' : '#f87171'} strokeWidth={2} fillOpacity={1} fill="url(#priceGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </Card>
  );
};