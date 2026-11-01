/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 سوق صغير (Mini Souk) — لوحة تحكم التاجر المتكاملة (dashboard.js)
 * ═══════════════════════════════════════════════════════════════════════════
 * يوفر هذا الملف:
 * - اختيار المتجر النشط من بين التجار المستقلين
 * - بطاقات إحصائية حية (عدد المنتجات، إجمالي المخزون، القيمة السوقية، التقييم)
 * - رسم بياني تفاعلي (CSS Bars) لتوزيع قيمة المخزون والكميات
 * - جدول إدارة المنتجات مع إضافة/تعديل/حذف وحفظ دائم في localStorage
 */

(function () {
  window.DASHBOARD_STATE = {
    selectedMerchantId: 'm1',
    editingProductId: null,
    isModalOpen: false
  };

  function saveProductsToStorage() {
    try {
      window.localStorage.setItem('minisouk_products', JSON.stringify(window.DATA.products));
    } catch (e) {
      // تجاهل أخطاء التخزين
    }
  }

  window.selectDashboardMerchant = function (merchantId) {
    window.DASHBOARD_STATE.selectedMerchantId = merchantId;
    window.DASHBOARD_STATE.editingProductId = null;
    window.DASHBOARD_STATE.isModalOpen = false;
    window.renderCurrentRoute(false);
  };

  window.openProductFormModal = function (productId = null) {
    window.DASHBOARD_STATE.editingProductId = productId;
    window.DASHBOARD_STATE.isModalOpen = true;
    window.renderCurrentRoute(false);
  };

  window.closeProductFormModal = function () {
    window.DASHBOARD_STATE.editingProductId = null;
    window.DASHBOARD_STATE.isModalOpen = false;
    window.renderCurrentRoute(false);
  };

  window.saveDashboardProduct = function (event) {
    event.preventDefault();
    const mId = window.DASHBOARD_STATE.selectedMerchantId;
    const editId = window.DASHBOARD_STATE.editingProductId;

    const titleVal = document.getElementById('dashFormTitle').value.trim();
    const priceVal = Number(document.getElementById('dashFormPrice').value) || 1000;
    const oldPriceVal = Number(document.getElementById('dashFormOldPrice').value) || null;
    const stockVal = Number(document.getElementById('dashFormStock').value) || 0;
    const catVal = document.getElementById('dashFormCategory').value || 'crafts';
    const emojiVal = document.getElementById('dashFormEmoji').value.trim() || '🛍️';
    const descVal = document.getElementById('dashFormDesc').value.trim();
    const tagsRaw = document.getElementById('dashFormTags').value.trim();
    const tagsArr = tagsRaw
      ? tagsRaw.split(',').map(function (s) { return s.trim(); }).filter(Boolean)
      : ['new'];

    // توليد صورة SVG أنيقة للمنتج الجديد أو المعدل
    const generatedImg = typeof window.createProductArt === 'function'
      ? window.createProductArt('#78350f', '#d97706', emojiVal, titleVal.slice(0, 22), 'منتج المتجر')
      : window.DATA.products[0].image;

    if (editId) {
      const existing = window.DATA.products.find(function (p) { return p.id === editId; });
      if (existing) {
        existing.title = titleVal;
        existing.titleI18n = { ar: titleVal, fr: titleVal, en: titleVal };
        existing.price = priceVal;
        existing.oldPrice = oldPriceVal;
        existing.stock = stockVal;
        existing.category = catVal;
        existing.description = descVal;
        existing.descriptionI18n = { ar: descVal, fr: descVal, en: descVal };
        existing.tags = tagsArr;
        if (emojiVal && emojiVal !== '🛍️') {
          existing.image = generatedImg;
          existing.gallery = [generatedImg];
        }
      }
    } else {
      const newId = 'p' + (Date.now().toString().slice(-5));
      window.DATA.products.unshift({
        id: newId,
        merchantId: mId,
        title: titleVal,
        titleI18n: { ar: titleVal, fr: titleVal, en: titleVal },
        description: descVal,
        descriptionI18n: { ar: descVal, fr: descVal, en: descVal },
        price: priceVal,
        oldPrice: oldPriceVal,
        image: generatedImg,
        gallery: [generatedImg],
        category: catVal,
        stock: stockVal,
        rating: 5.0,
        tags: tagsArr
      });
    }

    saveProductsToStorage();
    window.DASHBOARD_STATE.isModalOpen = false;
    window.DASHBOARD_STATE.editingProductId = null;
    window.showToast(window.t('toasts.productSaved'), 'success');
    window.renderCurrentRoute(false);
  };

  window.deleteDashboardProduct = function (productId) {
    window.DATA.products = window.DATA.products.filter(function (p) { return p.id !== productId; });
    saveProductsToStorage();
    window.showToast(window.t('toasts.productDeleted'), 'info');
    window.renderCurrentRoute(false);
  };

  window.resetMarketplaceDemoData = function () {
    try {
      window.localStorage.removeItem('minisouk_products');
    } catch (e) {
      // ignore
    }
    window.showToast(window.t('toasts.dataReset'), 'info');
    setTimeout(function () {
      window.location.reload();
    }, 500);
  };

  window.renderDashboardView = function () {
    const mId = window.DASHBOARD_STATE.selectedMerchantId;
    const merchant = window.DATA.merchants.find(function (m) { return m.id === mId; }) || window.DATA.merchants[0];
    const mProducts = window.DATA.products.filter(function (p) { return p.merchantId === merchant.id; });

    const totalProducts = mProducts.length;
    const totalStock = mProducts.reduce(function (sum, p) { return sum + (Number(p.stock) || 0); }, 0);
    const inventoryValue = mProducts.reduce(function (sum, p) { return sum + (Number(p.price) * Number(p.stock)); }, 0);
    const maxVal = Math.max.apply(null, mProducts.map(function (p) { return p.price * p.stock; }).concat([1]));

    const editingProduct = window.DASHBOARD_STATE.editingProductId
      ? window.DATA.products.find(function (p) { return p.id === window.DASHBOARD_STATE.editingProductId; })
      : null;

    return `
      <div class="container page-view-wrap">
        <div class="dashboard-top-bar">
          <div>
            <h1 class="section-title">📊 ${window.t('dashboard.title')}</h1>
            <p class="section-sub">${window.t('dashboard.subtitle')}</p>
          </div>
          <div class="dashboard-merchant-picker">
            <label for="dashMerchantSelect">${window.t('dashboard.selectMerchant')}</label>
            <select id="dashMerchantSelect" onchange="window.selectDashboardMerchant(this.value)">
              ${window.DATA.merchants.map(function (m) {
                return `<option value="${m.id}" ${m.id === merchant.id ? 'selected' : ''}>${m.logo} ${window.getLocalizedField(m, 'name')} (${window.getLocalizedField(m, 'city')})</option>`;
              }).join('')}
            </select>
          </div>
        </div>

        <!-- بطاقات الإحصائيات الرباعية -->
        <div class="dashboard-kpi-grid">
          <div class="kpi-card">
            <span class="kpi-icon">📦</span>
            <div class="kpi-info">
              <small>${window.t('dashboard.statTotalProducts')}</small>
              <strong>${totalProducts}</strong>
            </div>
          </div>
          <div class="kpi-card">
            <span class="kpi-icon">🏷️</span>
            <div class="kpi-info">
              <small>${window.t('dashboard.statTotalStock')}</small>
              <strong>${totalStock}</strong>
            </div>
          </div>
          <div class="kpi-card">
            <span class="kpi-icon">💰</span>
            <div class="kpi-info">
              <small>${window.t('dashboard.statInventoryValue')}</small>
              <strong>${window.formatPrice(inventoryValue)}</strong>
            </div>
          </div>
          <div class="kpi-card">
            <span class="kpi-icon">⭐</span>
            <div class="kpi-info">
              <small>${window.t('dashboard.statAvgRating')}</small>
              <strong>${merchant.rating.toFixed(1)} / 5.0</strong>
            </div>
          </div>
        </div>

        <!-- الرسم البياني التفاعلي (CSS Bars) -->
        <div class="dashboard-chart-card">
          <div class="chart-card-head">
            <h3>${window.t('dashboard.chartTitle')} — ${window.getLocalizedField(merchant, 'name')}</h3>
            <a href="#/merchant/${merchant.id}" class="btn-outline-sm">👁️ ${window.t('merchant.visitStore')}</a>
          </div>
          <div class="css-bars-container">
            ${mProducts.map(function (p) {
              const pVal = p.price * p.stock;
              const pct = Math.max(8, Math.round((pVal / maxVal) * 100));
              return `
                <div class="css-bar-row">
                  <div class="bar-label-col">
                    <strong>${window.getLocalizedField(p, 'title')}</strong>
                    <small>${p.stock} قطعة × ${window.formatPrice(p.price)}</small>
                  </div>
                  <div class="bar-track-col">
                    <div class="bar-fill" style="width: ${pct}%"></div>
                  </div>
                  <div class="bar-value-col">${window.formatPrice(pVal)}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- شريط أزرار الإضافة واستعادة البيانات -->
        <div class="dashboard-actions-header">
          <button type="button" class="btn-primary-lg" onclick="window.openProductFormModal(null)">
            ${window.t('dashboard.addProductBtn')}
          </button>
          <button type="button" class="btn-reset-filter" onclick="window.resetMarketplaceDemoData()">
            🔄 ${window.t('dashboard.resetDataBtn')}
          </button>
        </div>

        <!-- نافذة إضافة / تعديل منتج -->
        ${window.DASHBOARD_STATE.isModalOpen ? `
          <div class="dashboard-form-panel fade-in-up">
            <div class="form-panel-head">
              <h3>${editingProduct ? window.t('dashboard.editProductTitle') : window.t('dashboard.newProductTitle')}</h3>
              <button type="button" class="btn-close-modal" onclick="window.closeProductFormModal()">✕</button>
            </div>
            <form onsubmit="window.saveDashboardProduct(event)" class="dash-product-form">
              <div class="form-grid-2">
                <div class="form-group">
                  <label>${window.t('dashboard.formTitle')}</label>
                  <input type="text" id="dashFormTitle" required value="${editingProduct ? editingProduct.title : ''}" placeholder="مثال: طقم شاي نحاسي ملكي" />
                </div>
                <div class="form-group">
                  <label>${window.t('dashboard.formCategory')}</label>
                  <select id="dashFormCategory">
                    ${window.DATA.categories.filter(function (c) { return c.id !== 'all'; }).map(function (c) {
                      const selected = editingProduct ? editingProduct.category === c.id : merchant.category === c.id;
                      return `<option value="${c.id}" ${selected ? 'selected' : ''}>${c.icon} ${c.name[window.currentLang || 'ar']}</option>`;
                    }).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label>${window.t('dashboard.formPrice')}</label>
                  <input type="number" id="dashFormPrice" required min="100" value="${editingProduct ? editingProduct.price : 4500}" />
                </div>
                <div class="form-group">
                  <label>${window.t('dashboard.formOldPrice')}</label>
                  <input type="number" id="dashFormOldPrice" min="0" value="${editingProduct && editingProduct.oldPrice ? editingProduct.oldPrice : ''}" placeholder="مثال: 5500" />
                </div>
                <div class="form-group">
                  <label>${window.t('dashboard.formStock')}</label>
                  <input type="number" id="dashFormStock" required min="0" value="${editingProduct ? editingProduct.stock : 15}" />
                </div>
                <div class="form-group">
                  <label>${window.t('dashboard.formEmoji')}</label>
                  <input type="text" id="dashFormEmoji" value="🏺" placeholder="🏺 أو 🍯 أو 👘" />
                </div>
              </div>
              <div class="form-group">
                <label>${window.t('dashboard.formTags')}</label>
                <input type="text" id="dashFormTags" value="${editingProduct && editingProduct.tags ? editingProduct.tags.join(', ') : 'new, featured'}" />
              </div>
              <div class="form-group">
                <label>${window.t('dashboard.formDesc')}</label>
                <textarea id="dashFormDesc" rows="3" required placeholder="اكتب قصة المنتج ومميزاته...">${editingProduct ? editingProduct.description : ''}</textarea>
              </div>
              <div class="form-panel-actions">
                <button type="submit" class="btn-primary-lg">💾 ${window.t('dashboard.saveBtn')}</button>
                <button type="button" class="btn-outline-sm" onclick="window.closeProductFormModal()">${window.t('dashboard.cancelBtn')}</button>
              </div>
            </form>
          </div>
        ` : ''}

        <!-- جدول منتجات المتجر -->
        <div class="dashboard-table-wrap">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>${window.t('dashboard.tableImage')}</th>
                <th>${window.t('dashboard.tableTitle')}</th>
                <th>${window.t('dashboard.tableCategory')}</th>
                <th>${window.t('dashboard.tablePrice')}</th>
                <th>${window.t('dashboard.tableStock')}</th>
                <th>${window.t('dashboard.tableRating')}</th>
                <th>${window.t('dashboard.tableActions')}</th>
              </tr>
            </thead>
            <tbody>
              ${mProducts.map(function (p) {
                const catObj = window.DATA.categories.find(function (c) { return c.id === p.category; });
                return `
                  <tr>
                    <td><img src="${p.image}" alt="${p.title}" class="dash-table-thumb" /></td>
                    <td>
                      <strong><a href="#/product/${p.id}">${window.getLocalizedField(p, 'title')}</a></strong>
                      <div class="table-sub-id">#${p.id.toUpperCase()}</div>
                    </td>
                    <td><span class="cat-badge-sm">${catObj ? catObj.icon + ' ' + catObj.name[window.currentLang || 'ar'] : p.category}</span></td>
                    <td>
                      <strong>${window.formatPrice(p.price)}</strong>
                      ${p.oldPrice ? `<div class="table-old-price">${window.formatPrice(p.oldPrice)}</div>` : ''}
                    </td>
                    <td>
                      <span class="stock-pill ${p.stock <= 5 ? 'low' : 'ok'}">${p.stock}</span>
                    </td>
                    <td>★ ${Number(p.rating).toFixed(1)}</td>
                    <td>
                      <div class="table-action-btns">
                        <button type="button" class="btn-table-edit" onclick="window.openProductFormModal('${p.id}')">✏️ ${window.t('dashboard.editBtn')}</button>
                        <button type="button" class="btn-table-delete" onclick="window.deleteDashboardProduct('${p.id}')">🗑️ ${window.t('dashboard.deleteBtn')}</button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };
})();
