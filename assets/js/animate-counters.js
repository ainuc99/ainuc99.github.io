// General counter animation system
function animateCounter(element, options = {}) {
  const defaultOptions = {
    duration: 2000,
    easing: 'easeOutQuart',
    delay: 0,
    separator: true
  };
  
  const config = { ...defaultOptions, ...options };
  
  // Extract number and suffix from element content
  const originalText = element.textContent || element.getAttribute('data-target');
  const target = parseInt(originalText.replace(/[^\d]/g, ''));
  const prefix = originalText.split(/\d/)[0] || '';
  const suffix = originalText.replace(/[\d,]/g, '').replace(prefix, '') || '';
  
  if (isNaN(target)) return;
  
  // Easing functions
  const easingFunctions = {
    linear: t => t,
    easeOutQuart: t => 1 - Math.pow(1 - t, 4),
    easeOutCubic: t => 1 - Math.pow(1 - t, 3),
    easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
  };
  
  const easingFunction = easingFunctions[config.easing] || easingFunctions.easeOutQuart;
  
  // Start animation after delay
  setTimeout(() => {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / config.duration, 1);
      const easedProgress = easingFunction(progress);
      const current = Math.floor(target * easedProgress);
      
      // Format number with separator if enabled
      const formattedNumber = config.separator ? current.toLocaleString() : current.toString();
      element.textContent = prefix + formattedNumber + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        const finalNumber = config.separator ? target.toLocaleString() : target.toString();
        element.textContent = prefix + finalNumber + suffix;
        
        // Dispatch custom event when animation completes
        element.dispatchEvent(new CustomEvent('counterComplete', { 
          detail: { target, element } 
        }));
      }
    }
    
    // Set initial value
    element.textContent = prefix + '0' + suffix;
    requestAnimationFrame(updateCounter);
  }, config.delay);
}

// Auto-detect and animate counters when they become visible
function createCounterObserver() {
  // Select all elements with counter classes or data attributes
  const counters = document.querySelectorAll(`
    [data-counter],
    [data-count],
    .counter,
    .count,
    .number[data-target],
    .animate-number,
    .count-up
  `);
  
  if (counters.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        // Get options from data attributes
        const options = {
          duration: parseInt(element.dataset.duration) || 2000,
          easing: element.dataset.easing || 'easeOutQuart',
          delay: parseInt(element.dataset.delay) || 0,
          separator: element.dataset.separator !== 'false'
        };
        
        // Animate the counter
        animateCounter(element, options);
        
        // Stop observing this element
        observer.unobserve(element);
      }
    });
  }, {
    threshold: parseFloat(document.documentElement.dataset.counterThreshold) || 0.3,
    rootMargin: document.documentElement.dataset.counterMargin || '0px 0px -50px 0px'
  });
  
  // Observe all counter elements
  counters.forEach(counter => observer.observe(counter));
}

// Manual function to animate specific selectors
function animateCounters(selector = '[data-counter], .counter, .count', options = {}) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    const elementOptions = {
      ...options,
      delay: (options.delay || 0) + (options.stagger || 0) * index
    };
    
    animateCounter(element, elementOptions);
  });
}

// Initialize when DOM is ready
function initCounterSystem() {
  // Auto-detect mode (default)
  if (document.documentElement.dataset.counterMode !== 'manual') {
    createCounterObserver();
  }
  
  // Expose global functions
  window.animateCounter = animateCounter;
  window.animateCounters = animateCounters;
}

// Multiple initialization methods
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCounterSystem);
} else {
  initCounterSystem();
}

// Also expose for manual calling
window.initCounterSystem = initCounterSystem;