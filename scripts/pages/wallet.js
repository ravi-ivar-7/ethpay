/**
 * Wallet Account Page
 * Display wallet details and account information
 */

const WalletPage = {
  async init() {
    // Check if wallet is connected
    if (!Wallet.connected || !Wallet.address) {
      const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
      window.location.href = basePath + 'index.html';
      return;
    }
    
    this.displayAccountInfo();
    this.setupEventListeners();
    await this.fetchBalance();
  },

  displayAccountInfo() {
    const addressEl = document.getElementById('walletAddress');
    if (addressEl && Wallet.address) {
      addressEl.textContent = Wallet.address;
    }
  },

  async fetchBalance() {
    const balanceEl = document.getElementById('batBalance');
    const usdValueEl = document.getElementById('usdValue');
    
    if (!Wallet.address) return;
    
    try {
      // Fetch BAT balance using Etherscan API
      const BAT_ADDRESS = '0x0D8775F648430679A709E98d2b0Cb6250d2887EF';
      const API_KEY = 'CB1ZMNYR8NMK6A16GEADNAYCYKIZ988SDZ';
      
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${BAT_ADDRESS}&address=${Wallet.address}&tag=latest&apikey=${API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        // Convert from wei to BAT (18 decimals)
        const balance = parseFloat(data.result) / 1e18;
        balanceEl.textContent = balance.toFixed(4);
        
        // Fetch BAT price
        const priceResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=basic-attention-token&vs_currencies=usd'
        );
        const priceData = await priceResponse.json();
        const batPrice = priceData['basic-attention-token']?.usd || 0;
        
        const usdValue = balance * batPrice;
        usdValueEl.textContent = usdValue.toFixed(2);
      } else {
        balanceEl.textContent = '0.00';
        usdValueEl.textContent = '0.00';
      }
    } catch (error) {
      balanceEl.textContent = 'Error';
      usdValueEl.textContent = 'Error';
    }
  },

  setupEventListeners() {
    // Copy address button
    const copyBtn = document.getElementById('copyAddress');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (Wallet.address) {
          navigator.clipboard.writeText(Wallet.address);
          if (typeof Toast !== 'undefined') {
            Toast.show('Address copied to clipboard!', 'success');
          } else {
            alert('Address copied!');
          }
        }
      });
    }
    
    // Open Brave Wallet button
    const openWalletBtn = document.getElementById('openWalletBtn');
    if (openWalletBtn) {
      openWalletBtn.addEventListener('click', () => {
        const walletUrl = 'brave://wallet/crypto/portfolio/assets';
        
        // Copy URL to clipboard
        navigator.clipboard.writeText(walletUrl).then(() => {
          if (typeof Toast !== 'undefined') {
            Toast.show('Wallet URL copied! Paste in new tab to open Brave Wallet', 'success');
          } else {
            alert('URL copied to clipboard!\n\nPaste in a new tab: ' + walletUrl);
          }
        }).catch(() => {
          if (typeof Toast !== 'undefined') {
            Toast.show('Copy this URL to new tab: brave://wallet/crypto/portfolio/assets', 'info');
          } else {
            alert('Paste this in a new tab:\n\n' + walletUrl);
          }
        });
      });
    }
    
    // Disconnect button
    const disconnectBtn = document.getElementById('disconnectBtn');
    if (disconnectBtn) {
      disconnectBtn.addEventListener('click', () => {
        Wallet.disconnect();
        // Redirect to home
        const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        window.location.href = basePath + 'index.html';
      });
    }
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait for Wallet to be initialized
    setTimeout(() => WalletPage.init(), 500);
  });
} else {
  setTimeout(() => WalletPage.init(), 500);
}
