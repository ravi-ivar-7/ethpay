/**
 * Application Configuration
 */

const Config = {
  // Project Info
  PROJECT_NAME: 'ethpay.brave',
  VERSION: '1.0.0',
  
  // API Endpoints
  api: {
    coingecko: 'https://api.coingecko.com/api/v3',
    etherscan: 'https://api.etherscan.io/api',
    sepoliaEtherscan: 'https://api-sepolia.etherscan.io/api',
    braveSearch: 'https://api.search.brave.com/res/v1/web/search'
  },
  
  // API Keys
  ETHERSCAN_API_KEY: 'CB1ZMNYR8NMK6A16GEADNAYCYKIZ988SDZ',
  BRAVE_SEARCH_API_KEY: '', // Optional
  
  // Legacy API endpoints (for backward compatibility)
  COINGECKO_API: 'https://api.coingecko.com/api/v3',
  ETHERSCAN_API: 'https://api.etherscan.io/api',
  BRAVE_SEARCH_API: 'https://api.search.brave.com/res/v1/web/search',
  
  // Networks
  networks: {
    mainnet: {
      chainId: '0x1',
      chainIdDecimal: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: 'https://eth.llamarpc.com',
      blockExplorer: 'https://etherscan.io',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      }
    },
    sepolia: {
      chainId: '0xaa36a7',
      chainIdDecimal: 11155111,
      name: 'Sepolia Testnet',
      rpcUrl: 'https://rpc.sepolia.org',
      blockExplorer: 'https://sepolia.etherscan.io',
      nativeCurrency: {
        name: 'Sepolia Ether',
        symbol: 'SepoliaETH',
        decimals: 18
      },
      faucets: [
        'https://sepoliafaucet.com/',
        'https://www.alchemy.com/faucets/ethereum-sepolia'
      ]
    }
  },
  
  // BAT Token (Mainnet)
  bat: {
    contractAddress: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
    decimals: 18,
    symbol: 'BAT'
  },
  
  // Legacy BAT constants (for backward compatibility)
  BAT_CONTRACT_ADDRESS: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
  BAT_COINGECKO_ID: 'basic-attention-token',
  
  // Legacy Network constants (for backward compatibility)
  ETHEREUM_NETWORK: 'mainnet',
  ETHEREUM_CHAIN_ID: 1,
  
  // App Mode
  mode: {
    current: 'demo', // demo, testnet, mainnet
    defaultNetwork: 'sepolia'
  },
  
  // Refresh Intervals (in milliseconds)
  STATS_REFRESH_INTERVAL: 30000, // 30 seconds
  PRICE_REFRESH_INTERVAL: 30000, // 30 seconds
  
  // Local Storage Keys
  STORAGE_KEYS: {
    WALLET_ADDRESS: 'ethpay_wallet_address',
    PAYMENT_HISTORY: 'ethpay_payment_history',
    PREFERENCES: 'ethpay_preferences',
    APP_MODE: 'ethpay_app_mode',
    NETWORK: 'ethpay_network'
  },
  
  // UI Settings
  TOAST_DURATION: 3000, // 3 seconds
  ANIMATION_DURATION: 300, // 300ms
  
  // Limits
  MAX_PAYMENT_HISTORY: 50,
  MAX_RECENT_LINKS: 10
};

// Freeze config to prevent modifications
Object.freeze(Config);
