import React from 'react';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import PowerLevel from './components/PowerLevel';
import TipButtons from './components/TipButtons';
import WeeklyProgress from './components/WeeklyProgress';
import DailyPump from './components/DailyPump';
import TransactionStatus from './components/TransactionStatus';
import TransactionList from './components/TransactionList';
import WorkoutLog from './components/WorkoutLog';
import './index.css';

function App() {
    return (
        <WalletProvider>
            <div className="min-h-screen bg-gym-dark">
                <Navbar />

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <PowerLevel />
                            <TipButtons />
                            <WorkoutLog />
                            <WeeklyProgress />

                            {/* Welcome Section */}
                            <div className="glass-effect rounded-xl p-6">
                                <h2 className="text-2xl font-bold mb-3 neon-text">
                                    Welcome to GYM FUEL ⚡
                                </h2>
                                <p className="text-gray-300 mb-4">
                                    Support your favorite fitness creators with tips on the Stellar blockchain.
                                    Connect your Freighter wallet to get started!
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-gym-green/20 text-gym-green rounded-full text-sm border border-gym-green/30">
                                        💪 Fitness
                                    </span>
                                    <span className="px-3 py-1 bg-gym-green/20 text-gym-green rounded-full text-sm border border-gym-green/30">
                                        ⭐ Stellar
                                    </span>
                                    <span className="px-3 py-1 bg-gym-green/20 text-gym-green rounded-full text-sm border border-gym-green/30">
                                        🚀 Web3
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <TransactionList />
                            <div className="mt-6">
                                <DailyPump />
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-gym-green/20 mt-12 py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-gray-400 text-sm">
                            Built for the Stellar White Belt Challenge 🥋 | Powered by Stellar
                        </p>
                    </div>
                </footer>

                {/* Transaction Status Modal */}
                <TransactionStatus />
            </div>
        </WalletProvider>
    );
}

export default App;
