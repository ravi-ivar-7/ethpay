/**
 * CTA Component
 * Renders the CTA section on all pages
 */

const CTAComponent = {
  render() {
    const basePath = this.getBasePath();
    
    return `
      <section class="cta">
        <div class="container">
          <div class="cta__content">
            <h2 class="cta__title">Ready to Get Started?</h2>
            <p class="cta__subtitle">Create your first BAT payment link in under a minute</p>
            <a href="${basePath}pages/tools.html" class="btn btn--primary btn--large">Try Tools Now</a>
          </div>
        </div>
      </section>
    `;
  },

  getBasePath() {
    return window.location.pathname.includes('/pages/') ? '../' : '';
  },

  init() {
    const ctaPlaceholder = document.getElementById('cta-placeholder');
    if (ctaPlaceholder) {
      ctaPlaceholder.innerHTML = this.render();
    }
  }
};

// Auto-initialize if placeholder exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CTAComponent.init());
} else {
  CTAComponent.init();
}
