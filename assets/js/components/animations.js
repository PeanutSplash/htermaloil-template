// Animations Component for Heat Transfer Oil Solutions

// Animation state
let isScrolling = false;
let observerInitialized = false;

// Intersection Observer for scroll animations
let intersectionObserver = null;

// Check if element is in viewport
function isElementInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    return (
        rect.top <= windowHeight * (1 - threshold) &&
        rect.bottom >= windowHeight * threshold
    );
}

// Handle scroll animations using Intersection Observer
function initializeIntersectionObserver() {
    if (observerInitialized || !window.IntersectionObserver) {
        return;
    }
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -15% 0px', // Trigger when 85% visible
        threshold: 0.1
    };
    
    intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                // Stop observing this element once it's animated
                intersectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all fade-in sections
    const fadeInSections = document.querySelectorAll('.section-fade-in');
    fadeInSections.forEach(section => {
        intersectionObserver.observe(section);
    });
    
    observerInitialized = true;
    console.log('Intersection Observer initialized for', fadeInSections.length, 'sections');
}

// Fallback scroll animation for older browsers
function handleScrollAnimations() {
    const sections = document.querySelectorAll('.section-fade-in:not(.section-visible)');
    
    sections.forEach(section => {
        if (isElementInViewport(section, 0.15)) {
            section.classList.add('section-visible');
        }
    });
}

// Throttled scroll handler for performance
function initializeScrollAnimations() {
    // Try to use Intersection Observer first
    if (window.IntersectionObserver) {
        initializeIntersectionObserver();
    } else {
        // Fallback to scroll event for older browsers
        console.log('Using fallback scroll animations');
        
        // Initial check
        handleScrollAnimations();
        
        // Throttled scroll handler
        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                window.requestAnimationFrame(function() {
                    handleScrollAnimations();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
    }
}

// Initialize hover animations for cards
function initializeHoverAnimations() {
    const animatedCards = document.querySelectorAll('.comparison-card, .case-card, .client-logo');
    
    animatedCards.forEach(card => {
        // Add smooth transition if not already present
        if (!card.style.transition) {
            card.style.transition = 'all 0.3s ease';
        }
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

// Initialize button animations
function initializeButtonAnimations() {
    const animatedButtons = document.querySelectorAll('.bg-accent, .bg-gradient-accent, .bg-gradient-primary');
    
    animatedButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Add click animation
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.05)';
        });
    });
}

// Initialize loading animations
function initializeLoadingAnimations() {
    // Add loading class to body initially
    document.body.classList.add('loading');
    
    // Remove loading class when page is fully loaded
    window.addEventListener('load', function() {
        document.body.classList.remove('loading');
        
        // Trigger initial animations
        setTimeout(() => {
            const firstSection = document.querySelector('.section-fade-in');
            if (firstSection && !firstSection.classList.contains('section-visible')) {
                firstSection.classList.add('section-visible');
            }
        }, 100);
    });
}

// Initialize table scroll indicators
function initializeTableScrollIndicators() {
    const tableContainers = document.querySelectorAll('.table-responsive');
    
    tableContainers.forEach(container => {
        const table = container.querySelector('table');
        const indicator = container.querySelector('.scroll-indicator');
        
        if (table && indicator) {
            // Check if table needs scrolling
            function checkScrollNeed() {
                const needsScroll = table.scrollWidth > container.clientWidth;
                indicator.style.display = needsScroll ? 'flex' : 'none';
            }
            
            // Initial check
            checkScrollNeed();
            
            // Check on resize
            window.addEventListener('resize', checkScrollNeed);
            
            // Hide indicator when scrolled
            container.addEventListener('scroll', function() {
                const scrollPercentage = this.scrollLeft / (this.scrollWidth - this.clientWidth);
                indicator.style.opacity = Math.max(0, 1 - scrollPercentage * 2);
            });
        }
    });
}

// Initialize performance optimizations
function initializePerformanceOptimizations() {
    // Add content-visibility to sections for better performance
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (CSS.supports('content-visibility', 'auto')) {
            section.style.contentVisibility = 'auto';
        }
    });
    
    // Lazy load images if not already handled
    const images = document.querySelectorAll('img[loading="lazy"]');
    if (images.length > 0 && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Handle reduced motion preferences
function handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function updateAnimations(mediaQuery) {
        if (mediaQuery.matches) {
            // Disable animations for users who prefer reduced motion
            document.body.classList.add('reduce-motion');
            
            // Immediately show all sections
            const fadeInSections = document.querySelectorAll('.section-fade-in');
            fadeInSections.forEach(section => {
                section.classList.add('section-visible');
            });
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }
    
    // Initial check
    updateAnimations(prefersReducedMotion);
    
    // Listen for changes
    prefersReducedMotion.addEventListener('change', updateAnimations);
}

// Main animations initialization function
export function initializeAnimations() {
    try {
        handleReducedMotion();
        initializeLoadingAnimations();
        initializeScrollAnimations();
        initializeHoverAnimations();
        initializeButtonAnimations();
        initializeTableScrollIndicators();
        initializePerformanceOptimizations();
        
        console.log('Animations initialized successfully');
    } catch (error) {
        console.error('Error initializing animations:', error);
    }
}

// Cleanup function for when component is destroyed
export function cleanupAnimations() {
    if (intersectionObserver) {
        intersectionObserver.disconnect();
        intersectionObserver = null;
        observerInitialized = false;
    }
}

// Export utility functions for external use
export {
    isElementInViewport,
    handleScrollAnimations,
    initializeIntersectionObserver
};
