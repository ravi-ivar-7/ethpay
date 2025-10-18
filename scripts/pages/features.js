/**
 * Features Page Script
 */

(function() {
  'use strict';

  // Initialize wallet
  Wallet.init();

  // Setup wallet connect button on features page
  const connectWalletFeature = Utils.$('#connectWalletFeature');
  if (connectWalletFeature) {
    connectWalletFeature.addEventListener('click', () => {
      if (Wallet.connected) {
        Wallet.disconnect();
      } else {
        Wallet.connect();
      }
    });
    
    // Update button text based on wallet state
    const updateButton = () => {
      if (Wallet.connected && Wallet.address) {
        connectWalletFeature.textContent = Utils.shortenAddress(Wallet.address);
        connectWalletFeature.classList.add('connected');
      } else {
        connectWalletFeature.textContent = 'Connect Wallet';
        connectWalletFeature.classList.remove('connected');
      }
    };
    
    updateButton();
    
    // Listen for wallet changes
    setInterval(updateButton, 1000);
  }

  // Add scroll animations to feature details
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const featureDetails = Utils.$$('.feature-detail');
  featureDetails.forEach(detail => observer.observe(detail));

})();
