import React, { useState, useEffect } from 'react';
import { Camera, Heart, Zap, Image as ImageIcon } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const DailyPump = () => {
    const { transactionHistory, isWalletConnected } = useWallet();
    const [workoutDays, setWorkoutDays] = useState(0);
    const [latestWorkout, setLatestWorkout] = useState(null);
    const [imageError, setImageError] = useState(false);

    // Load workout logs from localStorage
    const loadWorkoutLogs = () => {
        try {
            const storedLogs = localStorage.getItem('gymfuel_workout_logs');
            console.log('[DailyPump] Raw localStorage data:', storedLogs);

            if (storedLogs) {
                const parsed = JSON.parse(storedLogs);
                console.log('[Daily Pump] Parsed workout logs:', parsed);

                if (Array.isArray(parsed)) {
                    setWorkoutDays(parsed.length);

                    // Get latest workout (first in array)
                    if (parsed.length > 0) {
                        const latest = parsed[0];
                        console.log('[DailyPump] Latest workout:', latest);
                        console.log('[DailyPump] Latest workout has image:', !!latest?.image);
                        setLatestWorkout(latest);
                    } else {
                        setLatestWorkout(null);
                    }
                } else {
                    console.warn('[DailyPump] Parsed data is not an array:', parsed);
                    setWorkoutDays(0);
                    setLatestWorkout(null);
                }
            } else {
                console.log('[DailyPump] No workout logs in localStorage');
                setWorkoutDays(0);
                setLatestWorkout(null);
            }
        } catch (err) {
            console.error('[DailyPump] Error loading workout logs:', err);
            setWorkoutDays(0);
            setLatestWorkout(null);
        }
    };

    // Load on mount
    useEffect(() => {
        loadWorkoutLogs();
    }, []);

    // Update when localStorage changes (listen for storage events)
    useEffect(() => {
        const handleStorageChange = () => {
            console.log('[DailyPump] Storage change detected, reloading...');
            loadWorkoutLogs();
            setImageError(false); // Reset error state
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

    // Handle image error
    const handleImageError = (e) => {
        console.error('[DailyPump] Image failed to load:', e);
        setImageError(true);
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

            {/* Photo Card */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gym-green/30 group">
                {latestWorkout && latestWorkout.image && !imageError ? (
                    // Show latest workout image
                    <>
                        <img
                            src={latestWorkout.image}
                            alt="Latest workout"
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                        />
                        {/* Overlay with note */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                {latestWorkout.note && (
                                    <p className="text-white text-sm line-clamp-2 mb-2">
                                        {latestWorkout.note}
                                    </p>
                                )}
                                <p className="text-gray-300 text-xs">
                                    Latest workout
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    // Placeholder
                    <>
                        <div className="absolute inset-0 bg-gym-green/10 group-hover:bg-gym-green/20 transition-all duration-300 flex items-center justify-center">
                            <div className="text-center">
                                <Camera className="w-16 h-16 text-gym-green/50 mx-auto mb-3" />
                                <p className="text-gray-400 font-semibold">
                                    {workoutDays > 0 ? 'Latest Workout' : 'Upload Your Daily Pump'}
                                </p>
                                <p className="text-gray-500 text-sm mt-1">
                                    {workoutDays > 0
                                        ? imageError
                                            ? 'Image failed to load'
                                            : `${workoutDays} workout${workoutDays !== 1 ? 's' : ''} logged!`
                                        : 'Show off your progress! 📸'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Decorative Corner Accents */}
                        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-gym-green/50"></div>
                        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-gym-green/50"></div>
                    </>
                )}
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
