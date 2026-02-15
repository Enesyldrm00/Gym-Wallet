import React, { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const WeeklyProgress = () => {
    const { transactionHistory, isWalletConnected } = useWallet();

    // Weekly target constant
    const WEEKLY_TARGET = 10;

    // Calculate progress based on last 7 days of transactions
    const weeklyStats = useMemo(() => {
        if (!transactionHistory || transactionHistory.length === 0) {
            return { count: 0, progress: 0 };
        }

        // Get timestamp for 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Filter transactions from last 7 days
        const recentTransactions = transactionHistory.filter(tx => {
            const txDate = new Date(tx.timestamp);
            return txDate >= sevenDaysAgo;
        });

        const count = recentTransactions.length;
        const progress = Math.min((count / WEEKLY_TARGET) * 100, 100);

        return { count, progress: Math.round(progress) };
    }, [transactionHistory]);

    // Don't show if not connected
    if (!isWalletConnected) {
        return null;
    }

    return (
        <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <TrendingUp className="text-gym-green w-6 h-6 neon-glow" />
                    <h2 className="text-xl font-bold text-white">Weekly Progress</h2>
                </div>
                <span className="text-gym-green font-semibold">{weeklyStats.progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-gym-green to-emerald-400 h-full transition-all duration-500 neon-glow"
                    style={{ width: `${weeklyStats.progress}%` }}
                >
                    {weeklyStats.progress > 0 && (
                        <div className="w-full h-full flex items-center justify-end pr-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-3">
                <p className="text-gray-400 text-sm">
                    {weeklyStats.progress >= 100
                        ? "🎉 Weekly goal achieved! Keep crushing it!"
                        : weeklyStats.progress >= 50
                            ? "💪 Keep pushing! You're crushing your fitness goals"
                            : "🔥 Start tipping to track your weekly progress"
                    }
                </p>
                <span className="text-xs text-gray-500">
                    {weeklyStats.count}/{WEEKLY_TARGET}
                </span>
            </div>
        </div>
    );
};

export default WeeklyProgress;
