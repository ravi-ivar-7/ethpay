/**
 * BAT Stats API
 * Fetch BAT token statistics from CoinGecko and Etherscan
 */

const BATStats = {
  cache: {
    data: null,
    timestamp: null
  },

  /**
   * Fetch BAT stats from CoinGecko
   */
  async fetchStats() {
    try {
      const response = await fetch(
        `${CONFIG.COINGECKO_API}/coins/${CONFIG.BAT_COINGECKO_ID}?localization=false&tickers=false&community_data=false&developer_data=false`
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
    const cacheValid = cacheAge < CONFIG.STATS_REFRESH_INTERVAL;

    if (!forceRefresh && cacheValid && this.cache.data) {
      return this.cache.data;
    }

    return await this.fetchStats();
  },

  /**
   * Update stats display on page
   */
  async updateDisplay() {
    try {
      const stats = await this.getStats();

      // Update price
      const priceEl = Utils.$('#batPrice');
      if (priceEl) {
        priceEl.textContent = Utils.formatCurrency(stats.price);
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
        marketCapEl.textContent = Utils.formatCurrency(stats.marketCap, 'USD').replace('.00', '');
      }

      // Update volume
      const volumeEl = Utils.$('#batVolume');
      if (volumeEl) {
        volumeEl.textContent = Utils.formatCurrency(stats.volume24h, 'USD').replace('.00', '');
      }

      // Update supply
      const supplyEl = Utils.$('#batSupply');
      if (supplyEl) {
        supplyEl.textContent = `${Utils.formatNumber(stats.circulatingSupply / 1000000, 0)}M`;
      }

      return stats;
    } catch (error) {
      console.error('Error updating BAT stats display:', error);
      
      // Show error in UI
      const priceEl = Utils.$('#batPrice');
      if (priceEl) {
        priceEl.textContent = 'Error loading';
      }
      
      throw error;
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
    }, CONFIG.STATS_REFRESH_INTERVAL);
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
