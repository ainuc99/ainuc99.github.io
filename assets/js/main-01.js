// Initialize particles.js
if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
    particlesJS('particles-js', particlesConfig);
}

// Load SVG icon sprites
(function loadIconSprite() {
    const script = document.createElement('script');
    script.src = 'assets/data/icons-sprite.js';
    script.async = false; 
    document.head.appendChild(script);
})();

// Initialize all components when DOM loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load services data for Typed.js
        if (typeof Typed !== 'undefined' && document.getElementById('typed-element')) {
            try {
                // Initialize Typed.js
                const typed = new Typed('#typed-element', {
                    strings: servicesData.services,
                    typeSpeed: servicesData.typewriterConfig.typeSpeed,
                    backSpeed: servicesData.typewriterConfig.deleteSpeed,
                    startDelay: 1500,
                    backDelay: servicesData.typewriterConfig.deleteDelay,
                    loop: servicesData.typewriterConfig.loop,
                    showCursor: servicesData.typewriterConfig.showCursor,
                    cursorChar: servicesData.typewriterConfig.cursorChar,
                    autoInsertCss: true,
                });

                window.serviceTyped = typed;
            } catch (error) {
                // Fallback with default strings
                const typed = new Typed('#typed-element', {
                    strings: ['Web Development', 'Digital Marketing', 'SEO Optimization'],
                    typeSpeed: 50,
                    backSpeed: 30,
                    backDelay: 1500,
                    loop: true,
                    showCursor: true,
                    cursorChar: '|'
                });
                window.serviceTyped = typed;
            }
        }

        // Initialize Portfolio
        initPortfolioIsotope();

        // Refresh AOS
        setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 100);
        
    } catch (error) {
        // Initialize AOS as fallback
        try {
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    delay: 100,
                    once: false,
                    mirror: true,
                    offset: 50,
                    easing: 'ease-out-cubic'
                });
            }
        } catch (aosError) {
            // Silent fail
        }
    }
});

/**
 * Enhanced portfolio initialization function
 */
function initPortfolioIsotope() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!portfolioGrid) {
        return;
    }
    
    if (filterButtons.length === 0) {
        console.warn('⚠️ No filter buttons found');
        return;
    }
    
    // Wait for images to load
    waitForImages(portfolioGrid).then(() => {
        
        // Create CustomIsotope instance
        const customIsotope = new CustomIsotope(portfolioGrid, {
            itemSelector: '.portfolio-item',
            gutter: 24, // Match your CSS gap
            transitionDuration: 500,
            hiddenStyle: { 
                opacity: 0, 
                transform: 'scale(0.9) translateY(20px)' 
            },
            visibleStyle: { 
                opacity: 1, 
                transform: 'scale(1) translateY(0px)' 
            }
        });
        
        // Store instance globally
        window.portfolioIsotope = customIsotope;
        window.customIsotope = customIsotope; // Additional alias
        
        // Setup filter buttons
        setupFilterButtons(customIsotope, filterButtons);
        
        // Refresh AOS after initial layout
        setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 1000);
        
    }).catch(error => {
        console.error('❌ Error loading images:', error);
        // Initialize anyway after timeout
        setTimeout(() => {
            const customIsotope = new CustomIsotope(portfolioGrid);
            window.portfolioIsotope = customIsotope;
            setupFilterButtons(customIsotope, filterButtons);
        }, 1000);
    });
}

// Typed.js control functions
function pauseTyping() {
    if (window.serviceTyped) {
        window.serviceTyped.stop();
    }
}

function resumeTyping() {
    if (window.serviceTyped) {
        window.serviceTyped.start();
    }
}

function resetTyping() {
    if (window.serviceTyped) {
        window.serviceTyped.reset();
    }
}

// AOS control functions
function refreshAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

function disableAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({ disable: true });
    }
}

function enableAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            delay: 100,
            once: false,
            mirror: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
    }
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        pauseTyping();
    } else {
        resumeTyping();
        refreshAOS();
    }
});

