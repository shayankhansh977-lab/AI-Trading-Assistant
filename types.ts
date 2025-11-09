

export type AssetType = 'Stock' | 'Commodity';

export interface HistoryPoint {
  time: Date;
  price: number;
}

export interface Stock {
  type: 'Stock';
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  volume: string;
  history: HistoryPoint[];
}

export interface Commodity {
    type: 'Commodity';
    ticker: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    unit: string;
    history: HistoryPoint[];
}

export type Asset = Stock | Commodity;


export interface Holding {
  ticker: string;
  quantity: number;
  purchasePrice: number;
}

export interface Portfolio {
  holdings: Holding[];
  cash: number;
}

export interface SearchResult {
    ticker: string;
    reason: string;
    type: AssetType;
}