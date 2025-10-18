/**
 * Main App Initialization
 * Core application setup and initialization
 */

const App = {
  init() {
    this.setupNavigation();
    this.setupScrollEffects();
    this.initializeComponents();
  },

  /**
   * Setup navigation functionality
   */
  setupNavigation() {
    const nav = Utils.$('.nav');
    const navToggle = Utils.$('.nav__toggle');
    const navMenu = Utils.$('.nav__menu');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
      });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = Utils.$$('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu && navMenu.classList.contains('active')) {
        if (!nav.contains(e.target)) {
          navMenu.classList.remove('active');
          if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });
  },

  /**
   * Setup scroll effects
   */
  setupScrollEffects() {
    const nav = Utils.$('.nav');
    
    if (nav) {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      };
      
      window.addEventListener('scroll', Utils.debounce(handleScroll, 10));
      handleScroll(); // Initial check
    }
  },

  /**
   * Initialize all components
   */
  initializeComponents() {
    // Add any component initialization here
    this.setupSmoothScroll();
  },

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScroll() {
    const links = Utils.$$('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        const target = Utils.$(href);
        if (target) {
          e.preventDefault();
          const offsetTop = target.offsetTop - 80; // Account for fixed nav
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
