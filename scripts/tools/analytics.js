/**
 * Payment Analytics Tool
 * Displays charts and transaction history
 */

const PaymentAnalytics = {
  volumeChart: null,
  typeChart: null,
  transactions: [],

  async init() {
    this.generateDemoData();
    this.updateStats();
    this.createCharts();
    this.renderTransactions();
    this.setupEventListeners();
  },

  generateDemoData() {
    // Generate demo transactions for the last 30 days
    const types = ['sent', 'received'];
    const now = Date.now();
    
    this.transactions = Array.from({ length: 20 }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const amount = (Math.random() * 100 + 10).toFixed(2);
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      
      return {
        id: `tx_${Date.now()}_${i}`,
        type,
        amount: parseFloat(amount),
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        date: date.toISOString(),
        timestamp: date.getTime()
      };
    }).sort((a, b) => b.timestamp - a.timestamp);
  },

  updateStats() {
    const totalSent = this.transactions
      .filter(tx => tx.type === 'sent')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalReceived = this.transactions
      .filter(tx => tx.type === 'received')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalVolume = totalSent + totalReceived;
    const transactionCount = this.transactions.length;

    document.getElementById('totalVolume').textContent = `${totalVolume.toFixed(2)} BAT`;
    document.getElementById('totalSent').textContent = `${totalSent.toFixed(2)} BAT`;
    document.getElementById('totalReceived').textContent = `${totalReceived.toFixed(2)} BAT`;
    document.getElementById('transactionCount').textContent = transactionCount;
  },

  createCharts() {
    this.createVolumeChart();
    this.createTypeChart();
  },

  createVolumeChart() {
    const ctx = document.getElementById('volumeChart');
    if (!ctx) return;

    // Get last 7 days data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    const labels = last7Days.map(date => 
      date.toLocaleDateString('en-US', { weekday: 'short' })
    );

    const sentData = last7Days.map(date => {
      const dayStart = new Date(date).setHours(0, 0, 0, 0);
      const dayEnd = new Date(date).setHours(23, 59, 59, 999);
      
      return this.transactions
        .filter(tx => tx.type === 'sent' && tx.timestamp >= dayStart && tx.timestamp <= dayEnd)
        .reduce((sum, tx) => sum + tx.amount, 0);
    });

    const receivedData = last7Days.map(date => {
      const dayStart = new Date(date).setHours(0, 0, 0, 0);
      const dayEnd = new Date(date).setHours(23, 59, 59, 999);
      
      return this.transactions
        .filter(tx => tx.type === 'received' && tx.timestamp >= dayStart && tx.timestamp <= dayEnd)
        .reduce((sum, tx) => sum + tx.amount, 0);
    });

    this.volumeChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Sent',
            data: sentData,
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Received',
            data: receivedData,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => `${value} BAT`
            }
          }
        }
      }
    });
  },

  createTypeChart() {
    const ctx = document.getElementById('typeChart');
    if (!ctx) return;

    const sentCount = this.transactions.filter(tx => tx.type === 'sent').length;
    const receivedCount = this.transactions.filter(tx => tx.type === 'received').length;

    this.typeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Sent', 'Received'],
        datasets: [{
          data: [sentCount, receivedCount],
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(16, 185, 129, 0.8)'
          ],
          borderColor: [
            '#EF4444',
            '#10B981'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  },

  renderTransactions() {
    const container = document.getElementById('transactionsList');
    if (!container) return;

    if (this.transactions.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">📭</div>
          <div class="empty-state__text">No transactions yet</div>
        </div>
      `;
      return;
    }

    // Show only first 10 transactions
    const recentTransactions = this.transactions.slice(0, 10);

    container.innerHTML = recentTransactions.map(tx => {
      const icon = tx.type === 'sent' ? '📤' : '📥';
      const typeLabel = tx.type === 'sent' ? 'Sent' : 'Received';
      const amountPrefix = tx.type === 'sent' ? '-' : '+';
      const shortAddress = `${tx.address.slice(0, 6)}...${tx.address.slice(-4)}`;
      const date = new Date(tx.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      return `
        <div class="transaction-item">
          <div class="transaction-icon ${tx.type}">
            ${icon}
          </div>
          <div class="transaction-details">
            <div class="transaction-type">${typeLabel}</div>
            <div class="transaction-address">${shortAddress}</div>
          </div>
          <div class="transaction-amount ${tx.type}">
            ${amountPrefix}${tx.amount.toFixed(2)} BAT
          </div>
          <div class="transaction-date">${date}</div>
        </div>
      `;
    }).join('');
  },

  setupEventListeners() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.generateDemoData();
        this.updateStats();
        this.updateCharts();
        this.renderTransactions();
        ToastComponent.show('Analytics refreshed', 'success');
      });
    }
  },

  updateCharts() {
    if (this.volumeChart) {
      this.volumeChart.destroy();
    }
    if (this.typeChart) {
      this.typeChart.destroy();
    }
    this.createCharts();
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PaymentAnalytics.init());
} else {
  PaymentAnalytics.init();
}
