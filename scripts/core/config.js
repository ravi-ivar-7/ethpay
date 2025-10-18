/**
 * Configuration
 * Global configuration constants
 */

const CONFIG = {
  // Project Info
  PROJECT_NAME: 'ethpay.brave',
  VERSION: '1.0.0',
  
  // API Endpoints
  COINGECKO_API: 'https://api.coingecko.com/api/v3',
  ETHERSCAN_API: 'https://api.etherscan.io/api',
  BRAVE_SEARCH_API: 'https://api.search.brave.com/res/v1/web/search',
  
  // API Keys (loaded from environment or config)
  ETHERSCAN_API_KEY: 'CB1ZMNYR8NMK6A16GEADNAYCYKIZ988SDZ',
  BRAVE_SEARCH_API_KEY: '', // Optional
  
  // BAT Token
  BAT_CONTRACT_ADDRESS: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
  BAT_COINGECKO_ID: 'basic-attention-token',
  
  // Network
  ETHEREUM_NETWORK: 'mainnet',
  ETHEREUM_CHAIN_ID: 1,
  
  // Refresh Intervals (in milliseconds)
  STATS_REFRESH_INTERVAL: 30000, // 30 seconds
  PRICE_REFRESH_INTERVAL: 30000, // 30 seconds
  
  // Local Storage Keys
  STORAGE_KEYS: {
    WALLET_ADDRESS: 'ethpay_wallet_address',
    PAYMENT_HISTORY: 'ethpay_payment_history',
    PREFERENCES: 'ethpay_preferences'
  },
  
  // UI Settings
  TOAST_DURATION: 3000, // 3 seconds
  ANIMATION_DURATION: 300, // 300ms
  
  // Limits
  MAX_PAYMENT_HISTORY: 50,
  MAX_RECENT_LINKS: 10
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