// Expose utility functions globally
window.AOSUtils = {
    refresh: refreshAOS,
    disable: disableAOS,
    enable: enableAOS
};

window.TypingUtils = {
    pause: pauseTyping,
    resume: resumeTyping,
    reset: resetTyping
};

// ==========================================================================
// RESPONSIVE HEADER
// ==========================================================================

function initResponsiveHeader() {
    const header = document.querySelector('.header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbar = document.getElementById('navbar');
    const body = document.body;
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    if (!header || !mobileMenuToggle || !navbar) return;

    // Funciones del menú móvil
    function openMobileMenu() {
        navbar.classList.add('mobile-menu-open');
        mobileMenuToggle.classList.add('active');
        body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        navbar.classList.remove('mobile-menu-open');
        mobileMenuToggle.classList.remove('active');
        body.style.overflow = '';
        closeAllDropdowns();
    }

    function toggleMobileMenu() {
        if (navbar.classList.contains('mobile-menu-open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Event listeners del menú móvil
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });

    document.addEventListener('click', function(e) {
        const isClickInsideMenu = navbar.contains(e.target);
        const isClickOnToggle = mobileMenuToggle.contains(e.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && navbar.classList.contains('mobile-menu-open')) {
            closeMobileMenu();
        }
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                closeMobileMenu();
            }
        });
    });

    function closeAllDropdowns() {
        dropdownMenus.forEach(menu => {
            menu.classList.remove('dropdown-open');
        });
        dropdownToggles.forEach(toggle => {
            toggle.classList.remove('active');
        });
    }

    function toggleDropdown(dropdownId, toggleElement) {
        const dropdownMenu = document.getElementById(dropdownId);
        
        if (!dropdownMenu) return;

        const isOpen = dropdownMenu.classList.contains('dropdown-open');
        closeAllDropdowns();
        
        if (!isOpen) {
            dropdownMenu.classList.add('dropdown-open');
            toggleElement.classList.add('active');
        }
    }

    // Event listeners de dropdown
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdownId = this.getAttribute('data-dropdown');
            toggleDropdown(dropdownId, this);
        });
    });

    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            const isClickInsideDropdown = Array.from(dropdownMenus).some(menu => 
                menu.contains(e.target)
            );
            const isClickOnToggle = Array.from(dropdownToggles).some(toggle => 
                toggle.contains(e.target)
            );
            
            if (!isClickInsideDropdown && !isClickOnToggle) {
                closeAllDropdowns();
            }
        }
    });

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                closeAllDropdowns();
                closeMobileMenu();
            }
        });
    });

    function handleHeaderScroll() {
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
            header.classList.remove('header-transparent');
        } else {
            header.classList.remove('header-scrolled');
            header.classList.add('header-transparent');
        }
    }

    if (window.scrollY > 100) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.add('header-transparent');
    }

    window.addEventListener('scroll', handleHeaderScroll);

    function handleWindowResize() {
        if (window.innerWidth > 992) {
            closeMobileMenu();
            closeAllDropdowns();
        }
    }

    window.addEventListener('resize', handleWindowResize);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (navbar.classList.contains('mobile-menu-open')) {
                closeMobileMenu();
            }
            closeAllDropdowns();
        }
    });
}
initResponsiveHeader();

// ==========================================================================
// CUSTOMERS CAROUSEL
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    if (typeof UniversalSlider !== 'undefined' && document.querySelector('.customers-carousel')) {
        const customersSlider = new UniversalSlider('.customers-carousel', {
            slidesPerView: {
                desktop: 5,
                tablet: 3,
                mobile: 2 
            },
            slideBy: 1,
            breakpoints: {
                mobile: 576,
                tablet: 992
            },
            autoplay: true,
            autoplayDelay: 3000,
            pagination: false,
            arrows: false,
            loop: true,
            touchEnabled: true,
        });
    }
});

// ==========================================================================
// NEWSLETTER FORM SUBMISSION
// ==========================================================================

