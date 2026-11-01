/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚀 سوق صغير (Mini Souk) — المنطق الرئيسي، الراوتر، والواتساب (app.js)
 * ═══════════════════════════════════════════════════════════════════════════
 * يتضمن هذا الملف:
 * - إدارة المظهر (Dark/Light Mode) مع احترام prefers-color-scheme وحفظه في localStorage("theme")
 * - نظام واتساب الكامل sendToWhatsApp(merchant, message) مع القوالب المترجمة
 * - SPA Hash Router لجميع المسارات: #/ , #/merchant/:id , #/product/:id , #/category/:name , #/cart , #/search?q= , #/dashboard
 * - إدارة السلة والمفضلة والتقييمات والكوبونات في localStorage
 * - فلترة فورية (بحث، مدينة، قسم، ترتيب، تبويبات العروض) + Skeleton Loading + Toasts
 */

// ─────────────────────────────────────────────────────────────────────────
// 1. دوال التخزين الآمن في localStorage
// ─────────────────────────────────────────────────────────────────────────
function storageGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // تجاهل أخطاء مساحة التخزين
  }
}

function storageGetRaw(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw !== null ? raw : fallback;
  } catch (e) {
    return fallback;
  }
}

function storageSetRaw(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (e) {
    // تجاهل الأخطاء
  }
}

// ─────────────────────────────────────────────────────────────────────────
// 2. حالة التطبيق المركزية (State)
// ─────────────────────────────────────────────────────────────────────────
window.APP_STATE = {
  cart: storageGet('minisouk_cart', []),
  wishlist: storageGet('minisouk_wishlist', ['p1', 'p5']),
  reviews: storageGet('minisouk_reviews', {
    p1: [
      { name: 'سارة بن يحيى (الجزائر)', rating: 5, comment: 'خياطة وتطريز يفوق الوصف! المجبود حر والقماش ثقيل وملكي، شكراً لدار القفطان.', date: '2026-10-18' },
      { name: 'أمينة تلمسانية', rating: 5, comment: 'وصلني في يومين مغلف بعناية فائقة مع عطر هدية.', date: '2026-10-25' }
    ],
    p5: [
      { name: 'كريم بوعلام', rating: 5, comment: 'أفضل بقلاوة ذقتها خارج القصبة، اللوز محمص بإتقان والعسل طبيعي غير ثقيل.', date: '2026-10-22' }
    ]
  }),
  selectedWilaya: storageGetRaw('minisouk_wilaya', 'algiers'),
  activeCoupon: storageGet('minisouk_coupon', null),
  customerInfo: storageGet('minisouk_customer', { name: '', city: 'الجزائر العاصمة', address: '' }),
  filters: {
    searchQuery: '',
    category: 'all',
    city: 'all',
    sortBy: 'featured',
    tagTab: 'all' // all | bestseller | new | deal
  },
  wishlistOnly: false,
  activeGalleryIndex: 0
};

// تحميل المنتجات من localStorage في حال قام التاجر بتعديلها أو إضافتها من لوحة التحكم
function syncCatalogFromStorage() {
  const customProducts = storageGet('minisouk_products', null);
  if (Array.isArray(customProducts) && customProducts.length > 0) {
    window.DATA.products = customProducts;
  } else {
    storageSet('minisouk_products', window.DATA.products);
  }
}
syncCatalogFromStorage();

// ─────────────────────────────────────────────────────────────────────────
// 3. إدارة الوضع الداكن والفاتح (Dark / Light Theme)
// ─────────────────────────────────────────────────────────────────────────
window.setTheme = function (theme) {
  const validTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', validTheme);
  storageSetRaw('theme', validTheme);

  const themeIcon = document.getElementById('themeToggleIcon');
  if (themeIcon) {
    themeIcon.textContent = validTheme === 'dark' ? '☀️' : '🌙';
  }
};

window.toggleTheme = function () {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  window.setTheme(current === 'dark' ? 'light' : 'dark');
};

function initTheme() {
  const savedTheme = storageGetRaw('theme', '');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    window.setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    window.setTheme(prefersDark ? 'dark' : 'light');
  }
}

