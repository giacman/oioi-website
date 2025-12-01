//
// Cookie Banner with Google Consent Mode v2
//

(function() {
    'use strict';

    const COOKIE_CONSENT_KEY = 'cookie_consent';
    const COOKIE_BANNER_ID = 'cookieBanner';
    
    // Check if consent was already given
    function getConsentStatus() {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        return consent ? JSON.parse(consent) : null;
    }

    // Save consent status
    function saveConsentStatus(consentData) {
        // consentData should be { analytics: boolean, marketing: boolean, status: 'custom'|'accepted'|'rejected' }
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
            ...consentData,
            timestamp: new Date().getTime()
        }));
    }

    // Update Google Consent Mode
    // input can be boolean (all/nothing) or object { analytics: bool, marketing: bool }
    function updateConsentMode(consent) {
        let analytics, marketing;

        if (typeof consent === 'boolean') {
            analytics = consent;
            marketing = consent;
        } else {
            analytics = consent.analytics;
            marketing = consent.marketing;
        }

        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': analytics ? 'granted' : 'denied',
                'ad_storage': marketing ? 'granted' : 'denied',
                'ad_user_data': marketing ? 'granted' : 'denied',
                'ad_personalization': marketing ? 'granted' : 'denied'
            });
        }
        
        // Also update dataLayer for GTM triggers
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'consent_update',
            'consent_analytics_storage': analytics ? 'granted' : 'denied',
            'consent_ad_storage': marketing ? 'granted' : 'denied',
            'consent_ad_user_data': marketing ? 'granted' : 'denied',
            'consent_ad_personalization': marketing ? 'granted' : 'denied'
        });
    }

    // Show cookie banner
    function showCookieBanner() {
        const banner = document.getElementById(COOKIE_BANNER_ID);
        if (banner) {
            banner.setAttribute('aria-hidden', 'false');
            banner.classList.add('show');
            document.body.classList.add('cookie-banner-visible');
            
            // Attach event listener to accept button (in case it was reopened)
            const acceptBtn = document.getElementById('cookieAccept');
            if (acceptBtn) {
                // Remove existing listener to avoid duplicates
                acceptBtn.removeEventListener('click', handleAccept);
                acceptBtn.addEventListener('click', handleAccept);
            }
        }
    }

    // Hide cookie banner
    function hideCookieBanner() {
        const banner = document.getElementById(COOKIE_BANNER_ID);
        if (banner) {
            banner.setAttribute('aria-hidden', 'true');
            banner.classList.remove('show');
            document.body.classList.remove('cookie-banner-visible');
        }
    }

    // Handle accept all button (from banner or policy)
    function handleAccept() {
        const consentData = { analytics: true, marketing: true, status: 'accepted' };
        saveConsentStatus(consentData);
        updateConsentMode(true);
        hideCookieBanner();
        
        // Update checkboxes if on policy page
        updatePolicyCheckboxes(true, true);
        
        if (document.getElementById('savePreferencesBtn')) {
            alert('Hai accettato tutti i cookie.');
        }
    }

    // Handle reject button (legacy or policy reject all)
    function handleReject() {
        const consentData = { analytics: false, marketing: false, status: 'rejected' };
        saveConsentStatus(consentData);
        updateConsentMode(false);
        hideCookieBanner();
        
        // Update checkboxes if on policy page
        updatePolicyCheckboxes(false, false);
    }

    // Handle save preferences from policy page form
    function handleSavePreferences() {
        const analytics = document.getElementById('consentAnalytics')?.checked || false;
        const marketing = document.getElementById('consentMarketing')?.checked || false;
        
        const consentData = { 
            analytics: analytics, 
            marketing: marketing, 
            status: 'custom' 
        };
        
        saveConsentStatus(consentData);
        updateConsentMode(consentData);
        hideCookieBanner(); // In case it was open
        
        alert('Preferenze salvate correttamente.');
    }

    // Update checkboxes UI based on current consent
    function updatePolicyCheckboxes(analytics, marketing) {
        const analyticsBox = document.getElementById('consentAnalytics');
        const marketingBox = document.getElementById('consentMarketing');
        
        if (analyticsBox) analyticsBox.checked = analytics;
        if (marketingBox) marketingBox.checked = marketing;
    }

    // Initialize cookie banner and preferences
    function initCookieBanner() {
        const consentStatus = getConsentStatus();
        
        if (consentStatus) {
            // Apply saved consent
            // Support legacy stored format if necessary, but usually we overwrote it
            const analytics = consentStatus.analytics !== undefined ? consentStatus.analytics : (consentStatus.status === 'accepted');
            const marketing = consentStatus.marketing !== undefined ? consentStatus.marketing : (consentStatus.status === 'accepted');
            
            updateConsentMode({ analytics, marketing });
            
            // Update UI checkboxes if present
            updatePolicyCheckboxes(analytics, marketing);
            
            return; // Don't show banner
        }

        // Show banner if consent not given
        showCookieBanner();
    }

    // Expose functions globally
    window.showCookiePreferences = showCookieBanner; // Re-opens banner
    window.handleAccept = handleAccept;
    window.handleReject = handleReject;
    window.handleSavePreferences = handleSavePreferences;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieBanner);
    } else {
        initCookieBanner();
    }

})();