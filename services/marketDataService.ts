

import { Stock, Commodity, Asset, HistoryPoint } from '../types';

const generatePriceHistory = (basePrice: number): HistoryPoint[] => {
  const history: HistoryPoint[] = [];
  let currentPrice = basePrice;
  const now = new Date();
  for (let i = 0; i < 50; i++) {
    const change = (Math.random() - 0.5) * (currentPrice * 0.01);
    currentPrice += change;
    history.push({ time: new Date(now.getTime() - (50 - i) * 60000), price: currentPrice });
  }
  return history;
};

const initialStocks: Stock[] = [
  { type: 'Stock', ticker: 'AAPL', name: 'Apple Inc.', price: 172.45, change: 1.25, changePercent: 0.73, marketCap: '2.8T', volume: '52M', history: generatePriceHistory(172.45) },
  { type: 'Stock', ticker: 'GOOGL', name: 'Alphabet Inc.', price: 2854.32, change: -12.55, changePercent: -0.44, marketCap: '1.9T', volume: '1.2M', history: generatePriceHistory(2854.32) },
  { type: 'Stock', ticker: 'MSFT', name: 'Microsoft Corp.', price: 304.87, change: 2.10, changePercent: 0.69, marketCap: '2.3T', volume: '25M', history: generatePriceHistory(304.87) },
  { type: 'Stock', ticker: 'AMZN', name: 'Amazon.com, Inc.', price: 3412.98, change: 25.43, changePercent: 0.75, marketCap: '1.7T', volume: '2.8M', history: generatePriceHistory(3412.98) },
  { type: 'Stock', ticker: 'TSLA', name: 'Tesla, Inc.', price: 780.59, change: -15.21, changePercent: -1.91, marketCap: '780B', volume: '30M', history: generatePriceHistory(780.59) },
  { type: 'Stock', ticker: 'NVDA', name: 'NVIDIA Corp.', price: 220.15, change: 5.67, changePercent: 2.64, marketCap: '550B', volume: '45M', history: generatePriceHistory(220.15) },
];

const initialCommodities: Commodity[] = [
    { type: 'Commodity', ticker: 'XAUUSD', name: 'Gold', price: 2350.55, change: 15.30, changePercent: 0.65, unit: 'per troy ounce', history: generatePriceHistory(2350.55) },
    { type: 'Commodity', ticker: 'XAGUSD', name: 'Silver', price: 28.75, change: -0.25, changePercent: -0.86, unit: 'per troy ounce', history: generatePriceHistory(28.75) },
    { type: 'Commodity', ticker: 'WTI', name: 'Crude Oil', price: 85.43, change: 1.12, changePercent: 1.33, unit: 'per barrel', history: generatePriceHistory(85.43) },
];

export const fetchInitialMarketData = (): Asset[] => {
  return [...initialStocks, ...initialCommodities];
};

export const getAssetPrice = (ticker: string, marketData: Asset[]): number | undefined => {
  return marketData.find(s => s.ticker === ticker)?.price;
};