const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const checkbox = this.querySelector('input[name="newsletter-agreement"]');
        
        if (checkbox && !checkbox.checked) {
            alert('Please agree to the Privacy Policy');
            return;
        }
        
        alert('Thank you for subscribing to our newsletter!');
        this.reset();
    });
}

// ==========================================================================
// SCROLL TO TOP FUNCTIONALITY
// ==========================================================================

const scrollToTop = document.getElementById('scrollToTop');
if (scrollToTop) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTop.classList.add('show');
        } else {
            scrollToTop.classList.remove('show');
        }
    });

    scrollToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth scrolling for footer links
document.querySelectorAll('.footer-link[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Page Loader Controller - MultiIT
 * Handles the loading screen until all resources are loaded
 */
class PageLoader {
    constructor() {
        this.loader = document.getElementById('page-loader');
        this.progressBar = document.querySelector('.progress-bar');
        this.isLoaded = false;
        this.minLoadTime = 1500; // Minimum loading time in ms
        this.maxLoadTime = 8000; // Maximum loading time in ms (fallback)
        this.startTime = Date.now();
        this.currentProgress = 0;
        this.loadingSteps = [];
        this.completedSteps = 0;
        
        // Only initialize if loader exists
        if (this.loader) {
            this.init();
        } else {
            console.warn('MultiIT Loader: #page-loader element not found');
        }
    }

    init() {
        try {
            // Add loading class to body
            document.body.classList.add('loading');
            
            // Start progress animation
            this.animateProgress();
            
            // Wait for page to load completely
            this.waitForPageLoad();
            
            // Safety timeout to prevent infinite loading
            this.setSafetyTimeout();
            
        } catch (error) {
            this.forceHide();
        }
    }

    waitForPageLoad() {
        const promises = [];
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            promises.push(new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
                this.loadingSteps.push('DOM Content Loaded');
            }));
        }
        
        // Wait for all resources (images, CSS, JS) to load
        if (document.readyState !== 'complete') {
            promises.push(new Promise(resolve => {
                window.addEventListener('load', resolve, { once: true });
                this.loadingSteps.push('Window Load');
            }));
        }
        
        // Wait for all images to load
        promises.push(this.waitForImages());
        this.loadingSteps.push('Images Loaded');
        
        // Wait for fonts to load (if using web fonts)
        if (document.fonts && document.fonts.ready) {
            promises.push(document.fonts.ready.catch(() => {
                console.warn('MultiIT Loader: Fonts failed to load');
            }));
            this.loadingSteps.push('Fonts Loaded');
        }

        // Wait for critical CSS to load
        promises.push(this.waitForCriticalAssets());
        this.loadingSteps.push('Critical Assets');
        
        // Execute when everything is loaded
        Promise.allSettled(promises).then((results) => {
            // Log any failed promises
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.warn(`MultiIT Loader: Step "${this.loadingSteps[index]}" failed:`, result.reason);
                }
            });
            
            this.isLoaded = true;
            this.checkMinimumLoadTime();
        });
    }

    waitForImages() {
        return new Promise(resolve => {
            const images = document.querySelectorAll('img[src], img[data-src]');
            
            if (images.length === 0) {
                resolve();
                return;
            }
            
            let loadedImages = 0;
            const totalImages = images.length;
            
            const imagePromises = Array.from(images).map((img, index) => {
                return new Promise(imageResolve => {
                    const handleImageLoad = () => {
                        loadedImages++;
                        // Update progress based on image loading
                        const imageProgress = (loadedImages / totalImages) * 30; // Images contribute 30% to progress
                        this.updateProgressStep(imageProgress);
                        imageResolve();
                    };

                    if (img.complete && img.naturalHeight !== 0) {
                        handleImageLoad();
                    } else {
                        img.addEventListener('load', handleImageLoad, { once: true });
                        img.addEventListener('error', () => {
                            console.warn(`MultiIT Loader: Image failed to load: ${img.src || img.dataset.src}`);
                            handleImageLoad(); // Continue even if image fails
                        }, { once: true });
                        
                        // Timeout fallback for stuck images
                        setTimeout(handleImageLoad, 3000);
                    }
                });
            });
            
            Promise.all(imagePromises).then(resolve);
        });
    }

    waitForCriticalAssets() {
        return new Promise(resolve => {
            // Check for critical CSS files
            const criticalStylesheets = document.querySelectorAll('link[rel="stylesheet"][href*="critical"], link[rel="stylesheet"][href*="main"]');
            
            if (criticalStylesheets.length === 0) {
                resolve();
                return;
            }

            let loadedSheets = 0;
            const totalSheets = criticalStylesheets.length;

            criticalStylesheets.forEach(sheet => {
                if (sheet.sheet) {
                    loadedSheets++;
                    if (loadedSheets === totalSheets) resolve();
                } else {
                    sheet.addEventListener('load', () => {
                        loadedSheets++;
                        if (loadedSheets === totalSheets) resolve();
                    }, { once: true });
                    
                    sheet.addEventListener('error', () => {
                        console.warn('MultiIT Loader: Critical stylesheet failed to load:', sheet.href);
                        loadedSheets++;
                        if (loadedSheets === totalSheets) resolve();
                    }, { once: true });
                }
            });

            // Timeout fallback
            setTimeout(resolve, 2000);
        });
    }

    setSafetyTimeout() {
        setTimeout(() => {
            if (!this.isLoaded) {
                this.isLoaded = true;
                this.checkMinimumLoadTime();
            }
        }, this.maxLoadTime);
    }

    checkMinimumLoadTime() {
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, this.minLoadTime - elapsed);
        
        // Complete progress bar
        this.setProgress(100);
        
        setTimeout(() => {
            this.hideLoader();
        }, remaining);
    }

    animateProgress() {
        const progressInterval = setInterval(() => {
            if (this.isLoaded) {
                this.setProgress(100);
                clearInterval(progressInterval);
                return;
            }
            
            // More realistic progress simulation
            const increment = Math.random() * 8 + 2; // 2-10% increments
            this.currentProgress = Math.min(this.currentProgress + increment, 85);
            this.setProgress(this.currentProgress);
            
            if (this.currentProgress >= 85) {
                clearInterval(progressInterval);
            }
        }, 300);
    }

    updateProgressStep(stepProgress) {
        // Update progress based on completed steps
        const baseProgress = (this.completedSteps / this.loadingSteps.length) * 70;
        this.currentProgress = Math.min(baseProgress + stepProgress, 90);
        this.setProgress(this.currentProgress);
    }

    setProgress(percentage) {
        if (this.progressBar) {
            // Smooth progress animation
            this.progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        }
    }

    hideLoader() {
        if (!this.loader) return;
        
        const loadTime = Date.now() - this.startTime;

        // Add loaded class for animation
        this.loader.classList.add('loaded');
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        
        // Remove loader from DOM after animation
        setTimeout(() => {
            if (this.loader && this.loader.parentNode) {
                this.loader.parentNode.removeChild(this.loader);
            }
        }, 800);
        
        // Trigger custom event for other scripts
        this.dispatchLoadedEvent(loadTime);
    }

    dispatchLoadedEvent(loadTime) {
        try {
            const event = new CustomEvent('pageLoaded', {
                detail: { 
                    loadTime,
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent,
                    connection: navigator.connection ? {
                        effectiveType: navigator.connection.effectiveType,
                        downlink: navigator.connection.downlink
                    } : null
                }
            });
            window.dispatchEvent(event);
        } catch (error) {
            console.warn('MultiIT Loader: Failed to dispatch pageLoaded event', error);
        }
    }

    // Public method to force hide loader
    forceHide() {
        this.isLoaded = true;
        this.hideLoader();
    }

    // Public method to show loader (for dynamic content loading)
    show() {
        if (this.loader) {
            this.loader.classList.remove('loaded');
            document.body.classList.add('loading');
            document.body.classList.remove('loaded');
            this.currentProgress = 0;
            this.setProgress(0);
        }
    }

    // Public method to update progress manually
    updateProgress(percentage) {
        this.setProgress(percentage);
    }
}

