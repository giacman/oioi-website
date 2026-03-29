(function () {
  'use strict';

  var CACHE_TTL = 5000;
  var cachedCart = null;
  var cacheTimestamp = 0;

  var els = {
    navItem: document.getElementById('cartNavItem'),
    preview: document.getElementById('cartPreview'),
    badge: document.getElementById('cartBadge'),
    empty: document.getElementById('cartPreviewEmpty'),
    body: document.getElementById('cartPreviewBody'),
    items: document.getElementById('cartPreviewItems'),
    total: document.getElementById('cartPreviewTotal')
  };

  if (!els.navItem || !els.preview) return;

  function formatMoney(amount, fromCents) {
    var value = fromCents ? amount / 100 : amount;
    return '€' + value.toFixed(2).replace('.', ',');
  }

  /* --- Data source: Storefront API (OioiCart) --- */

  function useStorefront() {
    return !!(window.oioiCart && window.oioiCart.cart);
  }

  /* --- Rendering --- */

  function renderFromStorefront(cart) {
    updateBadge(cart.totalQuantity);

    if (cart.totalQuantity === 0) {
      showEmpty();
      return;
    }

    els.empty.classList.add('d-none');
    els.body.classList.remove('d-none');

    var html = '';
    cart.lines.forEach(function (line) {
      var thumbUrl = line.image || '';
      var variant = line.variantTitle || '';

      html += '<li class="cart-preview__item">'
        + (thumbUrl
          ? '<img class="cart-preview__thumb" src="' + thumbUrl + '" alt="" loading="lazy">'
          : '<span class="cart-preview__thumb"></span>')
        + '<div class="cart-preview__info">'
        + '<p class="cart-preview__title">' + line.title + '</p>'
        + (variant ? '<span class="cart-preview__variant">' + variant + '</span>' : '')
        + '<span class="cart-preview__qty">Qtà: ' + line.quantity + '</span>'
        + '</div>'
        + '<span class="cart-preview__price">' + formatMoney(line.linePrice, false) + '</span>'
        + '</li>';
    });
    els.items.innerHTML = html;
    els.total.textContent = formatMoney(cart.totalAmount, false);
  }

  function updateBadge(count) {
    if (!els.badge) return;
    if (count > 0) {
      els.badge.textContent = count;
      els.badge.classList.remove('d-none');
    } else {
      els.badge.classList.add('d-none');
    }
  }

  function showEmpty() {
    els.empty.classList.remove('d-none');
    els.body.classList.add('d-none');
  }

  /* --- Show / Hide --- */

  function show() {
    els.preview.classList.add('is-visible');
    els.preview.setAttribute('aria-hidden', 'false');

    if (useStorefront()) {
      renderFromStorefront(window.oioiCart.cart);
    } else {
      showEmpty();
    }
  }

  function hide() {
    els.preview.classList.remove('is-visible');
    els.preview.setAttribute('aria-hidden', 'true');
  }

  // Desktop: hover
  var hideTimer = null;

  els.navItem.addEventListener('mouseenter', function () {
    clearTimeout(hideTimer);
    show();
  });

  els.navItem.addEventListener('mouseleave', function () {
    hideTimer = setTimeout(hide, 200);
  });

  // Mobile: tap on Shop toggles cart preview unless link is internal coming soon (production)
  var shopLink = els.navItem.querySelector('.nav-link');
  if (shopLink) {
    shopLink.addEventListener('click', function (e) {
      if (window.innerWidth < 992) {
        try {
          var u = new URL(shopLink.href, window.location.href);
          if (u.pathname.indexOf('shop-coming-soon') !== -1) {
            return;
          }
        } catch (err) { /* ignore */ }
        e.preventDefault();
        e.stopPropagation();
        if (els.preview.classList.contains('is-visible')) {
          hide();
        } else {
          show();
        }
      }
    });
  }

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!els.navItem.contains(e.target)) {
      hide();
    }
  });

  // Listen for cart:updated and refresh badge
  window.addEventListener('cart:updated', function (e) {
    if (e.detail && e.detail.totalQuantity !== undefined) {
      updateBadge(e.detail.totalQuantity);
    }
  });
})();
