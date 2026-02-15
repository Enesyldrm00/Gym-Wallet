/**
 * Application Configuration
 * 
 * Centralized configuration for Stellar network and application settings.
 * Loads sensitive data from environment variables for security.
 */

// Load recipient address from environment variable
const RECIPIENT_ADDRESS = import.meta.env.VITE_RECIPIENT_ADDRESS;

// Development mode check
const isDevelopment = import.meta.env.MODE === 'development';

// Validate recipient address in development
if (isDevelopment && !RECIPIENT_ADDRESS) {
    console.warn(
        '⚠️ WARNING: VITE_RECIPIENT_ADDRESS is not set in .env file!\n' +
        'Transactions will fail. Please add your Stellar public key to .env'
    );
}

// Validate address format
if (RECIPIENT_ADDRESS && !RECIPIENT_ADDRESS.startsWith('G')) {
    console.error(
        '❌ ERROR: VITE_RECIPIENT_ADDRESS must be a valid Stellar public key (starts with G)\n' +
        `Current value: ${RECIPIENT_ADDRESS}`
    );
}

// Stellar Network Configuration
export const STELLAR_CONFIG = {
    // Network Settings
    NETWORK: 'TESTNET',
    NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
    HORIZON_URL: 'https://horizon-testnet.stellar.org',

    // Recipient Configuration (Loaded from .env for security)
    RECIPIENT_PUBLIC_KEY: RECIPIENT_ADDRESS || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',

    // Transaction Settings
    BASE_FEE: '100', // 100 stroops = 0.00001 XLM
    TRANSACTION_TIMEOUT: 300, // 5 minutes in seconds

    // Explorer URLs
    EXPLORER_BASE_URL: 'https://stellar.expert/explorer/testnet',

    // Friendbot (for testnet funding)
    FRIENDBOT_URL: 'https://friendbot.stellar.org',
};

// Tip Amount Presets
export const TIP_AMOUNTS = [
    { value: '1', label: '1 XLM', emoji: '💪' },
    { value: '5', label: '5 XLM', emoji: '🔥' },
    { value: '10', label: '10 XLM', emoji: '⚡' },
];

// Transaction Memo
export const TRANSACTION_MEMO = 'Gym Fuel Support';

// Helper function to get explorer URL for transaction
export const getExplorerUrl = (hash) => {
    return `${STELLAR_CONFIG.EXPLORER_BASE_URL}/tx/${hash}`;
};

// Helper function to get explorer URL for account
export const getAccountExplorerUrl = (publicKey) => {
    return `${STELLAR_CONFIG.EXPLORER_BASE_URL}/account/${publicKey}`;
};