// ─────────────────────────────────────────────────────────────────────────
// 4. نظام إشعارات الواجهة (Toasts)
// ─────────────────────────────────────────────────────────────────────────
window.showToast = function (message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  const iconMap = { success: '✨', whatsapp: '💬', warning: '⚠️', info: '🔔' };
  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || '✨'}</span>
    <span class="toast-text">${message}</span>
  `;
  container.appendChild(toast);

  requestAnimationFrame(function () {
    toast.classList.add('visible');
  });

  setTimeout(function () {
    toast.classList.remove('visible');
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 320);
  }, 3200);
};

// ─────────────────────────────────────────────────────────────────────────
// 5. الربط الكامل مع واتساب (إجباري ومطابق للمواصفات)
// ─────────────────────────────────────────────────────────────────────────
function sendToWhatsApp(merchant, message) {
  if (!merchant || !merchant.whatsapp) return;
  const phone = merchant.whatsapp.replace(/\D/g, '');
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
}
window.sendToWhatsApp = sendToWhatsApp;

// 1) طلب منتج مباشر عبر واتساب
window.orderProductViaWhatsApp = function (productId) {
  const product = window.DATA.products.find(function (p) { return p.id === productId; });
  if (!product) return;
  const merchant = window.DATA.merchants.find(function (m) { return m.id === product.merchantId; });
  if (!merchant) return;

  const message = window.t('whatsapp.productOrder', {
    merchantName: window.getLocalizedField(merchant, 'name'),
    siteName: window.getSiteName(),
    productTitle: window.getLocalizedField(product, 'title'),
    productId: product.id.toUpperCase(),
    price: Number(product.price).toLocaleString(),
    currency: window.getCurrency()
  });

  window.showToast(window.t('toasts.whatsappOpened'), 'whatsapp');
  sendToWhatsApp(merchant, message);
};

// 2) تواصل مباشر مع التاجر عبر واتساب
window.contactMerchantViaWhatsApp = function (merchantId) {
  const merchant = window.DATA.merchants.find(function (m) { return m.id === merchantId; });
  if (!merchant) return;

  const message = window.t('whatsapp.merchantContact', {
    merchantName: window.getLocalizedField(merchant, 'name'),
    siteName: window.getSiteName(),
    city: window.getLocalizedField(merchant, 'city')
  });

  window.showToast(window.t('toasts.whatsappOpened'), 'whatsapp');
  sendToWhatsApp(merchant, message);
};

// 3) إرسال طلب السلة لتاجر محدد (أو لكل تاجر في السلة)
window.checkoutMerchantCartViaWhatsApp = function (merchantId) {
  const nameInput = document.getElementById('cartCustomerName');
  const citySelect = document.getElementById('cartCustomerCity');
  const addressInput = document.getElementById('cartCustomerAddress');

  if (nameInput) window.APP_STATE.customerInfo.name = nameInput.value.trim();
  if (citySelect) window.APP_STATE.customerInfo.city = citySelect.value;
  if (addressInput) window.APP_STATE.customerInfo.address = addressInput.value.trim();
  storageSet('minisouk_customer', window.APP_STATE.customerInfo);

  const customerName = window.APP_STATE.customerInfo.name || (window.currentLang === 'ar' ? 'زبون سوق صغير' : 'Client Mini Souk');
  const customerCity = window.APP_STATE.customerInfo.city || 'الجزائر';
  const customerAddress = window.APP_STATE.customerInfo.address || (window.currentLang === 'ar' ? 'توصيل عادي' : 'Standard');

  const merchant = window.DATA.merchants.find(function (m) { return m.id === merchantId; });
  if (!merchant) return;

  const merchantCartItems = window.APP_STATE.cart
    .map(function (ci) {
      const product = window.DATA.products.find(function (p) { return p.id === ci.productId; });
      return product ? { product: product, qty: ci.qty } : null;
    })
    .filter(function (entry) {
      return entry && entry.product.merchantId === merchantId;
    });

  if (merchantCartItems.length === 0) return;

  const currency = window.getCurrency();
  let subtotal = 0;
  const lines = merchantCartItems.map(function (entry, idx) {
    const lineTotal = entry.product.price * entry.qty;
    subtotal += lineTotal;
    const pTitle = window.getLocalizedField(entry.product, 'title');
    return `${idx + 1}. ${pTitle} (×${entry.qty}) — ${lineTotal.toLocaleString()} ${currency}`;
  });

  const discountPercent = window.APP_STATE.activeCoupon ? window.APP_STATE.activeCoupon.discountPercent : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const wilayaObj = window.DATA.settings.wilayas.find(function (w) { return w.id === window.APP_STATE.selectedWilaya; }) || window.DATA.settings.wilayas[0];
  const shippingFee = wilayaObj ? wilayaObj.shippingFee : 500;
  const finalTotal = subtotal - discountAmount + shippingFee;

  const discountLine = discountAmount > 0
    ? `🎁 *${window.t('cart.discount')}* -${discountAmount.toLocaleString()} ${currency} (${window.APP_STATE.activeCoupon.code})\n`
    : '';

  const message = window.t('whatsapp.cartOrder', {
    merchantName: window.getLocalizedField(merchant, 'name'),
    siteName: window.getSiteName(),
    customerName: customerName,
    customerCity: customerCity,
    customerAddress: customerAddress,
    itemsList: lines.join('\n'),
    shipping: shippingFee.toLocaleString(),
    discountLine: discountLine,
    total: finalTotal.toLocaleString(),
    currency: currency
  });

  window.showToast(window.t('toasts.whatsappOpened'), 'whatsapp');
  sendToWhatsApp(merchant, message);
};

// ─────────────────────────────────────────────────────────────────────────
// 6. إدارة السلة والمفضلة والكوبونات
// ─────────────────────────────────────────────────────────────────────────
window.addToCart = function (productId, qtyDelta = 1) {
  const product = window.DATA.products.find(function (p) { return p.id === productId; });
  if (!product || product.stock <= 0) return;

  const existing = window.APP_STATE.cart.find(function (item) { return item.productId === productId; });
  if (existing) {
    existing.qty = Math.min(product.stock, existing.qty + qtyDelta);
  } else {
    window.APP_STATE.cart.push({ productId: productId, qty: Math.max(1, qtyDelta) });
  }

  storageSet('minisouk_cart', window.APP_STATE.cart);
  window.updateHeaderBadges();
  window.showToast(window.t('toasts.addedToCart'), 'success');

  // تأثير نبض لطيف على أيقونة السلة
  const cartBadge = document.getElementById('navCartCount');
  if (cartBadge) {
    cartBadge.classList.remove('bump');
    void cartBadge.offsetWidth;
    cartBadge.classList.add('bump');
  }
};

window.updateCartQty = function (productId, newQty) {
  const qty = parseInt(newQty, 10);
  if (isNaN(qty) || qty <= 0) {
    window.removeFromCart(productId);
    return;
  }
  const product = window.DATA.products.find(function (p) { return p.id === productId; });
  const maxStock = product ? product.stock : 99;
  const item = window.APP_STATE.cart.find(function (ci) { return ci.productId === productId; });
  if (item) {
    item.qty = Math.min(maxStock, qty);
    storageSet('minisouk_cart', window.APP_STATE.cart);
    window.updateHeaderBadges();
    window.renderCurrentRoute(false);
  }
};

window.removeFromCart = function (productId) {
  window.APP_STATE.cart = window.APP_STATE.cart.filter(function (ci) { return ci.productId !== productId; });
  storageSet('minisouk_cart', window.APP_STATE.cart);
  window.updateHeaderBadges();
  window.showToast(window.t('toasts.removedFromCart'), 'info');
  window.renderCurrentRoute(false);
};

window.clearCart = function () {
  window.APP_STATE.cart = [];
  window.APP_STATE.activeCoupon = null;
  storageSet('minisouk_cart', []);
  storageSet('minisouk_coupon', null);
  window.updateHeaderBadges();
  window.renderCurrentRoute(false);
};

window.toggleWishlist = function (productId) {
  const idx = window.APP_STATE.wishlist.indexOf(productId);
  if (idx > -1) {
    window.APP_STATE.wishlist.splice(idx, 1);
    window.showToast(window.t('toasts.wishlistRemoved'), 'info');
  } else {
    window.APP_STATE.wishlist.push(productId);
    window.showToast(window.t('toasts.wishlistAdded'), 'success');
  }
  storageSet('minisouk_wishlist', window.APP_STATE.wishlist);
  window.updateHeaderBadges();

  // تحديث أزرار القلب في الصفحة الحالية بدون إعادة تحميل كامل
  document.querySelectorAll(`[data-wishlist-btn="${productId}"]`).forEach(function (btn) {
    const isFav = window.APP_STATE.wishlist.includes(productId);
    btn.classList.toggle('active', isFav);
    btn.innerHTML = isFav ? '❤️' : '🤍';
  });

  if (window.APP_STATE.wishlistOnly) {
    window.renderCurrentRoute(false);
  }
};

window.toggleWishlistFilter = function () {
  window.APP_STATE.wishlistOnly = !window.APP_STATE.wishlistOnly;
  const wishBtn = document.getElementById('navWishlistBtn');
  if (wishBtn) {
    wishBtn.classList.toggle('active-filter', window.APP_STATE.wishlistOnly);
  }
  if (window.location.hash !== '#/' && window.location.hash !== '') {
    window.location.hash = '#/';
  } else {
    window.renderCurrentRoute(false);
  }
  const productsSection = document.getElementById('productsShowcaseSection');
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' });
  }
};

window.updateHeaderBadges = function () {
  const totalCartItems = window.APP_STATE.cart.reduce(function (acc, item) { return acc + (item.qty || 0); }, 0);
  const cartBadge = document.getElementById('navCartCount');
  if (cartBadge) {
    cartBadge.textContent = totalCartItems;
  }
  const wishBadge = document.getElementById('navWishlistCount');
  if (wishBadge) {
    wishBadge.textContent = window.APP_STATE.wishlist.length;
  }
};

window.applyCouponCode = function () {
  const input = document.getElementById('couponCodeInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  const found = window.DATA.settings.coupons.find(function (c) { return c.code === code; });
  if (found) {
    window.APP_STATE.activeCoupon = found;
    storageSet('minisouk_coupon', found);
    window.showToast(window.t('toasts.couponApplied'), 'success');
    window.renderCurrentRoute(false);
  } else {
    window.showToast(window.t('toasts.couponInvalid'), 'warning');
  }
};

// ─────────────────────────────────────────────────────────────────────────
// 7. بناء البطاقات الموحدة (تاجر / منتج / نجوم التقييم)
// ─────────────────────────────────────────────────────────────────────────
window.renderStars = function (rating) {
  const full = Math.round(Number(rating) || 5);
  return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));
};

window.renderMerchantCard = function (merchant) {
  const mName = window.getLocalizedField(merchant, 'name');
  const mCity = window.getLocalizedField(merchant, 'city');
  const mDesc = window.getLocalizedField(merchant, 'description');
  const mBadge = merchant.badge ? merchant.badge[window.currentLang || 'ar'] : '';
  const productCount = window.DATA.products.filter(function (p) { return p.merchantId === merchant.id; }).length;

  return `
    <article class="merchant-card fade-in-up">
      <div class="merchant-card-cover" style="background: ${merchant.coverColor}">
        <span class="merchant-badge-pill">${mBadge}</span>
        <button type="button" class="merchant-wa-icon-btn" onclick="window.contactMerchantViaWhatsApp('${merchant.id}')" title="${window.t('merchant.contactWhatsapp')}">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/></svg>
        </button>
      </div>
      <div class="merchant-card-body">
        <div class="merchant-avatar-wrap">
          <div class="merchant-avatar">${merchant.logo}</div>
          ${merchant.verified ? `<span class="verified-check" title="${window.t('merchant.verified')}">✔</span>` : ''}
        </div>
        <div class="merchant-meta-top">
          <span class="merchant-city-tag">📍 ${mCity}</span>
          <span class="merchant-rating-pill">★ ${merchant.rating.toFixed(1)} (${merchant.reviewsCount})</span>
        </div>
        <h3 class="merchant-title">
          <a href="#/merchant/${merchant.id}">${mName}</a>
        </h3>
        <p class="merchant-desc">${mDesc}</p>
        <div class="merchant-card-footer">
          <span class="merchant-prod-count">📦 ${productCount} ${window.t('merchant.productsCount')}</span>
          <div class="merchant-actions">
            <a href="#/merchant/${merchant.id}" class="btn-outline-sm">${window.t('merchant.visitStore')}</a>
            <button type="button" class="btn-wa-sm" onclick="window.contactMerchantViaWhatsApp('${merchant.id}')">
              <span>واتساب</span> 💬
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
};

