// Language Switcher Component for Heat Transfer Oil Solutions

import { translatePage, getCurrentLanguage, setCurrentLanguage } from '../translations.js';

// Language switcher state
let isDropdownOpen = false;

// Language configuration
const languageConfig = {
    'en': { flag: '🇺🇸', name: 'English' },
    'ru': { flag: '🇷🇺', name: 'Русский' },
    'zh': { flag: '🇨🇳', name: '中文' }
};

// Toggle language dropdown
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    
    if (dropdown) {
        isDropdownOpen = !isDropdownOpen;
        
        if (isDropdownOpen) {
            dropdown.classList.add('show');
        } else {
            dropdown.classList.remove('show');
        }
    }
}

// Close language dropdown
function closeLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    
    if (dropdown) {
        isDropdownOpen = false;
        dropdown.classList.remove('show');
    }
}

// Update language switcher display
function updateLanguageSwitcher(language) {
    const button = document.getElementById('languageButton');
    const dropdown = document.getElementById('languageDropdown');

    if (button) {
        const flag = button.querySelector('.flag');
        if (flag && languageConfig[language]) {
            flag.textContent = languageConfig[language].flag;
        }
    }

    if (dropdown) {
        const options = dropdown.querySelectorAll('.language-option');
        options.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === language) {
                option.classList.add('active');
            }
        });
    }
}

// Handle language change
function changeLanguage(newLanguage) {
    const currentLang = getCurrentLanguage();
    
    if (newLanguage !== currentLang) {
        setCurrentLanguage(newLanguage);
        translatePage(newLanguage);
        updateLanguageSwitcher(newLanguage);
        closeLanguageDropdown();
        
        console.log('Language changed to:', newLanguage);
        
        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: newLanguage }
        }));
    }
}

// Initialize language dropdown events
function initializeLanguageDropdown() {
    const languageButton = document.getElementById('languageButton');
    const languageDropdown = document.getElementById('languageDropdown');

    if (languageButton && languageDropdown) {
        // Button click handler
        languageButton.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleLanguageDropdown();
        });

        // Dropdown option click handler
        languageDropdown.addEventListener('click', function(e) {
            const option = e.target.closest('.language-option');
            if (option) {
                const newLanguage = option.getAttribute('data-lang');
                changeLanguage(newLanguage);
            }
        });

        // Keyboard navigation support
        languageButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleLanguageDropdown();
            }
        });

        languageDropdown.addEventListener('keydown', function(e) {
            const options = Array.from(languageDropdown.querySelectorAll('.language-option'));
            const currentIndex = options.findIndex(option => option.classList.contains('active'));
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % options.length;
                    options[nextIndex].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = (currentIndex - 1 + options.length) % options.length;
                    options[prevIndex].focus();
                    break;
                case 'Enter':
                    e.preventDefault();
                    const focusedOption = document.activeElement;
                    if (focusedOption && focusedOption.classList.contains('language-option')) {
                        const newLanguage = focusedOption.getAttribute('data-lang');
                        changeLanguage(newLanguage);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    closeLanguageDropdown();
                    languageButton.focus();
                    break;
            }
        });
    }
}

// Initialize click outside handler
function initializeClickOutside() {
    document.addEventListener('click', function(e) {
        const languageSwitcher = document.querySelector('.language-switcher');
        
        if (isDropdownOpen && languageSwitcher && !languageSwitcher.contains(e.target)) {
            closeLanguageDropdown();
        }
    });
}

// Initialize language switcher with current language
function initializeLanguageDisplay() {
    const currentLang = getCurrentLanguage();
    updateLanguageSwitcher(currentLang);
}

// Main language switcher initialization function
export function initializeLanguageSwitcher() {
    try {
        initializeLanguageDisplay();
        initializeLanguageDropdown();
        initializeClickOutside();
        
        console.log('Language switcher initialized successfully');
    } catch (error) {
        console.error('Error initializing language switcher:', error);
    }
}

// Export utility functions for external use
export {
    changeLanguage,
    toggleLanguageDropdown,
    closeLanguageDropdown,
    updateLanguageSwitcher
};
