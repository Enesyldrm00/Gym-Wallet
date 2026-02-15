import React from 'react';
import { CheckCircle, XCircle, Loader2, ExternalLink, X } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const TransactionStatus = () => {
    const { txStatus, lastTx, clearTxStatus } = useWallet();

    if (!txStatus) return null;

    const renderContent = () => {
        switch (txStatus) {
            case 'building':
                return (
                    <div className="text-center">
                        <Loader2 className="w-16 h-16 text-gym-green mx-auto mb-4 animate-spin" />
                        <h3 className="text-2xl font-bold text-white mb-2">
                            Preparing Transaction
                        </h3>
                        <p className="text-gray-400">
                            Building your tip on Stellar...
                        </p>
                    </div>
                );

            case 'signing':
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gym-green/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gym-green animate-pulse">
                            <span className="text-3xl">✍️</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            Awaiting Signature
                        </h3>
                        <p className="text-gray-400">
                            Please confirm the transaction in Freighter
                        </p>
                    </div>
                );

            case 'submitting':
                return (
                    <div className="text-center">
                        <Loader2 className="w-16 h-16 text-gym-green mx-auto mb-4 animate-spin" />
                        <h3 className="text-2xl font-bold text-white mb-2">
                            Sending to Blockchain
                        </h3>
                        <p className="text-gray-400">
                            Transaction submitting to Stellar network...
                        </p>
                    </div>
                );

            case 'success':
                return (
                    <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-gym-green mx-auto mb-4 neon-glow" />
                        <h3 className="text-2xl font-bold text-gym-green mb-2 neon-text">
                            Transaction Confirmed! 🎉
                        </h3>
                        <p className="text-gray-300 mb-4">
                            Your tip was sent successfully
                        </p>

                        {lastTx && (
                            <div className="bg-gym-dark rounded-lg p-4 mb-4 border border-gym-green/30">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="text-left">
                                        <span className="text-gray-500">Ledger:</span>
                                        <span className="text-white ml-2 font-mono">{lastTx.ledger}</span>
                                    </div>
                                    <div className="text-left">
                                        <span className="text-gray-500">Hash:</span>
                                        <span className="text-white ml-2 font-mono text-xs">
                                            {lastTx.hash.slice(0, 8)}...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {lastTx && lastTx.explorerUrl && (
                            <a
                                href={lastTx.explorerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 px-6 py-3 bg-gym-green text-gym-dark rounded-lg font-semibold hover:bg-gym-green/90 transition-all duration-300 transform hover:scale-105"
                            >
                                <span>View on Stellar.Expert</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}

                        <button
                            onClick={clearTxStatus}
                            className="mt-4 text-gray-400 hover:text-white transition-colors"
                        >
                            Close
                        </button>
                    </div>
                );

            case 'error':
                return (
                    <div className="text-center">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-red-500 mb-2">
                            Transaction Failed
                        </h3>
                        <p className="text-gray-300 mb-6">
                            {lastTx?.error || 'An error occurred while processing your transaction'}
                        </p>

                        <div className="flex justify-center space-x-3">
                            <button
                                onClick={clearTxStatus}
                                className="px-6 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                {/* Modal */}
                <div className="glass-effect rounded-2xl p-8 max-w-md w-full relative border-2 border-gym-green/30 animate-fadeIn">
                    {/* Close Button */}
                    {(txStatus === 'success' || txStatus === 'error') && (
                        <button
                            onClick={clearTxStatus}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}

                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default TransactionStatus;
