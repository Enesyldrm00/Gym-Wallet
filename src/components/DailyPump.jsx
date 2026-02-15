import React from 'react';
import { Camera, Heart, Zap } from 'lucide-react';

const DailyPump = () => {
    return (
        <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <Camera className="text-gym-green w-6 h-6" />
                    <h2 className="text-xl font-bold text-white">Daily Pump</h2>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2 rounded-full bg-gym-green/20 hover:bg-gym-green/30 transition-all">
                        <Heart className="w-5 h-5 text-gym-green" />
                    </button>
                    <button className="p-2 rounded-full bg-gym-green/20 hover:bg-gym-green/30 transition-all">
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
                        <p className="text-gray-400 font-semibold">Upload Your Daily Pump</p>
                        <p className="text-gray-500 text-sm mt-1">Show off your progress! 📸</p>
                    </div>
                </div>

                {/* Decorative Corner Accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-gym-green/50"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-gym-green/50"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                    <p className="text-2xl font-bold text-gym-green">28</p>
                    <p className="text-gray-400 text-xs">Days</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-gym-green">54</p>
                    <p className="text-gray-400 text-xs">Tips</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-gym-green">💯</p>
                    <p className="text-gray-400 text-xs">Streak</p>
                </div>
            </div>
        </div>
    );
};

export default DailyPump;
