/**
 * Payment Requests Tool
 * Create and share payment requests with QR codes
 */

const PaymentRequest = {
  init() {
    this.setupForm();
    this.setupEventListeners();
    
    // Wait a bit for wallet to initialize
    setTimeout(() => {
      this.loadWalletAddress();
    }, 500);
  },

  setupForm() {
    const form = document.getElementById('requestForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.generateRequest();
      });
    }
  },

  setupEventListeners() {
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const newRequestBtn = document.getElementById('newRequestBtn');

    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        this.copyLink();
      });
    }

    if (newRequestBtn) {
      newRequestBtn.addEventListener('click', () => {
        this.resetForm();
      });
    }
  },

  loadWalletAddress() {
    const walletAddressInput = document.getElementById('walletAddress');
    
    if (typeof Wallet !== 'undefined' && Wallet.connected && Wallet.address) {
      walletAddressInput.value = Wallet.address;
      walletAddressInput.placeholder = 'Your wallet address';
    } else {
      walletAddressInput.value = '';
      walletAddressInput.placeholder = 'Please connect your wallet first';
      
      // Try again after a delay
      setTimeout(() => {
        if (typeof Wallet !== 'undefined' && Wallet.connected && Wallet.address) {
          walletAddressInput.value = Wallet.address;
          walletAddressInput.placeholder = 'Your wallet address';
        }
      }, 1000);
    }
  },

  generateRequest() {
    // Check wallet connection
    if (typeof Wallet === 'undefined' || !Wallet.connected || !Wallet.address) {
      if (typeof Toast !== 'undefined') {
        Toast.show('Please connect your wallet first', 'error');
      } else {
        alert('Please connect your wallet first');
      }
      return;
    }

    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const address = Wallet.address;

    if (!amount || parseFloat(amount) <= 0) {
      if (typeof Toast !== 'undefined') {
        Toast.show('Please enter a valid amount', 'error');
      }
      return;
    }

    // Update display
    document.getElementById('displayAmount').textContent = `${amount} BAT`;
    document.getElementById('displayDescription').textContent = description || 'No description';
    document.getElementById('displayAddress').textContent = address;

    // Generate payment link
    const paymentData = {
      to: address,
      amount: amount,
      description: description
    };
    
    const paymentLink = `${window.location.origin}/pages/pay.html?` + 
      `to=${encodeURIComponent(address)}&` +
      `amount=${encodeURIComponent(amount)}&` +
      `desc=${encodeURIComponent(description)}`;
    
    document.getElementById('shareLink').value = paymentLink;

    // Generate QR code
    this.generateQRCode(paymentLink);

    // Show generated card
    document.getElementById('generatedCard').style.display = 'block';
    document.getElementById('requestForm').parentElement.style.display = 'none';

    if (typeof Toast !== 'undefined') {
      Toast.show('Payment request generated!', 'success');
    }
  },

  async generateQRCode(data) {
    const qrcodeDiv = document.getElementById('qrcode');
    qrcodeDiv.innerHTML = 'Generating QR code...';

    if (typeof QRGenerator !== 'undefined') {
      await QRGenerator.renderToElement(qrcodeDiv, data, 200);
    } else {
      qrcodeDiv.innerHTML = '<p style="color: red;">QR Generator not loaded</p>';
    }
  },

  copyLink() {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    navigator.clipboard.writeText(shareLink.value).then(() => {
      if (typeof Toast !== 'undefined') {
        Toast.show('Payment link copied to clipboard!', 'success');
      }
    }).catch(() => {
      if (typeof Toast !== 'undefined') {
        Toast.show('Failed to copy link', 'error');
      }
    });
  },

  resetForm() {
    document.getElementById('requestForm').reset();
    document.getElementById('generatedCard').style.display = 'none';
    document.getElementById('requestForm').parentElement.style.display = 'block';
    this.loadWalletAddress();
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PaymentRequest.init());
} else {
  PaymentRequest.init();
}
