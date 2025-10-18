/**
 * Transaction History Tool
 * View and export transaction history
 */

const TransactionHistory = {
  transactions: [],
  filteredTransactions: [],

  init() {
    this.setupEventListeners();
    this.loadTransactions();
  },

  setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const dateFilter = document.getElementById('dateFilter');
    const exportBtn = document.getElementById('exportBtn');
    const refreshBtn = document.getElementById('refreshBtn');

    if (searchInput) {
      searchInput.addEventListener('input', () => this.applyFilters());
    }

    if (typeFilter) {
      typeFilter.addEventListener('change', () => this.applyFilters());
    }

    if (dateFilter) {
      dateFilter.addEventListener('change', () => this.applyFilters());
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportCSV());
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.loadTransactions());
    }
  },

  loadTransactions() {
    if (!Wallet.connected || !Wallet.address) {
      this.showEmptyState();
      return;
    }

    // Demo data - In production, fetch from Etherscan API
    this.transactions = this.generateDemoTransactions();
    this.filteredTransactions = [...this.transactions];
    this.renderTransactions();
  },

  generateDemoTransactions() {
    const userAddress = Wallet.address || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0';
    const demoTxs = [];
    
    // Generate 15 demo transactions
    for (let i = 0; i < 15; i++) {
      const isSent = i % 2 === 0;
      const date = new Date();
      date.setDate(date.getDate() - i * 2);
      
      demoTxs.push({
        hash: '0x' + Math.random().toString(16).substr(2, 64),
        from: isSent ? userAddress : '0x' + Math.random().toString(16).substr(2, 40),
        to: isSent ? '0x' + Math.random().toString(16).substr(2, 40) : userAddress,
        amount: (Math.random() * 50 + 1).toFixed(4),
        date: date,
        status: i === 0 ? 'pending' : 'success',
        type: isSent ? 'sent' : 'received'
      });
    }
    
    return demoTxs;
  },

  applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;

    this.filteredTransactions = this.transactions.filter(tx => {
      // Search filter
      const matchesSearch = !searchTerm || 
        tx.hash.toLowerCase().includes(searchTerm) ||
        tx.from.toLowerCase().includes(searchTerm) ||
        tx.to.toLowerCase().includes(searchTerm);

      // Type filter
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;

      // Date filter
      const matchesDate = this.matchesDateFilter(tx.date, dateFilter);

      return matchesSearch && matchesType && matchesDate;
    });

    this.renderTransactions();
  },

  matchesDateFilter(txDate, filter) {
    if (filter === 'all') return true;

    const now = new Date();
    const diffDays = Math.floor((now - txDate) / (1000 * 60 * 60 * 24));

    switch (filter) {
      case 'today':
        return diffDays === 0;
      case 'week':
        return diffDays <= 7;
      case 'month':
        return diffDays <= 30;
      case 'year':
        return diffDays <= 365;
      default:
        return true;
    }
  },

  renderTransactions() {
    const listEl = document.getElementById('transactionList');
    const emptyState = document.getElementById('emptyState');
    const countEl = document.getElementById('txCount');

    if (this.filteredTransactions.length === 0) {
      listEl.style.display = 'none';
      emptyState.style.display = 'block';
      countEl.textContent = '0';
      return;
    }

    listEl.style.display = 'flex';
    emptyState.style.display = 'none';
    countEl.textContent = this.filteredTransactions.length;

    listEl.innerHTML = this.filteredTransactions.map(tx => `
      <div class="transaction-item" onclick="TransactionHistory.viewTransaction('${tx.hash}')">
        <div class="tx-icon ${tx.type}">
          ${tx.type === 'sent' ? '📤' : '📥'}
        </div>
        <div class="tx-details">
          <div class="tx-address">${this.shortenAddress(tx.type === 'sent' ? tx.to : tx.from)}</div>
          <div class="tx-date">${this.formatDate(tx.date)}</div>
        </div>
        <div class="tx-amount ${tx.type}">
          ${tx.type === 'sent' ? '-' : '+'}${tx.amount} BAT
        </div>
        <div class="tx-status ${tx.status}">
          ${tx.status}
        </div>
      </div>
    `).join('');
  },

  shortenAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },

  formatDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  },

  viewTransaction(hash) {
    // Open Etherscan in new tab
    const etherscanUrl = `https://etherscan.io/tx/${hash}`;
    window.open(etherscanUrl, '_blank');
  },

  exportCSV() {
    if (this.filteredTransactions.length === 0) {
      if (typeof Toast !== 'undefined') {
        Toast.show('No transactions to export', 'error');
      }
      return;
    }

    // Create CSV content
    const headers = ['Date', 'Type', 'From', 'To', 'Amount (BAT)', 'Status', 'Transaction Hash'];
    const rows = this.filteredTransactions.map(tx => [
      tx.date.toISOString(),
      tx.type,
      tx.from,
      tx.to,
      tx.amount,
      tx.status,
      tx.hash
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bat-transactions-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    if (typeof Toast !== 'undefined') {
      Toast.show('Transactions exported successfully!', 'success');
    }
  },

  showEmptyState() {
    document.getElementById('transactionList').style.display = 'none';
    document.getElementById('emptyState').style.display = 'block';
    document.getElementById('txCount').textContent = '0';
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => TransactionHistory.init(), 500);
  });
} else {
  setTimeout(() => TransactionHistory.init(), 500);
}
