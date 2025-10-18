/**
 * Batch Payments Tool
 * Send BAT to multiple addresses at once
 */

const BatchPayments = {
  recipients: [],

  init() {
    this.setupEventListeners();
  },

  setupEventListeners() {
    const uploadArea = document.getElementById('uploadArea');
    const csvFile = document.getElementById('csvFile');
    const clearBtn = document.getElementById('clearBtn');
    const sendBatchBtn = document.getElementById('sendBatchBtn');
    const downloadExampleBtn = document.getElementById('downloadExampleBtn');

    // Download example CSV
    if (downloadExampleBtn) {
      downloadExampleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.downloadExample();
      });
    }

    // Click to upload
    if (uploadArea) {
      uploadArea.addEventListener('click', () => {
        csvFile.click();
      });
    }

    // File selection
    if (csvFile) {
      csvFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.handleFile(file);
        }
      });
    }

    // Drag and drop
    if (uploadArea) {
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
      });

      uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
      });

      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.csv')) {
          this.handleFile(file);
        } else {
          if (typeof Toast !== 'undefined') {
            Toast.show('Please upload a CSV file', 'error');
          }
        }
      });
    }

    // Clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearRecipients();
      });
    }

    // Send batch button
    if (sendBatchBtn) {
      sendBatchBtn.addEventListener('click', () => {
        this.sendBatch();
      });
    }
  },

  downloadExample() {
    const csvContent = `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0,10.5
0x1234567890123456789012345678901234567890,25.0
0xAbCdEfAbCdEfAbCdEfAbCdEfAbCdEfAbCdEfAbCd,5.75`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch-payments-example.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    if (typeof Toast !== 'undefined') {
      Toast.show('Example CSV downloaded!', 'success');
    }
  },

  handleFile(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      this.parseCSV(content);
    };
    
    reader.onerror = () => {
      if (typeof Toast !== 'undefined') {
        Toast.show('Error reading file', 'error');
      }
    };
    
    reader.readAsText(file);
  },

  parseCSV(content) {
    // Handle different line endings (Windows \r\n, Unix \n, Mac \r)
    const lines = content.split(/\r?\n/).filter(line => line.trim());
    const recipients = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Split by comma and clean up
      const parts = line.split(',').map(s => s.trim());
      
      if (parts.length < 2) {
        if (typeof Toast !== 'undefined') {
          Toast.show(`Invalid format on line ${i + 1}: Expected "address,amount"`, 'error');
        }
        return;
      }
      
      const address = parts[0];
      const amount = parts[1];
      
      // Validate address
      if (!address || !address.startsWith('0x')) {
        if (typeof Toast !== 'undefined') {
          Toast.show(`Invalid address on line ${i + 1}: Must start with 0x`, 'error');
        }
        return;
      }
      
      if (address.length !== 42) {
        if (typeof Toast !== 'undefined') {
          Toast.show(`Invalid address on line ${i + 1}: Must be 42 characters (${address.length} found)`, 'error');
        }
        return;
      }
      
      // Validate amount
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        if (typeof Toast !== 'undefined') {
          Toast.show(`Invalid amount on line ${i + 1}: "${amount}" is not a valid number`, 'error');
        }
        return;
      }
      
      recipients.push({
        address,
        amount: parsedAmount
      });
    }
    
    if (recipients.length === 0) {
      if (typeof Toast !== 'undefined') {
        Toast.show('No valid recipients found in CSV', 'error');
      }
      return;
    }
    
    this.recipients = recipients;
    this.renderRecipients();
    
    if (typeof Toast !== 'undefined') {
      Toast.show(`✅ Loaded ${recipients.length} recipient${recipients.length > 1 ? 's' : ''}`, 'success');
    }
  },

  renderRecipients() {
    const recipientsCard = document.getElementById('recipientsCard');
    const recipientsList = document.getElementById('recipientsList');
    const recipientCount = document.getElementById('recipientCount');
    const totalRecipients = document.getElementById('totalRecipients');
    const totalAmount = document.getElementById('totalAmount');
    
    if (this.recipients.length === 0) {
      recipientsCard.style.display = 'none';
      return;
    }
    
    recipientsCard.style.display = 'block';
    
    // Update counts
    recipientCount.textContent = this.recipients.length;
    totalRecipients.textContent = this.recipients.length;
    
    const total = this.recipients.reduce((sum, r) => sum + r.amount, 0);
    totalAmount.textContent = `${total.toFixed(4)} BAT`;
    
    // Render list
    recipientsList.innerHTML = this.recipients.map((recipient, index) => `
      <div class="recipient-item">
        <div class="recipient-address">${recipient.address}</div>
        <div class="recipient-amount">${recipient.amount} BAT</div>
        <button class="recipient-remove" data-index="${index}">✕</button>
      </div>
    `).join('');
    
    // Add remove listeners
    recipientsList.querySelectorAll('.recipient-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.removeRecipient(index);
      });
    });
  },

  removeRecipient(index) {
    this.recipients.splice(index, 1);
    this.renderRecipients();
  },

  clearRecipients() {
    this.recipients = [];
    this.renderRecipients();
    document.getElementById('csvFile').value = '';
    
    if (typeof Toast !== 'undefined') {
      Toast.show('Recipients cleared', 'info');
    }
  },

  async sendBatch() {
    if (!Wallet.connected || !Wallet.address) {
      if (typeof Toast !== 'undefined') {
        Toast.show('Please connect your wallet first', 'error');
      }
      return;
    }
    
    if (this.recipients.length === 0) {
      if (typeof Toast !== 'undefined') {
        Toast.show('No recipients to send to', 'error');
      }
      return;
    }
    
    // This is a demo - in production, you would:
    // 1. Use ethers.js to connect to the BAT contract
    // 2. Loop through recipients and send transactions
    // 3. Show progress for each transaction
    
    if (typeof Toast !== 'undefined') {
      Toast.show('Batch payment feature coming soon! This is a demo.', 'info');
    }
    
    // Demo: Show what would happen
    const total = this.recipients.reduce((sum, r) => sum + r.amount, 0);
    alert(`Demo Mode:\n\nWould send ${total.toFixed(4)} BAT to ${this.recipients.length} recipients.\n\nIn production, this would:\n1. Request wallet approval\n2. Send ${this.recipients.length} transactions\n3. Show progress for each\n4. Display final results`);
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => BatchPayments.init());
} else {
  BatchPayments.init();
}
