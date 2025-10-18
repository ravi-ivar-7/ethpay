/**
 * Demo Page Script
 * Payment link generator demo functionality
 */

(function() {
  'use strict';

  // Initialize wallet
  Wallet.init();

  const form = Utils.$('#paymentForm');
  const previewContainer = Utils.$('#paymentPreview');

  if (form && previewContainer) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const amount = Utils.$('#amount').value;
      const recipient = Utils.$('#recipient').value;
      const description = Utils.$('#description').value;

      // Validate inputs
      if (!amount || parseFloat(amount) <= 0) {
        Toast.error('Please enter a valid amount');
        return;
      }

      if (!Utils.isValidAddress(recipient)) {
        Toast.error('Please enter a valid Ethereum address');
        return;
      }

      try {
        // Generate payment link
        const result = PaymentLink.generate(amount, recipient, description);

        // Generate QR code (async)
        const qrDataUrl = await QRGenerator.generate(result.link, 200);

        // Update preview
        previewContainer.innerHTML = `
          <div class="preview-content fade-in">
            <div class="preview-amount">${amount} BAT</div>
            ${description ? `<div class="preview-description">${description}</div>` : ''}
            <div class="preview-recipient">To: ${Utils.shortenAddress(recipient)}</div>
            <div class="preview-qr">
              <img src="${qrDataUrl}" alt="Payment QR Code" style="width: 100%; height: 100%;">
            </div>
            <div class="preview-link">${result.link}</div>
            <div class="preview-actions">
              <button class="btn btn--primary" onclick="copyPaymentLink('${result.link}')">
                Copy Link
              </button>
              <button class="btn btn--secondary" onclick="downloadQR('${qrDataUrl}', '${result.data.id}')">
                Download QR
              </button>
            </div>
          </div>
        `;

        Toast.success('Payment link generated successfully!');
      } catch (error) {
        console.error('Error generating payment link:', error);
        Toast.error(error.message || 'Failed to generate payment link');
      }
    });
  }

  // Global functions for button actions
  window.copyPaymentLink = async function(link) {
    const success = await Utils.copyToClipboard(link);
    if (success) {
      Toast.success('Payment link copied to clipboard!');
    } else {
      Toast.error('Failed to copy link');
    }
  };

  window.downloadQR = function(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = `ethpay-qr-${filename}.png`;
    link.href = dataUrl;
    link.click();
    Toast.success('QR code downloaded!');
  };

})();
