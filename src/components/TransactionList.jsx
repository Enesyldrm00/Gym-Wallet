import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Loader2, ExternalLink, TrendingUp } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import stellarService from '../services/StellarService';
import { getExplorerUrl } from '../config/config';

const TransactionList = () => {
    const {
        isWalletConnected,
        transactionHistory,
        isLoadingHistory,
        historyError,
        publicKey,
    } = useWallet();

    // Don't show if wallet not connected
    if (!isWalletConnected) {
        return null;
    }

    // Loading state
    if (isLoadingHistory) {
        return (
            <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="text-gym-green w-6 h-6 neon-glow" />
                    <h2 className="text-xl font-bold text-white">Recent Gains</h2>
                </div>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-gym-green animate-spin" />
                    <span className="ml-3 text-gray-400">Loading workout history...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (historyError) {
        return (
            <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="text-gym-green w-6 h-6" />
                    <h2 className="text-xl font-bold text-white">Recent Gains</h2>
                </div>
                <div className="text-center py-8">
                    <p className="text-red-400">{historyError}</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (!transactionHistory || transactionHistory.length === 0) {
        return (
            <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="text-gym-green w-6 h-6 neon-glow" />
                    <h2 className="text-xl font-bold text-white">Recent Gains</h2>
                </div>
                <div className="text-center py-8">
                    <div className="text-6xl mb-4">💪</div>
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">
                        No workouts supported yet
                    </h3>
                    <p className="text-sm text-gray-500">
                        Be the first to fuel the gains!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-effect rounded-xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <TrendingUp className="text-gym-green w-6 h-6 neon-glow" />
                    <h2 className="text-xl font-bold text-white">Recent Gains</h2>
                </div>
                <span className="text-sm text-gray-500">
                    {transactionHistory.length} transaction{transactionHistory.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
                {transactionHistory?.map((tx) => {
                    // Safety check for transaction data
                    if (!tx || !tx.id) {
                        console.warn('Invalid transaction data:', tx);
                        return null;
                    }

                    const isIncoming = tx.direction === 'incoming';
                    const amount = parseFloat(tx?.amount || '0');
                    const txType = tx?.type || 'XLM';
                    const formattedAmount = `${isIncoming ? '+' : '-'}${amount.toFixed(2)} ${txType}`;

                    // Safe address truncation with fallbacks
                    const fromAddress = tx?.from || '';
                    const toAddress = tx?.to || '';
                    const displayAddress = isIncoming ? fromAddress : toAddress;
                    const truncatedAddress = displayAddress.length >= 8
                        ? `${displayAddress.slice(0, 4)}...${displayAddress.slice(-4)}`
                        : displayAddress || 'Unknown';

                    return (
                        <div
                            key={tx.id}
                            className="bg-gym-dark rounded-lg p-4 border border-gym-green/20 hover:border-gym-green/50 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                {/* Left: Icon + Details */}
                                <div className="flex items-start space-x-3 flex-1">
                                    {/* Direction Icon */}
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center
                                        ${isIncoming
                                            ? 'bg-gym-green/20 text-gym-green'
                                            : 'bg-red-500/20 text-red-400'
                                        }
                                    `}>
                                        {isIncoming ? (
                                            <ArrowDownLeft className="w-5 h-5" />
                                        ) : (
                                            <ArrowUpRight className="w-5 h-5" />
                                        )}
                                    </div>

                                    {/* Transaction Info */}
                                    <div className="flex-1 min-w-0">
                                        {/* Amount */}
                                        <div className={`font-bold text-lg ${isIncoming ? 'text-gym-green' : 'text-red-400'
                                            }`}>
                                            {formattedAmount}
                                        </div>

                                        {/* Memo */}
                                        {tx?.memo && (
                                            <div className="text-sm text-gray-400 mt-1">
                                                📝 {tx.memo}
                                            </div>
                                        )}

                                        {/* From/To */}
                                        <div className="text-xs text-gray-500 mt-1">
                                            {isIncoming ? 'From' : 'To'}:{' '}
                                            <span className="font-mono">
                                                {truncatedAddress}
                                            </span>
                                        </div>

                                        {/* Timestamp */}
                                        <div className="text-xs text-gray-600 mt-1">
                                            {tx?.timestamp
                                                ? stellarService.formatTimeAgo(tx.timestamp)
                                                : 'Unknown time'
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Link to Explorer */}
                                {tx?.hash && (
                                    <a
                                        href={getExplorerUrl(tx.hash)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 p-2 rounded-lg bg-gym-green/10 text-gym-green hover:bg-gym-green/20 transition-colors flex-shrink-0"
                                        title="View on Stellar.Expert"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TransactionList;