/* ========================================
   INITIALIZATION
======================================== */

let pageLoader;

function initializePageLoader() {
    try {
        pageLoader = new PageLoader();
    } catch (error) {
        console.error('MultiIT Loader: Failed to initialize', error);
    }
}

// Start immediately if DOM is already ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePageLoader, { once: true });
} else {
    initializePageLoader();
}

/* ========================================
   GLOBAL LOADER API
======================================== */

// Enhanced global API
window.MultiITLoader = {
    hide: () => pageLoader?.forceHide(),
    show: () => pageLoader?.show(),
    setProgress: (percentage) => pageLoader?.updateProgress(percentage),
    isLoaded: () => pageLoader?.isLoaded || false,
    getInstance: () => pageLoader
};

/* ========================================
   EVENT LISTENERS
======================================== */

// Listen for page loaded event with enhanced logging
window.addEventListener('pageLoaded', (event) => {
    const { loadTime, connection } = event.detail;
    const connectionInfo = connection ? `(${connection.effectiveType}, ${connection.downlink}Mbps)` : '';
});

// ✅ Inicializar AOS cuando el loader termine
window.addEventListener('pageLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            delay: 100,
            once: false,
            mirror: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
    }
});

// Handle page visibility change (when user switches tabs)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && pageLoader) {
        // Page became visible again, ensure loader behavior is correct
        setTimeout(() => {
            if (pageLoader && document.readyState === 'complete') {
                pageLoader.forceHide();
            }
        }, 100);
    }
});

