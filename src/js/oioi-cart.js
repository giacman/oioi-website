/**
 * OioiCart — Storefront API cart management
 *
 * Manages cart via Shopify Storefront API GraphQL.
 * Stores cartId in localStorage and reads it from URL param ?cartId=
 * for cross-domain synchronization.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'oioi_cart_id';
  var API_VERSION = '2024-10';

  function OioiCart(config) {
    this.token = config.token;
    this.domain = config.domain;
    this.endpoint = 'https://' + this.domain + '/api/' + API_VERSION + '/graphql.json';
    this.cartId = null;
    this.cart = null;
    this._listeners = [];

    this._readCartIdFromUrl();
    this._readCartIdFromStorage();
  }

  /* --- Private helpers --- */

  OioiCart.prototype._readCartIdFromUrl = function () {
    try {
      var params = new URLSearchParams(window.location.search);
      var id = params.get('cartId');
      if (id) {
        this.cartId = id;
        localStorage.setItem(STORAGE_KEY, id);
        params.delete('cartId');
        var clean = window.location.pathname + (params.toString() ? '?' + params.toString() : '') + window.location.hash;
        window.history.replaceState({}, '', clean);
      }
    } catch (e) { /* silent */ }
  };

  OioiCart.prototype._readCartIdFromStorage = function () {
    if (!this.cartId) {
      this.cartId = localStorage.getItem(STORAGE_KEY) || null;
    }
  };

  OioiCart.prototype._saveCartId = function (id) {
    this.cartId = id;
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  OioiCart.prototype._gql = function (query, variables) {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': this.token
      },
      body: JSON.stringify({ query: query, variables: variables || {} })
    })
    .then(function (r) { return r.json(); })
    .then(function (res) {
      if (res.errors) {
        console.error('[OioiCart] GraphQL errors:', res.errors);
        throw new Error(res.errors[0].message);
      }
      return res.data;
    });
  };

  OioiCart.prototype._notify = function () {
    var self = this;
    this._listeners.forEach(function (fn) { fn(self.cart); });
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: self.cart }));
  };

  var CART_FRAGMENT = [
    'fragment CartFields on Cart {',
    '  id',
    '  checkoutUrl',
    '  totalQuantity',
    '  cost { totalAmount { amount currencyCode } }',
    '  lines(first: 50) {',
    '    edges {',
    '      node {',
    '        id',
    '        quantity',
    '        cost { totalAmount { amount currencyCode } }',
    '        merchandise {',
    '          ... on ProductVariant {',
    '            id',
    '            title',
    '            image { url altText }',
    '            product { title handle }',
    '            price { amount currencyCode }',
    '          }',
    '        }',
    '      }',
    '    }',
    '  }',
    '}'
  ].join('\n');

  OioiCart.prototype._parseCart = function (gqlCart) {
    if (!gqlCart) return null;
    this._saveCartId(gqlCart.id);
    this.cart = {
      id: gqlCart.id,
      checkoutUrl: gqlCart.checkoutUrl,
      totalQuantity: gqlCart.totalQuantity,
      totalAmount: parseFloat(gqlCart.cost.totalAmount.amount),
      currency: gqlCart.cost.totalAmount.currencyCode,
      lines: gqlCart.lines.edges.map(function (edge) {
        var n = edge.node;
        var m = n.merchandise;
        return {
          lineId: n.id,
          variantId: m.id,
          quantity: n.quantity,
          title: m.product.title,
          variantTitle: m.title === 'Default Title' ? '' : m.title,
          handle: m.product.handle,
          image: m.image ? m.image.url : null,
          linePrice: parseFloat(n.cost.totalAmount.amount),
          unitPrice: parseFloat(m.price.amount),
          currency: m.price.currencyCode
        };
      })
    };
    return this.cart;
  };

  /* --- Public API --- */

  OioiCart.prototype.onChange = function (fn) {
    this._listeners.push(fn);
  };

  OioiCart.prototype.init = function () {
    if (this.cartId) {
      return this.getCart();
    }
    return this._createCart();
  };

  OioiCart.prototype._createCart = function () {
    var self = this;
    var query = 'mutation { cartCreate { cart { ...CartFields } userErrors { field message } } } ' + CART_FRAGMENT;
    return this._gql(query).then(function (data) {
      return self._parseCart(data.cartCreate.cart);
    });
  };

  OioiCart.prototype.getCart = function () {
    var self = this;
    if (!this.cartId) return this._createCart();
    var query = 'query($id: ID!) { cart(id: $id) { ...CartFields } } ' + CART_FRAGMENT;
    return this._gql(query, { id: this.cartId }).then(function (data) {
      if (!data.cart) {
        self._saveCartId(null);
        return self._createCart();
      }
      return self._parseCart(data.cart);
    });
  };

  OioiCart.prototype.addLine = function (variantId, qty) {
    var self = this;
    if (!this.cartId) {
      return this._createCart().then(function () {
        return self.addLine(variantId, qty);
      });
    }
    var query = [
      'mutation($cartId: ID!, $lines: [CartLineInput!]!) {',
      '  cartLinesAdd(cartId: $cartId, lines: $lines) {',
      '    cart { ...CartFields }',
      '    userErrors { field message }',
      '  }',
      '}',
      CART_FRAGMENT
    ].join('\n');
    return this._gql(query, {
      cartId: this.cartId,
      lines: [{ merchandiseId: variantId, quantity: qty || 1 }]
    }).then(function (data) {
      var cart = self._parseCart(data.cartLinesAdd.cart);
      self._notify();
      return cart;
    });
  };

  OioiCart.prototype.updateLine = function (lineId, qty) {
    var self = this;
    var query = [
      'mutation($cartId: ID!, $lines: [CartLineUpdateInput!]!) {',
      '  cartLinesUpdate(cartId: $cartId, lines: $lines) {',
      '    cart { ...CartFields }',
      '    userErrors { field message }',
      '  }',
      '}',
      CART_FRAGMENT
    ].join('\n');
    return this._gql(query, {
      cartId: this.cartId,
      lines: [{ id: lineId, quantity: qty }]
    }).then(function (data) {
      var cart = self._parseCart(data.cartLinesUpdate.cart);
      self._notify();
      return cart;
    });
  };

  OioiCart.prototype.removeLine = function (lineId) {
    var self = this;
    var query = [
      'mutation($cartId: ID!, $lineIds: [ID!]!) {',
      '  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {',
      '    cart { ...CartFields }',
      '    userErrors { field message }',
      '  }',
      '}',
      CART_FRAGMENT
    ].join('\n');
    return this._gql(query, {
      cartId: this.cartId,
      lineIds: [lineId]
    }).then(function (data) {
      var cart = self._parseCart(data.cartLinesRemove.cart);
      self._notify();
      return cart;
    });
  };

  OioiCart.prototype.getCheckoutUrl = function () {
    if (this.cart && this.cart.checkoutUrl) {
      return Promise.resolve(this.cart.checkoutUrl);
    }
    return this.getCart().then(function (cart) {
      return cart ? cart.checkoutUrl : '/cart';
    });
  };

  OioiCart.prototype.getCartIdParam = function () {
    return this.cartId ? 'cartId=' + encodeURIComponent(this.cartId) : '';
  };

  /**
   * Patches all [data-cross-domain] links to include ?cartId=...
   * Called after init and after every cart update.
   */
  OioiCart.prototype.patchCrossDomainLinks = function () {
    var cartId = this.cartId;
    var links = document.querySelectorAll('[data-cross-domain]');
    links.forEach(function (a) {
      try {
        var url = new URL(a.href);
        if (cartId) {
          url.searchParams.set('cartId', cartId);
        } else {
          url.searchParams.delete('cartId');
        }
        a.href = url.toString();
      } catch (e) { /* skip invalid URLs */ }
    });
  };

  /* Expose globally */
  window.OioiCart = OioiCart;
})();
