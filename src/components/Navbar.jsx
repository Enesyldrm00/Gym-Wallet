import React from 'react';
import { Dumbbell, Wallet } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const Navbar = () => {
    const { publicKey, isWalletConnected, isLoading, connectWallet, disconnectWallet, truncateAddress } = useWallet();

    const handleWalletClick = async () => {
        if (isWalletConnected) {
            disconnectWallet();
        } else {
            try {
                await connectWallet();
            } catch (err) {
                console.error('Failed to connect:', err);
            }
        }
    };

    return (
        <nav className="bg-gym-dark border-b border-gym-green/20 sticky top-0 z-50 glass-effect">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-3">
                        <Dumbbell className="text-gym-green w-8 h-8 neon-glow" />
                        <h1 className="text-2xl font-bold neon-text">
                            GYM FUEL ⚡
                        </h1>
                    </div>

                    {/* Connect Wallet Button */}
                    <button
                        onClick={handleWalletClick}
                        disabled={isLoading}
                        className={`
              flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold
              transition-all duration-300 transform hover:scale-105
              ${isWalletConnected
                                ? 'bg-gym-green/20 text-gym-green border-2 border-gym-green neon-glow'
                                : 'bg-gym-green text-gym-dark hover:bg-gym-green/90'}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                    >
                        <Wallet className="w-5 h-5" />
                        <span>
                            {isLoading
                                ? 'Connecting...'
                                : isWalletConnected
                                    ? truncateAddress(publicKey)
                                    : 'Connect Wallet'
                            }
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
