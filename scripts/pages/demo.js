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

        // Hide the "Payment Preview" title
        const previewTitle = Utils.$('#previewTitle');
        if (previewTitle) {
          previewTitle.style.display = 'none';
        }

        // Update preview
        previewContainer.innerHTML = `
          <div class="preview-content fade-in">
            <div class="preview-amount">${amount} BAT</div>
            ${description ? `<div class="preview-description">${description}</div>` : ''}
            <div class="preview-recipient">To: ${Utils.shortenAddress(recipient)}</div>
            <div class="preview-qr">
              <img src="${qrDataUrl}" alt="Payment QR Code" style="width: 100%; height: 100%;">
            </div>
            <div class="preview-link">
              <a href="${result.link}" target="_blank" style="color: var(--color-primary); text-decoration: none;">
                ${result.link}
              </a>
            </div>
            <div class="preview-actions" style="display: flex; flex-wrap: wrap; gap: var(--spacing-md);">
              <button class="btn btn--primary" onclick="copyPaymentLink('${result.link}')" style="flex: 1; min-width: 120px;">
                Copy Link
              </button>
              <a href="${result.link}" target="_blank" class="btn btn--secondary" style="flex: 1; min-width: 120px; text-align: center; text-decoration: none;">
                Open Link
              </a>
              <button class="btn btn--secondary" onclick="downloadQR('${qrDataUrl}', '${result.data.id}')" style="flex: 1; min-width: 120px;">
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
    // Open QR in new tab
    const newTab = window.open();
    newTab.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>ethpay QR Code - ${filename}</title>
        <style>
          body { 
            margin: 0; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh; 
            background: #f5f5f5;
            font-family: system-ui, -apple-system, sans-serif;
          }
          .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          }
          img { 
            max-width: 400px; 
            width: 100%; 
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 10px;
            color: #1a1b26;
          }
          p {
            color: #64748b;
            margin-bottom: 20px;
          }
          button {
            background: #FB542B;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            font-weight: 600;
          }
          button:hover {
            background: #e64a26;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>ethpay Payment QR Code</h1>
          <p>Scan to make payment</p>
          <img src="${dataUrl}" alt="Payment QR Code">
          <br>
          <button onclick="downloadImage()">Download QR Code</button>
        </div>
        <script>
          function downloadImage() {
            const link = document.createElement('a');
            link.download = 'ethpay-qr-${filename}.png';
            link.href = '${dataUrl}';
            link.click();
          }
        </script>
      </body>
      </html>
    `);
    Toast.success('QR code opened in new tab!');
  };

})();
