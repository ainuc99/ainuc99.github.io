// ==========================================================================
// UNIVERSAL SLIDER CLASS
// ==========================================================================

class UniversalSlider {
    constructor(selector, options = {}) {
        this.config = {
            slidesPerView: {
                desktop: 3,
                tablet: 2,
                mobile: 1
            },
            slideBy: 1, // How many slides to move at once
            breakpoints: {
                mobile: 576,
                tablet: 992
            },
            autoplay: true,
            autoplayDelay: 4000,
            pauseOnHover: true,
            pagination: true,
            arrows: false,
            transitionDuration: 500,
            touchEnabled: true,
            swipeThreshold: 50,
            loop: true,
            classes: {
                container: 'slider-container',
                slide: 'slider-slide',
                pagination: 'slider-pagination',
                paginationDot: 'pagination-dot',
                paginationActive: 'active',
                arrow: 'slider-arrow',
                arrowPrev: 'slider-arrow-prev',
                arrowNext: 'slider-arrow-next'
            },
            onInit: null,
            onSlideChange: null,
            onResize: null,
            ...options
        };
        
        this.slider = document.querySelector(selector);
        if (!this.slider) {
            console.warn(`Slider not found: ${selector}`);
            return;
        }
        
        this.container = null;
        this.slides = [];
        this.pagination = null;
        this.arrows = {};
        this.currentIndex = 0;
        this.slidesPerView = this.getSlidesPerView();
        this.totalSlides = 0;
        this.maxIndex = 0;
        this.autoplayInterval = null;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.setupSlider();
        this.calculateDimensions();
        if (this.config.pagination) this.createPagination();
        if (this.config.arrows) this.createArrows();
        this.bindEvents();
        this.updateSlider();
        if (this.config.autoplay) this.startAutoplay();
        if (this.config.onInit) this.config.onInit(this);
    }
    
    setupSlider() {
        this.container = this.slider.querySelector(`.${this.config.classes.container}`);
        
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = this.config.classes.container;
            
            const children = Array.from(this.slider.children);
            children.forEach(child => {
                if (!child.classList.contains(this.config.classes.pagination) && 
                    !child.classList.contains(this.config.classes.arrow)) {
                    child.classList.add(this.config.classes.slide);
                    this.container.appendChild(child);
                }
            });
            
            this.slider.appendChild(this.container);
        }
        
