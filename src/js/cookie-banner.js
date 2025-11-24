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
    function saveConsentStatus(status) {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
            status: status,
            timestamp: new Date().getTime()
        }));
    }

    // Update Google Consent Mode
    function updateConsentMode(accepted) {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': accepted ? 'granted' : 'denied',
                'ad_storage': accepted ? 'granted' : 'denied',
                'ad_user_data': accepted ? 'granted' : 'denied',
                'ad_personalization': accepted ? 'granted' : 'denied'
            });
        }
        
        // Also update dataLayer for GTM
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'consent_update',
            'consent_analytics_storage': accepted ? 'granted' : 'denied',
            'consent_ad_storage': accepted ? 'granted' : 'denied',
            'consent_ad_user_data': accepted ? 'granted' : 'denied',
            'consent_ad_personalization': accepted ? 'granted' : 'denied'
        });
    }

    // Show cookie banner
    function showCookieBanner() {
        const banner = document.getElementById(COOKIE_BANNER_ID);
        if (banner) {
            banner.setAttribute('aria-hidden', 'false');
            banner.classList.add('show');
            // Add class to body to prevent scroll when banner is visible
            document.body.classList.add('cookie-banner-visible');
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

    // Handle accept button
    function handleAccept() {
        saveConsentStatus('accepted');
        updateConsentMode(true);
        hideCookieBanner();
    }

    // Handle reject button
    function handleReject() {
        saveConsentStatus('rejected');
        updateConsentMode(false);
        hideCookieBanner();
    }

    // Initialize cookie banner
    function initCookieBanner() {
        const consentStatus = getConsentStatus();
        
        // If consent was already given, update consent mode and don't show banner
        if (consentStatus) {
            const accepted = consentStatus.status === 'accepted';
            updateConsentMode(accepted);
            return;
        }

        // Show banner if consent not given
        showCookieBanner();

        // Attach event listeners
        const acceptBtn = document.getElementById('cookieAccept');
        const rejectBtn = document.getElementById('cookieReject');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', handleAccept);
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', handleReject);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieBanner);
    } else {
        initCookieBanner();
    }

})();

