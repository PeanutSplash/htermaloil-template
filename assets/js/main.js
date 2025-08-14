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
        'en': {
            flag: `<svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="20" height="15" fill="#B22234"/>
                <rect width="20" height="1.15" fill="white"/>
                <rect y="2.31" width="20" height="1.15" fill="white"/>
                <rect y="4.62" width="20" height="1.15" fill="white"/>
                <rect y="6.92" width="20" height="1.15" fill="white"/>
                <rect y="9.23" width="20" height="1.15" fill="white"/>
                <rect y="11.54" width="20" height="1.15" fill="white"/>
                <rect y="13.85" width="20" height="1.15" fill="white"/>
                <rect width="8" height="8.08" fill="#3C3B6E"/>
            </svg>`,
            name: 'English'
        },
        'ru': {
            flag: `<svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="20" height="5" fill="white"/>
                <rect y="5" width="20" height="5" fill="#0039A6"/>
                <rect y="10" width="20" height="5" fill="#D52B1E"/>
            </svg>`,
            name: 'Русский'
        },
        'zh': {
            flag: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="13.33" viewBox="0 0 900 600">
                <path fill="#EE1C25" d="M0 0h900v600H0"/>
                <g transform="matrix(3 0 0 3 150 150)">
                    <path id="a" d="m0-30 17.634 54.27-46.166-33.54h57.064l-46.166 33.54Z" fill="#FF0"/>
                </g>
                <use xlink:href="#a" transform="rotate(23.036 2.784 766.082)"/>
                <use xlink:href="#a" transform="rotate(45.87 38.201 485.396)"/>
                <use xlink:href="#a" transform="rotate(69.945 29.892 362.328)"/>
                <use xlink:href="#a" transform="rotate(20.66 -590.66 957.955)"/>
            </svg>`,
            name: '中文'
        }
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
                flagSpan.innerHTML = config.flag;
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

        // Get target email from site config
        const targetEmail = window.siteConfig?.contact?.email || 'Peter.choy.wong@outlook.com';

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
        const mailtoLink = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
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
                const isHidden = mobileMenu.classList.contains('hidden');
                const icon = mobileMenuButton.querySelector('i');

                if (isHidden) {
                    mobileMenu.classList.remove('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'true');
                    // Change icon to X
                    if (icon) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    }
                    // Add class to body to indicate mobile menu is open
                    document.body.classList.add('mobile-menu-open');
                } else {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    // Change icon back to bars
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                    // Remove class from body
                    document.body.classList.remove('mobile-menu-open');
                }
            });

            // Close mobile menu when clicking on menu items
            const mobileMenuLinks = mobileMenu.querySelectorAll('a');
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    const icon = mobileMenuButton.querySelector('i');
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    // Change icon back to bars
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                    document.body.classList.remove('mobile-menu-open');
                });
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
    // SITE CONFIGURATION MODULE
    // ===========================================

    async function initializeSiteConfig() {
        try {
            // 动态导入配置模块
            const { getCurrentConfig, applyConfig } = await import('../../config/site-configs.js');

            // 获取当前配置
            const config = getCurrentConfig();

            // 应用配置到页面
            applyConfig(config);

            // 存储配置供其他模块使用
            window.siteConfig = config;

            console.log('Site configuration loaded:', config);
        } catch (error) {
            console.warn('Failed to load site configuration, using defaults:', error);
            // 如果配置加载失败，使用默认值
            window.siteConfig = {
                contact: {
                    phone: '+86 132 4287 7076',
                    email: 'Peter.choy.wong@outlook.com'
                }
            };
        }
    }

    // ===========================================
    // INITIALIZATION MODULE
    // ===========================================
    
    async function initializeApp() {
        console.log('Initializing Heat Transfer Oil App...');

        // Initialize site configuration first
        await initializeSiteConfig();

        // Initialize translations
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
