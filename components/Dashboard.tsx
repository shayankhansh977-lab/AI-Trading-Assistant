

import React, { useState } from 'react';
import { Portfolio } from './Portfolio';
import { MarketWatch } from './MarketWatch';
import { TradePanel } from './TradePanel';
import { AiAssistant } from './AiAssistant';
import { Asset } from '../types';

export const Dashboard: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          <Portfolio />
          <MarketWatch onAssetSelect={setSelectedAsset} />
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
          <TradePanel selectedAsset={selectedAsset} />
          <AiAssistant />
        </div>
      </div>
    </div>
  );
};