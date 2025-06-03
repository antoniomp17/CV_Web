document.addEventListener('DOMContentLoaded', function() {
    // Initialize the print button functionality
    initPrintButton();
    
    // Initialize language toggle functionality
    initLanguageToggle();
    
    // Add observer for scrolling animations
    initScrollObserver();
});

/**
 * Initialize the language toggle functionality
 */
function initLanguageToggle() {
    const languageToggle = document.getElementById('languageToggle');
    const body = document.body;
    
    if (!languageToggle) return;
    
    // Load saved language preference or default to Spanish
    const savedLanguage = sessionStorage.getItem('language') || 'es';
    setLanguage(savedLanguage);
    
    // Add click event listener
    languageToggle.addEventListener('click', function() {
        const currentLanguage = body.getAttribute('data-language');
        const newLanguage = currentLanguage === 'es' ? 'en' : 'es';
        setLanguage(newLanguage);
        
        // Save preference
        sessionStorage.setItem('language', newLanguage);
    });
}

/**
 * Set the application language
 */
function setLanguage(language) {
    const body = document.body;
    const languageToggle = document.getElementById('languageToggle');
    const languageIndicator = languageToggle.querySelector('.language-indicator');
    
    // Update body data attribute
    body.setAttribute('data-language', language);
    
    // Update language indicator
    languageIndicator.textContent = language.toUpperCase();
    
    // Update aria-label for accessibility
    const ariaLabel = language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish';
    languageToggle.setAttribute('aria-label', ariaLabel);
    
    // Update document language
    document.documentElement.setAttribute('lang', language);
    
    // Update all translatable text elements
    updateTranslatableElements(language);
    
    // Update page title
    const title = language === 'es' 
        ? 'Antonio Moraleda Palomino - CV' 
        : 'Antonio Moraleda Palomino - Resume';
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        const description = language === 'es'
            ? 'CV de Antonio Moraleda Palomino - Android & Multiplatform Developer'
            : 'Resume of Antonio Moraleda Palomino - Android & Multiplatform Developer';
        metaDescription.setAttribute('content', description);
    }
}

/**
 * Update all elements with translatable text
 */
function updateTranslatableElements(language) {
    const langElements = document.querySelectorAll('.lang-text');
    
    langElements.forEach(element => {
        const spanishText = element.getAttribute('data-es');
        const englishText = element.getAttribute('data-en');
        
        if (spanishText && englishText) {
            // Add fade out effect
            element.style.opacity = '0';
            
            // Update text after fade out
            setTimeout(() => {
                element.textContent = language === 'es' ? spanishText : englishText;
                element.style.opacity = '1';
            }, 150);
        }
    });
    
    // Update print button text
    updatePrintButtonText(language);
}

/**
 * Update print button text based on language
 */
function updatePrintButtonText(language) {
    const printBtn = document.querySelector('.print-btn');
    if (printBtn) {
        const text = language === 'es' ? 'Imprimir CV' : 'Print Resume';
        printBtn.innerHTML = `<i class="fas fa-print"></i> ${text}`;
    }
}

/**
 * Add a print button to allow for easy PDF export
 */
function initPrintButton() {
    // Create the print button
    const printButton = document.createElement('button');
    printButton.classList.add('btn', 'print-btn');
    
    // Set initial text based on current language
    const currentLanguage = document.body.getAttribute('data-language') || 'es';
    const text = currentLanguage === 'es' ? 'Imprimir CV' : 'Print Resume';
    printButton.innerHTML = `<i class="fas fa-print"></i> ${text}`;
    
    // Add click event to print the page
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    // Add button to the header section
    const header = document.querySelector('.profile-container');
    if (header) {
        header.appendChild(printButton);
    }
}

/**
 * Initialize the intersection observer for scroll animations
 */
function initScrollObserver() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        // If not supported, make all sections visible
        document.querySelectorAll('.card').forEach(section => {
            section.classList.add('visible');
        });
        return;
    }
    
    // Add initial hidden class to cards for animation
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('fade-in');
    });
    
    // Create observer instance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once the animation is done, stop observing this element
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.1, // 10% visibility
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all cards
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}

/**
 * Handle keyboard navigation for language toggle
 */
document.addEventListener('keydown', function(event) {
    // Allow Enter or Space to trigger language toggle
    if ((event.key === 'Enter' || event.key === ' ') && 
        event.target.id === 'languageToggle') {
        event.preventDefault();
        event.target.click();
    }
});

/**
 * Handle language toggle with smooth transitions
 */
function createLanguageTransition() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* Language transition animations */
        .lang-text {
            transition: opacity 0.3s ease;
        }
        
        /* Enhanced language toggle button animations */
        .language-toggle {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .language-toggle:hover {
            transform: scale(1.05);
        }
        
        .language-toggle:active {
            transform: scale(0.95);
        }
        
        /* Print button responsive positioning */
        @media (max-width: 900px) {
            .print-btn {
                position: relative;
                bottom: auto;
                right: auto;
                margin-top: 15px;
                align-self: center;
            }
            
            .profile-container {
                position: relative;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize enhanced transitions
createLanguageTransition();

/**
 * Utility function to get current language
 */
function getCurrentLanguage() {
    return document.body.getAttribute('data-language') || 'es';
}

/**
 * Utility function to check if language is Spanish
 */
function isSpanish() {
    return getCurrentLanguage() === 'es';
}

/**
 * Handle dynamic content updates for specific sections
 */
function updateDynamicContent(language) {
    // Update any dynamic content that might not have data attributes
    const dynamicElements = {
        'profile-info h2': {
            es: 'Desarrollador Android & Multiplataforma',
            en: 'Android & Multiplatform Developer'
        }
    };
    
    Object.keys(dynamicElements).forEach(selector => {
        const element = document.querySelector(selector);
        if (element && !element.hasAttribute('data-es')) {
            const content = dynamicElements[selector];
            element.textContent = content[language];
        }
    });
}

// Add smooth page transitions when language changes
document.addEventListener('DOMContentLoaded', function() {
    // Add a subtle animation class to the entire container
    const container = document.querySelector('.container');
    if (container) {
        container.style.transition = 'opacity 0.3s ease';
    }
});

/**
 * Handle accessibility improvements
 */
function enhanceAccessibility() {
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        // Add role and improved ARIA attributes
        languageToggle.setAttribute('role', 'button');
        languageToggle.setAttribute('tabindex', '0');
        
        // Add keyboard support announcement
        const srText = document.createElement('span');
        srText.className = 'sr-only';
        srText.textContent = 'Press Enter or Space to toggle language';
        languageToggle.appendChild(srText);
    }
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

/**
 * Debug function to log language state (can be removed in production)
 */
function debugLanguageState() {
    if (window.location.search.includes('debug=true')) {
        console.log('Current Language:', getCurrentLanguage());
        console.log('Stored Language:', sessionStorage.getItem('language'));
        console.log('Document Language:', document.documentElement.lang);
    }
}

// Run debug check
debugLanguageState();