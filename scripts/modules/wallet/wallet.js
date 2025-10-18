/**
 * Brave Wallet Integration
 * Connect and interact with Brave Wallet (MetaMask compatible)
 */

const Wallet = {
  address: null,
  connected: false,

  /**
   * Check if wallet is available
   */
  isAvailable() {
    return typeof window.ethereum !== 'undefined';
  },

  /**
   * Connect to wallet
   */
  async connect() {
    if (!this.isAvailable()) {
      // Check if Solana is available but not Ethereum
      if (window.solana && window.solana.isBraveWallet) {
        alert('Ethereum wallet not enabled!\n\nYou have Solana enabled, but BAT requires Ethereum.\n\nIn Brave Wallet:\n1. Click the lion icon (🦁) in the address bar\n2. Go to Settings\n3. Enable "Ethereum" network\n4. Refresh the page');
      } else {
        alert('Crypto Wallet not detected!\n\nIn Brave Browser:\n1. Click the lion icon (🦁) in the address bar\n2. Enable "Use Brave Wallet"\n3. Enable Ethereum network\n4. Refresh the page\n\nOr install MetaMask extension.');
      }
      return false;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        this.address = accounts[0];
        this.connected = true;
        
        localStorage.setItem('wallet_address', this.address);
        this.updateUI();
        this.setupListeners();
        
        if (typeof ToastComponent !== 'undefined') {
          ToastComponent.show('Wallet connected successfully!', 'success');
        }
        return true;
      }
    } catch (error) {
      const message = error.code === 4001 ? 'Wallet connection rejected' : 'Failed to connect wallet';
      
      if (typeof ToastComponent !== 'undefined') {
        ToastComponent.show(message, 'error');
      } else {
        alert(message);
      }
      
      return false;
    }
  },

  /**
   * Disconnect wallet
   */
  disconnect() {
    this.address = null;
    this.connected = false;
    
    localStorage.removeItem('wallet_address');
    this.updateUI();
    
    if (typeof ToastComponent !== 'undefined') {
      ToastComponent.show('Wallet disconnected', 'info');
    }
  },

  /**
   * Get BAT balance
   */
  async getBalance() {
    if (!this.connected || !this.address) {
      return null;
    }

    try {
      // This would require a proper Web3 library or direct contract call
      // For now, return null - implement when needed
      return null;
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  },

  /**
   * Setup event listeners
   */
  setupListeners() {
    if (!window.ethereum) return;

    // Account changed
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.address = accounts[0];
        this.connected = true;
        
        localStorage.setItem('wallet_address', this.address);
        this.updateUI();
        
        if (typeof ToastComponent !== 'undefined') {
          ToastComponent.show('Account changed', 'info');
        }
      }
    });

    // Chain changed
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  },

  /**
   * Update UI elements
   */
  updateUI() {
    const connectBtn = document.getElementById('connectWallet');
    
    if (connectBtn) {
      if (this.connected && this.address) {
        const shortAddress = `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
        connectBtn.innerHTML = `<span class="btn--wallet-full">${shortAddress}</span><span class="btn--wallet-short">Wallet</span>`;
        connectBtn.classList.add('connected');
      } else {
        connectBtn.innerHTML = '<span class="btn--wallet-full">Connect Wallet</span><span class="btn--wallet-short">Wallet</span>';
        connectBtn.classList.remove('connected');
      }
    }
  },

  /**
   * Initialize wallet
   */
  setupButton() {
    setTimeout(() => {
      const connectBtn = document.getElementById('connectWallet');
      
      if (connectBtn) {
        // Update UI first to show current state
        if (this.connected && this.address) {
          const shortAddress = `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
          connectBtn.innerHTML = `<span class="btn--wallet-full">${shortAddress}</span><span class="btn--wallet-short">Wallet</span>`;
          connectBtn.classList.add('connected');
        }
        
        // Remove any existing listeners by cloning
        const newBtn = connectBtn.cloneNode(true);
        connectBtn.parentNode.replaceChild(newBtn, connectBtn);
        
        // Add new listener
        newBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (this.connected) {
            const basePath = window.location.pathname.includes('/pages/') ? '' : 'pages/';
            window.location.href = basePath + 'wallet.html';
          } else {
            this.connect();
          }
        });
      }
    }, 100);
  },

  async init() {
    const savedAddress = localStorage.getItem('wallet_address');
    
    if (savedAddress && this.isAvailable()) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        });
        
        if (accounts.length > 0) {
          const normalizedSaved = savedAddress.toLowerCase();
          const foundAccount = accounts.find(acc => acc.toLowerCase() === normalizedSaved);
          
          if (foundAccount) {
            this.address = foundAccount;
            this.connected = true;
            this.setupListeners();
          } else {
            localStorage.removeItem('wallet_address');
          }
        } else {
          localStorage.removeItem('wallet_address');
        }
      } catch (error) {
        localStorage.removeItem('wallet_address');
      }
    }
  }
};

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Wallet.init());
} else {
  Wallet.init();
}
