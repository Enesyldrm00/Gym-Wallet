import React, { useState, useEffect } from 'react';
import { Camera, Heart, Zap } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const DailyPump = () => {
    const { transactionHistory, isWalletConnected } = useWallet();
    const [workoutDays, setWorkoutDays] = useState(0);

    // Load workout logs count from localStorage
    useEffect(() => {
        try {
            const storedLogs = localStorage.getItem('gymfuel_workout_logs');
            if (storedLogs) {
                const parsed = JSON.parse(storedLogs);
                setWorkoutDays(Array.isArray(parsed) ? parsed.length : 0);
            } else {
                setWorkoutDays(0);
            }
        } catch (err) {
            console.error('Error loading workout logs:', err);
            setWorkoutDays(0);
        }
    }, []);

    // Update workout days when localStorage changes (listen for storage events)
    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const storedLogs = localStorage.getItem('gymfuel_workout_logs');
                if (storedLogs) {
                    const parsed = JSON.parse(storedLogs);
                    setWorkoutDays(Array.isArray(parsed) ? parsed.length : 0);
                } else {
                    setWorkoutDays(0);
                }
            } catch (err) {
                console.error('Error loading workout logs:', err);
            }
        };

        // Listen for custom event from WorkoutLog component
        window.addEventListener('workoutLogsUpdated', handleStorageChange);

        // Also listen for storage changes from other tabs
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('workoutLogsUpdated', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Calculate total tips
    const totalTips = transactionHistory?.length || 0;

    // Calculate streak (simplified: consecutive days with workouts)
    const calculateStreak = () => {
        try {
            const storedLogs = localStorage.getItem('gymfuel_workout_logs');
            if (!storedLogs) return 0;

            const logs = JSON.parse(storedLogs);
            if (!Array.isArray(logs) || logs.length === 0) return 0;

            // For now, just return workout days count
            // TODO: Implement actual streak calculation based on consecutive days
            return logs.length > 0 ? '🔥' : '💯';
        } catch (err) {
            return '💯';
        }
    };

    return (
        <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <Camera className="text-gym-green w-6 h-6 neon-glow" />
                    <h2 className="text-xl font-bold text-white">Daily Pump</h2>
                </div>
                <div className="flex space-x-2">
                    <button
                        className="p-2 rounded-full bg-gym-green/20 hover:bg-gym-green/30 transition-all"
                        title="Favorite"
                    >
                        <Heart className="w-5 h-5 text-gym-green" />
                    </button>
                    <button
                        className="p-2 rounded-full bg-gym-green/20 hover:bg-gym-green/30 transition-all"
                        title="Boost"
                    >
                        <Zap className="w-5 h-5 text-gym-green" />
                    </button>
                </div>
            </div>

            {/* Photo Card Placeholder */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gym-green/30 group cursor-pointer">
                {/* Overlay */}
                <div className="absolute inset-0 bg-gym-green/10 group-hover:bg-gym-green/20 transition-all duration-300 flex items-center justify-center">
                    <div className="text-center">
                        <Camera className="w-16 h-16 text-gym-green/50 mx-auto mb-3" />
                        <p className="text-gray-400 font-semibold">Check Your Workout Log</p>
                        <p className="text-gray-500 text-sm mt-1">
                            {workoutDays > 0
                                ? `${workoutDays} workout${workoutDays !== 1 ? 's' : ''} logged!`
                                : 'Upload your first workout! 📸'
                            }
                        </p>
                    </div>
                </div>

                {/* Decorative Corner Accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-gym-green/50"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-gym-green/50"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                    <p className="text-2xl font-bold text-gym-green">{workoutDays}</p>
                    <p className="text-gray-400 text-xs">Days</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-gym-green">{totalTips}</p>
                    <p className="text-gray-400 text-xs">Tips</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold">{calculateStreak()}</p>
                    <p className="text-gray-400 text-xs">Streak</p>
                </div>
            </div>
        </div>
    );
};

export default DailyPump;