window.renderProductCard = function (product) {
  const merchant = window.DATA.merchants.find(function (m) { return m.id === product.merchantId; }) || window.DATA.merchants[0];
  const pTitle = window.getLocalizedField(product, 'title');
  const mName = window.getLocalizedField(merchant, 'name');
  const isFav = window.APP_STATE.wishlist.includes(product.id);
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPct = hasDiscount ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return `
    <article class="product-card fade-in-up">
      <div class="product-media">
        <a href="#/product/${product.id}" class="product-img-link">
          <img src="${product.image}" alt="${pTitle}" loading="lazy" class="product-img" />
        </a>
        <div class="product-badges">
          ${hasDiscount ? `<span class="badge-discount">-${discountPct}%</span>` : ''}
          ${product.tags && product.tags.includes('bestseller') ? `<span class="badge-hot">🔥</span>` : ''}
        </div>
        <button type="button" class="wishlist-btn ${isFav ? 'active' : ''}" data-wishlist-btn="${product.id}" onclick="window.toggleWishlist('${product.id}')" aria-label="Wishlist">
          ${isFav ? '❤️' : '🤍'}
        </button>
      </div>

      <div class="product-body">
        <div class="product-merchant-row">
          <a href="#/merchant/${merchant.id}" class="product-merchant-link">
            <span>${merchant.logo}</span>
            <span>${mName}</span>
          </a>
          <span class="product-rating">★ ${Number(product.rating).toFixed(1)}</span>
        </div>

        <h3 class="product-title">
          <a href="#/product/${product.id}">${pTitle}</a>
        </h3>

        <div class="product-price-row">
          <div class="price-block">
            <span class="price-current">${window.formatPrice(product.price)}</span>
            ${hasDiscount ? `<span class="price-old">${window.formatPrice(product.oldPrice)}</span>` : ''}
          </div>
          <span class="stock-pill ${product.stock <= 5 ? 'low' : 'ok'}">
            ${product.stock > 0 ? `${product.stock} 📦` : window.t('product.outOfStock')}
          </span>
        </div>

        <div class="product-actions-row">
          <button type="button" class="btn-add-cart" onclick="window.addToCart('${product.id}', 1)" ${product.stock <= 0 ? 'disabled' : ''}>
            🛒 ${window.t('product.addToCart')}
          </button>
          <button type="button" class="btn-wa-order" onclick="window.orderProductViaWhatsApp('${product.id}')" title="${window.t('product.orderWhatsapp')}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/></svg>
            <span>${window.t('product.orderWhatsapp')}</span>
          </button>
        </div>
      </div>
    </article>
  `;
};

