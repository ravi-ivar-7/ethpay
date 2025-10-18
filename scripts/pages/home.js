/**
 * Home Page Script
 * Initialize homepage functionality
 */

(function() {
  'use strict';

  // Initialize wallet
  Wallet.init();

  // Initialize BAT stats
  BATStats.init();

  // Rotating hero preview
  const heroPreview = document.querySelector('.payment-preview__body');
  if (heroPreview) {
    const previews = [
      {
        icon: '💳',
        title: 'Payment Link',
        amount: '5 BAT',
        link: 'ethpay.brave/pay/abc123'
      },
      {
        icon: '📊',
        title: 'Analytics Dashboard',
        amount: '125 BAT',
        link: 'Total received this month'
      },
      {
        icon: '💱',
        title: 'Currency Converter',
        amount: '10 BAT = $2.45',
        link: 'Live conversion rates'
      },
      {
        icon: '📤',
        title: 'Batch Payment',
        amount: '50 BAT',
        link: 'Send to 10 recipients'
      },
      {
        icon: '🧾',
        title: 'Receipt Generator',
        amount: '15 BAT',
        link: 'Professional receipt #1234'
      },
      {
        icon: '🦁',
        title: 'Brave Wallet',
        amount: '42.5 BAT',
        link: 'Connected: 0x1234...5678'
      }
    ];

    let currentIndex = 0;

    function rotatePreview() {
      const preview = previews[currentIndex];
      
      // Fade out
      heroPreview.style.opacity = '0';
      
      setTimeout(() => {
        heroPreview.innerHTML = `
          <div style="font-size: 64px; margin-bottom: 20px; filter: drop-shadow(0 4px 12px rgba(251, 84, 43, 0.2));">${preview.icon}</div>
          <div style="font-size: 12px; color: var(--color-gray-500); margin-bottom: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">${preview.title}</div>
          <div style="font-size: 36px; font-weight: 800; background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 16px;">${preview.amount}</div>
          <div style="font-size: 13px; color: var(--color-gray-600); padding: 8px 16px; background: linear-gradient(145deg, rgba(251, 84, 43, 0.05) 0%, rgba(102, 45, 145, 0.05) 100%); border-radius: 8px; border-left: 3px solid var(--color-primary);">${preview.link}</div>
        `;
        
        // Fade in
        setTimeout(() => {
          heroPreview.style.opacity = '1';
        }, 50);
      }, 400);
      
      currentIndex = (currentIndex + 1) % previews.length;
    }

    rotatePreview();
    setInterval(rotatePreview, 3000);
  }

  // Intersection Observer for scroll animations
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

  // Observe sections
  const sections = Utils.$$('.stats, .features, .cta');
  sections.forEach(section => observer.observe(section));

  // Connect wallet step button
  const connectWalletBtn = document.getElementById('connectWalletStep');
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (typeof Wallet !== 'undefined' && Wallet.connect) {
        if (!Wallet.connected) {
          await Wallet.connect();
        }
      } else {
        console.error('Wallet not loaded');
      }
      
      return false;
    });
  }

})();
