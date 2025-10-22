/**
 * BAT Stats API
 * Fetch BAT token statistics from CoinGecko and Etherscan
 */

const BATStats = {
  cache: {
    data: null,
    timestamp: null
  },

  // Fallback data to show during loading or on error
  fallbackData: {
    price: 0.17,
    priceChange24h: -2.13,
    marketCap: 260943010,
    volume24h: 30191945,
    circulatingSupply: 1496000000,
    totalSupply: 1500000000,
    high24h: 0.18,
    low24h: 0.16,
    lastUpdated: new Date().toISOString()
  },

  /**
   * Fetch BAT stats from CoinGecko
   */
  async fetchStats() {
    try {
      const response = await fetch(
        `${Config.COINGECKO_API || Config.api.coingecko}/coins/${Config.BAT_COINGECKO_ID || 'basic-attention-token'}?localization=false&tickers=false&community_data=false&developer_data=false`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch BAT stats');
      }

      const data = await response.json();
      
      const stats = {
        price: data.market_data.current_price.usd,
        priceChange24h: data.market_data.price_change_percentage_24h,
        marketCap: data.market_data.market_cap.usd,
        volume24h: data.market_data.total_volume.usd,
        circulatingSupply: data.market_data.circulating_supply,
        totalSupply: data.market_data.total_supply,
        high24h: data.market_data.high_24h.usd,
        low24h: data.market_data.low_24h.usd,
        lastUpdated: new Date().toISOString()
      };

      // Cache the data
      this.cache.data = stats;
      this.cache.timestamp = Date.now();

      return stats;
    } catch (error) {
      console.error('Error fetching BAT stats:', error);
      throw error;
    }
  },

  /**
   * Get cached stats or fetch new ones
   */
  async getStats(forceRefresh = false) {
    const cacheAge = this.cache.timestamp ? Date.now() - this.cache.timestamp : Infinity;
    const cacheValid = cacheAge < (Config.STATS_REFRESH_INTERVAL || 30000);

    if (!forceRefresh && cacheValid && this.cache.data) {
      return this.cache.data;
    }

    return await this.fetchStats();
  },

  /**
   * Display stats (either real or fallback)
   */
  displayStats(stats) {
    // Update price
    const priceEl = Utils.$('#batPrice');
    if (priceEl) {
      priceEl.textContent = `$${stats.price.toFixed(2)}`;
    }

    // Update price change
    const changeEl = Utils.$('#batChange');
    if (changeEl) {
      const change = stats.priceChange24h;
      changeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
      changeEl.className = `stat-card__change ${change >= 0 ? 'positive' : 'negative'}`;
    }

    // Update market cap
    const marketCapEl = Utils.$('#batMarketCap');
    if (marketCapEl) {
      const formatted = `$${(stats.marketCap / 1000000).toFixed(0)}M`;
      marketCapEl.textContent = formatted.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    // Update volume
    const volumeEl = Utils.$('#batVolume');
    if (volumeEl) {
      const formatted = `$${(stats.volume24h / 1000000).toFixed(0)}M`;
      volumeEl.textContent = formatted.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    // Update supply
    const supplyEl = Utils.$('#batSupply');
    if (supplyEl) {
      supplyEl.textContent = `${(stats.circulatingSupply / 1000000).toFixed(0)}M`;
    }
  },

  /**
   * Update stats display on page
   */
  async updateDisplay() {
    // Show fallback data immediately
    this.displayStats(this.fallbackData);

    try {
      const stats = await this.getStats();
      this.displayStats(stats);
      return stats;
    } catch (error) {
      console.error('Error updating BAT stats display:', error);
      // Keep showing fallback data on error
      return this.fallbackData;
    }
  },

  /**
   * Start auto-refresh
   */
  startAutoRefresh() {
    // Initial update
    this.updateDisplay();

    // Set up interval
    setInterval(() => {
      this.updateDisplay();
    }, Config.STATS_REFRESH_INTERVAL || 30000);
  },

  /**
   * Initialize BAT stats
   */
  init() {
    // Check if we're on a page with stats
    if (Utils.$('#batPrice')) {
      this.startAutoRefresh();
    }
  }
};
