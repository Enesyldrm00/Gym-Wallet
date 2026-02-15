import React, { useMemo } from 'react';
import { TrendingUp, Award } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const WeeklyProgress = () => {
    const { transactionHistory, isWalletConnected } = useWallet();

    // Weekly target constant
    const WEEKLY_TARGET = 10;

    // Get start of current week (Monday 00:00:00)
    const getWeekStart = () => {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const diff = day === 0 ? -6 : 1 - day; // Adjust to Monday
        const monday = new Date(now);
        monday.setDate(now.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
    };

    // Calculate progress based on current calendar week (Monday-Sunday)
    const weeklyStats = useMemo(() => {
        if (!transactionHistory || transactionHistory.length === 0) {
            return { count: 0, progress: 0, isOverdrive: false };
        }

        // Get Monday 00:00:00 of current week
        const weekStart = getWeekStart();
        console.log('[WeeklyProgress] Week starts:', weekStart.toLocaleString());

        // Filter transactions from current week (Monday onwards)
        const currentWeekTransactions = transactionHistory.filter(tx => {
            const txDate = new Date(tx.timestamp);
            return txDate >= weekStart;
        });

        const count = currentWeekTransactions.length;
        const isOverdrive = count > WEEKLY_TARGET;

        // Progress capped at 100%, but we track overdrive separately
        const progress = Math.min((count / WEEKLY_TARGET) * 100, 100);

        console.log('[WeeklyProgress] Current week transactions:', count);
        console.log('[WeeklyProgress] Overdrive:', isOverdrive);

        return {
            count,
            progress: Math.round(progress),
            isOverdrive
        };
    }, [transactionHistory]);

    // Don't show if not connected
    if (!isWalletConnected) {
        return null;
    }

    // Determine progress bar color and animation based on overdrive
    const getProgressBarClasses = () => {
        if (weeklyStats.isOverdrive) {
            // Gold gradient with pulse and glow effect
            return 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 h-full transition-all duration-500 animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.8)]';
        }
        return 'bg-gradient-to-r from-gym-green to-emerald-400 h-full transition-all duration-500 neon-glow';
    };

    // Get status message
    const getStatusMessage = () => {
        if (weeklyStats.isOverdrive) {
            return "🔥 Goal Smashed! You are on Fire! 🔥";
        }
        if (weeklyStats.progress >= 100) {
            return "🎉 Weekly goal achieved! Keep crushing it!";
        }
        if (weeklyStats.progress >= 50) {
            return "💪 Keep pushing! You're crushing your fitness goals";
        }
        return "🔥 Start tipping to track your weekly progress";
    };

    return (
        <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <TrendingUp className={`w-6 h-6 ${weeklyStats.isOverdrive ? 'text-yellow-400 animate-pulse' : 'text-gym-green'} neon-glow`} />
                    <h2 className="text-xl font-bold text-white">Weekly Progress</h2>
                </div>
                <div className="flex items-center space-x-2">
                    {/* New Record Badge */}
                    {weeklyStats.isOverdrive && (
                        <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                            <Award className="w-3 h-3" />
                            <span>New Record!</span>
                        </div>
                    )}
                    <span className={`font-semibold ${weeklyStats.isOverdrive ? 'text-yellow-400 text-lg' : 'text-gym-green'}`}>
                        {weeklyStats.progress}%
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                    className={getProgressBarClasses()}
                    style={{ width: `${weeklyStats.progress}%` }}
                >
                    {weeklyStats.progress > 0 && (
                        <div className="w-full h-full flex items-center justify-end pr-2">
                            <div className={`w-2 h-2 rounded-full ${weeklyStats.isOverdrive ? 'bg-white' : 'bg-white animate-pulse'}`}></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-3">
                <p className={`text-sm ${weeklyStats.isOverdrive ? 'text-yellow-400 font-bold' : 'text-gray-400'}`}>
                    {getStatusMessage()}
                </p>
                <div className="flex items-center space-x-1">
                    {/* Fire emoji/streak icon when in overdrive */}
                    {weeklyStats.isOverdrive && (
                        <span className="text-xl animate-pulse">🔥</span>
                    )}
                    <span className={`text-xs font-bold ${weeklyStats.isOverdrive ? 'text-yellow-400' : 'text-gray-500'}`}>
                        {weeklyStats.count} / {WEEKLY_TARGET}
                    </span>
                    {weeklyStats.isOverdrive && (
                        <span className="text-xl animate-pulse">🔥</span>
                    )}
                </div>
            </div>

            {/* Week Reset Info */}
            <div className="mt-2 pt-2 border-t border-gym-green/10">
                <p className="text-xs text-gray-500 text-center">
                    Resets every Monday • Current week progress
                </p>
            </div>
        </div>
    );
};

export default WeeklyProgress;
