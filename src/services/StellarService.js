/**
 * StellarService - Singleton Service for Stellar Network Operations
 * 
 * This service handles all interactions with the Stellar blockchain,
 * including account queries, balance retrieval, and transaction operations.
 * 
 * @pattern Singleton - Ensures a single Server instance across the app
 * @network Testnet - Currently configured for Stellar Testnet
 */

import * as StellarSdk from 'stellar-sdk';

// Stellar Network Configuration
const STELLAR_NETWORK = 'TESTNET';
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const FRIENDBOT_URL = 'https://friendbot.stellar.org';

/**
 * StellarService Class
 * Implements Singleton pattern for efficient server connection management
 */
class StellarService {
    constructor() {
        if (StellarService.instance) {
            return StellarService.instance;
        }

        // Initialize Stellar Server instance
        this.server = new StellarSdk.Horizon.Server(HORIZON_URL);
        this.network = STELLAR_NETWORK;

        StellarService.instance = this;
    }

    /**
     * Get Account Details
     * 
     * Fetches account information from Stellar Testnet including balance.
     * Handles unfunded accounts gracefully with custom error response.
     * 
     * @param {string} publicKey - Stellar public key (G... address)
     * @returns {Promise<Object>} Account details object
     * 
     * @returns {Object} Success Response:
     *   - publicKey: string
     *   - balance: string (XLM amount)
     *   - isActive: boolean (true)
     *   - subentryCount: number
     *   - accountData: Object (full Horizon response)
     * 
     * @returns {Object} Unfunded Account Response:
     *   - publicKey: string
     *   - balance: "0"
     *   - isActive: boolean (false)
     *   - error: "UNFUNDED_ACCOUNT"
     *   - friendbotUrl: string
     * 
     * @throws {Error} Network or validation errors
     */
    async getAccountDetails(publicKey) {
        try {
            // Validate public key format
            if (!publicKey || !publicKey.startsWith('G')) {
                throw new Error('Invalid Stellar public key format');
            }

            // Load account from Horizon
            const account = await this.server.loadAccount(publicKey);

            // Extract native (XLM) balance from balances array
            const nativeBalance = account.balances.find(
                (balance) => balance.asset_type === 'native'
            );

            return {
                publicKey: account.account_id,
                balance: nativeBalance ? nativeBalance.balance : '0',
                isActive: true,
                subentryCount: account.subentry_count,
                accountData: account,
            };

        } catch (error) {
            // Handle 404 - Account Not Found (Unfunded Account)
            if (error.response && error.response.status === 404) {
                return {
                    publicKey,
                    balance: '0',
                    isActive: false,
                    error: 'UNFUNDED_ACCOUNT',
                    friendbotUrl: `https://laboratory.stellar.org/#account-creator?network=testnet`,
                    message: 'Account not yet activated. Fund it with Friendbot to activate.',
                };
            }

            // Handle network errors
            if (error.response && error.response.status >= 500) {
                throw new Error('Stellar Horizon server is currently unavailable. Please try again later.');
            }

            // Re-throw other errors
            throw new Error(`Failed to fetch account details: ${error.message}`);
        }
    }

    /**
     * Get Server Instance
     * @returns {StellarSdk.Server} Horizon server instance
     */
    getServer() {
        return this.server;
    }

    /**
     * Get Network Type
     * @returns {string} Network name (TESTNET/PUBLIC)
     */
    getNetwork() {
        return this.network;
    }

    /**
     * Format Balance for Display
     * Truncates long decimal numbers to 7 decimal places
     * 
     * @param {string} balance - Raw balance string
     * @returns {string} Formatted balance
     */
    formatBalance(balance) {
        const num = parseFloat(balance);
        if (isNaN(num)) return '0.0000000';
        return num.toFixed(7);
    }

    /**
     * Fetch Time Bounds for Transaction
     * 
     * Gets current ledger time and calculates valid transaction window.
     * Prevents replay attacks and ensures transactions expire if not confirmed.
     * 
     * @param {number} timeout - Timeout in seconds (default: 300)
     * @returns {Promise<number>} Maximum time for transaction validity
     */
    async fetchTimebounds(timeout = 300) {
        try {
            const ledger = await this.server.ledgers().order('desc').limit(1).call();
            const currentTime = parseInt(ledger.records[0].closed_at);
            return currentTime + timeout;
        } catch (error) {
            // Fallback: use current time + timeout if ledger fetch fails
            console.warn('Failed to fetch ledger time, using local time:', error);
            return Math.floor(Date.now() / 1000) + timeout;
        }
    }

