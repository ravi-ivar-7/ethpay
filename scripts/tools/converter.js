/**
 * Currency Converter Tool
 * Converts BAT to/from USD, EUR, ETH, BTC using CoinGecko API
 */

const CurrencyConverter = {
  rates: {},
  batData: null,

  async init() {
    await this.fetchRates();
    this.setupEventListeners();
    this.convert();
    this.updateQuickRates();
    this.updateMarketInfo();
  },

  async fetchRates() {
    try {
      // Fetch BAT price data from CoinGecko (no API key needed)
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=basic-attention-token,ethereum,bitcoin&vs_currencies=usd,eur&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true'
      );
      
      if (!response.ok) throw new Error('Failed to fetch rates');
      
      const data = await response.json();
      
      // Store BAT data
      this.batData = data['basic-attention-token'];
      
      // Calculate rates (all relative to BAT)
      this.rates = {
        bat: 1,
        usd: this.batData.usd,
        eur: this.batData.eur,
        eth: this.batData.usd / data.ethereum.usd,
        btc: this.batData.usd / data.bitcoin.usd
      };

      console.log('Rates loaded:', this.rates);
    } catch (error) {
      console.error('Error fetching rates:', error);
      ToastComponent.show('Failed to load exchange rates', 'error');
      
      // Fallback rates
      this.rates = {
        bat: 1,
        usd: 0.25,
        eur: 0.23,
        eth: 0.00015,
        btc: 0.0000065
      };
    }
  },

  setupEventListeners() {
    const fromAmount = document.getElementById('fromAmount');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const swapBtn = document.getElementById('swapBtn');

    fromAmount.addEventListener('input', () => this.convert());
    fromCurrency.addEventListener('change', () => this.convert());
    toCurrency.addEventListener('change', () => this.convert());
    swapBtn.addEventListener('click', () => this.swap());
  },

  convert() {
    const fromAmount = parseFloat(document.getElementById('fromAmount').value) || 0;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const toAmountInput = document.getElementById('toAmount');
    const rateInfo = document.getElementById('rateInfo');

    // Convert to BAT first, then to target currency
    const batAmount = fromAmount / this.rates[fromCurrency];
    const result = batAmount * this.rates[toCurrency];

    // Display result
    toAmountInput.value = result.toFixed(8);

    // Update rate info
    const rate = this.rates[toCurrency] / this.rates[fromCurrency];
    rateInfo.innerHTML = `
      <span class="converter-rate-text">
        1 ${fromCurrency.toUpperCase()} = 
        <span class="converter-rate-value">${rate.toFixed(8)} ${toCurrency.toUpperCase()}</span>
      </span>
    `;
  },

  swap() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const fromAmount = document.getElementById('fromAmount');
    const toAmount = document.getElementById('toAmount');

    // Swap currencies
    const tempCurrency = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCurrency;

    // Swap amounts
    fromAmount.value = toAmount.value;

    // Recalculate
    this.convert();
  },

  updateQuickRates() {
    const quickRates = document.getElementById('quickRates');
    const currencies = [
      { code: 'usd', name: 'US Dollar', symbol: '$' },
      { code: 'eur', name: 'Euro', symbol: '€' },
      { code: 'eth', name: 'Ethereum', symbol: 'Ξ' },
      { code: 'btc', name: 'Bitcoin', symbol: '₿' }
    ];

    quickRates.innerHTML = currencies.map(currency => `
      <div class="quick-rate-item">
        <div class="quick-rate-currency">${currency.symbol} ${currency.name}</div>
        <div class="quick-rate-value">
          ${currency.code === 'eth' || currency.code === 'btc' 
            ? this.rates[currency.code].toFixed(8) 
            : this.rates[currency.code].toFixed(4)
          }
        </div>
      </div>
    `).join('');
  },

  updateMarketInfo() {
    if (!this.batData) return;

    const marketInfo = document.getElementById('marketInfo');
    const change24h = this.batData.usd_24h_change || 0;
    const changeClass = change24h >= 0 ? 'positive' : 'negative';
    const changeSymbol = change24h >= 0 ? '+' : '';

    marketInfo.innerHTML = `
      <h3 class="market-info__title">BAT Market Data</h3>
      <div class="market-info__grid">
        <div class="market-stat">
          <div class="market-stat__label">Current Price</div>
          <div class="market-stat__value">$${this.batData.usd.toFixed(4)}</div>
          <div class="market-stat__change ${changeClass}">
            ${changeSymbol}${change24h.toFixed(2)}%
          </div>
        </div>
        <div class="market-stat">
          <div class="market-stat__label">Market Cap</div>
          <div class="market-stat__value">
            $${(this.batData.usd_market_cap / 1000000).toFixed(2)}M
          </div>
        </div>
        <div class="market-stat">
          <div class="market-stat__label">24h Volume</div>
          <div class="market-stat__value">
            $${(this.batData.usd_24h_vol / 1000000).toFixed(2)}M
          </div>
        </div>
      </div>
    `;
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CurrencyConverter.init());
} else {
  CurrencyConverter.init();
}