// Handle network connection changes (if supported)
if (navigator.connection) {
    navigator.connection.addEventListener('change', () => {
        if (pageLoader && !pageLoader.isLoaded) {
        }
    });
}

// Handle errors globally
window.addEventListener('error', (event) => {
    return;
});

// Performance timing
window.addEventListener('load', () => {
    if (window.performance) {
        try {
            // Método moderno con Navigation Timing API Level 2
            if (performance.getEntriesByType && performance.getEntriesByType('navigation').length > 0) {
                const navigationEntry = performance.getEntriesByType('navigation')[0];
            }
            // Fallback para navegadores que no soportan Navigation Timing Level 2
            else if (performance.timing) {
                // Solo usar si es absolutamente necesario para compatibilidad
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.fetchStart;
            }
        } catch (error) {
            console.warn('MultiIt Performance: Could not measure performance timing', error);
        }
    }
});

// --- THEME SWITCHER LOGIC ---
// Wait for the initial HTML document to be completely loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

    // Select the DOM elements
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // Function to update the visibility of the icons
    const updateIcons = (isDarkMode) => {
        if (isDarkMode) {
            // If dark mode is active, show the light mode icon (sun)
            themeToggleDarkIcon.classList.add('hidden');
            themeToggleLightIcon.classList.remove('hidden');
        } else {
            // Otherwise, show the dark mode icon (moon)
            themeToggleDarkIcon.classList.remove('hidden');
            themeToggleLightIcon.classList.add('hidden');
        }
    };

    // Checks for a saved theme, defaulting to light mode.
    const applyInitialTheme = () => {
        // The new logic: The theme is light by default, and dark ONLY if explicitly saved as 'dark'.
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            updateIcons(true);
        } else {
            // For all other cases (first visit or theme saved as 'light'), default to light mode.
            document.body.classList.remove('dark-mode');
            updateIcons(false);
        }
    };

    // Only add the event listener if the toggle button exists on the page
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Toggle the 'dark-mode' class on the body. 
            // .toggle() returns true if the class was added, false if removed.
            const isDarkMode = document.body.classList.toggle('dark-mode');

            // Save the user's preference to localStorage
            if (isDarkMode) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }

            // Update the button's icon to reflect the new state
            updateIcons(isDarkMode);
        });
    }

    applyInitialTheme();
});
