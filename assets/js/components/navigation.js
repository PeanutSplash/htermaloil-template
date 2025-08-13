// Navigation Component for Heat Transfer Oil Solutions

// Navigation state
let isMenuOpen = false;

// Mobile menu toggle functionality
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.getElementById('menuToggle');
    
    if (mobileMenu && menuToggle) {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            document.body.classList.add('mobile-menu-open');
            menuToggle.setAttribute('aria-expanded', 'true');
        } else {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('mobile-menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }
}

// Close mobile menu
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.getElementById('menuToggle');
    
    if (mobileMenu && menuToggle) {
        isMenuOpen = false;
        mobileMenu.classList.add('hidden');
        document.body.classList.remove('mobile-menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}

// Smooth scroll to section
function smoothScrollToSection(targetId) {
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        // Close mobile menu first
        closeMobileMenu();
        
        // Smooth scroll to target
        window.scrollTo({
            top: targetElement.offsetTop - 80, // Account for fixed navbar
            behavior: 'smooth'
        });
    }
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('py-2', 'shadow-lg');
            navbar.classList.remove('py-3', 'shadow-md');
        } else {
            navbar.classList.add('py-3', 'shadow-md');
            navbar.classList.remove('py-2', 'shadow-lg');
        }
    }
}

// Initialize smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollToSection(targetId);
        });
    });
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const navbar = document.querySelector('nav');
        const languageSwitcher = document.querySelector('.language-switcher');
        
        if (isMenuOpen && 
            !navbar.contains(e.target) && 
            !languageSwitcher.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Throttled scroll handler for performance
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                handleNavbarScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
}

// Main navigation initialization function
export function initializeNavigation() {
    try {
        initializeMobileMenu();
        initializeSmoothScrolling();
        initializeScrollEffects();
        
        console.log('Navigation initialized successfully');
    } catch (error) {
        console.error('Error initializing navigation:', error);
    }
}

// Export utility functions for external use
export {
    toggleMobileMenu,
    closeMobileMenu,
    smoothScrollToSection
};
