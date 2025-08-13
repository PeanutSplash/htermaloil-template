// Import translations
import { translatePage, getCurrentLanguage, setCurrentLanguage, initializeTranslations } from './translations.js';

(function() {
    'use strict';

    // ===========================================
    // LANGUAGE CHANGE HANDLER
    // ===========================================

    // Change language function
    function changeLanguage(language) {
        setCurrentLanguage(language);
        translatePage(language);
        updateLanguageSwitcher(language);

        // Close dropdown after selection
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
            dropdown.classList.remove('show');
            isDropdownOpen = false;
        }
    }

    // ===========================================
    // LANGUAGE SWITCHER MODULE
    // ===========================================
    
    let isDropdownOpen = false;
    const languageConfig = {
        'en': { flag: '🇺🇸', name: 'English' },
        'ru': { flag: '🇷🇺', name: 'Русский' },
        'zh': { flag: '🇨🇳', name: '中文' }
    };

    function updateLanguageSwitcher(language) {
        const button = document.getElementById('languageButton');
        const dropdown = document.getElementById('languageDropdown');

        if (!button || !dropdown) return;

        const config = languageConfig[language];
        if (config) {
            // Update button flag
            const flagSpan = button.querySelector('.flag');
            if (flagSpan) {
                flagSpan.textContent = config.flag;
            }
        }

        // Update active state in dropdown
        const options = dropdown.querySelectorAll('.language-option');
        options.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === language) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    function toggleLanguageDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        if (!dropdown) return;

        isDropdownOpen = !isDropdownOpen;

        if (isDropdownOpen) {
            dropdown.classList.remove('hidden');
            dropdown.classList.add('show');
        } else {
            dropdown.classList.add('hidden');
            dropdown.classList.remove('show');
        }
    }

    // ===========================================
    // FORM HANDLING MODULE
    // ===========================================
    
    function handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const message = formData.get('message');

        // Validation
        if (!name || !phone) {
            alert('Please enter your name and contact phone number');
            return;
        }

        // Create email content
        const subject = encodeURIComponent('Heat Transfer Oil System Inquiry');
        const body = encodeURIComponent(`
Name: ${name}
Phone: ${phone}
Email: ${email || 'Not provided'}
Message: ${message || 'No additional message'}

Please provide more information about your heat transfer oil system retrofit solution.
        `);

        // Open email client
        const mailtoLink = `mailto:info@example.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;

        // Show success message
        alert('Email client has been opened with pre-filled inquiry template. Please send the email to complete your inquiry!');
    }

    // ===========================================
    // SMOOTH SCROLLING MODULE
    // ===========================================
    
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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
    }

    // ===========================================
    // MOBILE MENU MODULE
    // ===========================================
    
    function initMobileMenu() {
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    // ===========================================
    // SCROLL ANIMATIONS MODULE
    // ===========================================
    
    let intersectionObserver;

    function initScrollAnimations() {
        const sections = document.querySelectorAll('section');
        
        if (window.IntersectionObserver) {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -15% 0px',
                threshold: 0.1
            };

            intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('section-visible');
                    }
                });
            }, observerOptions);

            sections.forEach(section => {
                intersectionObserver.observe(section);
            });
        } else {
            // Fallback for older browsers
            sections.forEach(section => {
                section.classList.add('section-visible');
            });
        }
    }

    // ===========================================
    // INITIALIZATION MODULE
    // ===========================================
    
    async function initializeApp() {
        console.log('Initializing Heat Transfer Oil App...');

        // Initialize translations first
        const initialLanguage = await initializeTranslations();
        
        // Initialize all modules
        initSmoothScrolling();
        initMobileMenu();
        initScrollAnimations();
        
        // Set up event listeners
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }

        const languageButton = document.getElementById('languageButton');
        if (languageButton) {
            languageButton.addEventListener('click', toggleLanguageDropdown);
        }

        // Add click events to language options
        const languageOptions = document.querySelectorAll('.language-option');
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                if (lang) {
                    changeLanguage(lang);
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const languageButton = document.getElementById('languageButton');
            const dropdown = document.getElementById('languageDropdown');
            const target = event.target;

            if (languageButton && dropdown && target instanceof Node &&
                !languageButton.contains(target) && !dropdown.contains(target)) {
                dropdown.classList.add('hidden');
                dropdown.classList.remove('show');
                isDropdownOpen = false;
            }
        });

        // Update language switcher with initial language
        updateLanguageSwitcher(initialLanguage);
        
        console.log('Heat Transfer Oil App initialized successfully');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

    // Expose public API
    if (typeof window !== 'undefined') {
        window['HeatTransferOilApp'] = {
            version: '1.0.0',
            initialized: true,
            changeLanguage: changeLanguage,
            translatePage: translatePage
        };
    }

})();
