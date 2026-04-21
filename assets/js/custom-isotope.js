/**
 * CustomIsotope - Custom implementation of filtering and layout
 * Replaces Isotope.js functionality - FIXED VERSION
 */
class CustomIsotope {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.options = {
            itemSelector: '.portfolio-item',
            layoutMode: 'masonry',
            columnWidth: null,
            gutter: 20,
            transitionDuration: 600,
            hiddenStyle: { opacity: 0, transform: 'scale(0.8)' },
            visibleStyle: { opacity: 1, transform: 'scale(1)' },
            ...options
        };
        
        this.items = [];
        this.filteredItems = [];
        this.currentFilter = '*';
        this.isLayoutComplete = false;
        
        this.init();
    }
    
    // Initialize the isotope instance
    init() {
        if (!this.container) {
            console.error('❌ Container not found');
            return;
        }
        
        // Get all items
        this.items = Array.from(this.container.querySelectorAll(this.options.itemSelector));
        this.filteredItems = [...this.items];
        
        // Setup initial styles
        this.setupContainer();
        this.setupItems();
        
        // Execute initial layout
        setTimeout(() => {
            this.layout();
        }, 100);
        
        // Listen for window resize
        this.setupResizeListener();
    }
    
    // Setup container styles
    setupContainer() {
        const container = this.container;
        container.style.position = 'relative';
        container.style.transition = `height ${this.options.transitionDuration}ms ease`;
    }
    
    // Setup individual item styles
    setupItems() {
        this.items.forEach((item, index) => {
            item.style.position = 'absolute';
            item.style.transition = `all ${this.options.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            item.style.left = '0';
            item.style.top = '0';
            
            // Apply default visible styles
            Object.assign(item.style, {
                opacity: this.options.visibleStyle.opacity,
                transform: this.options.visibleStyle.transform
            });
        });
    }
    
    // Setup window resize listener
    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.layout();
            }, 250);
        });
    }
    
    /**
     * Filter items by category
     */
    arrange(options = {}) {
        const filter = options.filter || '*';
        this.currentFilter = filter;
        
        // Filter items
        if (filter === '*') {
            this.filteredItems = [...this.items];
        } else {
            const filterClass = filter.replace('.', '');
            this.filteredItems = this.items.filter(item => 
                item.classList.contains(filterClass)
            );
        }
        
        // Animate hidden items out
        this.hideItems();
        
        // Layout after hide animation
        setTimeout(() => {
            this.layout();
            this.showItems();
        }, this.options.transitionDuration / 2);
    }
    
    // Hide items that don't match filter
    hideItems() {
        this.items.forEach(item => {
            if (!this.filteredItems.includes(item)) {
                Object.assign(item.style, {
                    opacity: this.options.hiddenStyle.opacity,
                    transform: this.options.hiddenStyle.transform,
                    pointerEvents: 'none'
                });
            }
        });
    }
    
    // Show filtered items with staggered animation
    showItems() {
        this.filteredItems.forEach((item, index) => {
            setTimeout(() => {
                Object.assign(item.style, {
                    opacity: this.options.visibleStyle.opacity,
                    transform: this.options.visibleStyle.transform,
                    pointerEvents: 'auto'
                });
            }, index * 50); // Staggered animation
        });
    }
    
    /**
     * Calculate and apply layout - FIXED VERSION
     */
    layout() {
        if (this.filteredItems.length === 0) {
            this.container.style.height = '0px';
            return;
        }
        
        const containerWidth = this.container.offsetWidth;
        
        // Calculate columns based on container width and item width
        const itemWidth = this.getItemWidth();
        const columns = Math.max(1, Math.floor((containerWidth + this.options.gutter) / (itemWidth + this.options.gutter)));
        const actualItemWidth = Math.floor((containerWidth - (columns - 1) * this.options.gutter) / columns);
        
        // Arrays to track each column height
        const columnHeights = new Array(columns).fill(0);
        
        // Process each filtered item
        this.filteredItems.forEach((item, index) => {
            // Set width first
            item.style.width = `${actualItemWidth}px`;
            
            // Force reflow to get accurate height
            item.offsetHeight;
            
            // Find shortest column
            const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
            
            // Calculate position
            const x = shortestColumnIndex * (actualItemWidth + this.options.gutter);
            const y = columnHeights[shortestColumnIndex];
            
            // Apply position
            item.style.left = `${x}px`;
            item.style.top = `${y}px`;
            
            // Get item height and update column height
            const itemHeight = item.offsetHeight;
            columnHeights[shortestColumnIndex] += itemHeight + this.options.gutter;
        });
        
        // Update container height
        const maxHeight = Math.max(...columnHeights) - this.options.gutter;
        this.container.style.height = `${maxHeight}px`;
        
        this.isLayoutComplete = true;
    }
    
    // Get item width for calculations
    getItemWidth() {
        if (this.options.columnWidth) {
            return this.options.columnWidth;
        }
        
        // Use first item width as reference, but make it responsive
        const containerWidth = this.container.offsetWidth;
        
        // Responsive breakpoints
        if (containerWidth <= 640) { // sm (mobile)
            return containerWidth; // 1 column
        } else if (containerWidth <= 768) { // md (tablet)
            return Math.floor((containerWidth - this.options.gutter) / 2); // 2 columns
        } else { // lg and xl (desktop) - ALWAYS 3 COLUMNS
            return Math.floor((containerWidth - 2 * this.options.gutter) / 3); // 3 columns
        }
    }
    
    /**
     * Reload items and layout
     */
    reloadItems() {
        this.items = Array.from(this.container.querySelectorAll(this.options.itemSelector));
        this.setupItems();
        this.arrange({ filter: this.currentFilter });
    }
    
    /**
     * Destroy instance
     */
    destroy() {
        this.items.forEach(item => {
            item.style.position = '';
            item.style.left = '';
            item.style.top = '';
            item.style.width = '';
            item.style.transition = '';
            item.style.opacity = '';
            item.style.transform = '';
            item.style.pointerEvents = '';
        });
        
        this.container.style.height = '';
        this.container.style.position = '';
        this.container.style.transition = '';
    }
    
    /**
     * Get currently filtered items
     */
    getFilteredItems() {
        return [...this.filteredItems];
    }
    
    /**
     * Get current filter
     */
    getCurrentFilter() {
        return this.currentFilter;
    }
}

/**
 * Setup filter buttons
 */
function setupFilterButtons(isotope, filterButtons) {
    filterButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            isotope.arrange({ filter: filterValue });
            
            // Refresh AOS after filtering
            setTimeout(() => {
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 700);
        });
    });
}

/**
 * Wait for images to load
 */
function waitForImages(container) {
    return new Promise((resolve, reject) => {
        const images = container.querySelectorAll('img');
        
        if (images.length === 0) {
            resolve();
            return;
        }
        
        let loadedCount = 0;
        let hasError = false;
        
        const checkComplete = () => {
            loadedCount++;
            if (loadedCount === images.length) {
                if (hasError) {
                    reject(new Error('Some images failed to load'));
                } else {
                    resolve();
                }
            }
        };
        
        images.forEach(img => {
            if (img.complete) {
                checkComplete();
            } else {
                img.addEventListener('load', checkComplete);
                img.addEventListener('error', () => {
                    hasError = true;
                    checkComplete();
                });
            }
        });
        
        // Safety timeout
        setTimeout(() => {
            if (loadedCount < images.length) {
                resolve();
            }
        }, 5000);
    });
}

// Updated global utilities
window.PortfolioUtils = {
    refresh: function() {
        if (window.customIsotope) {
            window.customIsotope.layout();
        }
    },
    
    filter: function(category) {
        if (window.customIsotope) {
            window.customIsotope.arrange({ filter: category });
            
            // Update active button
            const filterBtn = document.querySelector(`[data-filter="${category}"]`);
            if (filterBtn) {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                filterBtn.classList.add('active');
            }
        }
    },
    
    getCurrentFilter: function() {
        return window.customIsotope ? window.customIsotope.getCurrentFilter() : '*';
    },
    
    getFilteredItems: function() {
        return window.customIsotope ? window.customIsotope.getFilteredItems() : [];
    },
    
    reload: function() {
        if (window.customIsotope) {
            window.customIsotope.reloadItems();
        }
    },
    
    destroy: function() {
        if (window.customIsotope) {
            window.customIsotope.destroy();
            window.customIsotope = null;
            window.portfolioIsotope = null;
        }
    },
    
    reinitialize: function() {
        this.destroy();
        setTimeout(() => {
            initPortfolioIsotope();
        }, 100);
    }
};