// ─────────────────────────────────────────────────────────────────────────
// 8. الفلترة والترتيب وحاسبة التوصيل
// ─────────────────────────────────────────────────────────────────────────
window.getFilteredProducts = function (overrideCategory, overrideMerchantId) {
  const f = window.APP_STATE.filters;
  const q = (f.searchQuery || '').trim().toLowerCase();

  let list = window.DATA.products.filter(function (p) {
    const merchant = window.DATA.merchants.find(function (m) { return m.id === p.merchantId; });

    // فلتر المفضلة فقط إن كان مفعلاً
    if (window.APP_STATE.wishlistOnly && !window.APP_STATE.wishlist.includes(p.id)) {
      return false;
    }

    // فلتر التاجر
    if (overrideMerchantId && p.merchantId !== overrideMerchantId) {
      return false;
    }

    // فلتر القسم
    const activeCat = overrideCategory || f.category;
    if (activeCat && activeCat !== 'all' && p.category !== activeCat) {
      return false;
    }

    // فلتر المدينة
    if (f.city && f.city !== 'all' && merchant && merchant.city !== f.city) {
      return false;
    }

    // فلتر التبويبات السريعة (الأكثر مبيعاً / جديد / عروض)
    if (f.tagTab === 'bestseller' && !(p.tags && p.tags.includes('bestseller'))) {
      return false;
    }
    if (f.tagTab === 'new' && !(p.tags && p.tags.includes('new'))) {
      return false;
    }
    if (f.tagTab === 'deal' && !(p.oldPrice && p.oldPrice > p.price)) {
      return false;
    }

    // البحث النصي الفوري (في العنوان، الوصف، الوسوم، اسم التاجر، المدينة)
    if (q) {
      const hay = [
        p.title,
        p.description,
        p.titleI18n && p.titleI18n.fr,
        p.titleI18n && p.titleI18n.en,
        merchant && merchant.name,
        merchant && merchant.city,
        (p.tags || []).join(' ')
      ].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  // الترتيب
  if (f.sortBy === 'price-asc') {
    list.sort(function (a, b) { return a.price - b.price; });
  } else if (f.sortBy === 'price-desc') {
    list.sort(function (a, b) { return b.price - a.price; });
  } else if (f.sortBy === 'rating') {
    list.sort(function (a, b) { return b.rating - a.rating; });
  }

  return list;
};

window.setFilterValue = function (key, value) {
  window.APP_STATE.filters[key] = value;
  window.renderCurrentRoute(false);
};

window.resetAllFilters = function () {
  window.APP_STATE.filters = {
    searchQuery: '',
    category: 'all',
    city: 'all',
    sortBy: 'featured',
    tagTab: 'all'
  };
  window.APP_STATE.wishlistOnly = false;
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) searchInput.value = '';
  const wishBtn = document.getElementById('navWishlistBtn');
  if (wishBtn) wishBtn.classList.remove('active-filter');

  if (window.location.hash.startsWith('#/search') || window.location.hash.startsWith('#/category')) {
    window.location.hash = '#/';
  } else {
    window.renderCurrentRoute(false);
  }
};

window.changeShippingWilaya = function (wilayaId) {
  window.APP_STATE.selectedWilaya = wilayaId;
  storageSetRaw('minisouk_wilaya', wilayaId);
  window.renderCurrentRoute(false);
};

// ─────────────────────────────────────────────────────────────────────────
// 9. عروض الصفحات (Views)
// ─────────────────────────────────────────────────────────────────────────

// أ) الصفحة الرئيسية (#/)
function renderHomeView() {
  const cities = Array.from(new Set(window.DATA.merchants.map(function (m) { return m.city; })));
  const filteredProducts = window.getFilteredProducts();
  const activeWilaya = window.DATA.settings.wilayas.find(function (w) { return w.id === window.APP_STATE.selectedWilaya; }) || window.DATA.settings.wilayas[0];
  const f = window.APP_STATE.filters;

  return `
    <!-- Hero Banner الزعفراني المتوسطي -->
    <section class="hero-banner">
      <div class="hero-pattern-overlay"></div>
      <div class="container hero-grid">
        <div class="hero-content">
          <span class="hero-pill">${window.t('hero.badge')}</span>
          <h1 class="hero-title">${window.t('hero.title')}</h1>
          <p class="hero-subtitle">${window.t('hero.subtitle')}</p>
          <div class="hero-cta-group">
            <a href="#productsShowcaseSection" onclick="document.getElementById('productsShowcaseSection').scrollIntoView({behavior:'smooth'}); return false;" class="btn-primary-lg">
              🛍️ ${window.t('hero.ctaExplore')}
            </a>
            <a href="#/dashboard" class="btn-glass-lg">
              📊 ${window.t('hero.ctaDashboard')}
            </a>
          </div>
          <div class="hero-stats-row">
            <div class="hero-stat-item">
              <strong>+${window.DATA.merchants.length}</strong>
              <span>${window.t('hero.statMerchants')}</span>
            </div>
            <div class="hero-stat-item">
              <strong>+${window.DATA.products.length}</strong>
              <span>${window.t('hero.statProducts')}</span>
            </div>
            <div class="hero-stat-item">
              <strong>58</strong>
              <span>${window.t('hero.statCities')}</span>
            </div>
          </div>
        </div>

        <div class="hero-showcase-card">
          <div class="hero-floating-card">
            <div class="floating-header">
              <span class="live-dot"></span>
              <span>سوق صغير المباشر — تواصل فوري</span>
            </div>
            <div class="hero-mini-merchants">
              ${window.DATA.merchants.slice(0, 4).map(function (m) {
                return `
                  <a href="#/merchant/${m.id}" class="hero-mini-merchant">
                    <span class="mini-logo">${m.logo}</span>
                    <div class="mini-info">
                      <strong>${window.getLocalizedField(m, 'name')}</strong>
                      <small>📍 ${window.getLocalizedField(m, 'city')} • ★ ${m.rating}</small>
                    </div>
                    <span class="mini-wa-badge">💬</span>
                  </a>
                `;
              }).join('')}
            </div>
            <div class="shipping-estimator-box">
              <div class="shipping-title">${window.t('sections.shippingCalcTitle')}</div>
              <div class="shipping-controls">
                <select aria-label="${window.t('sections.shippingSelectWilaya')}" onchange="window.changeShippingWilaya(this.value)" class="shipping-select">
                  ${window.DATA.settings.wilayas.map(function (w) {
                    return `<option value="${w.id}" ${w.id === activeWilaya.id ? 'selected' : ''}>${w.name[window.currentLang || 'ar']}</option>`;
                  }).join('')}
                </select>
                <div class="shipping-result">
                  <span>${window.formatPrice(activeWilaya.shippingFee)}</span>
                  <small>(${activeWilaya.days} ${window.t('sections.shippingDaysUnit')})</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- شريط التصنيفات التفاعلي -->
    <section class="section-block container">
      <div class="section-header">
        <div>
          <h2 class="section-title">${window.t('sections.categoriesTitle')}</h2>
          <p class="section-sub">${window.t('sections.categoriesSub')}</p>
        </div>
      </div>
      <div class="categories-strip">
        ${window.DATA.categories.map(function (cat) {
          const isActive = f.category === cat.id;
          return `
            <button type="button" class="category-pill ${isActive ? 'active' : ''}" onclick="window.setFilterValue('category', '${cat.id}')">
              <span class="cat-icon">${cat.icon}</span>
              <span class="cat-name">${cat.name[window.currentLang || 'ar']}</span>
            </button>
          `;
        }).join('')}
      </div>
    </section>

    <!-- قسم المتاجر المستقلة -->
    <section class="section-block container" id="merchantsSection">
      <div class="section-header">
        <div>
          <h2 class="section-title">${window.t('sections.merchantsTitle')}</h2>
          <p class="section-sub">${window.t('sections.merchantsSub')}</p>
        </div>
      </div>
      <div class="merchants-grid">
        ${window.DATA.merchants.map(window.renderMerchantCard).join('')}
      </div>
    </section>

    <!-- معرض المنتجات والفلترة المتقدمة -->
    <section class="section-block container" id="productsShowcaseSection">
      <div class="section-header">
        <div>
          <h2 class="section-title">
            ${window.APP_STATE.wishlistOnly ? '❤️ ' + window.t('nav.wishlist') : window.t('sections.productsTitle')}
          </h2>
          <p class="section-sub">${window.t('sections.productsSub')}</p>
        </div>
        <div class="results-counter-badge">
          <strong>${filteredProducts.length}</strong> ${window.t('filters.resultsCount')}
        </div>
      </div>

      <!-- شريط التبويبات والفلاتر (المدينة + الترتيب + العروض) -->
      <div class="filter-toolbar">
        <div class="tag-tabs">
          <button type="button" class="tag-tab ${f.tagTab === 'all' ? 'active' : ''}" onclick="window.setFilterValue('tagTab', 'all')">${window.t('filters.tabAll')}</button>
          <button type="button" class="tag-tab ${f.tagTab === 'bestseller' ? 'active' : ''}" onclick="window.setFilterValue('tagTab', 'bestseller')">${window.t('filters.tabBestseller')}</button>
          <button type="button" class="tag-tab ${f.tagTab === 'new' ? 'active' : ''}" onclick="window.setFilterValue('tagTab', 'new')">${window.t('filters.tabNew')}</button>
          <button type="button" class="tag-tab ${f.tagTab === 'deal' ? 'active' : ''}" onclick="window.setFilterValue('tagTab', 'deal')">${window.t('filters.tabDeals')}</button>
        </div>

        <div class="filter-selects">
          <select class="filter-select" aria-label="Filter by city" onchange="window.setFilterValue('city', this.value)">
            <option value="all">${window.t('filters.allCities')}</option>
            ${cities.map(function (c) {
              return `<option value="${c}" ${f.city === c ? 'selected' : ''}>📍 ${c}</option>`;
            }).join('')}
          </select>

          <select class="filter-select" aria-label="Sort products" onchange="window.setFilterValue('sortBy', this.value)">
            <option value="featured" ${f.sortBy === 'featured' ? 'selected' : ''}>${window.t('filters.sortFeatured')}</option>
            <option value="price-asc" ${f.sortBy === 'price-asc' ? 'selected' : ''}>${window.t('filters.sortPriceAsc')}</option>
            <option value="price-desc" ${f.sortBy === 'price-desc' ? 'selected' : ''}>${window.t('filters.sortPriceDesc')}</option>
            <option value="rating" ${f.sortBy === 'rating' ? 'selected' : ''}>${window.t('filters.sortRating')}</option>
          </select>

          ${(f.category !== 'all' || f.city !== 'all' || f.tagTab !== 'all' || f.searchQuery || window.APP_STATE.wishlistOnly) ? `
            <button type="button" class="btn-reset-filter" onclick="window.resetAllFilters()">
              ↺ ${window.t('filters.clearFilters')}
            </button>
          ` : ''}
        </div>
      </div>

      ${filteredProducts.length > 0 ? `
        <div class="products-grid">
          ${filteredProducts.map(window.renderProductCard).join('')}
        </div>
      ` : `
        <div class="empty-state-box">
          <div class="empty-emoji">🧭</div>
          <h3>لا توجد منتجات مطابقة لخيارات البحث الحالية</h3>
          <p>جرّب تغيير القسم أو المدينة أو استعادة جميع الفلاتر لاستكشاف كافة منتجات السوق.</p>
          <button type="button" class="btn-primary-lg" onclick="window.resetAllFilters()">${window.t('filters.clearFilters')}</button>
        </div>
      `}
    </section>
  `;
}

// ب) صفحة متجر التاجر (#/merchant/:id) مع زر واتساب العائم
function renderMerchantView(merchantId) {
  const merchant = window.DATA.merchants.find(function (m) { return m.id === merchantId; });
  if (!merchant) {
    return renderHomeView();
  }
  const mName = window.getLocalizedField(merchant, 'name');
  const mCity = window.getLocalizedField(merchant, 'city');
  const mDesc = window.getLocalizedField(merchant, 'description');
  const merchantProducts = window.getFilteredProducts(null, merchant.id);

  return `
    <div class="container page-View-wrap">
      <nav class="breadcrumb-nav">
        <a href="#/">${window.t('nav.home')}</a>
        <span>/</span>
        <span>${mName}</span>
      </nav>

      <section class="merchant-hero-header" style="background: ${merchant.coverColor}">
        <div class="merchant-hero-inner">
          <div class="merchant-hero-avatar">${merchant.logo}</div>
          <div class="merchant-hero-info">
            <div class="merchant-hero-badges">
              <span class="verified-pill">✔ ${window.t('merchant.verified')}</span>
              <span class="city-pill">📍 ${mCity}</span>
              <span class="rating-pill">★ ${merchant.rating} (${merchant.reviewsCount} ${window.t('merchant.reviews')})</span>
            </div>
            <h1>${mName}</h1>
            <p>${mDesc}</p>
            <div class="merchant-contact-chips">
              <span>📞 <b dir="ltr">${merchant.phone}</b></span>
              <span>📸 <b dir="ltr">${merchant.instagram}</b></span>
            </div>
          </div>
          <div class="merchant-hero-cta">
            <button type="button" class="btn-wa-hero" onclick="window.contactMerchantViaWhatsApp('${merchant.id}')">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/></svg>
              <span>${window.t('merchant.contactWhatsapp')}</span>
            </button>
          </div>
        </div>
      </section>

      <section class="section-block">
        <div class="section-header">
          <h2 class="section-title">${window.t('merchant.allMerchantProducts')} (${merchantProducts.length})</h2>
          <a href="#/" class="btn-outline-sm">← ${window.t('merchant.backToHome')}</a>
        </div>
        <div class="products-grid">
          ${merchantProducts.map(window.renderProductCard).join('')}
        </div>
      </section>

      <!-- زر واتساب العائم الخاص بصفحة التاجر (إجباري) -->
      <button type="button" class="floating-wa-merchant-btn" onclick="window.contactMerchantViaWhatsApp('${merchant.id}')" title="${window.t('merchant.floatingWhatsapp')}">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/></svg>
        <span>${window.t('merchant.floatingWhatsapp')}</span>
      </button>
    </div>
  `;
}

// ج) صفحة تفاصيل المنتج (#/product/:id) مع معرض الصور والتقييمات
window.switchProductGalleryImage = function (idx, imgSrc) {
  window.APP_STATE.activeGalleryIndex = idx;
  const mainImg = document.getElementById('mainProductDetailImg');
  if (mainImg) mainImg.src = imgSrc;
  document.querySelectorAll('.gallery-thumb-btn').forEach(function (btn, i) {
    btn.classList.toggle('active', i === idx);
  });
};

window.submitProductReview = function (event, productId) {
  event.preventDefault();
  const nameEl = document.getElementById('reviewAuthorName');
  const ratingEl = document.getElementById('reviewRatingSelect');
  const commentEl = document.getElementById('reviewCommentText');
  if (!nameEl || !commentEl || !nameEl.value.trim() || !commentEl.value.trim()) return;

  if (!window.APP_STATE.reviews[productId]) {
    window.APP_STATE.reviews[productId] = [];
  }
  window.APP_STATE.reviews[productId].unshift({
    name: nameEl.value.trim(),
    rating: Number(ratingEl ? ratingEl.value : 5),
    comment: commentEl.value.trim(),
    date: new Date().toISOString().slice(0, 10)
  });
  storageSet('minisouk_reviews', window.APP_STATE.reviews);
  window.showToast(window.t('toasts.reviewAdded'), 'success');
  window.renderCurrentRoute(false);
};

window.copyCurrentProductLink = function () {
  const url = window.location.href;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
    } else {
      const temp = document.createElement('input');
      document.body.appendChild(temp);
      temp.value = url;
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    }
  } catch (e) {
    // fallback
  }
  window.showToast(window.t('toasts.linkCopied'), 'info');
};

