// Translation Data and Management for Heat Transfer Oil Solutions

// Translation data object - loaded from JSON file
let translations = {};

// Current language state
let currentLanguage = 'en';

// Load translations from JSON file
async function loadTranslations() {
    try {
        const response = await fetch('./assets/js/translations.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations = await response.json();
        console.log('Translations loaded successfully');
        return translations;
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to basic English translations
        translations = {
            en: {
                'page-title': 'Heat Transfer Oil System Retrofit Solution',
                'nav-brand': 'Heat Transfer Oil Solutions',
                'header-title': 'Heat Transfer Oil System Retrofit Solution',
                'contact-title': 'Contact Us'
            }
        };
        return translations;
    }
}

// Browser language detection
function detectBrowserLanguage() {
    const browserLang = navigator.language;
    if (browserLang && browserLang.startsWith('zh')) return 'zh';
    if (browserLang && browserLang.startsWith('ru')) return 'ru';
    return 'en';
}

// Translation function
export function translatePage(language) {
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

    // Update page title
    if (translations[language] && translations[language]['page-title']) {
        document.title = translations[language]['page-title'];
    }

    // Update HTML lang attribute
    document.documentElement.lang = language;
    
    currentLanguage = language;
    localStorage.setItem('preferredLanguage', language);
}

// Get current language
export function getCurrentLanguage() {
    return currentLanguage;
}

// Set current language
export function setCurrentLanguage(language) {
    currentLanguage = language;
    localStorage.setItem('language', language);
}

// Initialize translations
export async function initializeTranslations() {
    // Load translations from JSON file first
    await loadTranslations();
    
    // Get language from localStorage or detect from browser
    const savedLanguage = localStorage.getItem('language') || localStorage.getItem('preferredLanguage');
    const detectedLanguage = detectBrowserLanguage();
    const initialLanguage = savedLanguage || detectedLanguage;
    
    setCurrentLanguage(initialLanguage);
    translatePage(initialLanguage);
    
    console.log('Translations initialized with language:', initialLanguage);
    return initialLanguage;
}

// Export translations for backward compatibility
export { translations };
