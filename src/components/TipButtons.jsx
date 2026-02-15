import React, { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { TIP_AMOUNTS } from '../config/config';

const TipButtons = () => {
    const { isWalletConnected, isAccountActive, sendTip, txPending } = useWallet();
    const [selectedAmount, setSelectedAmount] = useState(null);

    // Don't show if wallet not connected
    if (!isWalletConnected) {
        return (
            <div className="glass-effect rounded-xl p-6 mb-6">
                <div className="text-center">
                    <Zap className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">
                        Connect Your Wallet
                    </h3>
                    <p className="text-sm text-gray-500">
                        Connect Freighter to send tips
                    </p>
                </div>
            </div>
        );
    }

    // Show activation message if account not funded
    if (!isAccountActive) {
        return (
            <div className="glass-effect rounded-xl p-6 mb-6">
                <div className="text-center">
                    <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-3 opacity-50" />
                    <h3 className="text-lg font-semibold text-yellow-500 mb-2">
                        Activate Your Account
                    </h3>
                    <p className="text-sm text-gray-400">
                        Fund your account with Friendbot to send tips
                    </p>
                </div>
            </div>
        );
    }

    const handleTipClick = async (amount) => {
        if (txPending) return;

        setSelectedAmount(amount);

        try {
            await sendTip(amount);
        } catch (error) {
            console.error('Tip failed:', error);
        } finally {
            // Keep selection visible briefly
            setTimeout(() => setSelectedAmount(null), 2000);
        }
    };

    return (
        <div className="glass-effect rounded-xl p-6 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <Zap className="text-gym-green w-6 h-6 neon-glow" />
                    <h2 className="text-xl font-bold text-white">Power Up Your Support</h2>
                </div>
            </div>

            <p className="text-gray-400 text-sm mb-4">
                Send XLM to fuel the fitness journey 💪
            </p>

            {/* Tip Amount Buttons */}
            <div className="grid grid-cols-3 gap-3">
                {TIP_AMOUNTS.map((tip) => (
                    <button
                        key={tip.value}
                        onClick={() => handleTipClick(tip.value)}
                        disabled={txPending}
                        className={`
                            relative py-4 px-4 rounded-lg font-bold text-lg
                            transition-all duration-300 transform
                            border-2
                            ${txPending && selectedAmount === tip.value
                                ? 'bg-gym-green/30 border-gym-green scale-95 cursor-wait'
                                : txPending
                                    ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                                    : 'bg-gym-green/10 border-gym-green/50 text-gym-green hover:bg-gym-green hover:text-gym-dark hover:scale-105 neon-glow'
                            }
                        `}
                    >
                        {txPending && selectedAmount === tip.value ? (
                            <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm">Sending...</span>
                            </div>
                        ) : (
                            <>
                                <div className="text-3xl mb-1">{tip.emoji}</div>
                                <div>{tip.label}</div>
                            </>
                        )}
                    </button>
                ))}
            </div>

            {/* Transaction Pending Indicator */}
            {txPending && (
                <div className="mt-4 text-center">
                    <div className="inline-flex items-center space-x-2 bg-gym-green/10 border border-gym-green/30 rounded-lg px-4 py-2">
                        <Loader2 className="w-4 h-4 text-gym-green animate-spin" />
                        <span className="text-sm text-gym-green animate-pulse">
                            Processing transaction...
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TipButtons;
