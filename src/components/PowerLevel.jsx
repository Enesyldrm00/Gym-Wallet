import React from 'react';
import { Zap, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const PowerLevel = () => {
    const {
        isWalletConnected,
        balance,
        isAccountActive,
        isSyncing,
        balanceError,
        syncBalance,
    } = useWallet();

    // Don't show if wallet not connected
    if (!isWalletConnected) {
        return null;
    }

    // Format balance for display
    const formatBalance = (bal) => {
        const num = parseFloat(bal);
        if (isNaN(num)) return '0.00';
        return num.toFixed(2);
    };

    return (
        <div className="glass-effect rounded-xl p-6 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <Zap className="text-gym-green w-7 h-7 neon-glow" />
                    <h2 className="text-2xl font-bold text-white">Current Power Level</h2>
                </div>

                {/* Sync Button */}
                <button
                    onClick={syncBalance}
                    disabled={isSyncing}
                    className={`
                        p-2 rounded-lg bg-gym-green/20 hover:bg-gym-green/30 
                        border border-gym-green/30 transition-all duration-300
                        ${isSyncing ? 'cursor-not-allowed' : 'hover:scale-110'}
                    `}
                    title="Sync Balance"
                >
                    <RefreshCw
                        className={`w-5 h-5 text-gym-green ${isSyncing ? 'animate-spin' : ''}`}
                    />
                </button>
            </div>

            {/* Balance Display */}
            <div className="bg-gradient-to-r from-gym-dark to-gray-900 rounded-lg p-6 border border-gym-green/30">
                <div className="flex items-end space-x-2">
                    <span className="text-5xl font-bold text-gym-green neon-text">
                        {formatBalance(balance)}
                    </span>
                    <span className="text-2xl font-semibold text-gray-400 pb-2">XLM</span>
                </div>

                {/* Account Status */}
                <div className="mt-3 flex items-center space-x-2">
                    {isAccountActive ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gym-green rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-400">Account Active</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-yellow-500">Inactive Account</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Unfunded Account Alert */}
            {balanceError && balanceError.type === 'UNFUNDED_ACCOUNT' && (
                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-yellow-500 mb-1">
                                ⚡ Boost Required
                            </h3>
                            <p className="text-sm text-gray-300 mb-3">
                                {balanceError.message}
                            </p>
                            <a
                                href={balanceError.friendbotUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
                            >
                                <span>Activate with Friendbot</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Network Error */}
            {balanceError && balanceError.type === 'FETCH_ERROR' && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-500 mb-1">
                                Connection Error
                            </h3>
                            <p className="text-sm text-gray-300">
                                {balanceError.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Syncing Indicator */}
            {isSyncing && (
                <div className="mt-3 text-center">
                    <span className="text-sm text-gym-green animate-pulse">
                        Syncing with Stellar Network...
                    </span>
                </div>
            )}
        </div>
    );
};

export default PowerLevel;