    /**
     * Build Tip Transaction
     * 
     * Creates a payment transaction with proper fee, sequence number, and memo.
     * Returns unsigned XDR for Freighter to sign.
     * 
     * @param {string} senderPublicKey - Sender's Stellar address
     * @param {string} amount - XLM amount to send (e.g., "5")
     * @param {string} recipientPublicKey - Recipient's address
     * @param {string} memo - Transaction memo (optional)
     * @returns {Promise<string>} Transaction XDR (unsigned)
     * 
     * @throws {Error} If account not funded or invalid parameters
     */
    async buildTipTransaction(senderPublicKey, amount, recipientPublicKey, memo = 'Gym Fuel Support') {
        try {
            // Import config here to avoid circular dependencies
            const { STELLAR_CONFIG } = await import('../config/config.js');

            // Validate inputs
            if (!senderPublicKey || !senderPublicKey.startsWith('G')) {
                throw new Error('Invalid sender public key');
            }

            if (!recipientPublicKey || !recipientPublicKey.startsWith('G')) {
                throw new Error('Invalid recipient public key');
            }

            const amountNum = parseFloat(amount);
            if (isNaN(amountNum) || amountNum <= 0) {
                throw new Error('Amount must be a positive number');
            }

            // Load sender account (gets sequence number)
            const account = await this.server.loadAccount(senderPublicKey);

            // Get time bounds
            const maxTime = await this.fetchTimebounds(STELLAR_CONFIG.TRANSACTION_TIMEOUT);

            // Build transaction
            const transaction = new StellarSdk.TransactionBuilder(account, {
                fee: STELLAR_CONFIG.BASE_FEE,
                networkPassphrase: StellarSdk.Networks.TESTNET,
            })
                .addOperation(
                    StellarSdk.Operation.payment({
                        destination: recipientPublicKey,
                        asset: StellarSdk.Asset.native(),
                        amount: amount.toString(),
                    })
                )
                .addMemo(StellarSdk.Memo.text(memo))
                .setTimeout(STELLAR_CONFIG.TRANSACTION_TIMEOUT)
                .build();

            // Return unsigned XDR
            return transaction.toXDR();

        } catch (error) {
            // Handle specific errors
            if (error.response && error.response.status === 404) {
                throw new Error('Sender account not found. Please fund your account first.');
            }

            throw new Error(`Failed to build transaction: ${error.message}`);
        }
    }

    /**
     * Submit Transaction to Horizon
     * 
     * Submits a signed transaction XDR to the Stellar network.
     * 
     * @param {string} signedXdr - Signed transaction XDR from Freighter
     * @returns {Promise<Object>} Transaction result with hash and ledger
     * 
     * @throws {Error} If submission fails or transaction rejected
     */
    async submitTransaction(signedXdr) {
        try {
            // Parse XDR back to transaction
            const transaction = StellarSdk.TransactionBuilder.fromXDR(
                signedXdr,
                StellarSdk.Networks.TESTNET
            );

            // Submit to network
            const result = await this.server.submitTransaction(transaction);

            // Import config for explorer URL
            const { getExplorerUrl } = await import('../config/config.js');

            return {
                success: true,
                hash: result.hash,
                ledger: result.ledger,
                explorerUrl: getExplorerUrl(result.hash),
            };

        } catch (error) {
            throw this.parseTransactionError(error);
        }
    }

    /**
     * Parse Transaction Error
     * 
     * Converts Horizon error responses to user-friendly messages.
     * 
     * @param {Error} error - Error from Horizon
     * @returns {Error} User-friendly error
     */
    parseTransactionError(error) {
        // User cancelled in Freighter
        if (error.message && error.message.includes('User declined')) {
            return new Error('Transaction cancelled by user');
        }

        // Network/Horizon errors
        if (error.response && error.response.data) {
            const extras = error.response.data.extras;

            if (extras && extras.result_codes) {
                const txCode = extras.result_codes.transaction;
                const opCodes = extras.result_codes.operations || [];

                // Map error codes to user messages
                const errorMessages = {
                    'tx_insufficient_balance': 'Insufficient XLM balance to complete transaction',
                    'tx_bad_seq': 'Transaction sequence error. Please try again.',
                    'tx_failed': 'Transaction rejected by network',
                    'op_underfunded': 'Not enough XLM in your account for this operation',
                    'op_line_full': 'Recipient account cannot accept more of this asset',
                    'op_no_destination': 'Recipient account does not exist',
                };

                // Check transaction-level error
                if (errorMessages[txCode]) {
                    return new Error(errorMessages[txCode]);
                }

                // Check operation-level errors
                for (const opCode of opCodes) {
                    if (errorMessages[opCode]) {
                        return new Error(errorMessages[opCode]);
                    }
                }

                // Generic transaction failed
                return new Error(`Transaction failed: ${txCode}`);
            }
        }

        // Timeout error
        if (error.message && error.message.includes('timeout')) {
            return new Error('Transaction timed out. Please try again.');
        }

        // Generic network error
        return new Error(error.message || 'Failed to submit transaction');
    }
}

// Export Singleton instance
const stellarServiceInstance = new StellarService();
Object.freeze(stellarServiceInstance);

export default stellarServiceInstance;

