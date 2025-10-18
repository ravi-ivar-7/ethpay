/**
 * Navigation Component
 * Renders the navigation on all pages
 */

const NavigationComponent = {
  render() {
    const basePath = this.getBasePath();
    const currentPage = this.getCurrentPage();
    
    return `
      <nav class="nav" role="navigation" aria-label="Main navigation">
        <div class="container">
          <div class="nav__content">
            <a href="${basePath}index.html" class="nav__logo" aria-label="ethpay home">
              <span class="nav__logo-text">ethpay</span>
            </a>
            
            <ul class="nav__menu">
              <li><a href="${basePath}index.html" class="nav__link ${currentPage === 'home' ? 'nav__link--active' : ''}">Home</a></li>
              <li><a href="${basePath}pages/features.html" class="nav__link ${currentPage === 'features' ? 'nav__link--active' : ''}">Features</a></li>
              <li><a href="${basePath}pages/demo.html" class="nav__link ${currentPage === 'demo' ? 'nav__link--active' : ''}">Demo</a></li>
              <li class="nav__dropdown">
                <span class="nav__link ${currentPage === 'tools' ? 'nav__link--active' : ''}" style="cursor: pointer;">
                  Tools <span class="dropdown-arrow">▼</span>
                </span>
                <ul class="nav__dropdown-menu">
                  <li><a href="${basePath}pages/tools.html" class="nav__dropdown-link">📦 All Tools</a></li>
                  <li class="nav__dropdown-divider"></li>
                  <li><a href="${basePath}pages/converter.html" class="nav__dropdown-link">💱 Currency Converter</a></li>
                  <li><a href="${basePath}pages/analytics.html" class="nav__dropdown-link">📊 Payment Analytics</a></li>
                  <li><a href="${basePath}pages/batch.html" class="nav__dropdown-link">📤 Batch Payments</a></li>
                  <li><a href="${basePath}pages/request.html" class="nav__dropdown-link">📝 Payment Requests</a></li>
                  <li><a href="${basePath}pages/receipt.html" class="nav__dropdown-link">🧾 Receipt Generator</a></li>
                  <li><a href="${basePath}pages/history.html" class="nav__dropdown-link">📜 Transaction History</a></li>
                </ul>
              </li>
              <li><a href="${basePath}pages/docs.html" class="nav__link ${currentPage === 'docs' ? 'nav__link--active' : ''}">Docs</a></li>
              <li><a href="${basePath}pages/about.html" class="nav__link ${currentPage === 'about' ? 'nav__link--active' : ''}">About</a></li>
            </ul>
            
            <a href="${basePath}pages/contact.html" class="btn btn--outline btn--contact">
              <span class="btn--contact-full">Buy Domain/Code</span>
              <span class="btn--contact-short">Buy</span>
            </a>
            
            <button class="btn btn--primary btn--wallet" id="connectWallet">
              <span class="btn--wallet-full">Connect Wallet</span>
              <span class="btn--wallet-short">Wallet</span>
            </button>
            
            <button class="nav__toggle" aria-label="Toggle navigation menu" aria-expanded="false">
              <span class="nav__toggle-icon"></span>
            </button>
          </div>
        </div>
      </nav>
    `;
  },

  getBasePath() {
    return window.location.pathname.includes('/pages/') ? '../' : '';
  },

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('features')) return 'features';
    if (path.includes('demo')) return 'demo';
    if (path.includes('tools')) return 'tools';
    // Check for individual tool pages
    if (path.includes('converter') || path.includes('analytics') || 
        path.includes('batch') || path.includes('request') || 
        path.includes('receipt') || path.includes('history')) return 'tools';
    if (path.includes('docs')) return 'docs';
    if (path.includes('about')) return 'about';
    return 'home';
  },

  init() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
      navPlaceholder.innerHTML = this.render();
      this.setupMobileMenu();
      
      // Initialize wallet after navigation is rendered
      if (typeof Wallet !== 'undefined') {
        if (Wallet.setupButton) {
          Wallet.setupButton();
        }
        if (Wallet.updateUI) {
          Wallet.updateUI();
        }
      }
    }
  },

  setupMobileMenu() {
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.querySelector('.nav__menu');
    
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('active');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav')) {
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('active');
        }
      });
    }
  }
};

// Auto-initialize if placeholder exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => NavigationComponent.init());
} else {
  NavigationComponent.init();
}
