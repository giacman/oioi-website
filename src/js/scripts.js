//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Force scroll to top on page load
    window.scrollTo(0, 0);

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });

    // Mobile touch support for SVG buttons
    const svgButtons = document.querySelectorAll('.button-svg');
    svgButtons.forEach(btn => {
        // Add active class on touch start
        btn.addEventListener('touchstart', function() {
            this.classList.add('is-active');
        }, { passive: true });

        // Remove active class on touch end with a slight delay to show the effect
        btn.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('is-active');
            }, 200);
        });

        // Also remove on touchcancel just in case
        btn.addEventListener('touchcancel', function() {
            this.classList.remove('is-active');
        });
    });

});
