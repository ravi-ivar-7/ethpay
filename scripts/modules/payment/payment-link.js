/**
 * Payment Link Generator
 * Generate shareable BAT payment links
 */

const PaymentLink = {
  /**
   * Generate payment link
   */
  generate(amount, recipient, description = '') {
    if (!amount || !recipient) {
      throw new Error('Amount and recipient are required');
    }

    if (!Utils.isValidAddress(recipient)) {
      throw new Error('Invalid Ethereum address');
    }

    const linkId = Utils.generateId(8);
    const paymentData = {
      id: linkId,
      amount: parseFloat(amount),
      recipient: recipient,
      description: description,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    this.savePaymentLink(paymentData);

    // Generate link
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/pay/${linkId}`;

    return {
      link: link,
      data: paymentData
    };
  },

  /**
   * Save payment link to history
   */
  savePaymentLink(paymentData) {
    const history = Utils.storage.get(CONFIG.STORAGE_KEYS.PAYMENT_HISTORY) || [];
    
    history.unshift(paymentData);
    
    // Keep only last MAX_PAYMENT_HISTORY items
    if (history.length > CONFIG.MAX_PAYMENT_HISTORY) {
      history.splice(CONFIG.MAX_PAYMENT_HISTORY);
    }

    Utils.storage.set(CONFIG.STORAGE_KEYS.PAYMENT_HISTORY, history);
  },

  /**
   * Get payment history
   */
  getHistory() {
    return Utils.storage.get(CONFIG.STORAGE_KEYS.PAYMENT_HISTORY) || [];
  },

  /**
   * Get payment by ID
   */
  getById(id) {
    const history = this.getHistory();
    return history.find(payment => payment.id === id);
  },

  /**
   * Clear history
   */
  clearHistory() {
    Utils.storage.remove(CONFIG.STORAGE_KEYS.PAYMENT_HISTORY);
  }
};
