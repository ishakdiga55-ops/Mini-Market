/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📦 سوق صغير (Mini Souk) — قاعدة البيانات المركزية والترجمات (data.js)
 * ═══════════════════════════════════════════════════════════════════════════
 * يحتوي هذا الملف على:
 * - إعدادات الموقع والعملات (settings)
 * - تصنيفات السوق (categories)
 * - بيانات التجار الجزائريين (merchants: 6 متاجر موثقة)
 * - بيانات المنتجات (products: 24 منتجاً مع معرض صور ووسوم ذكية)
 * - كوبونات الخصم وحاسبة التوصيل حسب الولاية
 * - قاموس الترجمة الكامل (ar, fr, en) شاملاً قوالب رسائل واتساب
 */

// دالة مساعدة لتوليد صور SVG فنية عالية الدقة بدون الحاجة لاتصال خارجي
function createProductArt(bg1, bg2, emoji, label, badgeText = '') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}"/>
        <stop offset="100%" stop-color="${bg2}"/>
      </linearGradient>
      <radialGradient id="r" cx="80%" cy="20%" r="60%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.28)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
    </defs>
    <rect width="600" height="450" fill="url(#g)"/>
    <rect width="600" height="450" fill="url(#r)"/>
    <circle cx="500" cy="80" r="140" fill="rgba(255,255,255,0.08)"/>
    <circle cx="90" cy="380" r="170" fill="rgba(0,0,0,0.08)"/>
    <g transform="translate(300, 195)">
      <circle cx="0" cy="0" r="92" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
      <text x="0" y="30" font-size="88" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    </g>
    <rect x="60" y="335" width="480" height="58" rx="16" fill="rgba(15,23,42,0.45)"/>
    <text x="300" y="371" font-family="Cairo, Tajawal, sans-serif" font-size="24" font-weight="700" fill="#ffffff" text-anchor="middle">${label}</text>
    ${badgeText ? `<rect x="30" y="26" width="140" height="38" rx="19" fill="rgba(255,255,255,0.9)"/><text x="100" y="51" font-family="Cairo, sans-serif" font-size="16" font-weight="800" fill="${bg1}" text-anchor="middle">${badgeText}</text>` : ''}
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

