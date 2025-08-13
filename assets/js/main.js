// Import translations
import { translations } from './translations.js';

(function() {
    'use strict';

    // ===========================================
    // TRANSLATIONS MODULE
    // ===========================================

    // Current language state
    let currentLanguage = 'en';

    // Browser language detection
    function detectBrowserLanguage() {
        const browserLang = navigator.language;
        if (browserLang && browserLang.startsWith('zh')) return 'zh';
        if (browserLang && browserLang.startsWith('ru')) return 'ru';
        return 'en';
    }

    // Translation function
    function translatePage(language) {
        if (!translations[language]) {
            console.warn(`Language ${language} not found, falling back to English`);
            language = 'en';
        }

        // Update text content elements
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (key && translations[language] && translations[language][key]) {
                if (element.hasAttribute('data-translate-attr')) {
                    const attr = element.getAttribute('data-translate-attr');
                    if (attr) {
                        element.setAttribute(attr, translations[language][key]);
                    }
                } else {
                    element.textContent = translations[language][key];
                }
            }
        });

        // Update placeholder elements
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (key && translations[language] && translations[language][key]) {
                element.setAttribute('placeholder', translations[language][key]);
            }
        });

        currentLanguage = language;
        localStorage.setItem('preferredLanguage', language);
        
        // Update language switcher
        updateLanguageSwitcher(language);
    }

    // Change language function
    function changeLanguage(language) {
        translatePage(language);
        
        // Close dropdown after selection
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
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
        dropdown.classList.toggle('hidden', !isDropdownOpen);
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
            const errorKey = 'form-validation-error';
            const errorMessage = translations[currentLanguage] && translations[currentLanguage][errorKey] 
                ? translations[currentLanguage][errorKey] 
                : 'Please enter your name and contact phone number';
            alert(errorMessage);
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
        const successKey = 'form-success-message';
        const successMessage = translations[currentLanguage] && translations[currentLanguage][successKey]
            ? translations[currentLanguage][successKey]
            : 'Email client has been opened with pre-filled inquiry template. Please send the email to complete your inquiry!';
        alert(successMessage);
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

        // Detect and set initial language
        const savedLanguage = localStorage.getItem('preferredLanguage');
        const initialLanguage = savedLanguage || detectBrowserLanguage();
        
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
                isDropdownOpen = false;
            }
        });

        // Apply initial translation
        translatePage(initialLanguage);
        
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
