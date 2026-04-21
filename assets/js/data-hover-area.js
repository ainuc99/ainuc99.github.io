// Hover Grid Auto Setup with Edge Detection and Animation Div Creation

// Debug elements - DOM references for visual debugging
const debugInfo = document.getElementById('debugInfo');
const directionSpan = document.getElementById('direction');
const statusSpan = document.getElementById('status');

// Updates the debug information display
function updateDebug(direction, status) {
    if (directionSpan && statusSpan) {
        directionSpan.textContent = direction || '-';
        statusSpan.textContent = status || '-';
    }
}

// HoverGridSystem Class
class HoverGridSystem {
    constructor() {
        this.activeCards = new Map(); // Tracks active cards and animations
        this.init();
    }

    init() {
        document.querySelectorAll('[data-hover-area]').forEach(parentGrid => {
            const gridSelector = parentGrid.getAttribute('data-hover-area');
            const grid = document.querySelector(gridSelector);

            if (!grid) {
                console.warn(`Grid not found: ${gridSelector}`);
                return;
            }

            const config = this.extractConfig(parentGrid);
            this.setupGrid(grid, config);
        });
    }

    extractConfig(element) {
        return {
            hoverColor: element.getAttribute('data-hover-color') || 'rgba(0, 191, 255, 0.3)',
            targetSelector: element.getAttribute('data-target') || null,
            targetColor: element.getAttribute('data-target-color') || '#00BFFF',
            animationDuration: element.getAttribute('data-duration') || '0.6s',
            animationEasing: element.getAttribute('data-easing') || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        };
    }

    setupGrid(grid, config) {
        const cards = Array.from(grid.children);

        cards.forEach(card => {
            this.setupCard(card, config);
        });
    }

    setupCard(card, config) {
        if (getComputedStyle(card).position === 'static') {
            card.style.position = 'relative';
        }

        card.style.overflow = 'hidden';

        const overlay = document.createElement('div');
        overlay.className = 'anim-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${config.hoverColor};
            opacity: 0;
            z-index: 0;
            pointer-events: none;
        `;

        card.appendChild(overlay);

        // Ensure all content is above the overlay
        Array.from(card.children).forEach(child => {
            if (!child.classList.contains('anim-overlay')) {
                child.style.position = 'relative';
                child.style.zIndex = '1';
            }
        });

        if (config.targetSelector) {
            const targetElement = card.querySelector(config.targetSelector);
            if (targetElement) {
                targetElement.style.transition = `color ${config.animationDuration} ${config.animationEasing}`;
            }
        }

        card.addEventListener('mouseenter', (e) => this.handleMouseEnter(card, overlay, e, config));
        card.addEventListener('mouseleave', (e) => this.handleMouseLeave(card, overlay, e, config));
    }

    handleMouseEnter(card, overlay, event, config) {
        const direction = this.getDirection(card, event.clientX, event.clientY);
        updateDebug(direction, 'ENTER');

        this.cancelAnimation(card);

        if (config.targetSelector) {
            const targetElement = card.querySelector(config.targetSelector);
            if (targetElement) {
                targetElement.style.color = config.targetColor;
            }
        }

        this.animateEntry(overlay, direction, config);

        this.activeCards.set(card, {
            overlay: overlay,
            direction: direction,
            isActive: true,
            config: config
        });
    }

    handleMouseLeave(card, overlay, event, config) {
        const direction = this.getDirection(card, event.clientX, event.clientY);
        updateDebug(direction, 'LEAVE');

        if (config.targetSelector) {
            const targetElement = card.querySelector(config.targetSelector);
            if (targetElement) {
                targetElement.style.color = '';
            }
        }

        this.animateExit(overlay, direction, config);

        const duration = parseFloat(config.animationDuration) * 1000;
        setTimeout(() => {
            this.activeCards.delete(card);
        }, duration + 100);
    }

    getDirection(element, mouseX, mouseY) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
        const degree = angle * (180 / Math.PI);

        if (degree >= -45 && degree < 45) {
            return 'right';
        } else if (degree >= 45 && degree < 135) {
            return 'bottom';
        } else if (degree >= 135 || degree < -135) {
            return 'left';
        } else {
            return 'top';
        }
    }

    animateEntry(overlay, direction, config) {
        overlay.style.transition = 'none';
        overlay.style.opacity = '1';
        overlay.style.transform = this.getInitialSlideTransform(direction);

        overlay.offsetHeight;

        overlay.style.transition = `transform ${config.animationDuration} ${config.animationEasing}`;
        overlay.style.transform = 'translate(0, 0)';
    }

    animateExit(overlay, direction, config) {
        const exitEasing = 'cubic-bezier(0.55, 0.085, 0.68, 0.53)';
        overlay.style.transition = `transform ${config.animationDuration} ${exitEasing}`;
        overlay.style.transform = this.getExitSlideTransform(direction);

        const duration = parseFloat(config.animationDuration) * 1000;
        setTimeout(() => {
            overlay.style.opacity = '0';
            overlay.style.transition = 'none';
        }, duration);
    }

    getInitialSlideTransform(direction) {
        switch(direction) {
            case 'top':
                return 'translateY(-100%)';
            case 'right':
                return 'translateX(100%)';
            case 'bottom':
                return 'translateY(100%)';
            case 'left':
                return 'translateX(-100%)';
            default:
                return 'translateY(-100%)';
        }
    }

    getExitSlideTransform(direction) {
        switch(direction) {
            case 'top':
                return 'translateY(-100%)';
            case 'right':
                return 'translateX(100%)';
            case 'bottom':
                return 'translateY(100%)';
            case 'left':
                return 'translateX(-100%)';
            default:
                return 'translateY(-100%)';
        }
    }

    cancelAnimation(card) {
        const cardData = this.activeCards.get(card);
        if (cardData && cardData.overlay) {
            cardData.overlay.style.transition = 'none';
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HoverGridSystem();
    });
} else {
    new HoverGridSystem();
}

if (debugInfo) {
    setTimeout(() => {
        debugInfo.style.opacity = '0.3';
        debugInfo.style.transition = 'opacity 0.5s ease';
    }, 5000);
}