function renderProductDetailView(productId) {
  const product = window.DATA.products.find(function (p) { return p.id === productId; });
  if (!product) return renderHomeView();

  const merchant = window.DATA.merchants.find(function (m) { return m.id === product.merchantId; }) || window.DATA.merchants[0];
  const pTitle = window.getLocalizedField(product, 'title');
  const pDesc = window.getLocalizedField(product, 'description');
  const mName = window.getLocalizedField(merchant, 'name');
  const gallery = (product.gallery && product.gallery.length > 0) ? product.gallery : [product.image];
  const relatedProducts = window.DATA.products.filter(function (p) {
    return p.merchantId === product.merchantId && p.id !== product.id;
  }).slice(0, 3);
  const reviews = window.APP_STATE.reviews[product.id] || [];

  return `
    <div class="container page-view-wrap">
      <nav class="breadcrumb-nav">
        <a href="#/">${window.t('nav.home')}</a>
        <span>/</span>
        <a href="#/merchant/${merchant.id}">${mName}</a>
        <span>/</span>
        <span>${pTitle}</span>
      </nav>

      <div class="product-detail-card">
        <div class="product-detail-gallery">
          <div class="main-image-frame">
            <img id="mainProductDetailImg" src="${gallery[0]}" alt="${pTitle}" />
          </div>
          ${gallery.length > 1 ? `
            <div class="gallery-thumbs">
              ${gallery.map(function (imgUrl, idx) {
                return `
                  <button type="button" class="gallery-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="window.switchProductGalleryImage(${idx}, '${imgUrl}')">
                    <img src="${imgUrl}" alt="thumb ${idx + 1}" />
                  </button>
                `;
              }).join('')}
            </div>
          ` : ''}
        </div>

        <div class="product-detail-info">
          <div class="detail-top-meta">
            <span class="sku-tag">${window.t('product.sku')} #${product.id.toUpperCase()}</span>
            <span class="detail-rating">★ ${product.rating.toFixed(1)} (${reviews.length + 12})</span>
          </div>

          <h1 class="detail-title">${pTitle}</h1>

          <div class="detail-price-box">
            <span class="detail-price-now">${window.formatPrice(product.price)}</span>
            ${product.oldPrice ? `<span class="detail-price-old">${window.formatPrice(product.oldPrice)}</span>` : ''}
            <span class="detail-stock-badge">${product.stock > 0 ? `✔ ${window.t('product.inStock')} (${product.stock})` : window.t('product.outOfStock')}</span>
          </div>

          <p class="detail-description">${pDesc}</p>

          <div class="detail-tags-list">
            ${(product.tags || []).map(function (tag) { return `<span class="tag-chip">#${tag}</span>`; }).join('')}
          </div>

          <div class="detail-merchant-box">
            <div class="dm-left">
              <span class="dm-logo">${merchant.logo}</span>
              <div>
                <small>${window.t('product.soldBy')}</small>
                <h4><a href="#/merchant/${merchant.id}">${mName}</a></h4>
                <span>📍 ${window.getLocalizedField(merchant, 'city')}</span>
              </div>
            </div>
            <button type="button" class="btn-outline-sm" onclick="window.contactMerchantViaWhatsApp('${merchant.id}')">
              💬 ${window.t('merchant.contactWhatsapp')}
            </button>
          </div>

          <div class="detail-cta-row">
            <button type="button" class="btn-primary-lg" onclick="window.addToCart('${product.id}', 1)">
              🛒 ${window.t('product.addToCart')}
            </button>
            <button type="button" class="btn-wa-lg" onclick="window.orderProductViaWhatsApp('${product.id}')">
              💬 ${window.t('product.orderWhatsapp')}
            </button>
            <button type="button" class="btn-icon-only" onclick="window.copyCurrentProductLink()" title="${window.t('product.shareProduct')}">
              🔗
            </button>
          </div>
        </div>
      </div>

      <!-- قسم تقييمات العملاء -->
      <section class="reviews-section">
        <div class="reviews-grid">
          <div class="reviews-list-col">
            <h3>${window.t('product.customerReviews')} (${reviews.length})</h3>
            ${reviews.length > 0 ? reviews.map(function (r) {
              return `
                <div class="review-card">
                  <div class="review-head">
                    <strong>👤 ${r.name}</strong>
                    <span class="review-stars">${window.renderStars(r.rating)}</span>
                  </div>
                  <p>${r.comment}</p>
                  <small>${r.date}</small>
                </div>
              `;
            }).join('') : `<p class="muted-note">كن أول من يشارك تجربته مع هذا المنتج الأصيل!</p>`}
          </div>

          <form class="review-form-card" onsubmit="window.submitProductReview(event, '${product.id}')">
            <h3>${window.t('product.addReviewTitle')}</h3>
            <div class="form-group">
              <label>${window.t('product.yourName')}</label>
              <input type="text" id="reviewAuthorName" required placeholder="مثال: ياسين ب." />
            </div>
            <div class="form-group">
              <label>التقييم</label>
              <select id="reviewRatingSelect">
                <option value="5">★★★★★ (5/5 ممتاز)</option>
                <option value="4">★★★★☆ (4/5 جيد جداً)</option>
                <option value="3">★★★☆☆ (3/5 جيد)</option>
              </select>
            </div>
            <div class="form-group">
              <label>${window.t('product.yourComment')}</label>
              <textarea id="reviewCommentText" rows="3" required placeholder="${window.t('product.yourComment')}"></textarea>
            </div>
            <button type="submit" class="btn-primary-lg full-w">${window.t('product.submitReview')}</button>
          </form>
        </div>
      </section>

      ${relatedProducts.length > 0 ? `
        <section class="section-block">
          <h2 class="section-title">${window.t('product.relatedTitle')}</h2>
          <div class="products-grid">
            ${relatedProducts.map(window.renderProductCard).join('')}
          </div>
        </section>
      ` : ''}
    </div>
  `;
}

// د) صفحة السلة الذكية متعددة التجار (#/cart)
function renderCartView() {
  const cartEntries = window.APP_STATE.cart
    .map(function (ci) {
      const product = window.DATA.products.find(function (p) { return p.id === ci.productId; });
      return product ? { product: product, qty: ci.qty } : null;
    })
    .filter(Boolean);

  if (cartEntries.length === 0) {
    return `
      <div class="container page-view-wrap">
        <div class="empty-state-box">
          <div class="empty-emoji">🛒</div>
          <h2>${window.t('cart.emptyTitle')}</h2>
          <p>${window.t('cart.emptySub')}</p>
          <a href="#/" class="btn-primary-lg">${window.t('cart.browseBtn')}</a>
        </div>
      </div>
    `;
  }

  // تجميع المنتجات حسب كل تاجر مستقل
  const groupedByMerchant = {};
  let overallSubtotal = 0;

  cartEntries.forEach(function (entry) {
    const mId = entry.product.merchantId;
    if (!groupedByMerchant[mId]) {
      groupedByMerchant[mId] = [];
    }
    groupedByMerchant[mId].push(entry);
    overallSubtotal += entry.product.price * entry.qty;
  });

  const merchantIds = Object.keys(groupedByMerchant);
  const discountPct = window.APP_STATE.activeCoupon ? window.APP_STATE.activeCoupon.discountPercent : 0;
  const discountAmount = Math.round((overallSubtotal * discountPct) / 100);
  const wilayaObj = window.DATA.settings.wilayas.find(function (w) { return w.id === window.APP_STATE.selectedWilaya; }) || window.DATA.settings.wilayas[0];
  const shippingTotal = (wilayaObj ? wilayaObj.shippingFee : 500) * merchantIds.length;
  const grandTotal = overallSubtotal - discountAmount + shippingTotal;

  return `
    <div class="container page-view-wrap">
      <div class="section-header">
        <div>
          <h1 class="section-title">🛒 ${window.t('cart.title')}</h1>
          <p class="section-sub">${window.t('cart.subtitle')}</p>
        </div>
        <button type="button" class="btn-reset-filter" onclick="window.clearCart()">🗑️ ${window.t('cart.clearCart')}</button>
      </div>

      <div class="cart-layout-grid">
        <!-- قائمة المنتجات مقسمة حسب التاجر -->
        <div class="cart-merchants-col">
          <h3 class="sub-heading">${window.t('cart.groupedByMerchant')}</h3>
          ${merchantIds.map(function (mId) {
            const merchant = window.DATA.merchants.find(function (m) { return m.id === mId; }) || window.DATA.merchants[0];
            const items = groupedByMerchant[mId];
            const mSubtotal = items.reduce(function (s, e) { return s + e.product.price * e.qty; }, 0);

            return `
              <div class="cart-merchant-group">
                <div class="cm-header">
                  <div class="cm-title">
                    <span class="cm-logo">${merchant.logo}</span>
                    <div>
                      <strong>${window.getLocalizedField(merchant, 'name')}</strong>
                      <small>📍 ${window.getLocalizedField(merchant, 'city')}</small>
                    </div>
                  </div>
                  <span class="cm-subtotal">${window.formatPrice(mSubtotal)}</span>
                </div>

                <div class="cm-items-list">
                  ${items.map(function (entry) {
                    const p = entry.product;
                    return `
                      <div class="cart-item-row">
                        <img src="${p.image}" alt="${window.getLocalizedField(p, 'title')}" class="cart-item-img" />
                        <div class="cart-item-info">
                          <a href="#/product/${p.id}" class="cart-item-title">${window.getLocalizedField(p, 'title')}</a>
                          <span class="cart-item-unit">${window.formatPrice(p.price)}</span>
                        </div>
                        <div class="cart-qty-controls">
                          <button type="button" onclick="window.updateCartQty('${p.id}', ${entry.qty - 1})">−</button>
                          <span>${entry.qty}</span>
                          <button type="button" onclick="window.updateCartQty('${p.id}', ${entry.qty + 1})">+</button>
                        </div>
                        <div class="cart-item-total">${window.formatPrice(p.price * entry.qty)}</div>
                        <button type="button" class="cart-remove-btn" onclick="window.removeFromCart('${p.id}')" title="Remove">✕</button>
                      </div>
                    `;
                  }).join('')}
                </div>

                <div class="cm-footer">
                  <button type="button" class="btn-wa-merchant-checkout" onclick="window.checkoutMerchantCartViaWhatsApp('${merchant.id}')">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/></svg>
                    <span>${window.t('cart.checkoutMerchantBtn')} (${window.getLocalizedField(merchant, 'name')})</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- ملخص الطلب وبيانات الزبون والكوبون -->
        <aside class="cart-summary-card">
          <h3>${window.t('cart.customerInfoTitle')}</h3>
          <div class="form-group">
            <label>${window.t('cart.customerName')}</label>
            <input type="text" id="cartCustomerName" value="${window.APP_STATE.customerInfo.name || ''}" placeholder="${window.t('cart.customerNamePlaceholder')}" />
          </div>
          <div class="form-group">
            <label>${window.t('cart.customerCity')}</label>
            <select id="cartCustomerCity" onchange="window.changeShippingWilaya(this.options[this.selectedIndex].getAttribute('data-wid'))">
              ${window.DATA.settings.wilayas.map(function (w) {
                const wLabel = w.name[window.currentLang || 'ar'];
                return `<option value="${wLabel}" data-wid="${w.id}" ${w.id === window.APP_STATE.selectedWilaya ? 'selected' : ''}>${wLabel}</option>`;
              }).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>${window.t('cart.customerAddress')}</label>
            <input type="text" id="cartCustomerAddress" value="${window.APP_STATE.customerInfo.address || ''}" placeholder="${window.t('cart.customerAddressPlaceholder')}" />
          </div>

          <div class="coupon-box">
            <label>${window.t('cart.couponLabel')}</label>
            <div class="coupon-input-row">
              <input type="text" id="couponCodeInput" value="${window.APP_STATE.activeCoupon ? window.APP_STATE.activeCoupon.code : ''}" placeholder="${window.t('cart.couponPlaceholder')}" />
              <button type="button" class="btn-outline-sm" onclick="window.applyCouponCode()">${window.t('cart.applyCoupon')}</button>
            </div>
          </div>

          <div class="summary-totals">
            <div class="summary-line">
              <span>${window.t('cart.subtotal')}</span>
              <strong>${window.formatPrice(overallSubtotal)}</strong>
            </div>
            ${discountAmount > 0 ? `
              <div class="summary-line discount">
                <span>${window.t('cart.discount')} (${window.APP_STATE.activeCoupon.code})</span>
                <strong>-${window.formatPrice(discountAmount)}</strong>
              </div>
            ` : ''}
            <div class="summary-line">
              <span>${window.t('cart.shipping')} (${merchantIds.length} متجر)</span>
              <strong>${window.formatPrice(shippingTotal)}</strong>
            </div>
            <div class="summary-line total">
              <span>${window.t('cart.total')}</span>
              <strong>${window.formatPrice(grandTotal)}</strong>
            </div>
          </div>

          <button type="button" class="btn-wa-lg full-w" onclick="window.checkoutMerchantCartViaWhatsApp('${merchantIds[0]}')">
            💬 ${window.t('cart.checkoutAllBtn')}
          </button>
        </aside>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────
// 10. الموجه (SPA Hash Router) + Skeleton Loader
// ─────────────────────────────────────────────────────────────────────────
function renderSkeletonHTML() {
  return `
    <div class="container skeleton-wrap">
      <div class="skeleton-hero"></div>
      <div class="skeleton-grid">
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
      </div>
    </div>
  `;
}

window.renderCurrentRoute = function (withSkeleton = false) {
  const appRoot = document.getElementById('appRoot');
  if (!appRoot) return;

  const hash = window.location.hash || '#/';

  // تحديث حالة الروابط النشطة في شريط التنقل
  document.querySelectorAll('.nav-link-item').forEach(function (link) {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === hash || (hash === '#/' && href === '#/'));
  });

  const doRender = function () {
    if (hash.startsWith('#/merchant/')) {
      const mId = hash.replace('#/merchant/', '').trim();
      appRoot.innerHTML = renderMerchantView(mId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (hash.startsWith('#/product/')) {
      const pId = hash.replace('#/product/', '').trim();
      appRoot.innerHTML = renderProductDetailView(pId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (hash.startsWith('#/category/')) {
      const catName = decodeURIComponent(hash.replace('#/category/', '').trim());
      window.APP_STATE.filters.category = catName;
      appRoot.innerHTML = renderHomeView();
    } else if (hash.startsWith('#/search')) {
      const qIndex = hash.indexOf('?q=');
      if (qIndex > -1) {
        const qVal = decodeURIComponent(hash.slice(qIndex + 3));
        window.APP_STATE.filters.searchQuery = qVal;
      }
      appRoot.innerHTML = renderHomeView();
    } else if (hash.startsWith('#/cart')) {
      appRoot.innerHTML = renderCartView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (hash.startsWith('#/dashboard')) {
      if (typeof window.renderDashboardView === 'function') {
        appRoot.innerHTML = window.renderDashboardView();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      appRoot.innerHTML = renderHomeView();
    }
  };

  if (withSkeleton) {
    appRoot.innerHTML = renderSkeletonHTML();
    setTimeout(doRender, 180);
  } else {
    doRender();
  }
};

// تفعيل البحث الفوري من شريط التنقل
window.handleGlobalSearch = function (val) {
  window.APP_STATE.filters.searchQuery = val;
  if (window.location.hash !== '#/' && !window.location.hash.startsWith('#/search')) {
    window.location.hash = '#/search?q=' + encodeURIComponent(val);
  } else {
    window.renderCurrentRoute(false);
  }
};

// تهيئة التطبيق عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', function () {
  initTheme();
  window.setLanguage(window.currentLang || 'ar', false);
  window.updateHeaderBadges();
  window.renderCurrentRoute(true);

  window.addEventListener('hashchange', function () {
    window.renderCurrentRoute(true);
  });
});
