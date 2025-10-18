/**
 * Mode Selection Page
 */

const ModePage = {
  init() {
    this.updateStatus();
    
    // Listen for mode/network changes
    window.addEventListener('modeChanged', () => {
      this.updateStatus();
    });
    
    window.addEventListener('networkChanged', () => {
      this.updateStatus();
    });
    
    // Update wallet status when wallet connects/disconnects
    setInterval(() => {
      this.updateWalletStatus();
    }, 1000);
  },

  updateStatus() {
    const mode = NetworkManager.getMode();
    const network = NetworkManager.getNetwork();
    
    // Update mode display
    const modeNames = {
      demo: 'Demo Mode',
      testnet: 'Testnet Mode',
      mainnet: 'Mainnet Mode'
    };
    
    document.getElementById('currentMode').textContent = modeNames[mode] || mode;
    
    // Update network display
    if (mode === 'demo') {
      document.getElementById('currentNetwork').textContent = 'N/A (Demo)';
    } else {
      const networkConfig = NetworkManager.getNetworkConfig(network);
      document.getElementById('currentNetwork').textContent = networkConfig.name;
    }
    
    this.updateWalletStatus();
  },

  updateWalletStatus() {
    const walletStatusEl = document.getElementById('walletStatus');
    
    if (typeof Wallet !== 'undefined' && Wallet.connected) {
      const shortAddress = Wallet.address.slice(0, 6) + '...' + Wallet.address.slice(-4);
      walletStatusEl.textContent = `Connected (${shortAddress})`;
      walletStatusEl.style.color = '#10B981';
    } else {
      walletStatusEl.textContent = 'Not Connected';
      walletStatusEl.style.color = '#6B7280';
    }
  }
};

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ModePage.init());
} else {
  ModePage.init();
}
