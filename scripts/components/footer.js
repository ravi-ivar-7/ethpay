/**
 * Footer Component
 * Renders the footer on all pages
 */

const FooterComponent = {
  render() {
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer__content">
            <div class="footer__brand">
              <div class="footer__logo">EthPay</div>
              <p class="footer__tagline">Built for the Brave ecosystem</p>
            </div>
            
            <div class="footer__links">
              <div class="footer__column">
                <h4 class="footer__heading">Product</h4>
                <ul class="footer__list">
                  <li><a href="${this.getBasePath()}pages/features.html">Features</a></li>
                  <li><a href="${this.getBasePath()}pages/tools.html">Tools</a></li>
                  <li><a href="${this.getBasePath()}pages/demo.html">Demo</a></li>
                </ul>
              </div>
              
              <div class="footer__column">
                <h4 class="footer__heading">Resources</h4>
                <ul class="footer__list">
                  <li><a href="${this.getBasePath()}pages/docs.html">Documentation</a></li>
                  <li><a href="https://brave.com" target="_blank" rel="noopener">Brave Browser</a></li>
                  <li><a href="https://basicattentiontoken.org" target="_blank" rel="noopener">About BAT</a></li>
                </ul>
              </div>
              
              <div class="footer__column">
                <h4 class="footer__heading">Connect</h4>
                <ul class="footer__list">
                  <li><a href="https://x.com/ImAditIyer" target="_blank" rel="noopener">Twitter</a></li>
                  <li><a href="https://discord.gg/ethpay" target="_blank" rel="noopener">Discord</a></li>
                  <li><a href="${this.getBasePath()}pages/about.html">About Us</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="footer__bottom">
            <p class="footer__copyright">&copy; 2025 EthPay.brave. Built for Brave Website-Building Challenge.</p>
          </div>
        </div>
      </footer>
    `;
  },

  getBasePath() {
    // Check if we're in a subdirectory (pages folder)
    return window.location.pathname.includes('/pages/') ? '../' : '';
  },

  init() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = this.render();
    }
  }
};

// Auto-initialize if placeholder exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => FooterComponent.init());
} else {
  FooterComponent.init();
}