window.DATA = {
  // ⚙️ الإعدادات العامة للمنصة
  settings: {
    siteName: {
      ar: 'سوق صغير',
      fr: 'Mini Souk',
      en: 'Mini Souk'
    },
    currency: {
      ar: 'د.ج',
      fr: 'DA',
      en: 'DZD'
    },
    defaultLang: 'ar',
    countryCode: 'DZ',
    wilayas: [
      { id: 'algiers', name: { ar: 'الجزائر العاصمة', fr: 'Alger', en: 'Algiers' }, shippingFee: 400, days: '1-2' },
      { id: 'constantine', name: { ar: 'قسنطينة', fr: 'Constantine', en: 'Constantine' }, shippingFee: 600, days: '2-3' },
      { id: 'oran', name: { ar: 'وهران', fr: 'Oran', en: 'Oran' }, shippingFee: 600, days: '2-3' },
      { id: 'tlemcen', name: { ar: 'تلمسان', fr: 'Tlemcen', en: 'Tlemcen' }, shippingFee: 700, days: '2-4' },
      { id: 'ghardaia', name: { ar: 'غرداية', fr: 'Ghardaïa', en: 'Ghardaia' }, shippingFee: 800, days: '3-4' },
      { id: 'kabylie', name: { ar: 'تيزي وزو / بجاية', fr: 'Tizi Ouzou / Béjaïa', en: 'Kabylie (Tizi/Bejaia)' }, shippingFee: 500, days: '1-3' }
    ],
    coupons: [
      { code: 'SOUK10', discountPercent: 10, desc: { ar: 'خصم 10% ترحيبي', fr: '10% de réduction', en: '10% Welcome Discount' } },
      { code: 'DZAIR20', discountPercent: 20, desc: { ar: 'خصم 20% على الحرف والأصالة', fr: '20% sur tout le souk', en: '20% Special Souk Promo' } }
    ]
  },

  // 🗂️ التصنيفات المعتمدة في السوق
  categories: [
    { id: 'all', name: { ar: 'كل الأقسام', fr: 'Toutes catégories', en: 'All Categories' }, icon: '✨' },
    { id: 'fashion', name: { ar: 'أزياء وتراث', fr: 'Mode & Tradition', en: 'Fashion & Heritage' }, icon: '👗' },
    { id: 'sweets', name: { ar: 'حلويات وتمر', fr: 'Pâtisserie & Dattes', en: 'Sweets & Dates' }, icon: '🍯' },
    { id: 'crafts', name: { ar: 'حرف وديكور', fr: 'Artisanat & Déco', en: 'Crafts & Decor' }, icon: '🏺' },
    { id: 'beauty', name: { ar: 'عطور وجمال طبيعي', fr: 'Parfums & Beauté', en: 'Scents & Beauty' }, icon: '🌿' },
    { id: 'electronics', name: { ar: 'إلكترونيات وإكسسوارات', fr: 'Tech & Accessoires', en: 'Tech & Gadgets' }, icon: '🎧' },
    { id: 'books', name: { ar: 'كتب وقرطاسية', fr: 'Livres & Papeterie', en: 'Books & Stationery' }, icon: '📚' }
  ],

  // 🏪 قائمة التجار المستقلين (6 تجار جزائريين ببيانات واقعية)
  merchants: [
    {
      id: 'm1',
      name: 'دار القفطان التلمساني',
      nameI18n: {
        ar: 'دار القفطان التلمساني',
        fr: 'Dar El Caftan Tlemcen',
        en: 'Tlemcen Caftan House'
      },
      logo: '👑',
      category: 'fashion',
      rating: 4.9,
      reviewsCount: 148,
      city: 'تلمسان',
      cityI18n: { ar: 'تلمسان', fr: 'Tlemcen', en: 'Tlemcen' },
      phone: '+213 551 23 45 01',
      whatsapp: '213551234501',
      instagram: '@dar_caftan_tlemcen',
      verified: true,
      badge: { ar: 'الأعلى تقييماً ⭐', fr: 'Mieux noté ⭐', en: 'Top Rated ⭐' },
      coverColor: 'linear-gradient(135deg, #881337 0%, #be123c 55%, #d97706 100%)',
      description: 'ورشة عائلية عريقة في قلب تلمسان، ننسج خيوط الذهب (المجبود والفتلة) لنصنع أزياء تقليدية وعصرية تليق بالمناسبات الراقية.',
      descriptionI18n: {
        ar: 'ورشة عائلية عريقة في قلب تلمسان، ننسج خيوط الذهب (المجبود والفتلة) لنصنع أزياء تقليدية وعصرية تليق بالمناسبات الراقية.',
        fr: 'Atelier familial ancestral au cœur de Tlemcen, spécialisé dans la broderie d’or (Medjboud et Fetla) et les tenues traditionnelles.',
        en: 'Ancestral family atelier in the heart of Tlemcen crafting golden thread embroidery and timeless Algerian couture.'
      }
    },
    {
      id: 'm2',
      name: 'حلويات القصبة الأصيلة',
      nameI18n: {
        ar: 'حلويات القصبة الأصيلة',
        fr: 'Délices de la Casbah',
        en: 'Casbah Authentic Sweets'
      },
      logo: '🍯',
      category: 'sweets',
      rating: 4.8,
      reviewsCount: 215,
      city: 'الجزائر العاصمة',
      cityI18n: { ar: 'الجزائر العاصمة', fr: 'Alger', en: 'Algiers' },
      phone: '+213 662 34 56 02',
      whatsapp: '213662345602',
      instagram: '@delices_casbah_dz',
      verified: true,
      badge: { ar: 'الأكثر مبيعاً 🔥', fr: 'Meilleures ventes 🔥', en: 'Best Seller 🔥' },
      coverColor: 'linear-gradient(135deg, #78350f 0%, #b45309 55%, #f59e0b 100%)',
      description: 'من أزقة القصبة العتيقة إلى مائدتكم مباشرة؛ نصنع البقلاوة باللوز الحر، المقروط المعسل، وأفخر تمور دقلة نور المحشوة.',
      descriptionI18n: {
        ar: 'من أزقة القصبة العتيقة إلى مائدتكم مباشرة؛ نصنع البقلاوة باللوز الحر، المقروط المعسل، وأفخر تمور دقلة نور المحشوة.',
        fr: 'Des ruelles de la Casbah à votre table : baklawa aux amandes pures, makrout au miel et dattes Deglet Nour fourrées.',
        en: 'From the historic alleys of the Casbah to your table: pure almond baklawa, honeyed makrout, and stuffed Deglet Nour dates.'
      }
    },
    {
      id: 'm3',
      name: 'فخار ونحاس قسنطينة',
      nameI18n: {
        ar: 'فخار ونحاس قسنطينة',
        fr: 'Cuivre & Poterie Cirta',
        en: 'Cirta Copper & Pottery'
      },
      logo: '🏺',
      category: 'crafts',
      rating: 4.9,
      reviewsCount: 96,
      city: 'قسنطينة',
      cityI18n: { ar: 'قسنطينة', fr: 'Constantine', en: 'Constantine' },
      phone: '+213 773 45 67 03',
      whatsapp: '213773456703',
      instagram: '@cirta_artisanat',
      verified: true,
      badge: { ar: 'حرفي معتمد 🏅', fr: 'Artisan Certifié 🏅', en: 'Master Artisan 🏅' },
      coverColor: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 55%, #38bdf8 100%)',
      description: 'حرفيون من حي السويقة بقسنطينة وميزاب، نبدع في نقش النحاس اليدوي، الفخار الأمازيغي، وزرابي غرداية الصوفية الحرة.',
      descriptionI18n: {
        ar: 'حرفيون من حي السويقة بقسنطينة وميزاب، نبدع في نقش النحاس اليدوي، الفخار الأمازيغي، وزرابي غرداية الصوفية الحرة.',
        fr: 'Artisans de Constantine et du M’zab : dinanderie en cuivre ciselé à la main, poterie berbère et tapis authentiques.',
        en: 'Master artisans from Constantine and M’zab creating hand-engraved copperware, Berber pottery, and pure wool rugs.'
      }
    },
    {
      id: 'm4',
      name: 'واحة جرجرة للزيوت والعطور',
      nameI18n: {
        ar: 'واحة جرجرة للزيوت والعطور',
        fr: 'Oasis Djurdjura Bio',
        en: 'Djurdjura Bio Scents'
      },
      logo: '🌿',
      category: 'beauty',
      rating: 4.7,
      reviewsCount: 132,
      city: 'تيزي وزو / بجاية',
      cityI18n: { ar: 'تيزي وزو / بجاية', fr: 'Tizi Ouzou / Béjaïa', en: 'Kabylie (Tizi/Bejaia)' },
      phone: '+213 554 56 78 04',
      whatsapp: '213554567804',
      instagram: '@djurdjura_bio',
      verified: true,
      badge: { ar: 'منتج طبيعي 100% 🌱', fr: '100% Bio & Naturel 🌱', en: '100% Organic 🌱' },
      coverColor: 'linear-gradient(135deg, #064e3b 0%, #059669 55%, #34d399 100%)',
      description: 'تقطير تقليدي لماء الورد والزهر القسنطيني، زيوت التين الشوكي البكر، وصابون طبيعي بأعشاب جبال جرجرة.',
      descriptionI18n: {
        ar: 'تقطير تقليدي لماء الورد والزهر القسنطيني، زيوت التين الشوكي البكر، وصابون طبيعي بأعشاب جبال جرجرة.',
        fr: 'Distillation traditionnelle d’eau de fleur d’oranger, huile de pépins de figue de barbarie bio et savons de Djurdjura.',
        en: 'Traditional floral distillation, organic prickly pear seed oil, and cold-processed herbal soaps from Djurdjura.'
      }
    },
    {
      id: 'm5',
      name: 'تك زون وهران (TechZone)',
      nameI18n: {
        ar: 'تك زون وهران (TechZone)',
        fr: 'TechZone Oran',
        en: 'TechZone Oran'
      },
      logo: '🎧',
      category: 'electronics',
      rating: 4.6,
      reviewsCount: 184,
      city: 'وهران',
      cityI18n: { ar: 'وهران', fr: 'Oran', en: 'Oran' },
      phone: '+213 665 67 89 05',
      whatsapp: '213665678905',
      instagram: '@techzone_oran',
      verified: true,
      badge: { ar: 'الأسرع رداً ⚡', fr: 'Réponse rapide ⚡', en: 'Fastest Reply ⚡' },
      coverColor: 'linear-gradient(135deg, #311042 0%, #6d28d9 55%, #ec4899 100%)',
      description: 'أحدث إكسسوارات المكتب الذكي، السماعات اللاسلكية، ومعدات صناع المحتوى مع ضمان حقيقي وتوصيل سريع لـ 58 ولاية.',
      descriptionI18n: {
        ar: 'أحدث إكسسوارات المكتب الذكي، السماعات اللاسلكية، ومعدات صناع المحتوى مع ضمان حقيقي وتوصيل سريع لـ 58 ولاية.',
        fr: 'Accessoires high-tech, audio sans fil et équipement pour créateurs avec garantie officielle et livraison 58 wilayas.',
        en: 'Smart desk accessories, wireless audio, and creator gear with warranty and rapid delivery across all 58 wilayas.'
      }
    },
    {
      id: 'm6',
      name: 'مكتبة الأوراس الثقافية',
      nameI18n: {
        ar: 'مكتبة الأوراس الثقافية',
        fr: 'Librairie El Aurès',
        en: 'El Aures Cultural Bookshop'
      },
      logo: '📚',
      category: 'books',
      rating: 4.9,
      reviewsCount: 112,
      city: 'غرداية',
      cityI18n: { ar: 'غرداية', fr: 'Ghardaïa', en: 'Ghardaia' },
      phone: '+213 776 78 90 06',
      whatsapp: '213776789006',
      instagram: '@aures_books_dz',
      verified: true,
      badge: { ar: 'تغليف هدايا مجاني 🎁', fr: 'Emballage cadeau 🎁', en: 'Free Gift Wrap 🎁' },
      coverColor: 'linear-gradient(135deg, #134e4a 0%, #0f766e 55%, #f59e0b 100%)',
      description: 'ملاذ القراء ومحبي التنظيم؛ نوفر إصدارات الأدب الجزائري والعالمي، المفكرات الجلدية الفاخرة، وأدوات الخط العربي.',
      descriptionI18n: {
        ar: 'ملاذ القراء ومحبي التنظيم؛ نوفر إصدارات الأدب الجزائري والعالمي، المفكرات الجلدية الفاخرة، وأدوات الخط العربي.',
        fr: 'Le refuge des lecteurs : littérature algérienne et mondiale, carnets en cuir véritable et coffrets de calligraphie.',
        en: 'A haven for readers and planners: Algerian literature, fine leather journals, and traditional Arabic calligraphy sets.'
      }
    }
  ],

  // 🛍️ قائمة المنتجات (24 منتجاً بأوصاف قصصية ومعرض صور متعدد)
  products: [
    // --- دار القفطان التلمساني (m1 - fashion) ---
    {
      id: 'p1',
      merchantId: 'm1',
      title: 'كراكو عاصمي ملكي بالمجبود الذهبي',
      titleI18n: {
        ar: 'كراكو عاصمي ملكي بالمجبود الذهبي',
        fr: 'Karakou Algérois Royal au Fil d’Or',
        en: 'Royal Algiers Karakou with Gold Embroidery'
      },
      description: 'قطعة فنية من المخمل الكرزي الفاخر، طُرزت يدوياً على مدار 45 يوماً بخيوط الفتلة والمجبود الذهبي الحر، مرفقة بـ "سروال شلقة" حريري يمنحك إطلالة ملكية.',
      descriptionI18n: {
        ar: 'قطعة فنية من المخمل الكرزي الفاخر، طُرزت يدوياً على مدار 45 يوماً بخيوط الفتلة والمجبود الذهبي الحر، مرفقة بـ "سروال شلقة" حريري يمنحك إطلالة ملكية.',
        fr: 'Velours bordeaux royal brodé à la main durant 45 jours au fil d’or (Fetla & Medjboud), accompagné de son sarouel chelka en soie.',
        en: 'Rich burgundy velvet hand-embroidered over 45 days with golden threads, paired with a flowing silk chelka trouser.'
      },
      price: 42000,
      oldPrice: 48500,
      image: createProductArt('#881337', '#d97706', '👘', 'كراكو ملكي بالمجبود', 'صناعة يدوية'),
      gallery: [
        createProductArt('#881337', '#d97706', '👘', 'كراكو ملكي بالمجبود', 'صورة أمامية'),
        createProductArt('#9f1239', '#b45309', '✨', 'تفاصيل تطريز الفتلة', 'زوم التطريز'),
        createProductArt('#4c0519', '#f59e0b', '👑', 'طقم كامل مع السروال', 'الإطلالة الكاملة')
      ],
      category: 'fashion',
      stock: 4,
      rating: 5.0,
      tags: ['featured', 'bestseller', 'handmade', 'عرايسي', 'مجبود']
    },
    {
      id: 'p2',
      merchantId: 'm1',
      title: 'برنوس جزائري صوفي حر (وبر الجمل)',
      titleI18n: {
        ar: 'برنوس جزائري صوفي حر (وبر الجمل)',
        fr: 'Burnous Algérien Pur Poil de Chameau',
        en: 'Authentic Camel Wool Algerian Burnous'
      },
      description: 'برنوس أصيل منسوج من وبر الإبل الطبيعي في الهضاب العليا، خفيف الوزن ودافئ جداً، يجمع بين الهيبة التقليدية واللمسة العصرية في الحواف.',
      descriptionI18n: {
        ar: 'برنوس أصيل منسوج من وبر الإبل الطبيعي في الهضاب العليا، خفيف الوزن ودافئ جداً، يجمع بين الهيبة التقليدية واللمسة العصرية في الحواف.',
        fr: 'Burnous prestigieux tissé à la main en laine et poil de chameau naturel, alliant chaleur exceptionnelle et allure noble.',
        en: 'Prestigious hand-woven camel wool burnous offering remarkable warmth, lightness, and timeless Algerian nobility.'
      },
      price: 29500,
      oldPrice: 34000,
      image: createProductArt('#78350f', '#a16207', '🧥', 'برنوس وبر الإبل الحر', 'تراث أصيل'),
      gallery: [
        createProductArt('#78350f', '#a16207', '🧥', 'برنوس وبر الإبل الحر', 'تراث أصيل'),
        createProductArt('#451a03', '#ca8a04', '🧶', 'نسيج يدوي فاخر', 'تفاصيل الصوف')
      ],
      category: 'fashion',
      stock: 7,
      rating: 4.9,
      tags: ['bestseller', 'شتوي', 'رجالي', 'تراث']
    },
    {
      id: 'p3',
      merchantId: 'm1',
      title: 'جبّة قبائلية عصرية بالحرير الفضي',
      titleI18n: {
        ar: 'جبّة قبائلية عصرية بالحرير الفضي',
        fr: 'Robe Kabyle Moderne Soie & Argent',
        en: 'Modern Kabyle Dress with Silver Silk'
      },
      description: 'تصميم يمزج رموز الزخرفة الأمازيغية الأصيلة مع قصة مريحة من قماش الكريب الحريري، مزينة بـ "زقزاق" متقن وحزام مجدول يدوياً.',
      descriptionI18n: {
        ar: 'تصميم يمزج رموز الزخرفة الأمازيغية الأصيلة مع قصة مريحة من قماش الكريب الحريري، مزينة بـ "زقزاق" متقن وحزام مجدول يدوياً.',
        fr: 'Coupe moderne en crêpe de soie ornée de motifs berbères authentiques et d’une ceinture tressée à la main.',
        en: 'Modern silk-crepe silhouette adorned with authentic Amazigh geometric motifs and a hand-braided belt.'
      },
      price: 16500,
      oldPrice: 19000,
      image: createProductArt('#1e3a8a', '#e11d48', '👗', 'جبّة قبائلية عصرية', 'جديد الموسم'),
      gallery: [
        createProductArt('#1e3a8a', '#e11d48', '👗', 'جبّة قبائلية عصرية', 'جديد الموسم'),
        createProductArt('#172554', '#be123c', '💎', 'حزام أمازيغي مجدول', 'تفاصيل الحزام')
      ],
      category: 'fashion',
      stock: 11,
      rating: 4.8,
      tags: ['new', 'أزياء', 'قبائلي', 'مناسبات']
    },
    {
      id: 'p4',
      merchantId: 'm1',
      title: 'خيط الروح التلمساني المرصّع بالجوهر',
      titleI18n: {
        ar: 'خيط الروح التلمساني المرصّع بالجوهر',
        fr: 'Khait Errouh Tlemcénien aux Perles',
        en: 'Tlemcen Khait Errouh Pearl Diadem'
      },
      description: 'الحلية الجزائرية الأيقونية "خيط الروح" مطلية بالذهب عيار 18 ومرصعة بحبات الجوهر وأحجار الزمرد الأخضر لتتألقي في كل مناسبة.',
      descriptionI18n: {
        ar: 'الحلية الجزائرية الأيقونية "خيط الروح" مطلية بالذهب عيار 18 ومرصعة بحبات الجوهر وأحجار الزمرد الأخضر لتتألقي في كل مناسبة.',
        fr: 'Le bijou emblématique algérien plaqué or 18K et serti de perles de culture et pierres émeraude.',
        en: 'Iconic Algerian forehead jewel plated in 18K gold and set with cultured pearls and emerald stones.'
      },
      price: 8900,
      oldPrice: 11500,
      image: createProductArt('#b45309', '#be185d', '💎', 'خيط الروح المرصع', 'خصم خاص'),
      gallery: [
        createProductArt('#b45309', '#be185d', '💎', 'خيط الروح المرصع', 'خصم خاص'),
        createProductArt('#78350f', '#9d174d', '✨', 'علبة مخملية فاخرة', 'تغليف هدية')
      ],
      category: 'fashion',
      stock: 15,
      rating: 4.9,
      tags: ['deal', 'مجوهرات', 'هدية', 'تقليدي']
    },

    // --- حلويات القصبة الأصيلة (m2 - sweets) ---
    {
      id: 'p5',
      merchantId: 'm2',
      title: 'صندوق بقلاوة عاصمية باللوز الحر والعسل (1 كغ)',
      titleI18n: {
        ar: 'صندوق بقلاوة عاصمية باللوز الحر والعسل (1 كغ)',
        fr: 'Coffret Baklawa Algéroise Pur Amande (1 kg)',
        en: 'Algiers Pure Almond Baklawa Box (1 kg)'
      },
      description: '12 طبقة مقرمشة من العجين المورق يدوياً، محشوة باللوز البلدي المحمص والسمن الحر، ومشربة بعسل الزهور الطبيعي فور خروجها من الفرن.',
      descriptionI18n: {
        ar: '12 طبقة مقرمشة من العجين المورق يدوياً، محشوة باللوز البلدي المحمص والسمن الحر، ومشربة بعسل الزهور الطبيعي فور خروجها من الفرن.',
        fr: '12 feuilles croustillantes étirées à la main, garnies d’amandes torréfiées et arrosées de miel pur.',
        en: '12 crispy hand-stretched pastry layers filled with roasted local almonds and drenched in pure wildflower honey.'
      },
      price: 3800,
      oldPrice: 4400,
      image: createProductArt('#92400e', '#f59e0b', '🍯', 'بقلاوة عاصمية باللوز', 'طازج يومياً'),
      gallery: [
        createProductArt('#92400e', '#f59e0b', '🍯', 'بقلاوة عاصمية باللوز', 'طازج يومياً'),
        createProductArt('#78350f', '#d97706', '🥜', 'حشوة اللوز البلدي 100%', 'مكونات طبيعية')
      ],
      category: 'sweets',
      stock: 25,
      rating: 5.0,
      tags: ['featured', 'bestseller', 'حلويات', 'ضيافة']
    },
    {
      id: 'p6',
      merchantId: 'm2',
      title: 'تمر دقلة نور طولقة ملكي محشو بالجوز والبيستاش',
      titleI18n: {
        ar: 'تمر دقلة نور طولقة ملكي محشو بالجوز والبيستاش',
        fr: 'Dattes Deglet Nour Tolga Fourrées Pistache & Noix',
        en: 'Royal Stuffed Deglet Nour Dates (Walnut & Pistachio)'
      },
      description: 'تمور دقلة نور شفافة كالعنبر من بساتين طولقة، محشوة يدوياً بعجينة الفستق الحلبي والجوز الكامل، مرتبة في علبة خشبية فاخرة للإهداء.',
      descriptionI18n: {
        ar: 'تمور دقلة نور شفافة كالعنبر من بساتين طولقة، محشوة يدوياً بعجينة الفستق الحلبي والجوز الكامل، مرتبة في علبة خشبية فاخرة للإهداء.',
        fr: 'Dattes Deglet Nour de Tolga translucides, fourrées à la pâte de pistache et cerneaux de noix en coffret bois.',
        en: 'Amber-translucent Tolga Deglet Nour dates stuffed with pistachio paste and walnut halves in a wooden gift box.'
      },
      price: 2900,
      oldPrice: 3500,
      image: createProductArt('#713f12', '#ca8a04', '🌴', 'دقلة نور ملكية محشوة', 'علبة إهداء'),
      gallery: [
        createProductArt('#713f12', '#ca8a04', '🌴', 'دقلة نور ملكية محشوة', 'علبة إهداء'),
        createProductArt('#422006', '#eab308', '🎁', 'علبة خشبية منقوشة', 'هدية فاخرة')
      ],
      category: 'sweets',
      stock: 30,
      rating: 4.9,
      tags: ['bestseller', 'deal', 'تمور', 'هدية']
    },
    {
      id: 'p7',
      merchantId: 'm2',
      title: 'تشكيلة دزيريات ومخبز وعرايش (24 قطعة)',
      titleI18n: {
        ar: 'تشكيلة دزيريات ومخبز وعرايش (24 قطعة)',
        fr: 'Assortiment Dziriettes, Mkhabez & Arayech (24 pcs)',
        en: 'Royal Algiers Pastry Assortment (24 pcs)'
      },
      description: 'بوكس المناسبات السعيدة: يضم 8 حبات دزيريات بالقارص، 8 حبات مخبز بطلية الفانيليا، و8 حبات عرايش تذوب في الفم بماء الزهر المقطر.',
      descriptionI18n: {
        ar: 'بوكس المناسبات السعيدة: يضم 8 حبات دزيريات بالقارص، 8 حبات مخبز بطلية الفانيليا، و8 حبات عرايش تذوب في الفم بماء الزهر المقطر.',
        fr: 'Coffret prestige de 24 pièces : Dziriettes au citron, Mkhabez glacé à la vanille et Arayech fondants.',
        en: 'Prestige 24-piece box featuring lemon Dziriettes, vanilla-glazed Mkhabez, and melt-in-the-mouth Arayech.'
      },
      price: 4500,
      oldPrice: 5000,
      image: createProductArt('#be185d', '#f59e0b', '🧁', 'بوكس دزيريات وعرايش', '24 قطعة'),
      gallery: [
        createProductArt('#be185d', '#f59e0b', '🧁', 'بوكس دزيريات وعرايش', '24 قطعة'),
        createProductArt('#831843', '#d97706', '🍋', 'نكهة الليمون وماء الزهر', 'تحضير يدوي')
      ],
      category: 'sweets',
      stock: 14,
      rating: 4.8,
      tags: ['new', 'مناسبات', 'حلويات_تقليدية']
    },
    {
      id: 'p8',
      merchantId: 'm2',
      title: 'عسل السدر الصحراوي الحر (500 غ)',
      titleI18n: {
        ar: 'عسل السدر الصحراوي الحر (500 غ)',
        fr: 'Miel de Jujubier (Sidr) Pur du Sahara (500g)',
        en: 'Pure Saharan Sidr Honey (500g)'
      },
      description: 'عسل سدر طبيعي خالص مفحوص مخبرياً من مناحل الأغواط والبيض، ذو قوام كثيف ونكهة كراميلية دافئة تمنح الجسم مناعة وطاقة طبيعية.',
      descriptionI18n: {
        ar: 'عسل سدر طبيعي خالص مفحوص مخبرياً من مناحل الأغواط والبيض، ذو قوام كثيف ونكهة كراميلية دافئة تمنح الجسم مناعة وطاقة طبيعية.',
        fr: 'Miel de Sidr 100% pur certifié des ruchers de Laghouat, texture dense et arôme caramélisé riche en bienfaits.',
        en: 'Lab-certified 100% pure Sidr honey from Laghouat apiaries with a rich caramel aroma and immune-boosting properties.'
      },
      price: 4200,
      oldPrice: 4800,
      image: createProductArt('#b45309', '#fde047', '🐝', 'عسل السدر الصحراوي الحر', 'مفحوص مخبرياً'),
      gallery: [
        createProductArt('#b45309', '#fde047', '🐝', 'عسل السدر الصحراوي الحر', 'مفحوص مخبرياً')
      ],
      category: 'sweets',
      stock: 18,
      rating: 4.9,
      tags: ['صحي', 'عسل_حر', 'طبيعي']
    },

    // --- فخار ونحاس قسنطينة (m3 - crafts) ---
    {
      id: 'p9',
      merchantId: 'm3',
      title: 'سنيوة وبراد نحاس قسنطيني منقوش يدوياً',
      titleI18n: {
        ar: 'سنيوة وبراد نحاس قسنطيني منقوش يدوياً',
        fr: 'Plateau & Théière en Cuivre Ciselé de Constantine',
        en: 'Hand-Engraved Constantine Copper Tea Set'
      },
      description: 'طقم شاي نحاسي أصيل نقشه المعلم حسان في حي السويقة بقسنطينة؛ زخارف نباتية وهندسية دقيقة تضفي على جلسات الشاي والقهوة سحراً لا يصدأ.',
      descriptionI18n: {
        ar: 'طقم شاي نحاسي أصيل نقشه المعلم حسان في حي السويقة بقسنطينة؛ زخارف نباتية وهندسية دقيقة تضفي على جلسات الشاي والقهوة سحراً لا يصدأ.',
        fr: 'Ensemble plateau et théière en cuivre massif ciselé à la main dans la vieille ville de Constantine.',
        en: 'Solid copper tray and teapot hand-chiseled in Constantine’s old quarter with intricate floral and geometric art.'
      },
      price: 15800,
      oldPrice: 18500,
      image: createProductArt('#b45309', '#0284c7', '🫖', 'طقم نحاس قسنطيني منقوش', 'تحفة فنية'),
      gallery: [
        createProductArt('#b45309', '#0284c7', '🫖', 'طقم نحاس قسنطيني منقوش', 'تحفة فنية'),
        createProductArt('#78350f', '#0369a1', '🔨', 'نقش يدوي 100%', 'حي السويقة')
      ],
      category: 'crafts',
      stock: 6,
      rating: 5.0,
      tags: ['featured', 'bestseller', 'نحاس', 'ديكور']
    },
    {
      id: 'p10',
      merchantId: 'm3',
      title: 'زربية غرداية الصوفية المنسوجة يدوياً (200×140 سم)',
      titleI18n: {
        ar: 'زربية غرداية الصوفية المنسوجة يدوياً (200×140 سم)',
        fr: 'Tapis de Ghardaïa Pur Laine Tissé Main (200×140cm)',
        en: 'Handwoven Ghardaia Pure Wool Rug (200×140cm)'
      },
      description: 'زربية ميزابية من صوف الغنم البكر غير المصبوغ كيميائياً، تحمل رموز الأصالة الصحراوية بتصميم مينيماليست يتناغم بروعة مع الصالونات الحديثة.',
      descriptionI18n: {
        ar: 'زربية ميزابية من صوف الغنم البكر غير المصبوغ كيميائياً، تحمل رموز الأصالة الصحراوية بتصميم مينيماليست يتناغم بروعة مع الصالونات الحديثة.',
        fr: 'Tapis berbère du M’zab en laine vierge naturelle, motifs géométriques minimalistes parfaits pour un salon moderne.',
        en: 'M’zab Berber rug crafted from undyed virgin wool with minimalist geometric symbols suited for modern interiors.'
      },
      price: 26000,
      oldPrice: 31000,
      image: createProductArt('#0f766e', '#d97706', '🧶', 'زربية غرداية صوف حر', 'صوف طبيعي'),
      gallery: [
        createProductArt('#0f766e', '#d97706', '🧶', 'زربية غرداية صوف حر', 'صوف طبيعي'),
        createProductArt('#115e59', '#b45309', '🏠', 'تناسق عصري وتراثي', 'مقاس 200×140')
      ],
      category: 'crafts',
      stock: 5,
      rating: 4.9,
      tags: ['deal', 'زربية', 'غرداية', 'أثاث']
    },
    {
      id: 'p11',
      merchantId: 'm3',
      title: 'طقم فخار أمقران الأمازيغي للكسكس والشوربة (8 قطع)',
      titleI18n: {
        ar: 'طقم فخار أمقران الأمازيغي للكسكس والشوربة (8 قطع)',
        fr: 'Service Poterie Berbère Couscous & Chorba (8 pcs)',
        en: 'Berber Hand-Painted Pottery Dining Set (8 pcs)'
      },
      description: 'فخار طبيعي مشوي على الحطب وملون بأصباغ معدنية طبيعية، يحفظ حرارة الشوربة والكسكس ويمنح مائدتك نكهة الأرض الطيبة.',
      descriptionI18n: {
        ar: 'فخار طبيعي مشوي على الحطب وملون بأصباغ معدنية طبيعية، يحفظ حرارة الشوربة والكسكس ويمنح مائدتك نكهة الأرض الطيبة.',
        fr: 'Service en terre cuite peinte à la main avec des pigments naturels, idéal pour garder la chorba et le couscous bien chauds.',
        en: 'Wood-fired terracotta tableware hand-painted with natural mineral pigments, keeping soups and couscous warm.'
      },
      price: 7400,
      oldPrice: 8900,
      image: createProductArt('#9a3412', '#dc2626', '🏺', 'طقم فخار أمازيغي 8 قطع', 'صحي للطبخ'),
      gallery: [
        createProductArt('#9a3412', '#dc2626', '🏺', 'طقم فخار أمازيغي 8 قطع', 'صحي للطبخ')
      ],
      category: 'crafts',
      stock: 12,
      rating: 4.8,
      tags: ['فخار', 'مائدة', 'رمضان']
    },
    {
      id: 'p12',
      merchantId: 'm3',
      title: 'مصباح أرابيسك نحاسي مخرّم (إضاءة دافئة)',
      titleI18n: {
        ar: 'مصباح أرابيسك نحاسي مخرّم (إضاءة دافئة)',
        fr: 'Lampe Arabesque en Cuivre Ajouré',
        en: 'Perforated Copper Arabesque Ambient Lamp'
      },
      description: 'مصباح طاولة مصنوع من النحاس المخرم بدقة متناهية، يلقي ظلالاً هندسية ساحرة على جدران الغرفة ليحول المساء إلى لوحة أندلسية دافئة.',
      descriptionI18n: {
        ar: 'مصباح طاولة مصنوع من النحاس المخرم بدقة متناهية، يلقي ظلالاً هندسية ساحرة على جدران الغرفة ليحول المساء إلى لوحة أندلسية دافئة.',
        fr: 'Lampe d’ambiance en cuivre finement ciselé projetant des ombres géométriques féeriques dans votre salon.',
        en: 'Finely perforated copper table lamp casting enchanting geometric shadows across your living space.'
      },
      price: 9200,
      oldPrice: 10800,
      image: createProductArt('#1e293b', '#f59e0b', '🏮', 'مصباح أرابيسك نحاسي', 'إضاءة ساحرة'),
      gallery: [
        createProductArt('#1e293b', '#f59e0b', '🏮', 'مصباح أرابيسك نحاسي', 'إضاءة ساحرة')
      ],
      category: 'crafts',
      stock: 9,
      rating: 4.9,
      tags: ['new', 'إضاءة', 'ديكور']
    },

    // --- واحة جرجرة للزيوت والعطور (m4 - beauty) ---
    {
      id: 'p13',
      merchantId: 'm4',
      title: 'إكسير زيت بذور التين الشوكي العضوي (30 مل)',
      titleI18n: {
        ar: 'إكسير زيت بذور التين الشوكي العضوي (30 مل)',
        fr: 'Élixr d’Huile de Pépins de Figue de Barbarie Bio (30ml)',
        en: 'Organic Prickly Pear Seed Oil Elixir (30ml)'
      },
      description: 'الذهب الأخضر الجزائري؛ معصور على البارد من تين منطقة سيدي فرج والقبائل، غني بفيتامين E ومضادات الأكسدة لتجديد البشرة وإشراقتها.',
      descriptionI18n: {
        ar: 'الذهب الأخضر الجزائري؛ معصور على البارد من تين منطقة سيدي فرج والقبائل، غني بفيتامين E ومضادات الأكسدة لتجديد البشرة وإشراقتها.',
        fr: 'L’or vert algérien pressé à froid, ultra-riche en vitamine E pour régénérer et illuminer la peau naturellement.',
        en: 'Cold-pressed Algerian green gold rich in Vitamin E and antioxidants for radiant, youthful skin.'
      },
      price: 5400,
      oldPrice: 6500,
      image: createProductArt('#065f46', '#10b981', '💧', 'زيت التين الشوكي العضوي', 'معصور على البارد'),
      gallery: [
        createProductArt('#065f46', '#10b981', '💧', 'زيت التين الشوكي العضوي', 'معصور على البارد'),
        createProductArt('#047857', '#34d399', '🌵', 'نقاء 100% بدون إضافات', 'شهادة عضوية')
      ],
      category: 'beauty',
      stock: 19,
      rating: 4.9,
      tags: ['featured', 'bestseller', 'عناية', 'عضوي']
    },
    {
      id: 'p14',
      merchantId: 'm4',
      title: 'مقطّر ماء الزهر القسنطيني الحر في قطارة نحاسية',
      titleI18n: {
        ar: 'مقطّر ماء الزهر القسنطيني الحر في قطارة نحاسية',
        fr: 'Hydrolat de Fleur d’Oranger Pur de Constantine',
        en: 'Pure Distilled Constantine Orange Blossom Water'
      },
      description: 'قطرة واحدة تكفي لتعطير البيت والقهوة؛ مقطر في الربيع بالطريقة التقليدية في القطارة النحاسية من أزهار النارنج البرية.',
      descriptionI18n: {
        ar: 'قطرة واحدة تكفي لتعطير البيت والقهوة؛ مقطر في الربيع بالطريقة التقليدية في القطارة النحاسية من أزهار النارنج البرية.',
        fr: 'Distillé au printemps dans un alambic en cuivre traditionnel à partir de fleurs de bigaradier sauvages.',
        en: 'Spring-distilled in traditional copper stills from wild bitter orange blossoms for culinary and skincare rituals.'
      },
      price: 1850,
      oldPrice: 2200,
      image: createProductArt('#0f766e', '#2dd4bf', '🌸', 'مقطر ماء الزهر الحر', 'تقطير تقليدي'),
      gallery: [
        createProductArt('#0f766e', '#2dd4bf', '🌸', 'مقطر ماء الزهر الحر', 'تقطير تقليدي')
      ],
      category: 'beauty',
      stock: 35,
      rating: 4.8,
      tags: ['تقطير', 'ماء_الزهر', 'طبيعي']
    },
    {
      id: 'p15',
      merchantId: 'm4',
      title: 'مجموعة الحمام المغاربي الملكي (صابون أسود + طين + ليفة)',
      titleI18n: {
        ar: 'مجموعة الحمام المغاربي الملكي (صابون أسود + طين + ليفة)',
        fr: 'Coffret Rituel Hammam Royal (Savon Noir, Ghassoul & Kessa)',
        en: 'Royal Maghrebi Hammam Spa Kit'
      },
      description: 'دلّل نفسك بتجربة سبا منزلية متكاملة: صابون بلدي بزيت زيتون بجاية والأوكالبتوس، غاسول بطين الأطلس بالخزامى، وليفة كيسة أصلية.',
      descriptionI18n: {
        ar: 'دلّل نفسك بتجربة سبا منزلية متكاملة: صابون بلدي بزيت زيتون بجاية والأوكالبتوس، غاسول بطين الأطلس بالخزامى، وليفة كيسة أصلية.',
        fr: 'Expérience spa complète à la maison : savon noir à l’huile d’olive de Béjaïa et eucalyptus, ghassoul à la lavande et gant kessa.',
        en: 'Complete home spa ritual featuring Bejaia olive oil black soap with eucalyptus, lavender clay mask, and exfoliating kessa glove.'
      },
      price: 3200,
      oldPrice: 3900,
      image: createProductArt('#115e59', '#059669', '🧖‍♀️', 'مجموعة الحمام الملكي', 'بوكس متكامل'),
      gallery: [
        createProductArt('#115e59', '#059669', '🧖‍♀️', 'مجموعة الحمام الملكي', 'بوكس متكامل')
      ],
      category: 'beauty',
      stock: 22,
      rating: 4.7,
      tags: ['deal', 'سبا', 'هدية']
    },
    {
      id: 'p16',
      merchantId: 'm4',
      title: 'عطر العنبر والعود الصحراوي المركّز (50 مل)',
      titleI18n: {
        ar: 'عطر العنبر والعود الصحراوي المركّز (50 مل)',
        fr: 'Extrait de Parfum Ambre & Oud du Sahara (50ml)',
        en: 'Saharan Amber & Oud Extrait de Parfum (50ml)'
      },
      description: 'توليفة دافئة تدوم أكثر من 24 ساعة، تمتزج فيها نفحات الزعفران والعنبر الذهبي مع خشب العود والمسك الأبيض في زجاجة كريستالية أنيقة.',
      descriptionI18n: {
        ar: 'توليفة دافئة تدوم أكثر من 24 ساعة، تمتزج فيها نفحات الزعفران والعنبر الذهبي مع خشب العود والمسك الأبيض في زجاجة كريستالية أنيقة.',
        fr: 'Sillage envoûtant longue tenue mêlant safran, ambre doré, bois d’oud et musc blanc.',
        en: 'Long-lasting captivating scent blending saffron, golden amber, oud wood, and white musk.'
      },
      price: 6800,
      oldPrice: 7900,
      image: createProductArt('#3f6212', '#ca8a04', '🧴', 'عطر العنبر والعود', 'ثبات 24 ساعة'),
      gallery: [
        createProductArt('#3f6212', '#ca8a04', '🧴', 'عطر العنبر والعود', 'ثبات 24 ساعة')
      ],
      category: 'beauty',
      stock: 10,
      rating: 4.9,
      tags: ['new', 'عطور', 'فاخر']
    },

    // --- تك زون وهران (m5 - electronics) ---
    {
      id: 'p17',
      merchantId: 'm5',
      title: 'سماعات رأس لاسلكية عازلة للضوضاء ANC Pro',
      titleI18n: {
        ar: 'سماعات رأس لاسلكية عازلة للضوضاء ANC Pro',
        fr: 'Casque Sans Fil Réduction de Bruit Active ANC Pro',
        en: 'ANC Pro Active Noise Cancelling Wireless Headphones'
      },
      description: 'اعزل نفسك عن صخب العالم واستمتع بصوت محيطي نقي لمدة 45 ساعة متواصلة، مع وسائد أذن ميموري فوم مريحة جداً للدراسة والعمل عن بعد.',
      descriptionI18n: {
        ar: 'اعزل نفسك عن صخب العالم واستمتع بصوت محيطي نقي لمدة 45 ساعة متواصلة، مع وسائد أذن ميموري فوم مريحة جداً للدراسة والعمل عن بعد.',
        fr: 'Son haute fidélité avec réduction de bruit active, autonomie de 45h et coussinets à mémoire de forme ultra-confortables.',
        en: 'Hi-Fi spatial audio with active noise cancellation, 45-hour battery life, and plush memory foam earcups.'
      },
      price: 12900,
      oldPrice: 15500,
      image: createProductArt('#311042', '#7c3aed', '🎧', 'سماعات ANC Pro اللاسلكية', 'بطارية 45 ساعة'),
      gallery: [
        createProductArt('#311042', '#7c3aed', '🎧', 'سماعات ANC Pro اللاسلكية', 'بطارية 45 ساعة'),
        createProductArt('#1e1b4b', '#6d28d9', '🔋', 'شحن سريع Type-C', 'ضمان 12 شهر')
      ],
      category: 'electronics',
      stock: 16,
      rating: 4.8,
      tags: ['featured', 'bestseller', 'deal', 'سماعات', 'تقنية']
    },
    {
      id: 'p18',
      merchantId: 'm5',
      title: 'لوحة مفاتيح ميكانيكية لاسلكية (عربي/فرنسي/إنجليزي)',
      titleI18n: {
        ar: 'لوحة مفاتيح ميكانيكية لاسلكية (عربي/فرنسي/إنجليزي)',
        fr: 'Clavier Mécanique Sans Fil RGB (Arabe/FR/EN)',
        en: 'Wireless Mechanical Keyboard RGB (AR/FR/EN)'
      },
      description: 'لوحة مفاتيح ميكانيكية 75% للمبرمجين والكتّاب، تدعم البلوتوث لـ 3 أجهزة معاً، مفاتيح هادئة قابلة للتبديل، وحروف عربية محفورة بالليزر.',
      descriptionI18n: {
        ar: 'لوحة مفاتيح ميكانيكية 75% للمبرمجين والكتّاب، تدعم البلوتوث لـ 3 أجهزة معاً، مفاتيح هادئة قابلة للتبديل، وحروف عربية محفورة بالليزر.',
        fr: 'Clavier mécanique compact 75% multi-appareils avec switches tactiles silencieux et gravure laser Arabe/Latin.',
        en: 'Compact 75% multi-device mechanical keyboard with silent tactile switches and laser-etched Arabic/Latin keycaps.'
      },
      price: 11200,
      oldPrice: 13000,
      image: createProductArt('#1e1b4b', '#ec4899', '⌨️', 'كيبورد ميكانيكي عربي/لاتيني', 'بلوتوث + سلكي'),
      gallery: [
        createProductArt('#1e1b4b', '#ec4899', '⌨️', 'كيبورد ميكانيكي عربي/لاتيني', 'بلوتوث + سلكي')
      ],
      category: 'electronics',
      stock: 13,
      rating: 4.7,
      tags: ['برمجة', 'مكتب', 'كيبورد']
    },
    {
      id: 'p19',
      merchantId: 'm5',
      title: 'حامل لابتوب ألمنيوم قابل للطي + موزع USB-C 7 في 1',
      titleI18n: {
        ar: 'حامل لابتوب ألمنيوم قابل للطي + موزع USB-C 7 في 1',
        fr: 'Support Laptop Aluminium + Hub USB-C 7-en-1',
        en: 'Foldable Aluminum Laptop Stand + 7-in-1 USB-C Hub'
      },
      description: 'احمِ رقبتك وضاعف إنتاجيتك؛ حامل ألمنيوم متين بـ 6 زوايا ارتفاع مدمج مع موزع منافذ يضم HDMI 4K وقارئ بطاقات وشحن PD 100W.',
      descriptionI18n: {
        ar: 'احمِ رقبتك وضاعف إنتاجيتك؛ حامل ألمنيوم متين بـ 6 زوايا ارتفاع مدمج مع موزع منافذ يضم HDMI 4K وقارئ بطاقات وشحن PD 100W.',
        fr: 'Support ergonomique réglable en alliage d’aluminium avec hub USB-C intégré (HDMI 4K, PD 100W, USB 3.0).',
        en: 'Ergonomic 6-level aluminum laptop stand paired with a 7-in-1 USB-C hub supporting 4K HDMI and 100W PD.'
      },
      price: 6500,
      oldPrice: 7800,
      image: createProductArt('#0f172a', '#3b82f6', '💻', 'حامل لابتوب + Hub 7in1', 'إنتاجية عالية'),
      gallery: [
        createProductArt('#0f172a', '#3b82f6', '💻', 'حامل لابتوب + Hub 7in1', 'إنتاجية عالية')
      ],
      category: 'electronics',
      stock: 21,
      rating: 4.6,
      tags: ['deal', 'عمل_عن_بعد', 'إكسسوارات']
    },
    {
      id: 'p20',
      merchantId: 'm5',
      title: 'طقم مايكروفون لاسلكي مزدوج لصناع المحتوى (Type-C & iOS)',
      titleI18n: {
        ar: 'طقم مايكروفون لاسلكي مزدوج لصناع المحتوى (Type-C & iOS)',
        fr: 'Double Micro-Cravate Sans Fil pour Créateurs (USB-C & iOS)',
        en: 'Dual Wireless Lavalier Microphone Kit (USB-C & iOS)'
      },
      description: 'سجل فيديوهات Reels وبودكاست بصوت استوديو نقي حتى مسافة 30 متراً، مع علبة شحن ذكية وخاصية إلغاء ضجيج الرياح والشارع بضغطة زر.',
      descriptionI18n: {
        ar: 'سجل فيديوهات Reels وبودكاست بصوت استوديو نقي حتى مسافة 30 متراً، مع علبة شحن ذكية وخاصية إلغاء ضجيج الرياح والشارع بضغطة زر.',
        fr: 'Enregistrez vos Reels et podcasts avec un son cristallin jusqu’à 30m, boîtier de charge inclus.',
        en: 'Record studio-grade Reels and podcasts up to 30m away with one-click noise reduction and charging case.'
      },
      price: 5800,
      oldPrice: 6900,
      image: createProductArt('#4c1d95', '#06b6d4', '🎙️', 'مايكروفون لاسلكي مزدوج', 'لصناع المحتوى'),
      gallery: [
        createProductArt('#4c1d95', '#06b6d4', '🎙️', 'مايكروفون لاسلكي مزدوج', 'لصناع المحتوى')
      ],
      category: 'electronics',
      stock: 24,
      rating: 4.8,
      tags: ['new', 'بودكاست', 'تصوير']
    },

    // --- مكتبة الأوراس الثقافية (m6 - books) ---
    {
      id: 'p21',
      merchantId: 'm6',
      title: 'ثلاثية الجزائر لمحمد ديب (طبعة فاخرة مجلدة)',
      titleI18n: {
        ar: 'ثلاثية الجزائر لمحمد ديب (طبعة فاخرة مجلدة)',
        fr: 'La Trilogie Algérienne — Mohammed Dib (Édition Collector)',
        en: 'The Algerian Trilogy by Mohammed Dib (Hardcover Collector Set)'
      },
      description: 'الدار الكبيرة، الحريق، والنول — روائع الأدب الجزائري الخالدة في طبعة مذهّبة فاخرة بورق كريمي مريح للعين وفاصل كتاب نحاسي هدية.',
      descriptionI18n: {
        ar: 'الدار الكبيرة، الحريق، والنول — روائع الأدب الجزائري الخالدة في طبعة مذهّبة فاخرة بورق كريمي مريح للعين وفاصل كتاب نحاسي هدية.',
        fr: 'La Grande Maison, L’Incendie et Le Métier à tisser réunis dans un coffret relié doré avec marque-page en cuivre.',
        en: 'The Big House, The Fire, and The Loom in a gilded hardcover collector box set with a brass bookmark.'
      },
      price: 4600,
      oldPrice: 5400,
      image: createProductArt('#134e4a', '#d97706', '📚', 'ثلاثية محمد ديب الفاخرة', 'طبعة خاصة'),
      gallery: [
        createProductArt('#134e4a', '#d97706', '📚', 'ثلاثية محمد ديب الفاخرة', 'طبعة خاصة'),
        createProductArt('#0f766e', '#b45309', '🔖', 'مرفقة بفاصل نحاسي', 'ورق كريمي')
      ],
      category: 'books',
      stock: 15,
      rating: 5.0,
      tags: ['featured', 'bestseller', 'أدب_جزائري', 'روايات']
    },
    {
      id: 'p22',
      merchantId: 'm6',
      title: 'مفكرة "إنجاز" الجلدية غير المؤرخة + قلم حبر معدني',
      titleI18n: {
        ar: 'مفكرة "إنجاز" الجلدية غير المؤرخة + قلم حبر معدني',
        fr: 'Planner "Injaz" en Cuir + Stylo Plume Métallique',
        en: '"Injaz" Leather Undated Planner + Metal Fountain Pen'
      },
      description: 'صُممت لترتيب أهدافك الأسبوعية وتتبع عاداتك وميزانيتك بدون ضغط التواريخ؛ غلاف جلد نباتي فاخر وورق سميك 120 غرام لا يشف الحبر.',
      descriptionI18n: {
        ar: 'صُممت لترتيب أهدافك الأسبوعية وتتبع عاداتك وميزانيتك بدون ضغط التواريخ؛ غلاف جلد نباتي فاخر وورق سميك 120 غرام لا يشف الحبر.',
        fr: 'Organisez vos objectifs et habitudes sur papier 120g ivoire avec couverture en cuir souple et stylo assorti.',
        en: 'Plan weekly goals, habits, and budgets on 120gsm ivory paper bound in supple vegan leather with a matching pen.'
      },
      price: 2700,
      oldPrice: 3200,
      image: createProductArt('#1e293b', '#0d9488', '📓', 'مفكرة إنجاز الجلدية', 'ورق 120 غرام'),
      gallery: [
        createProductArt('#1e293b', '#0d9488', '📓', 'مفكرة إنجاز الجلدية', 'ورق 120 غرام')
      ],
      category: 'books',
      stock: 28,
      rating: 4.8,
      tags: ['تنظيم', 'قرطاسية', 'مفكرة']
    },
    {
      id: 'p23',
      merchantId: 'm6',
      title: 'حقيبة الخطاط العربي المتكاملة (أقلام قصب + حبر + ورق مقهر)',
      titleI18n: {
        ar: 'حقيبة الخطاط العربي المتكاملة (أقلام قصب + حبر + ورق مقهر)',
        fr: 'Coffret Calligraphie Arabe Complet (Calames, Encre & Papier)',
        en: 'Master Arabic Calligraphy Starter Kit'
      },
      description: 'كل ما تحتاجه لتعلم وإتقان الخط الديواني، الرقعة، والخط المغاربي: 5 أقلام قصب وبامبو مقطوعة يدوياً، محبرة بالحرير (ليقة)، وكراس تدريب.',
      descriptionI18n: {
        ar: 'كل ما تحتاجه لتعلم وإتقان الخط الديواني، الرقعة، والخط المغاربي: 5 أقلام قصب وبامبو مقطوعة يدوياً، محبرة بالحرير (ليقة)، وكراس تدريب.',
        fr: '5 calames taillés à la main, encrier traditionnel avec soie (liqa), papier ahar et guide des styles Maghribi et Diwani.',
        en: '5 hand-cut reed pens, traditional silk-thread inkwell, burnished paper, and a practice guide for Maghribi script.'
      },
      price: 3900,
      oldPrice: 4500,
      image: createProductArt('#451a03', '#b45309', '✒️', 'حقيبة الخط العربي', 'للمبتدئين والمحترفين'),
      gallery: [
        createProductArt('#451a03', '#b45309', '✒️', 'حقيبة الخط العربي', 'للمبتدئين والمحترفين')
      ],
      category: 'books',
      stock: 11,
      rating: 4.9,
      tags: ['new', 'خط_عربي', 'فنون', 'هدية']
    },
    {
      id: 'p24',
      merchantId: 'm6',
      title: 'موسوعة المطبخ الجزائري المصورة (350 وصفة تقليدية)',
      titleI18n: {
        ar: 'موسوعة المطبخ الجزائري المصورة (350 وصفة تقليدية)',
        fr: 'Encyclopédie Illustrée de la Cuisine Algérienne (350 Recettes)',
        en: 'Illustrated Encyclopedia of Algerian Cuisine (350 Recipes)'
      },
      description: 'رحلة ذوقية من الشرق إلى الغرب ومن الساحل إلى الصحراء؛ 350 وصفة بمقادير مضبوطة بالغرام والكوب مع صور احترافية خطوة بخطوة.',
      descriptionI18n: {
        ar: 'رحلة ذوقية من الشرق إلى الغرب ومن الساحل إلى الصحراء؛ 350 وصفة بمقادير مضبوطة بالغرام والكوب مع صور احترافية خطوة بخطوة.',
        fr: '350 recettes authentiques de toutes les régions d’Algérie expliquées étape par étape avec photos haute résolution.',
        en: 'A culinary journey across Algeria featuring 350 step-by-step regional recipes with full-color photography.'
      },
      price: 3500,
      oldPrice: 4200,
      image: createProductArt('#991b1b', '#ea580c', '🍲', 'موسوعة المطبخ الجزائري', '350 وصفة مصورة'),
      gallery: [
        createProductArt('#991b1b', '#ea580c', '🍲', 'موسوعة المطبخ الجزائري', '350 وصفة مصورة')
      ],
      category: 'books',
      stock: 20,
      rating: 4.9,
      tags: ['deal', 'طبخ', 'تراث', 'كتب']
    }
  ],

  // 🌐 قاموس الترجمات الشامل (العربية، الفرنسية، الإنجليزية)
  translations: {
    ar: {
      nav: {
        home: 'الرئيسية',
        homeTitle: 'سوق صغير',
        merchants: 'المتاجر',
        categories: 'الأقسام',
        deals: 'العروض 🔥',
        dashboard: 'لوحة التاجر',
        cart: 'السلة',
        wishlist: 'المفضلة',
        searchPlaceholder: 'ابحث عن منتج، متجر، أو مدينة (مثل: كراكو، بقلاوة، قسنطينة)...',
        notifications: 'الإشعارات',
        themeToggle: 'تبديل المظهر',
        langLabel: 'العربية'
      },
      hero: {
        badge: '🇩🇿 منصة التجار والحرفيين المستقلين #1',
        title: 'اكتشف روائع المحلات الجزائرية وتسوّق مباشرة عبر واتساب',
        subtitle: 'سوق صغير يجمع لك نخبة الحرفيين، صناع الحلويات، والمتاجر العصرية في مكان واحد — بدون وسطاء وبتواصل فوري مع التاجر.',
        ctaExplore: 'تصفّح المنتجات الآن',
        ctaDashboard: 'افتح متجرك مجاناً',
        statMerchants: 'تاجر موثّق',
        statProducts: 'منتج أصيل',
        statCities: 'ولاية مشمولة بالتوصيل'
      },
      filters: {
        allCities: 'كل الولايات / المدن',
        sortBy: 'ترتيب حسب:',
        sortFeatured: 'الأكثر تميزاً',
        sortPriceAsc: 'السعر: من الأقل للأعلى',
        sortPriceDesc: 'السعر: من الأعلى للأقل',
        sortRating: 'الأعلى تقييماً ⭐',
        tabAll: 'الكل ✨',
        tabBestseller: 'الأكثر مبيعاً 🔥',
        tabNew: 'جديد اليوم 🌱',
        tabDeals: 'عروض وتخفيضات 🏷️',
        resultsCount: 'منتج متوفر',
        clearFilters: 'إعادة ضبط الفلاتر'
      },
      sections: {
        categoriesTitle: 'تسوّق حسب القسم',
        categoriesSub: 'اختر الفئة التي تبحث عنها واستكشف إبداعات التجار',
        merchantsTitle: 'متاجر مميزة في سوق صغير',
        merchantsSub: 'تجار مستقلون موثقون يمكنك زيارة محلاتهم أو مراسلتهم مباشرة عبر واتساب',
        productsTitle: 'معرض المنتجات المختارة',
        productsSub: 'اطلب مباشرة عبر واتساب أو أضف إلى سلتك المشتركة',
        shippingCalcTitle: '🚚 حاسبة التوصيل التقديرية',
        shippingSelectWilaya: 'اختر ولايتك لحساب التوصيل:',
        shippingFeeLabel: 'سعر التوصيل التقديري:',
        shippingDaysLabel: 'مدة التوصيل:',
        shippingDaysUnit: 'أيام عمل'
      },
      merchant: {
        verified: 'متجر موثّق',
        productsCount: 'منتج',
        reviews: 'تقييم',
        visitStore: 'زيارة المتجر',
        contactWhatsapp: 'تواصل عبر واتساب',
        floatingWhatsapp: 'راسل التاجر مباشرة عبر واتساب',
        allMerchantProducts: 'جميع منتجات المتجر',
        backToHome: 'العودة للرئيسية'
      },
      product: {
        addToCart: 'أضف للسلة',
        orderWhatsapp: 'اطلب عبر واتساب',
        inStock: 'متوفر في المخزون',
        lowStock: 'بقيت قطع قليلة:',
        outOfStock: 'نفد المخزون',
        soldBy: 'يُباع بواسطة:',
        category: 'القسم:',
        sku: 'رقم المنتج:',
        shareProduct: 'نسخ رابط المنتج',
        relatedTitle: 'منتجات أخرى من نفس المتجر',
        customerReviews: 'تقييمات الزبائن',
        addReviewTitle: 'أضف تقييمك لهذا المنتج',
        yourName: 'اسمك الكريم',
        yourComment: 'شاركنا رأيك في جودة المنتج...',
        submitReview: 'نشر التقييم ⭐'
      },
      cart: {
        title: 'سلة المشتريات الذكية',
        subtitle: 'إذا كانت مشترياتك من عدة تجار، سنجهز لك رسالة واتساب مخصصة لكل تاجر بضغطة زر!',
        emptyTitle: 'سلة مشترياتك فارغة حالياً',
        emptySub: 'استكشف محلات سوق صغير وأضف ما يعجبك من الحلويات، الأزياء، أو التحف.',
        browseBtn: 'ابدأ التسوق الآن',
        customerInfoTitle: 'بيانات المستلم (لإرسالها للتاجر عبر واتساب)',
        customerName: 'الاسم الكامل',
        customerNamePlaceholder: 'مثال: أمين بن علي',
        customerCity: 'الولاية / المدينة',
        customerAddress: 'العنوان أو ملاحظة للتاجر (اختياري)',
        customerAddressPlaceholder: 'مثال: حي الزهور، التوصيل مساءً...',
        couponLabel: 'هل لديك كود خصم؟ (جرّب SOUK10 أو DZAIR20)',
        couponPlaceholder: 'أدخل الكود هنا',
        applyCoupon: 'تطبيق',
        subtotal: 'المجموع الفرعي:',
        discount: 'قيمة الخصم:',
        shipping: 'التوصيل التقديري:',
        total: 'الإجمالي النهائي:',
        checkoutMerchantBtn: 'إرسال طلب منتجات هذا التاجر عبر واتساب',
        checkoutAllBtn: 'إرسال الطلب عبر واتساب',
        clearCart: 'إفراغ السلة',
        groupedByMerchant: 'المنتجات مقسّمة حسب المتجر:'
      },
      dashboard: {
        title: 'لوحة تحكم التاجر',
        subtitle: 'أدر منتجات متجرك، راقب الإحصائيات، وحدث الأسعار والمخزون فوراً (تُحفظ تلقائياً في المتصفح)',
        selectMerchant: 'اختر المتجر الذي تديره:',
        statTotalProducts: 'إجمالي المنتجات',
        statTotalStock: 'إجمالي القطع بالمخزون',
        statInventoryValue: 'القيمة السوقية للمخزون',
        statAvgRating: 'متوسط تقييم المتجر',
        chartTitle: '📊 تحليل المخزون وقيمة المنتجات الحالية',
        addProductBtn: '+ إضافة منتج جديد',
        editProductTitle: 'تعديل بيانات المنتج',
        newProductTitle: 'إضافة منتج جديد للمتجر',
        tableImage: 'الصورة',
        tableTitle: 'اسم المنتج',
        tableCategory: 'القسم',
        tablePrice: 'السعر',
        tableStock: 'المخزون',
        tableRating: 'التقييم',
        tableActions: 'الإجراءات',
        formTitle: 'اسم المنتج',
        formPrice: 'السعر الحالي (د.ج)',
        formOldPrice: 'السعر قبل الخصم (اختياري)',
        formStock: 'الكمية المتوفرة',
        formCategory: 'القسم',
        formEmoji: 'رمز / إيموجي المنتج (لتوليد صورة تلقائية)',
        formDesc: 'وصف المنتج القصصي',
        formTags: 'الوسوم (مفصولة بفاصلة: جديد, عروض...)',
        saveBtn: 'حفظ المنتج',
        cancelBtn: 'إلغاء',
        editBtn: 'تعديل',
        deleteBtn: 'حذف',
        resetDataBtn: 'استعادة البيانات الافتراضية للسوق'
      },
      toasts: {
        addedToCart: 'تمت إضافة المنتج إلى السلة بنجاح 🛒',
        removedFromCart: 'تم حذف المنتج من السلة',
        wishlistAdded: 'أُضيف إلى قائمة المفضلة ❤️',
        wishlistRemoved: 'أُزيل من قائمة المفضلة',
        couponApplied: 'تم تفعيل كود الخصم بنجاح! 🎉',
        couponInvalid: 'كود الخصم غير صالح، جرّب SOUK10 أو DZAIR20',
        productSaved: 'تم حفظ المنتج في متجرك بنجاح ✅',
        productDeleted: 'تم حذف المنتج من المتجر 🗑️',
        reviewAdded: 'شكراً لك! تم إضافة تقييمك بنجاح ⭐',
        linkCopied: 'تم نسخ الرابط إلى الحافظة 📋',
        enterCustomerName: 'يرجى إدخال اسمك لإتمام رسالة طلب واتساب 📝',
        whatsappOpened: 'جاري فتح واتساب لمراسلة التاجر 💬',
        dataReset: 'تمت استعادة البيانات الأصلية للمنصة 🔄'
      },
      whatsapp: {
        productOrder: 'مرحباً {merchantName} 👋\nأود طلب هذا المنتج من متجركم في *{siteName}*:\n\n📦 *المنتج:* {productTitle}\n🔢 *رقم المنتج:* #{productId}\n💰 *السعر:* {price} {currency}\n🏪 *المتجر:* {merchantName}\n\nهل المنتج متوفر حالياً؟ وشكراً لكم! 🌿',
        merchantContact: 'السلام عليكم *{merchantName}* 👋\nوجدت متجركم الرائع في منصة *{siteName}* ({city})، وأود الاستفسار عن منتجاتكم المتوفرة وطريقة التوصيل. شكراً جزيلاً!',
        cartOrder: 'مرحباً *{merchantName}* 👋\nطلب جديد عبر منصة *{siteName}*:\n\n👤 *العميل:* {customerName}\n📍 *الولاية/المدينة:* {customerCity}\n🏠 *ملاحظة/عنوان:* {customerAddress}\n\n🛍️ *المنتجات المطلوبة:*\n{itemsList}\n\n🚚 *التوصيل التقديري:* {shipping} {currency}\n{discountLine}💰 *المجموع الإجمالي:* *{total} {currency}*\n\nهل يمكن تأكيد توفر الطلب؟ شكراً لكم!'
      }
    },

    fr: {
      nav: {
        home: 'Accueil',
        homeTitle: 'Mini Souk',
        merchants: 'Boutiques',
        categories: 'Catégories',
        deals: 'Promos 🔥',
        dashboard: 'Espace Marchand',
        cart: 'Panier',
        wishlist: 'Favoris',
        searchPlaceholder: 'Rechercher un produit, une boutique ou une ville (ex: Karakou, Alger)...',
        notifications: 'Notifications',
        themeToggle: 'Changer le thème',
        langLabel: 'Français'
      },
      hero: {
        badge: '🇩🇿 La 1ère Marketplace des Artisans & Commerçants',
        title: 'Découvrez les pépites des boutiques algériennes en direct sur WhatsApp',
        subtitle: 'Mini Souk réunit les meilleurs artisans, pâtissiers et boutiques modernes en un seul endroit — sans intermédiaire et en contact direct.',
        ctaExplore: 'Explorer les produits',
        ctaDashboard: 'Gérer ma boutique',
        statMerchants: 'Marchands vérifiés',
        statProducts: 'Produits authentiques',
        statCities: 'Wilayas livrées'
      },
      filters: {
        allCities: 'Toutes les villes / Wilayas',
        sortBy: 'Trier par :',
        sortFeatured: 'En vedette',
        sortPriceAsc: 'Prix : Croissant',
        sortPriceDesc: 'Prix : Décroissant',
        sortRating: 'Mieux notés ⭐',
        tabAll: 'Tout ✨',
        tabBestseller: 'Meilleures ventes 🔥',
        tabNew: 'Nouveautés 🌱',
        tabDeals: 'Promotions 🏷️',
        resultsCount: 'produits trouvés',
        clearFilters: 'Réinitialiser les filtres'
      },
      sections: {
        categoriesTitle: 'Parcourir par catégorie',
        categoriesSub: 'Explorez le savoir-faire de nos marchands indépendants',
        merchantsTitle: 'Boutiques à la Une sur Mini Souk',
        merchantsSub: 'Commerçants vérifiés — visitez leur vitrine ou discutez directement sur WhatsApp',
        productsTitle: 'Sélection de Produits',
        productsSub: 'Commandez en 1 clic sur WhatsApp ou ajoutez à votre panier multi-boutiques',
        shippingCalcTitle: '🚚 Simulateur de Livraison',
        shippingSelectWilaya: 'Votre Wilaya :',
        shippingFeeLabel: 'Tarif estimé :',
        shippingDaysLabel: 'Délai :',
        shippingDaysUnit: 'jours ouvrables'
      },
      merchant: {
        verified: 'Boutique Vérifiée',
        productsCount: 'produits',
        reviews: 'avis',
        visitStore: 'Voir la boutique',
        contactWhatsapp: 'Contacter sur WhatsApp',
        floatingWhatsapp: 'Discuter avec le marchand sur WhatsApp',
        allMerchantProducts: 'Tous les produits de la boutique',
        backToHome: 'Retour à l’accueil'
      },
      product: {
        addToCart: 'Ajouter au panier',
        orderWhatsapp: 'Commander via WhatsApp',
        inStock: 'En stock',
        lowStock: 'Stock limité :',
        outOfStock: 'Rupture de stock',
        soldBy: 'Vendu par :',
        category: 'Catégorie :',
        sku: 'Réf produit :',
        shareProduct: 'Copier le lien',
        relatedTitle: 'Autres créations de cette boutique',
        customerReviews: 'Avis des clients',
        addReviewTitle: 'Donnez votre avis sur ce produit',
        yourName: 'Votre nom',
        yourComment: 'Partagez votre expérience...',
        submitReview: 'Publier l’avis ⭐'
      },
      cart: {
        title: 'Votre Panier Intelligent',
        subtitle: 'Si votre panier contient plusieurs boutiques, nous générons un message WhatsApp dédié pour chaque marchand !',
        emptyTitle: 'Votre panier est vide',
        emptySub: 'Parcourez les boutiques de Mini Souk et ajoutez vos coups de cœur.',
        browseBtn: 'Découvrir le Souk',
        customerInfoTitle: 'Vos coordonnées (pour le bon de commande WhatsApp)',
        customerName: 'Nom complet',
        customerNamePlaceholder: 'Ex : Amine Benali',
        customerCity: 'Wilaya / Ville',
        customerAddress: 'Adresse ou note au vendeur (optionnel)',
        customerAddressPlaceholder: 'Ex : Quartier des Fleurs, livraison l’après-midi...',
        couponLabel: 'Code promo (essayez SOUK10 ou DZAIR20)',
        couponPlaceholder: 'Entrez votre code',
        applyCoupon: 'Appliquer',
        subtotal: 'Sous-total :',
        discount: 'Réduction :',
        shipping: 'Livraison estimée :',
        total: 'Total à payer :',
        checkoutMerchantBtn: 'Envoyer la commande à ce marchand sur WhatsApp',
        checkoutAllBtn: 'Commander sur WhatsApp',
        clearCart: 'Vider le panier',
        groupedByMerchant: 'Articles groupés par boutique :'
      },
      dashboard: {
        title: 'Tableau de Bord Marchand',
        subtitle: 'Gérez votre catalogue, suivez vos statistiques et mettez à jour vos stocks en temps réel (sauvegardé dans localStorage)',
        selectMerchant: 'Boutique active :',
        statTotalProducts: 'Total Produits',
        statTotalStock: 'Unités en Stock',
        statInventoryValue: 'Valeur du Stock',
        statAvgRating: 'Note Moyenne',
        chartTitle: '📊 Répartition du Stock et Valeur par Produit',
        addProductBtn: '+ Nouveau Produit',
        editProductTitle: 'Modifier le produit',
        newProductTitle: 'Ajouter un produit à la boutique',
        tableImage: 'Aperçu',
        tableTitle: 'Produit',
        tableCategory: 'Catégorie',
        tablePrice: 'Prix',
        tableStock: 'Stock',
        tableRating: 'Note',
        tableActions: 'Actions',
        formTitle: 'Nom du produit',
        formPrice: 'Prix actuel (DA)',
        formOldPrice: 'Ancien prix (optionnel)',
        formStock: 'Quantité en stock',
        formCategory: 'Catégorie',
        formEmoji: 'Icône / Emoji du produit',
        formDesc: 'Description détaillée',
        formTags: 'Tags (séparés par virgule : new, deal...)',
        saveBtn: 'Enregistrer',
        cancelBtn: 'Annuler',
        editBtn: 'Modifier',
        deleteBtn: 'Supprimer',
        resetDataBtn: 'Réinitialiser les données démo'
      },
      toasts: {
        addedToCart: 'Produit ajouté au panier 🛒',
        removedFromCart: 'Produit retiré du panier',
        wishlistAdded: 'Ajouté à vos favoris ❤️',
        wishlistRemoved: 'Retiré de vos favoris',
        couponApplied: 'Code promo appliqué avec succès ! 🎉',
        couponInvalid: 'Code invalide, essayez SOUK10 ou DZAIR20',
        productSaved: 'Produit enregistré avec succès ✅',
        productDeleted: 'Produit supprimé de la boutique 🗑️',
        reviewAdded: 'Merci ! Votre avis a été publié ⭐',
        linkCopied: 'Lien copié dans le presse-papiers 📋',
        enterCustomerName: 'Veuillez saisir votre nom pour envoyer la commande WhatsApp 📝',
        whatsappOpened: 'Ouverture de WhatsApp en cours 💬',
        dataReset: 'Données initiales restaurées 🔄'
      },
      whatsapp: {
        productOrder: 'Bonjour {merchantName} 👋\nJe souhaite commander cet article vu sur *{siteName}* :\n\n📦 *Produit :* {productTitle}\n🔢 *Référence :* #{productId}\n💰 *Prix :* {price} {currency}\n🏪 *Boutique :* {merchantName}\n\nEst-il disponible actuellement ? Merci beaucoup ! 🌿',
        merchantContact: 'Bonjour *{merchantName}* 👋\nJ’ai découvert votre boutique sur *{siteName}* ({city}) et j’aimerais avoir plus d’informations sur vos produits et la livraison. Merci !',
        cartOrder: 'Bonjour *{merchantName}* 👋\nNouvelle commande depuis *{siteName}* :\n\n👤 *Client :* {customerName}\n📍 *Wilaya/Ville :* {customerCity}\n🏠 *Adresse/Note :* {customerAddress}\n\n🛍️ *Articles commandés :*\n{itemsList}\n\n🚚 *Livraison estimée :* {shipping} {currency}\n{discountLine}💰 *Total :* *{total} {currency}*\n\nPouvez-vous confirmer la disponibilité ? Merci !'
      }
    },

    en: {
      nav: {
        home: 'Home',
        homeTitle: 'Mini Souk',
        merchants: 'Shops',
        categories: 'Categories',
        deals: 'Hot Deals 🔥',
        dashboard: 'Merchant Hub',
        cart: 'Cart',
        wishlist: 'Wishlist',
        searchPlaceholder: 'Search products, shops, or cities (e.g. Karakou, Baklawa, Algiers)...',
        notifications: 'Notifications',
        themeToggle: 'Toggle theme',
        langLabel: 'English'
      },
      hero: {
        badge: '🇩🇿 #1 Independent Artisans & Merchants Marketplace',
        title: 'Discover Authentic Algerian Shops & Order Directly via WhatsApp',
        subtitle: 'Mini Souk connects you with master artisans, pastry makers, and modern local shops in one curated marketplace — zero middlemen, instant WhatsApp chat.',
        ctaExplore: 'Explore Products',
        ctaDashboard: 'Merchant Dashboard',
        statMerchants: 'Verified Shops',
        statProducts: 'Curated Products',
        statCities: 'Wilayas Covered'
      },
      filters: {
        allCities: 'All Cities / Wilayas',
        sortBy: 'Sort by:',
        sortFeatured: 'Featured First',
        sortPriceAsc: 'Price: Low to High',
        sortPriceDesc: 'Price: High to Low',
        sortRating: 'Highest Rated ⭐',
        tabAll: 'All Items ✨',
        tabBestseller: 'Best Sellers 🔥',
        tabNew: 'New Arrivals 🌱',
        tabDeals: 'Special Deals 🏷️',
        resultsCount: 'products available',
        clearFilters: 'Reset Filters'
      },
      sections: {
        categoriesTitle: 'Shop by Category',
        categoriesSub: 'Explore handpicked creations from independent Algerian sellers',
        merchantsTitle: 'Featured Independent Shops',
        merchantsSub: 'Verified local merchants — visit their storefront or message them directly on WhatsApp',
        productsTitle: 'Curated Marketplace Showcase',
        productsSub: 'Order with a single click via WhatsApp or build a multi-vendor cart',
        shippingCalcTitle: '🚚 Delivery Fee Estimator',
        shippingSelectWilaya: 'Destination Wilaya:',
        shippingFeeLabel: 'Estimated Delivery:',
        shippingDaysLabel: 'Transit Time:',
        shippingDaysUnit: 'business days'
      },
      merchant: {
        verified: 'Verified Merchant',
        productsCount: 'products',
        reviews: 'reviews',
        visitStore: 'Visit Shop',
        contactWhatsapp: 'Chat on WhatsApp',
        floatingWhatsapp: 'Message Merchant on WhatsApp',
        allMerchantProducts: 'All Shop Products',
        backToHome: 'Back to Marketplace'
      },
      product: {
        addToCart: 'Add to Cart',
        orderWhatsapp: 'Order via WhatsApp',
        inStock: 'In Stock',
        lowStock: 'Low Stock:',
        outOfStock: 'Out of Stock',
        soldBy: 'Sold by:',
        category: 'Category:',
        sku: 'Product ID:',
        shareProduct: 'Copy Product Link',
        relatedTitle: 'More from this Shop',
        customerReviews: 'Customer Reviews',
        addReviewTitle: 'Leave a Review',
        yourName: 'Your Name',
        yourComment: 'Share your thoughts about this product...',
        submitReview: 'Post Review ⭐'
      },
      cart: {
        title: 'Smart Multi-Vendor Cart',
        subtitle: 'Buying from multiple shops? We automatically generate a tailored WhatsApp order message for each merchant!',
        emptyTitle: 'Your shopping cart is empty',
        emptySub: 'Explore Mini Souk shops and add traditional sweets, crafts, or tech gear.',
        browseBtn: 'Start Shopping',
        customerInfoTitle: 'Delivery Details (included in your WhatsApp order)',
        customerName: 'Full Name',
        customerNamePlaceholder: 'e.g. Amine Benali',
        customerCity: 'Wilaya / City',
        customerAddress: 'Delivery Address or Note (optional)',
        customerAddressPlaceholder: 'e.g. Hydrah, evening delivery preferred...',
        couponLabel: 'Have a promo code? (Try SOUK10 or DZAIR20)',
        couponPlaceholder: 'Enter promo code',
        applyCoupon: 'Apply',
        subtotal: 'Subtotal:',
        discount: 'Discount:',
        shipping: 'Est. Delivery:',
        total: 'Grand Total:',
        checkoutMerchantBtn: 'Send Order to this Merchant via WhatsApp',
        checkoutAllBtn: 'Order via WhatsApp',
        clearCart: 'Clear Cart',
        groupedByMerchant: 'Items grouped by independent shop:'
      },
      dashboard: {
        title: 'Merchant Control Center',
        subtitle: 'Manage your shop catalog, monitor inventory metrics, and add/edit products in real time (saved in localStorage)',
        selectMerchant: 'Active Shop:',
        statTotalProducts: 'Total Products',
        statTotalStock: 'Total Units in Stock',
        statInventoryValue: 'Inventory Value',
        statAvgRating: 'Store Rating',
        chartTitle: '📊 Live Inventory Stock & Value Breakdown',
        addProductBtn: '+ Add New Product',
        editProductTitle: 'Edit Product Details',
        newProductTitle: 'Add New Product to Shop',
        tableImage: 'Image',
        tableTitle: 'Product Title',
        tableCategory: 'Category',
        tablePrice: 'Price',
        tableStock: 'Stock',
        tableRating: 'Rating',
        tableActions: 'Actions',
        formTitle: 'Product Name',
        formPrice: 'Current Price (DZD)',
        formOldPrice: 'Old Price (optional)',
        formStock: 'Stock Quantity',
        formCategory: 'Category',
        formEmoji: 'Product Emoji (for auto artwork)',
        formDesc: 'Storytelling Description',
        formTags: 'Tags (comma-separated: new, deal...)',
        saveBtn: 'Save Product',
        cancelBtn: 'Cancel',
        editBtn: 'Edit',
        deleteBtn: 'Delete',
        resetDataBtn: 'Reset Demo Marketplace Data'
      },
      toasts: {
        addedToCart: 'Added to your cart 🛒',
        removedFromCart: 'Removed from cart',
        wishlistAdded: 'Saved to your wishlist ❤️',
        wishlistRemoved: 'Removed from wishlist',
        couponApplied: 'Promo code applied! 🎉',
        couponInvalid: 'Invalid code — try SOUK10 or DZAIR20',
        productSaved: 'Product saved to your shop ✅',
        productDeleted: 'Product deleted from shop 🗑️',
        reviewAdded: 'Thank you! Your review is live ⭐',
        linkCopied: 'Product link copied to clipboard 📋',
        enterCustomerName: 'Please enter your name before sending the WhatsApp order 📝',
        whatsappOpened: 'Opening WhatsApp chat 💬',
        dataReset: 'Default marketplace data restored 🔄'
      },
      whatsapp: {
        productOrder: 'Hello {merchantName} 👋\nI would like to order this item from your shop on *{siteName}*:\n\n📦 *Product:* {productTitle}\n🔢 *Product ID:* #{productId}\n💰 *Price:* {price} {currency}\n🏪 *Shop:* {merchantName}\n\nIs this item currently available? Thank you! 🌿',
        merchantContact: 'Hello *{merchantName}* 👋\nI found your shop on *{siteName}* ({city}) and would love to inquire about your products and delivery options. Thank you!',
        cartOrder: 'Hello *{merchantName}* 👋\nNew order from *{siteName}*:\n\n👤 *Customer:* {customerName}\n📍 *Wilaya/City:* {customerCity}\n🏠 *Address/Note:* {customerAddress}\n\n🛍️ *Ordered Items:*\n{itemsList}\n\n🚚 *Est. Delivery:* {shipping} {currency}\n{discountLine}💰 *Total Amount:* *{total} {currency}*\n\nCould you please confirm availability? Thank you!'
      }
    }
  }
};
