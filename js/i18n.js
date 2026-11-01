/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🌐 سوق صغير (Mini Souk) — محرك تعدد اللغات والاتجاه (i18n.js)
 * ═══════════════════════════════════════════════════════════════════════════
 * يدعم هذا الملف:
 * - دالة t(key, params) مع دعم dot notation والتعويض الديناميكي للمتغيرات
 * - دالة setLanguage(lang) لتحديث html.lang و html.dir وحفظ الاختيار في localStorage
 * - ترجمة عناصر DOM التي تحمل data-i18n و data-i18n-placeholder و data-i18n-title
 * - دوال مساعدة لجلب الاسم المترجم للتاجر أو المنتج أو العملة حسب اللغة النشطة
 */

(function () {
  // دوال آمنة للتعامل مع localStorage لتفادي أي خطأ في البيئات المعزولة
  function safeGetStorage(key, fallback) {
    try {
      const val = window.localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeSetStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      // تجاهل أخطاء التخزين في الوضع الخاص
    }
  }

  // اللغة الحالية: نقرأ من localStorage("lang") أو نعتمد اللغة الافتراضية "ar"
  const savedLang = safeGetStorage('lang', (window.DATA && window.DATA.settings.defaultLang) || 'ar');
  window.currentLang = ['ar', 'fr', 'en'].includes(savedLang) ? savedLang : 'ar';

  /**
   * دالة استرجاع النص المترجم عبر dot notation (مثل: t('nav.home'))
   * مع إمكانية تمرير متغيرات للتعويض مثل { merchantName: '...' }
   */
  window.t = function (key, params = {}) {
    const lang = window.currentLang || 'ar';
    const dict = (window.DATA && window.DATA.translations && window.DATA.translations[lang]) || {};
    const fallbackDict = (window.DATA && window.DATA.translations && window.DATA.translations.ar) || {};

    const keys = String(key).split('.');
    let result = dict;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        result = undefined;
        break;
      }
    }

    // في حال عدم توفر المفتاح في اللغة الحالية نرجع للعربية
    if (result === undefined) {
      result = fallbackDict;
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          result = key;
          break;
        }
      }
    }

    if (typeof result !== 'string') {
      return key;
    }

    // استبدال المتغيرات داخل النص {variable}
    return result.replace(/\{(\w+)\}/g, function (_, token) {
      return params[token] !== undefined ? params[token] : `{${token}}`;
    });
  };

  /**
   * دوال مساعدة للحصول على النصوص المترجمة للكيانات (تاجر، منتج، تصنيف، عملة)
   */
  window.getCurrency = function () {
    const lang = window.currentLang || 'ar';
    return (window.DATA && window.DATA.settings.currency[lang]) || 'د.ج';
  };

  window.getSiteName = function () {
    const lang = window.currentLang || 'ar';
    return (window.DATA && window.DATA.settings.siteName[lang]) || 'سوق صغير';
  };

  window.getLocalizedField = function (item, field) {
    if (!item) return '';
    const lang = window.currentLang || 'ar';
    const i18nField = item[field + 'I18n'];
    if (i18nField && i18nField[lang]) {
      return i18nField[lang];
    }
    if (item[field] && typeof item[field] === 'object' && item[field][lang]) {
      return item[field][lang];
    }
    return typeof item[field] === 'string' ? item[field] : '';
  };

  window.formatPrice = function (amount) {
    const num = Number(amount) || 0;
    const formatted = num.toLocaleString(window.currentLang === 'ar' ? 'ar-DZ' : 'fr-DZ');
    return `${formatted} ${window.getCurrency()}`;
  };

  /**
   * تحديث كافة عناصر الصفحة التي تحتوي على سمات data-i18n
   */
  window.applyTranslationsToDOM = function () {
    // ترجمة النصوص الداخلية
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = window.t(key);
      }
    });

    // ترجمة placeholders لحقول الإدخال
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.setAttribute('placeholder', window.t(key));
      }
    });

    // ترجمة عناوين الأزرار (title / aria-label)
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        const translated = window.t(key);
        el.setAttribute('title', translated);
        el.setAttribute('aria-label', translated);
      }
    });

    // تحديث حالة أزرار اختيار اللغة في القائمة العلوية
    document.querySelectorAll('[data-lang-option]').forEach(function (btn) {
      const btnLang = btn.getAttribute('data-lang-option');
      btn.classList.toggle('active', btnLang === window.currentLang);
    });
  };

  /**
   * تغيير لغة الموقع وتحديث اتجاه الصفحة (RTL للعربية و LTR للفرنسية والإنجليزية)
   */
  window.setLanguage = function (lang, shouldRender = true) {
    if (!['ar', 'fr', 'en'].includes(lang)) {
      lang = 'ar';
    }
    window.currentLang = lang;
    safeSetStorage('lang', lang);

    const htmlEl = document.documentElement;
    htmlEl.setAttribute('lang', lang);
    htmlEl.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // تحديث عنوان المتصفح
    document.title = lang === 'ar'
      ? 'سوق صغير | Mini Souk — منصة التجار المستقلين'
      : 'Mini Souk | سوق صغير — Multi-Vendor Marketplace';

    window.applyTranslationsToDOM();

    // إعادة رسم الواجهة الديناميكية عند تبديل اللغة
    if (shouldRender && typeof window.renderCurrentRoute === 'function') {
      window.renderCurrentRoute(false);
    }
    if (typeof window.updateHeaderBadges === 'function') {
      window.updateHeaderBadges();
    }
  };
})();
