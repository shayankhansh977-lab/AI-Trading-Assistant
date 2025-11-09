import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../App';
import { analyzePortfolio, searchAssets, generateSmartAlerts } from '../services/geminiService';
import { SearchResult } from '../types';
import { SparklesIcon, SearchIcon, LightBulbIcon, RefreshIcon } from './icons/Icons';
import ReactMarkdown from 'react-markdown';


const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 ${className}`}>
        {children}
    </div>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
    </div>
);

export const AiAssistant: React.FC = () => {
    const { portfolio, setLoading: setAppLoading } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('analysis');
    const [analysis, setAnalysis] = useState('');
    const [alerts, setAlerts] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setLoading] = useState<Record<string, boolean>>({
        analysis: false,
        alerts: false,
        search: false,
    });
    const [error, setError] = useState<string | null>(null);

    const handleAnalyzePortfolio = useCallback(async () => {
        setLoading(prev => ({ ...prev, analysis: true }));
        setAppLoading(true);
        try {
            const result = await analyzePortfolio(portfolio.holdings, portfolio.cash);
            setAnalysis(result);
        } catch (e) {
            setAnalysis("Failed to load AI analysis. Please check your connection or API key.");
        } finally {
            setLoading(prev => ({ ...prev, analysis: false }));
            setAppLoading(false);
        }
    }, [portfolio, setAppLoading]);

    const handleGenerateAlerts = useCallback(async () => {
        setLoading(prev => ({...prev, alerts: true}));
        try {
            const result = await generateSmartAlerts();
            setAlerts(result);
        } catch (e) {
            setAlerts(["Failed to load AI alerts."]);
        } finally {
            setLoading(prev => ({...prev, alerts: false}));
        }
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setLoading(prev => ({ ...prev, search: true }));
        setAppLoading(true);
        setError(null);
        try {
            const results = await searchAssets(searchQuery);
            setSearchResults(results);
        } catch (e: any) {
            setError(e.message || "An error occurred during search.");
            setSearchResults([]);
        } finally {
            setLoading(prev => ({ ...prev, search: false }));
            setAppLoading(false);
        }
    };
    
    useEffect(() => {
        handleGenerateAlerts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Card>
            <div className="flex items-center space-x-2 mb-4">
                <SparklesIcon className="h-6 w-6 text-indigo-400"/>
                <h2 className="text-2xl font-bold text-white">AI Assistant</h2>
            </div>
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {['analysis', 'alerts', 'search'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                    ? 'border-indigo-400 text-indigo-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                            } capitalize whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-all duration-300`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="mt-4 min-h-[300px]">
                {activeTab === 'analysis' && (
                    <div>
                        <button onClick={handleAnalyzePortfolio} disabled={isLoading.analysis} className="w-full flex justify-center items-center mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:from-gray-600 disabled:to-gray-600">
                             {isLoading.analysis ? 'Analyzing...' : 'Analyze My Portfolio'}
                        </button>
                        {isLoading.analysis ? <LoadingSpinner/> :
                         <div className="prose prose-sm prose-invert max-w-none text-gray-300">
                             {analysis ? <ReactMarkdown>{analysis}</ReactMarkdown> : <p className="text-gray-400">Click the button to get an AI-powered analysis of your current portfolio.</p>}
                         </div>
                        }
                    </div>
                )}
                {activeTab === 'alerts' && (
                    <div>
                         <button onClick={handleGenerateAlerts} disabled={isLoading.alerts} className="text-indigo-400 hover:text-indigo-500 float-right"><RefreshIcon className={`h-5 w-5 ${isLoading.alerts ? 'animate-spin' : ''}`} /></button>
                         <h3 className="font-semibold mb-2">Smart Alerts</h3>
                         {isLoading.alerts ? <LoadingSpinner/> :
                         <ul className="space-y-3">
                             {alerts.map((alert, index) => (
                                 <li key={index} className="flex items-start space-x-3 text-sm">
                                     <LightBulbIcon className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5"/>
                                     <span className="text-gray-300">{alert}</span>
                                 </li>
                             ))}
                         </ul>
                         }
                    </div>
                )}
                {activeTab === 'search' && (
                    <div>
                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="e.g., undervalued tech stocks"
                                className="flex-grow block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button type="submit" disabled={isLoading.search} className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600"><SearchIcon className="h-5 w-5"/></button>
                        </form>
                        {isLoading.search ? <LoadingSpinner/> :
                         error ? <p className="text-red-400 text-sm">{error}</p> :
                         <ul className="space-y-3">
                             {searchResults.map((result, index) => (
                                 <li key={index} className="p-3 bg-gray-700/50 rounded-md">
                                     <div className="flex justify-between items-center">
                                        <p className="font-bold text-cyan-400">{result.ticker}</p>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${result.type === 'Stock' ? 'bg-indigo-200 text-indigo-800 dark:bg-indigo-500/30 dark:text-indigo-300' : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-500/30 dark:text-yellow-300'}`}>{result.type}</span>
                                    </div>
                                     <p className="text-sm text-gray-300 mt-1">{result.reason}</p>
                                 </li>
                             ))}
                         </ul>
                        }
                    </div>
                )}
            </div>
        </Card>
    );
};