import React from 'react';
import { TrendingUp } from 'lucide-react';

const WeeklyProgress = () => {
    // Placeholder data - will be dynamic later
    const progress = 65; // 65% progress

    return (
        <div className="glass-effect rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <TrendingUp className="text-gym-green w-6 h-6" />
                    <h2 className="text-xl font-bold text-white">Weekly Progress</h2>
                </div>
                <span className="text-gym-green font-semibold">{progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-gym-green to-emerald-400 h-full transition-all duration-500 neon-glow"
                    style={{ width: `${progress}%` }}
                >
                    <div className="w-full h-full flex items-center justify-end pr-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            <p className="text-gray-400 text-sm mt-3">
                Keep pushing! You're crushing your fitness goals 💪
            </p>
        </div>
    );
};

export default WeeklyProgress;
