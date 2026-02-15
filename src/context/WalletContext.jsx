import React, { createContext, useContext, useState, useEffect } from 'react';
import { isConnected, getPublicKey, isAllowed, setAllowed, signTransaction } from '@stellar/freighter-api';
import stellarService from '../services/StellarService';
import { STELLAR_CONFIG, TRANSACTION_MEMO } from '../config/config';

// Create the Wallet Context
const WalletContext = createContext(null);

// Custom hook to use the wallet context
export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

// Wallet Provider Component
export const WalletProvider = ({ children }) => {
    const [publicKey, setPublicKey] = useState(null);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Balance-related state
    const [balance, setBalance] = useState('0');
    const [isAccountActive, setIsAccountActive] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [balanceError, setBalanceError] = useState(null);

    // Transaction-related state
    const [txStatus, setTxStatus] = useState(null); // 'building', 'signing', 'submitting', 'success', 'error'
    const [txPending, setTxPending] = useState(false);
    const [lastTx, setLastTx] = useState(null);

    // Transaction history state
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    // Check if Freighter is installed
    const isFreighterInstalled = async () => {
        try {
            const connected = await isConnected();
            return connected;
        } catch (err) {
            console.error('Freighter not detected:', err);
            return false;
        }
    };

    // Fetch Balance from Stellar Network
    const fetchBalance = async (key = publicKey) => {
        if (!key) {
            setBalance('0');
            setIsAccountActive(false);
            return;
        }

        setIsSyncing(true);
        setBalanceError(null);

        try {
            const accountDetails = await stellarService.getAccountDetails(key);

            if (accountDetails.isActive) {
                // Account is funded and active
                setBalance(accountDetails.balance);
                setIsAccountActive(true);
            } else {
                // Account is unfunded
                setBalance('0');
                setIsAccountActive(false);
                setBalanceError({
                    type: 'UNFUNDED_ACCOUNT',
                    message: accountDetails.message,
                    friendbotUrl: accountDetails.friendbotUrl,
                });
            }
        } catch (err) {
            console.error('Error fetching balance:', err);
            setBalance('0');
            setIsAccountActive(false);
            setBalanceError({
                type: 'FETCH_ERROR',
                message: err.message || 'Failed to fetch balance',
            });
        } finally {
            setIsSyncing(false);
        }
    };

    // Manual Sync Balance (for "Sync Data" button)
    const syncBalance = async () => {
        if (!publicKey) return;
        await fetchBalance(publicKey);
    };

    // Send Tip Transaction
    const sendTip = async (amount) => {
        if (!publicKey || !isAccountActive) {
            throw new Error('Wallet not connected or account not active');
        }

        setTxPending(true);
        setTxStatus('building');
        setLastTx(null);

        try {
            // 1. Build transaction
            const xdr = await stellarService.buildTipTransaction(
                publicKey,
                amount,
                STELLAR_CONFIG.RECIPIENT_PUBLIC_KEY,
                TRANSACTION_MEMO
            );

            setTxStatus('signing');

            // 2. Sign with Freighter
            const signedXdr = await signTransaction(xdr, {
                networkPassphrase: STELLAR_CONFIG.NETWORK_PASSPHRASE,
            });

            setTxStatus('submitting');

            // 3. Submit to blockchain
            const result = await stellarService.submitTransaction(signedXdr);

            setTxStatus('success');
            setLastTx(result);

            // 4. Refresh balance and history after successful transaction
            setTimeout(() => {
                fetchBalance(publicKey);
                fetchTransactionHistory(publicKey);
            }, 2000);

            return result;

        } catch (error) {
            console.error('Transaction error:', error);
            setTxStatus('error');
            setLastTx({ error: error.message });
            throw error;
        } finally {
            setTxPending(false);
        }
    };

    // Clear Transaction Status
    const clearTxStatus = () => {
        setTxStatus(null);
        setLastTx(null);
    };

    // Fetch Transaction History
    const fetchTransactionHistory = async (key = publicKey) => {
        if (!key) {
            setTransactionHistory([]);
            return;
        }

        setIsLoadingHistory(true);
        setHistoryError(null);

        try {
            const history = await stellarService.fetchTransactionHistory(key, 10);
            setTransactionHistory(history);
        } catch (err) {
            console.error('Error fetching transaction history:', err);
            setHistoryError(err.message || 'Failed to fetch transaction history');
            setTransactionHistory([]);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // Refresh transaction history (manual)
    const refreshHistory = async () => {
        if (!publicKey) return;
        await fetchTransactionHistory(publicKey);
    };

    // Connect Wallet Function
    const connectWallet = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Check if Freighter is installed
            const installed = await isFreighterInstalled();

            if (!installed) {
                throw new Error('Freighter wallet is not installed. Please install it from https://www.freighter.app/');
            }

            // Check if the site is allowed to interact with Freighter
            const allowed = await isAllowed();

            if (!allowed) {
                // Request permission
                await setAllowed();
            }

            // Get the public key
            const key = await getPublicKey();

            setPublicKey(key);
            setIsWalletConnected(true);

            // Store in localStorage for persistence
            localStorage.setItem('stellar_public_key', key);

            // Fetch balance immediately after connecting
            await fetchBalance(key);

            return key;
        } catch (err) {
            console.error('Error connecting wallet:', err);
            setError(err.message || 'Failed to connect wallet');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Disconnect Wallet Function
    const disconnectWallet = () => {
        setPublicKey(null);
        setIsWalletConnected(false);
        setError(null);
        setBalance('0');
        setIsAccountActive(false);
        setBalanceError(null);
        localStorage.removeItem('stellar_public_key');
    };

    // Check for existing connection on mount
    useEffect(() => {
        const checkExistingConnection = async () => {
            const storedKey = localStorage.getItem('stellar_public_key');

            if (storedKey) {
                try {
                    const installed = await isFreighterInstalled();
                    const allowed = await isAllowed();

                    if (installed && allowed) {
                        // Verify the stored key is still valid
                        const currentKey = await getPublicKey();
                        if (currentKey === storedKey) {
                            setPublicKey(storedKey);
                            setIsWalletConnected(true);
                            // Fetch balance for reconnected wallet
                            await fetchBalance(storedKey);
                        } else {
                            // Key mismatch, clear storage
                            localStorage.removeItem('stellar_public_key');
                        }
                    }
                } catch (err) {
                    console.error('Error checking existing connection:', err);
                    localStorage.removeItem('stellar_public_key');
                }
            }
        };

        checkExistingConnection();
    }, []);

    // Auto-fetch balance and history when publicKey changes
    useEffect(() => {
        if (publicKey && isWalletConnected) {
            fetchBalance(publicKey);
            fetchTransactionHistory(publicKey);
        }
    }, [publicKey]);

    // Truncate public key for display
    const truncateAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    const value = {
        publicKey,
        isWalletConnected,
        isLoading,
        error,
        balance,
        isAccountActive,
        isSyncing,
        balanceError,
        txStatus,
        txPending,
        lastTx,
        transactionHistory,
        isLoadingHistory,
        historyError,
        connectWallet,
        disconnectWallet,
        syncBalance,
        sendTip,
        clearTxStatus,
        refreshHistory,
        truncateAddress,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};
