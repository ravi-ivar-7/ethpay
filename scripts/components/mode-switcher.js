/**
 * Mode Switcher Component
 * UI for switching between Demo, Testnet, and Mainnet modes
 */

const ModeSwitcher = {
  render() {
    const currentMode = NetworkManager.getMode();
    const currentNetwork = NetworkManager.getNetwork();
    
    return `
      <div class="mode-switcher">
        <div class="mode-switcher__label">Mode:</div>
        <div class="mode-switcher__buttons">
          <button class="mode-btn ${currentMode === 'demo' ? 'mode-btn--active' : ''}" data-mode="demo">
            🎮 Demo
          </button>
          <button class="mode-btn ${currentMode === 'testnet' ? 'mode-btn--active' : ''}" data-mode="testnet">
            🧪 Testnet
          </button>
          <button class="mode-btn ${currentMode === 'mainnet' ? 'mode-btn--active' : ''}" data-mode="mainnet">
            🌐 Mainnet
          </button>
        </div>
        <div class="mode-switcher__message" id="modeSwitcherMessage" style="display: none;"></div>
        ${currentMode !== 'demo' ? `
          <div class="mode-switcher__info">
            <span class="network-indicator ${currentMode === 'testnet' ? 'network-indicator--testnet' : 'network-indicator--mainnet'}">
              ${currentMode === 'testnet' ? '🧪 Sepolia' : '🌐 Ethereum'}
            </span>
            ${currentMode === 'testnet' ? `
              <a href="https://www.alchemy.com/faucets/ethereum-sepolia" target="_blank" class="faucet-link">
                💧 Get Free Test ETH
              </a>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  },

  init() {
    // Only initialize on settings page
    const placeholder = document.getElementById('mode-switcher-placeholder');
    if (placeholder) {
      placeholder.innerHTML = this.render();
      this.setupEventListeners();
    }
  },

  setupEventListeners() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    modeButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const mode = btn.dataset.mode;
        await this.switchMode(mode);
      });
    });

    // Listen for mode changes
    window.addEventListener('modeChanged', () => {
      this.update();
    });

    // Listen for network changes
    window.addEventListener('networkChanged', () => {
      this.update();
    });
  },

  showMessage(text, type = 'info') {
    const messageEl = document.getElementById('modeSwitcherMessage');
    if (messageEl) {
      messageEl.textContent = text;
      messageEl.className = `mode-switcher__message mode-switcher__message--${type}`;
      messageEl.style.display = 'block';
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 10000);
    } else {
      console.error('Message element not found!');
    }
  },

  async switchMode(mode) {
    const buttons = document.querySelectorAll('.mode-btn');
    const clickedButton = Array.from(buttons).find(btn => btn.dataset.mode === mode);
    
    // Check if already switching
    if (NetworkManager.switching) {
      this.showMessage('⏳ A network switch is already in progress. Please wait for it to complete before switching again.', 'warning');
      return;
    }

    // Disable all buttons and show loading on clicked button
    const originalText = clickedButton ? clickedButton.textContent : '';
    
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
      
      if (btn.dataset.mode === mode) {
        btn.innerHTML = '⏳ Switching...';
      }
    });

    const success = NetworkManager.setMode(mode);
    
    if (!success) {
      // Re-enable buttons and restore text
      if (clickedButton) clickedButton.innerHTML = originalText;
      buttons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
      });
      
      if (typeof Toast !== 'undefined') {
        Toast.show('Failed to switch mode', 'error');
      }
      return;
    }

    // If switching to testnet or mainnet, need wallet
    if (mode !== 'demo') {
      // Check if wallet is connected
      if (typeof Wallet === 'undefined' || !Wallet.connected) {
        // Re-enable buttons and restore text
        if (clickedButton) clickedButton.innerHTML = originalText;
        buttons.forEach(btn => {
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.style.cursor = 'pointer';
        });
        
        this.showMessage('❌ Connect your wallet first to use Testnet/Mainnet', 'error');
        
        // Reset mode back to demo
        NetworkManager.setMode('demo');
        // Update buttons only
        setTimeout(() => {
          buttons.forEach(btn => {
            if (btn.dataset.mode === 'demo') {
              btn.classList.add('mode-btn--active');
            } else {
              btn.classList.remove('mode-btn--active');
            }
          });
        }, 100);
        return;
      }

      // Switch to appropriate network (wait for any pending wallet requests)
      await new Promise(resolve => setTimeout(resolve, 1500));
      const networkName = mode === 'testnet' ? 'sepolia' : 'mainnet';
      const result = await NetworkManager.switchNetwork(networkName);
      
      // Re-enable buttons and restore text
      if (clickedButton) clickedButton.innerHTML = originalText;
      buttons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
      });
      
      if (result.success) {
        const modeNames = {
          testnet: 'Successfully switched to Sepolia Testnet! You can now test with free test ETH.',
          mainnet: 'Successfully switched to Ethereum Mainnet! Using real ETH/BAT.'
        };
        this.showMessage(modeNames[mode], 'success');
        
        // Update button states
        buttons.forEach(btn => {
          if (btn.dataset.mode === mode) {
            btn.classList.add('mode-btn--active');
          } else {
            btn.classList.remove('mode-btn--active');
          }
        });
      } else {
        // Show specific error message based on error type
        let errorMessage = '';
        switch(result.error) {
          case 'REQUEST_IN_PROGRESS':
            errorMessage = '⏳ Another wallet request is in progress. Please complete or cancel it first, then try again.';
            break;
          case 'USER_REJECTED':
            errorMessage = '❌ You rejected the network switch request in your wallet.';
            break;
          case 'NO_WALLET':
            errorMessage = '❌ Wallet not available. Please install Brave Wallet or MetaMask.';
            break;
          default:
            errorMessage = `❌ Network switch failed. ${result.message || 'Please try again.'}`;
        }
        this.showMessage(errorMessage, 'error');
        
        // Reset mode back to demo
        NetworkManager.setMode('demo');
        // Update buttons only
        setTimeout(() => {
          buttons.forEach(btn => {
            if (btn.dataset.mode === 'demo') {
              btn.classList.add('mode-btn--active');
            } else {
              btn.classList.remove('mode-btn--active');
            }
          });
        }, 100);
        return;
      }
    } else {
      // Re-enable buttons for demo mode and restore text
      if (clickedButton) clickedButton.innerHTML = originalText;
      buttons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
      });
      
      this.showMessage('✅ Switched to Demo Mode', 'success');
    }
  },

  update() {
    const placeholder = document.getElementById('mode-switcher-placeholder');
    if (placeholder) {
      // Save current message if exists
      const messageEl = document.getElementById('modeSwitcherMessage');
      const savedMessage = messageEl ? {
        text: messageEl.textContent,
        className: messageEl.className,
        display: messageEl.style.display
      } : null;
      
      placeholder.innerHTML = this.render();
      this.setupEventListeners();
      
      // Restore message if it was visible
      if (savedMessage && savedMessage.display !== 'none') {
        const newMessageEl = document.getElementById('modeSwitcherMessage');
        if (newMessageEl) {
          newMessageEl.textContent = savedMessage.text;
          newMessageEl.className = savedMessage.className;
          newMessageEl.style.display = savedMessage.display;
        }
      }
    }
  }
};

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => ModeSwitcher.init(), 500);
  });
} else {
  setTimeout(() => ModeSwitcher.init(), 500);
}
