/**
 * Receipt Generator Tool
 * Generate professional payment receipts
 */

const ReceiptGenerator = {
  init() {
    this.setupForm();
    this.setupEventListeners();
    this.setDefaultDate();
  },

  setupForm() {
    const form = document.getElementById('receiptForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.generateReceipt();
      });
    }
  },

  setupEventListeners() {
    const downloadBtn = document.getElementById('downloadBtn');
    const newReceiptBtn = document.getElementById('newReceiptBtn');

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.downloadReceipt();
      });
    }

    if (newReceiptBtn) {
      newReceiptBtn.addEventListener('click', () => {
        this.resetForm();
      });
    }
  },

  setDefaultDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.value = today;
    }
  },

  generateReceipt() {
    const txHash = document.getElementById('txHash').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const fromAddress = document.getElementById('fromAddress').value;
    const toAddress = document.getElementById('toAddress').value;
    const description = document.getElementById('description').value;

    // Validate
    if (!txHash || !amount || !date || !fromAddress || !toAddress) {
      if (typeof Toast !== 'undefined') {
        Toast.show('Please fill all required fields', 'error');
      }
      return;
    }

    // Generate receipt number
    const receiptNumber = this.generateReceiptNumber(txHash);

    // Update receipt preview
    document.getElementById('receiptNumber').textContent = receiptNumber;
    document.getElementById('receiptDate').textContent = this.formatDate(date);
    document.getElementById('receiptAmount').textContent = `${amount} BAT`;
    document.getElementById('receiptFrom').textContent = fromAddress;
    document.getElementById('receiptTo').textContent = toAddress;
    document.getElementById('receiptDesc').textContent = description || 'No description';
    document.getElementById('receiptTxHash').textContent = txHash;

    // Show receipt preview
    document.querySelector('.receipt-card').style.display = 'none';
    document.getElementById('receiptPreview').style.display = 'block';

    if (typeof Toast !== 'undefined') {
      Toast.show('Receipt generated successfully!', 'success');
    }
  },

  generateReceiptNumber(txHash) {
    // Generate receipt number from tx hash
    const hash = txHash.slice(2, 10).toUpperCase();
    return `RCP-${hash}`;
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  downloadReceipt() {
    // In a real implementation, you would use a library like jsPDF or html2pdf
    // For now, we'll use window.print() which allows saving as PDF
    
    if (typeof Toast !== 'undefined') {
      Toast.show('Opening print dialog...', 'info');
    }

    // Create a print-friendly version
    const receiptDoc = document.getElementById('receiptDocument').cloneNode(true);
    const printWindow = window.open('', '', 'width=800,height=600');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .receipt-header {
            text-align: center;
            padding-bottom: 30px;
            border-bottom: 3px solid #E5E7EB;
            margin-bottom: 30px;
          }
          .receipt-logo {
            font-size: 36px;
            font-weight: 800;
            color: #FB542B;
            margin-bottom: 10px;
          }
          .receipt-subtitle {
            font-size: 18px;
            color: #6B7280;
            font-weight: 600;
          }
          .receipt-section {
            margin-bottom: 30px;
          }
          .receipt-section-title {
            font-size: 18px;
            font-weight: 700;
            color: #1A1A2E;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #E5E7EB;
          }
          .receipt-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
          }
          .receipt-label {
            font-size: 12px;
            color: #6B7280;
            font-weight: 600;
            text-transform: uppercase;
          }
          .receipt-value {
            font-size: 14px;
            color: #1A1A2E;
            font-weight: 500;
            text-align: right;
            word-break: break-all;
          }
          .receipt-amount {
            font-size: 28px;
            font-weight: 800;
            color: #FB542B;
          }
          .receipt-address, .receipt-hash {
            font-family: monospace;
            font-size: 11px;
          }
          .receipt-footer {
            text-align: center;
            padding-top: 30px;
            border-top: 3px solid #E5E7EB;
            color: #9CA3AF;
            font-size: 12px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        ${receiptDoc.outerHTML}
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  },

  resetForm() {
    document.getElementById('receiptForm').reset();
    this.setDefaultDate();
    document.querySelector('.receipt-card').style.display = 'block';
    document.getElementById('receiptPreview').style.display = 'none';
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ReceiptGenerator.init());
} else {
  ReceiptGenerator.init();
}
