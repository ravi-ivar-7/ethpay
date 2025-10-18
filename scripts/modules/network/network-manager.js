/**
 * Network Manager
 * Handles network switching and mode management
 */

const NetworkManager = {
  currentMode: 'demo',
  currentNetwork: 'sepolia',
  switching: false,

  init() {
    // Load saved mode from localStorage
    const savedMode = localStorage.getItem(Config.STORAGE_KEYS.APP_MODE);
    const savedNetwork = localStorage.getItem(Config.STORAGE_KEYS.NETWORK);
    
    if (savedMode) {
      this.currentMode = savedMode;
    }
    
    if (savedNetwork) {
      this.currentNetwork = savedNetwork;
    }
  },

  /**
   * Get current mode
   */
  getMode() {
    return this.currentMode;
  },

  /**
   * Set application mode
   */
  setMode(mode) {
    if (!['demo', 'testnet', 'mainnet'].includes(mode)) {
      console.error('Invalid mode:', mode);
      return false;
    }

    this.currentMode = mode;
    localStorage.setItem(Config.STORAGE_KEYS.APP_MODE, mode);
    
    // Emit mode change event
    window.dispatchEvent(new CustomEvent('modeChanged', { detail: { mode } }));
    
    return true;
  },

  /**
   * Get current network
   */
  getNetwork() {
    return this.currentNetwork;
  },

  /**
   * Get network config
   */
  getNetworkConfig(networkName = null) {
    const network = networkName || this.currentNetwork;
    return Config.networks[network];
  },

  /**
   * Switch to a different network
   */
  async switchNetwork(networkName) {
    if (this.switching) {
      console.error('Network switch already in progress');
      return { success: false, error: 'ALREADY_SWITCHING' };
    }

    if (!window.ethereum) {
      console.error('Wallet not available');
      return { success: false, error: 'NO_WALLET' };
    }

    if (!Config.networks[networkName]) {
      console.error('Invalid network:', networkName);
      return { success: false, error: 'INVALID_NETWORK' };
    }

    const network = Config.networks[networkName];
    
    // Check if already on the correct network
    try {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (currentChainId === network.chainId) {
        this.currentNetwork = networkName;
        localStorage.setItem(Config.STORAGE_KEYS.NETWORK, networkName);
        return { success: true };
      }
    } catch (error) {
      console.error('Error checking current network:', error);
    }
    
    this.switching = true;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });

      this.currentNetwork = networkName;
      localStorage.setItem(Config.STORAGE_KEYS.NETWORK, networkName);
      window.dispatchEvent(new CustomEvent('networkChanged', { detail: { network: networkName } }));
      
      this.switching = false;
      return { success: true };
    } catch (error) {
      this.switching = false;
      
      // Network doesn't exist, add it
      if (error.code === 4902) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return await this.addNetwork(networkName);
      }
      
      // User rejected or request in progress
      if (error.code === 4001) {
        console.error('Network switch error (code 4001):', error.message);
        
        // Check if it's "already in progress" error
        if (error.message && error.message.includes('already in progress')) {
          return { success: false, error: 'REQUEST_IN_PROGRESS' };
        }
        
        // Otherwise it's user rejection
        return { success: false, error: 'USER_REJECTED' };
      }
      
      console.error('Failed to switch network:', error);
      return { success: false, error: 'UNKNOWN_ERROR', message: error.message };
    }
  },

  /**
   * Add network to wallet
  async addNetwork(networkName) {
    const network = Config.networks[networkName];
    
    if (!network) {
      console.error('Invalid network:', networkName);
      return { success: false, error: 'INVALID_NETWORK' };
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
      });

      this.currentNetwork = networkName;
      localStorage.setItem(Config.STORAGE_KEYS.NETWORK, networkName);
      window.dispatchEvent(new CustomEvent('networkChanged', { detail: { network: networkName } }));
      
      return { success: true };
    } catch (error) {
      console.error('Failed to add network:', error);
      if (error.code === 4001) {
        return { success: false, error: 'USER_REJECTED' };
      }
      return { success: false, error: 'ADD_FAILED', message: error.message };
    }
  },

  /**
   * Check if connected to correct network
  async checkNetwork() {
    if (!window.ethereum) return false;

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const expectedChainId = this.getNetworkConfig().chainId;
      
      return chainId === expectedChainId;
    } catch (error) {
      console.error('Failed to check network:', error);
      return false;
    }
  },

  /**
   * Get block explorer URL for transaction
   */
  getExplorerUrl(txHash) {
    const network = this.getNetworkConfig();
    return `${network.blockExplorer}/tx/${txHash}`;
  },

  /**
   * Get block explorer URL for address
   */
  getAddressExplorerUrl(address) {
    const network = this.getNetworkConfig();
    return `${network.blockExplorer}/address/${address}`;
  },

  /**
   * Is demo mode?
   */
  isDemo() {
    return this.currentMode === 'demo';
  },

  /**
   * Is testnet mode?
   */
  isTestnet() {
    return this.currentMode === 'testnet';
  },

  /**
   * Is mainnet mode?
   */
  isMainnet() {
    return this.currentMode === 'mainnet';
  }
};

// Initialize
NetworkManager.init();
