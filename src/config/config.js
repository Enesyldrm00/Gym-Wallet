/**
 * Application Configuration
 * 
 * Centralized configuration for Stellar network and application settings.
 * Loads sensitive data from environment variables for security.
 * 
 * SECURITY: NEVER hardcode private keys or recipient addresses.
 * ALWAYS use environment variables.
 */

// Load recipient address from environment variable
const RECIPIENT_ADDRESS = import.meta.env.VITE_RECIPIENT_ADDRESS;

// Development mode check
const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

/**
 * CRITICAL SECURITY VALIDATION
 * 
 * In production, we MUST have a valid recipient address.
 * In development, we warn but don't crash (for easier onboarding).
 */

if (!RECIPIENT_ADDRESS) {
    const errorMessage = `
╔═══════════════════════════════════════════════════════════════╗
║  CRITICAL SECURITY ERROR: Recipient Address Missing           ║
╚═══════════════════════════════════════════════════════════════╝

The VITE_RECIPIENT_ADDRESS environment variable is not set.

${isProduction ? '🚨 PRODUCTION BUILD - APPLICATION CANNOT START' : '⚠️  DEVELOPMENT MODE WARNING'}

To fix this:
1. Create a .env file in the project root
2. Add: VITE_RECIPIENT_ADDRESS=YOUR_STELLAR_PUBLIC_KEY_HERE
3. Example: VITE_RECIPIENT_ADDRESS=GABC123...XYZ

Get your Stellar public key from:
- Freighter Wallet: Click "Copy Address"
- Stellar Laboratory: https://laboratory.stellar.org/#account-creator

NEVER commit your .env file to Git!
`.trim();

    if (isProduction) {
        // In production, throw error and prevent app from starting
        throw new Error(errorMessage);
    } else {
        // In development, warn but allow to continue
        console.error(errorMessage);
        console.warn('\n⚠️  App will continue but transactions will FAIL without a recipient address!\n');
    }
}

// Validate address format (Stellar public keys start with 'G')
if (RECIPIENT_ADDRESS && !RECIPIENT_ADDRESS.startsWith('G')) {
    const formatError = `
╔═══════════════════════════════════════════════════════════════╗
║  INVALID STELLAR ADDRESS FORMAT                               ║
╚═══════════════════════════════════════════════════════════════╝

VITE_RECIPIENT_ADDRESS must be a valid Stellar public key.
Stellar public keys:
- Start with the letter 'G'
- Are 56 characters long
- Contain only uppercase letters and numbers

Current value: ${RECIPIENT_ADDRESS}
Length: ${RECIPIENT_ADDRESS.length}

Please update your .env file with a valid Stellar public key.
`.trim();

    if (isProduction) {
        throw new Error(formatError);
    } else {
        console.error(formatError);
    }
}

// Validate address length
if (RECIPIENT_ADDRESS && RECIPIENT_ADDRESS.length !== 56) {
    const lengthError = `
╔═══════════════════════════════════════════════════════════════╗
║  INVALID STELLAR ADDRESS LENGTH                               ║
╚═══════════════════════════════════════════════════════════════╝

Stellar public keys must be exactly 56 characters long.

Current address: ${RECIPIENT_ADDRESS}
Current length: ${RECIPIENT_ADDRESS.length}
Expected length: 56

Please verify your .env file contains the complete Stellar public key.
`.trim();

    if (isProduction) {
        throw new Error(lengthError);
    } else {
        console.error(lengthError);
    }
}

// Success message (only in development)
if (isDevelopment && RECIPIENT_ADDRESS) {
    console.log(`✅ Recipient address loaded: ${RECIPIENT_ADDRESS.slice(0, 8)}...${RECIPIENT_ADDRESS.slice(-8)}`);
}

// Stellar Network Configuration
export const STELLAR_CONFIG = {
    // Network Settings
    NETWORK: 'TESTNET',
    NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
    HORIZON_URL: 'https://horizon-testnet.stellar.org',

    // Recipient Configuration (Loaded from .env for security)
    // NOTE: This will be undefined if validation failed in development
    RECIPIENT_PUBLIC_KEY: RECIPIENT_ADDRESS,

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

// Runtime validation helper (use before transactions)
export const validateRecipientAddress = () => {
    if (!STELLAR_CONFIG.RECIPIENT_PUBLIC_KEY) {
        throw new Error(
            'Cannot send transaction: Recipient address not configured. ' +
            'Please set VITE_RECIPIENT_ADDRESS in your environment variables.'
        );
    }
    return true;
};
