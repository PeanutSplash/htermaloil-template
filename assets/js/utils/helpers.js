// Utility Helper Functions for Heat Transfer Oil Solutions

// Debounce function for performance optimization
export function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

// Throttle function for scroll events
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if device is mobile
export function isMobile() {
    return window.innerWidth <= 768;
}

// Check if device is tablet
export function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

// Check if device is desktop
export function isDesktop() {
    return window.innerWidth > 1024;
}

// Get device type
export function getDeviceType() {
    if (isMobile()) return 'mobile';
    if (isTablet()) return 'tablet';
    return 'desktop';
}

// Check if browser supports a feature
export function supportsFeature(feature, value) {
    if (typeof CSS !== 'undefined' && CSS.supports) {
        return CSS.supports(feature, value);
    }
    return false;
}

// Check if browser supports IntersectionObserver
export function supportsIntersectionObserver() {
    return 'IntersectionObserver' in window;
}

// Check if browser supports localStorage
export function supportsLocalStorage() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

// Safe localStorage operations
export const storage = {
    get(key, defaultValue = null) {
        if (!supportsLocalStorage()) return defaultValue;
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Error reading from localStorage:', e);
            return defaultValue;
        }
    },
    
    set(key, value) {
        if (!supportsLocalStorage()) return false;
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Error writing to localStorage:', e);
            return false;
        }
    },
    
    remove(key) {
        if (!supportsLocalStorage()) return false;
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn('Error removing from localStorage:', e);
            return false;
        }
    }
};

// Format phone number for display
export function formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Basic formatting for common patterns
    if (cleaned.startsWith('+86')) {
        // Chinese format: +86 XXX XXXX XXXX
        return cleaned.replace(/(\+86)(\d{3})(\d{4})(\d{4})/, '$1 $2 $3 $4');
    } else if (cleaned.startsWith('+1')) {
        // US format: +1 (XXX) XXX-XXXX
        return cleaned.replace(/(\+1)(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4');
    } else if (cleaned.startsWith('+7')) {
        // Russian format: +7 XXX XXX-XX-XX
        return cleaned.replace(/(\+7)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3-$4-$5');
    }
    
    return phone; // Return original if no pattern matches
}

// Validate email format
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number format
export function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,20}$/;
    return phoneRegex.test(phone);
}

// Sanitize HTML to prevent XSS
export function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Generate unique ID
export function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Deep clone object
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

// Wait for element to exist in DOM
export function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

// Smooth scroll to element
export function smoothScrollTo(element, offset = 0, duration = 800) {
    if (!element) return;
    
    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    // Easing function
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Get browser information
export function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';
    
    if (ua.indexOf('Chrome') > -1) {
        browser = 'Chrome';
        version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Firefox') > -1) {
        browser = 'Firefox';
        version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Safari') > -1) {
        browser = 'Safari';
        version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Edge') > -1) {
        browser = 'Edge';
        version = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
    }
    
    return { browser, version, userAgent: ua };
}

// Log application information
export function logAppInfo() {
    const deviceType = getDeviceType();
    const browserInfo = getBrowserInfo();
    const screenInfo = {
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight
    };
    
    console.group('Heat Transfer Oil Solutions - App Info');
    console.log('Device Type:', deviceType);
    console.log('Browser:', browserInfo.browser, browserInfo.version);
    console.log('Screen:', screenInfo);
    console.log('Viewport:', { width: window.innerWidth, height: window.innerHeight });
    console.log('Features:', {
        localStorage: supportsLocalStorage(),
        intersectionObserver: supportsIntersectionObserver(),
        cssSupports: typeof CSS !== 'undefined' && !!CSS.supports
    });
    console.groupEnd();
}
