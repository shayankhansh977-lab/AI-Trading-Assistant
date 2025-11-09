

import React, { useContext } from 'react';
import { AppContext } from '../App';
import { SunIcon, MoonIcon, ChartBarIcon } from './icons/Icons';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useContext(AppContext);

  return (
    <header className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl sticky top-0 z-50 border-b border-white/10 dark:border-gray-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8 text-indigo-400" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              AI Trading Assistant
            </h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-indigo-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-6 w-6" />
              ) : (
                <SunIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};