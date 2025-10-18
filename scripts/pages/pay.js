/**
 * Pay Page
 * Complete payment from request link
 */

const PayPage = {
  paymentData: null,

  init() {
    this.loadPaymentData();
    this.setupEventListeners();
  },

  loadPaymentData() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const to = urlParams.get('to');
    const amount = urlParams.get('amount');
    const description = urlParams.get('desc');

    if (!to || !amount) {
      if (typeof Toast !== 'undefined') {
        Toast.show('Invalid payment link', 'error');
      }
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 2000);
      return;
    }

    this.paymentData = {
      to,
      amount: parseFloat(amount),
      description: description || 'No description'
    };

    this.displayPaymentInfo();
  },

  displayPaymentInfo() {
    if (!this.paymentData) return;

    document.getElementById('payAmount').textContent = `${this.paymentData.amount} BAT`;
    document.getElementById('payDescription').textContent = this.paymentData.description;
    document.getElementById('payTo').textContent = this.paymentData.to;
  },

  setupEventListeners() {
    const sendPaymentBtn = document.getElementById('sendPaymentBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    if (sendPaymentBtn) {
      sendPaymentBtn.addEventListener('click', () => {
        this.sendPayment();
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
      });
    }
  },

  async sendPayment() {
    if (!Wallet.connected || !Wallet.address) {
      if (typeof Toast !== 'undefined') {
        Toast.show('Please connect your wallet first', 'error');
      } else {
        alert('Please connect your wallet first');
      }
      return;
    }

    if (!this.paymentData) {
      if (typeof Toast !== 'undefined') {
        Toast.show('Invalid payment data', 'error');
      }
      return;
    }

    // This is a demo - in production, you would:
    // 1. Use ethers.js to connect to the BAT contract
    // 2. Call the transfer function
    // 3. Wait for transaction confirmation
    // 4. Show transaction hash

    if (typeof Toast !== 'undefined') {
      Toast.show('Processing payment...', 'info');
    }

    // Simulate payment processing
    setTimeout(() => {
      // Show success
      document.querySelector('.pay-card').style.display = 'none';
      document.getElementById('successCard').style.display = 'block';

      if (typeof Toast !== 'undefined') {
        Toast.show('Payment sent successfully!', 'success');
      }
    }, 2000);

    // Demo alert
    alert(`Demo Mode:\n\nWould send ${this.paymentData.amount} BAT to:\n${this.paymentData.to}\n\nDescription: ${this.paymentData.description}\n\nIn production, this would:\n1. Request wallet approval\n2. Send transaction\n3. Show transaction hash\n4. Confirm on blockchain`);
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => PayPage.init(), 500);
  });
} else {
  setTimeout(() => PayPage.init(), 500);
}