        this.slides = Array.from(this.container.children);
        this.totalSlides = this.slides.length;
        this.applyBaseStyles();
    }
    
    applyBaseStyles() {
        this.slider.style.position = 'relative';
        this.slider.style.overflow = 'hidden';
        this.container.style.display = 'flex';
        this.container.style.transition = `transform ${this.config.transitionDuration}ms ease-in-out`;
        this.container.style.width = '100%';
        
        this.slides.forEach(slide => {
            slide.style.flexShrink = '0';
            slide.style.userSelect = 'none';
        });
    }
    
    getSlidesPerView() {
        const width = window.innerWidth;
        if (width <= this.config.breakpoints.mobile) {
            return this.config.slidesPerView.mobile;
        } else if (width <= this.config.breakpoints.tablet) {
            return this.config.slidesPerView.tablet;
        } else {
            return this.config.slidesPerView.desktop;
        }
    }
    
    calculateDimensions() {
        this.slidesPerView = this.getSlidesPerView();
        // Calculate max index based on slideBy setting
        if (this.config.slideBy === 1) {
            // Move one slide at a time
            this.maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
        } else {
            // Move by groups (original behavior)
            this.maxIndex = Math.max(0, Math.ceil(this.totalSlides / this.slidesPerView) - 1);
        }
    }
    
    createPagination() {
        const existingPagination = this.slider.querySelector(`.${this.config.classes.pagination}`);
        if (existingPagination) existingPagination.remove();
        
        this.pagination = document.createElement('div');
        this.pagination.className = this.config.classes.pagination;
        
        // Create pagination based on slideBy setting
        let totalPages;
        if (this.config.slideBy === 1) {
            totalPages = this.maxIndex + 1;
        } else {
            totalPages = Math.ceil(this.totalSlides / this.slidesPerView);
        }
        
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = this.config.classes.paginationDot;
            dot.setAttribute('data-index', i);
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add(this.config.classes.paginationActive);
            this.pagination.appendChild(dot);
        }
        
        this.slider.appendChild(this.pagination);
    }
    
    createArrows() {
        this.arrows.prev = document.createElement('button');
        this.arrows.prev.className = `${this.config.classes.arrow} ${this.config.classes.arrowPrev}`;
        this.arrows.prev.innerHTML = '‹';
        this.arrows.prev.setAttribute('aria-label', 'Previous slide');
        
        this.arrows.next = document.createElement('button');
        this.arrows.next.className = `${this.config.classes.arrow} ${this.config.classes.arrowNext}`;
        this.arrows.next.innerHTML = '›';
        this.arrows.next.setAttribute('aria-label', 'Next slide');
        
        this.slider.appendChild(this.arrows.prev);
        this.slider.appendChild(this.arrows.next);
    }
    
    bindEvents() {
        if (this.pagination) {
            this.pagination.addEventListener('click', (e) => {
                if (e.target.classList.contains(this.config.classes.paginationDot)) {
                    const index = parseInt(e.target.dataset.index);
                    this.goToSlide(index);
                }
            });
        }
        
        if (this.arrows.prev) {
            this.arrows.prev.addEventListener('click', () => this.prevSlide());
        }
        if (this.arrows.next) {
            this.arrows.next.addEventListener('click', () => this.nextSlide());
        }
        
        window.addEventListener('resize', () => this.handleResize());
        
        if (this.config.touchEnabled) {
            this.addTouchSupport();
        }
        
        if (this.config.pauseOnHover && this.config.autoplay) {
            this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
            this.slider.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        this.slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.container.addEventListener('touchmove', (e) => {
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            if (diffX > diffY) {
                e.preventDefault();
            }
        });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, endX, startY, endY);
        });
    }
    
    handleSwipe(startX, endX, startY, endY) {
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.config.swipeThreshold) {
            if (diffX > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    handleResize() {
        const newSlidesPerView = this.getSlidesPerView();
        
        if (newSlidesPerView !== this.slidesPerView) {
            this.calculateDimensions();
            
            // Adjust index to valid range
            if (this.currentIndex > this.maxIndex) {
                this.currentIndex = this.maxIndex;
            }
            
            if (this.config.pagination) this.createPagination();
            this.updateSlider();
            
            if (this.config.onResize) this.config.onResize(this);
        }
    }
    
    updateSlider() {
        if (this.isTransitioning) return;
        
        const slideWidth = 100 / this.slidesPerView;
        let translateX;
        
        if (this.config.slideBy === 1) {
            // Move one slide at a time
            translateX = -(this.currentIndex * slideWidth);
        } else {
            // Move by groups (original behavior)
            translateX = -(this.currentIndex * 100);
        }
        
        this.slides.forEach(slide => {
            slide.style.flex = `0 0 ${slideWidth}%`;
            slide.style.maxWidth = `${slideWidth}%`;
        });
        
        this.container.style.transform = `translateX(${translateX}%)`;
        this.updateNavigation();
        
        if (this.config.onSlideChange) {
            this.config.onSlideChange(this.currentIndex, this);
        }
    }
    
    updateNavigation() {
        if (this.pagination) {
            const dots = this.pagination.querySelectorAll(`.${this.config.classes.paginationDot}`);
            dots.forEach((dot, index) => {
                dot.classList.toggle(this.config.classes.paginationActive, index === this.currentIndex);
            });
        }
        
        if (!this.config.loop && this.arrows.prev && this.arrows.next) {
            this.arrows.prev.disabled = this.currentIndex === 0;
            this.arrows.next.disabled = this.currentIndex === this.maxIndex;
        }
    }
    
    goToSlide(index, force = false) {
        if (this.isTransitioning && !force) return;
        
        if (this.config.loop) {
            if (index < 0) {
                this.currentIndex = this.maxIndex;
            } else if (index > this.maxIndex) {
                this.currentIndex = 0;
            } else {
                this.currentIndex = index;
            }
        } else {
            this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
        }
        
        this.updateSlider();
        this.restartAutoplay();
    }
    
    nextSlide() {
        this.goToSlide(this.currentIndex + 1);
    }
    
    prevSlide() {
        this.goToSlide(this.currentIndex - 1);
    }
    
    startAutoplay() {
        if (!this.config.autoplay) return;
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.config.autoplayDelay);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    restartAutoplay() {
        if (this.config.autoplay) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    }
    
    destroy() {
        this.stopAutoplay();
        if (this.pagination) this.pagination.remove();
        if (this.arrows.prev) this.arrows.prev.remove();
        if (this.arrows.next) this.arrows.next.remove();
    }
    
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.calculateDimensions();
        this.updateSlider();
    }
    
    getState() {
        return {
            currentIndex: this.currentIndex,
            totalSlides: this.totalSlides,
            slidesPerView: this.slidesPerView,
            maxIndex: this.maxIndex,
            isAutoplay: !!this.autoplayInterval
        };
    }
}

function createSlider(selector, options) {
    return new UniversalSlider(selector, options);
}

window.UniversalSlider = UniversalSlider;
window.createSlider = createSlider;