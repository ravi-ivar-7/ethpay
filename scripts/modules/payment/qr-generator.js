/**
 * QR Code Generator
 * Generate QR codes for payment links using direct image URL
 */

const QRGenerator = {
  /**
   * Generate QR code using API.qrserver.com (no CORS issues)
   */
  async generate(text, size = 200) {
    try {
      // Use QR Server API - free and no CORS
      const encodedText = encodeURIComponent(text);
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;
      
      // Return the URL directly - browser will load it
      return apiUrl;
    } catch (error) {
      console.error('QR generation failed:', error);
      return this.generateFallback(text, size);
    }
  },

  /**
   * Fallback: Generate simple QR-like pattern
   */
  generateFallback(text, size = 200) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Create pattern based on text
    ctx.fillStyle = '#000000';
    const moduleSize = size / 25;
    
    const hash = this.simpleHash(text);
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if ((hash + i * j) % 3 === 0) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Add corner markers
    this.drawCornerMarker(ctx, 0, 0, moduleSize * 7);
    this.drawCornerMarker(ctx, size - moduleSize * 7, 0, moduleSize * 7);
    this.drawCornerMarker(ctx, 0, size - moduleSize * 7, moduleSize * 7);

    return canvas.toDataURL('image/png');
  },

  /**
   * Draw QR corner marker
   */
  drawCornerMarker(ctx, x, y, size) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + size * 0.14, y + size * 0.14, size * 0.72, size * 0.72);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + size * 0.28, y + size * 0.28, size * 0.44, size * 0.44);
  },

  /**
   * Simple hash function for pattern generation
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  },

  /**
   * Render QR code to element
   */
  async renderToElement(element, text, size = 200) {
    const dataUrl = await this.generate(text, size);
    
    if (element.tagName === 'IMG') {
      element.src = dataUrl;
      element.alt = 'QR Code';
    } else {
      const img = document.createElement('img');
      img.src = dataUrl;
      img.alt = 'QR Code';
      img.style.width = '100%';
      img.style.height = 'auto';
      element.innerHTML = '';
      element.appendChild(img);
    }
  }
};
