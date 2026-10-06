/**
 * LMP Studio - Proposal Core Module
 * Shared catalog, calculations, hash serialization (deflate-raw + base64url),
 * localStorage draft management, and WhatsApp message formatting.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ProposalCore = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // ─── CATALOG DEFINITION ───────────────────────────────────────────────────
  // Packages and Add-ons aligned with index.html (photography) & video.html (dance/video)
  const PACKAGES = [
    {
      id: 'photo-1h',
      category: 'photo',
      nameEn: '1 Hour Studio Session',
      nameEs: 'Sesión de Estudio de 1 Hora',
      price: 150,
      descriptionEn: 'Up to 1 hour, 20-40 edited photos, full studio access, up to 3 outfits.',
      descriptionEs: 'Hasta 1 hora, 20-40 fotos editadas, acceso total al estudio, hasta 3 cambios de vestuario.',
      featuresEn: [
        'Up to 1 hour (includes setup & wrap-up)',
        '20-40 professionally edited photos',
        '2-3 detailed edits included',
        'Full studio access & lighting gear',
        'Up to 3 outfits',
        'Backdrop options available (white cyclorama, textured walls, black)'
      ],
      featuresEs: [
        'Hasta 1 hora (incluye montaje y recogida)',
        '20-40 fotos editadas profesionalmente',
        '2-3 retoques detallados incluidos',
        'Acceso completo al estudio y equipo de iluminación',
        'Hasta 3 cambios de vestuario',
        'Opciones de fondo (ciclorama blanco, pared texturizada, negro)'
      ]
    },
    {
      id: 'photo-2h',
      category: 'photo',
      nameEn: '2 Hour Studio Session',
      nameEs: 'Sesión de Estudio de 2 Horas',
      price: 250,
      descriptionEn: 'Extended studio time, more photos, more creative changes.',
      descriptionEs: 'Mayor tiempo de estudio, más fotografías, más cambios creativos.',
      featuresEn: [
        'Up to 2 hours of studio time',
        'All features of the 1-hour session',
        'Double shooting time = significantly more photos',
        'Opportunity for multiple lighting setups & outfit changes',
        'Best value per hour'
      ],
      featuresEs: [
        'Hasta 2 horas de estudio',
        'Todas las características de la sesión de 1 hora',
        'Doble tiempo de disparo = significativamente más fotos',
        'Opción de múltiples esquemas de luz y cambios de look',
        'Mejor valor por hora'
      ]
    },
    {
      id: 'video-dance',
      category: 'video',
      nameEn: 'Dance Video Sessions (Base Pack)',
      nameEs: 'Sesión de Vídeo de Baile (Pack Base)',
      price: 120,
      descriptionEn: 'Up to 1h shoot, 1 location, 2 one-shot continuous videos + cover photos.',
      descriptionEs: 'Hasta 1h de grabación, 1 localización, 2 vídeos en plano secuencia + fotos de portada.',
      featuresEn: [
        'Up to 1 hour of shooting',
        '1 outdoor location',
        '2 one-shot videos, one continuous take, professionally recorded & color graded',
        'Basic color correction & music sync',
        'Simple text / branding overlays when needed',
        'Edited cover photos from the session for social media',
        'Standard delivery via private gallery'
      ],
      featuresEs: [
        'Hasta 1 hora de grabación',
        '1 localización exterior',
        '2 vídeos en plano secuencia, toma continua, grabados y editados profesionalmente',
        'Corrección de color básica y sincronización musical',
        'Texto simple o grafismos si se requieren',
        'Fotos de portada editadas para redes sociales',
        'Entrega estándar mediante galería privada'
      ]
    },
    {
      id: 'custom-package',
      category: 'custom',
      nameEn: 'Custom Tailored Package',
      nameEs: 'Paquete Personalizado a Medida',
      price: 0,
      isCustom: true,
      descriptionEn: 'Bespoke project tailored to specific creative and commercial requirements.',
      descriptionEs: 'Proyecto a medida adaptado a requerimientos creativos y comerciales específicos.',
      featuresEn: [
        'Custom production plan & timeframe',
        'Dedicated creative consultation'
      ],
      featuresEs: [
        'Plan de producción y calendario a medida',
        'Asesoramiento creativo dedicado'
      ]
    }
  ];

  const ADDONS = [
    // Photography add-ons
    {
      id: 'photo-video',
      category: 'photo',
      nameEn: 'Video Clip (during photo session)',
      nameEs: 'Clip de Vídeo (durante la sesión)',
      price: 50,
      priceType: 'fixed', // per session
      priceSuffixEn: '',
      priceSuffixEs: '',
      descriptionEn: 'Short dynamic video reel filmed within the same booked slot.',
      descriptionEs: 'Vídeo reel dinámico grabado dentro del mismo horario reservado.'
    },
    {
      id: 'photo-outdoor',
      category: 'photo',
      nameEn: 'Outdoor Session (Poble Espanyol)',
      nameEs: 'Sesión en Exterior (Poble Espanyol)',
      price: 50,
      priceType: 'fixed',
      priceSuffixEn: '',
      priceSuffixEs: '',
      descriptionEn: 'Combine studio portraits with architectural outdoor backdrops.',
      descriptionEs: 'Combina fotos en estudio con localizaciones exteriores arquitectónicas.'
    },
    {
      id: 'photo-extra-photos',
      category: 'photo',
      nameEn: 'Extra Edited Photos (batch of 10)',
      nameEs: 'Fotos Editadas Extra (lote de 10)',
      price: 30,
      priceType: 'quantity',
      defaultQty: 1,
      priceSuffixEn: ' / 10 photos',
      priceSuffixEs: ' / 10 fotos',
      descriptionEn: '+10 extra high-resolution and professionally edited photos.',
      descriptionEs: '+10 fotografías adicionales editadas profesionalmente y en alta resolución.'
    },
    {
      id: 'photo-retouch',
      category: 'photo',
      nameEn: 'Advanced Beauty Retouch',
      nameEs: 'Retoque Avanzado de Piel / Detalle',
      price: 30,
      priceType: 'quantity',
      defaultQty: 1,
      priceSuffixEn: ' / hour',
      priceSuffixEs: ' / hora',
      descriptionEn: 'High-end frequency separation and detailed editorial skin retouching.',
      descriptionEs: 'Separación de frecuencias y retoque editorial minucioso.'
    },
    {
      id: 'photo-express',
      category: 'photo',
      nameEn: 'Express 24-48h Delivery',
      nameEs: 'Entrega Urgente 24-48h',
      price: 50,
      priceType: 'editable',
      priceSuffixEn: ' (flat)',
      priceSuffixEs: ' (tarifa plana)',
      descriptionEn: 'Prioritized editing pipeline for urgent deadlines.',
      descriptionEs: 'Prioridad máxima de revelado y entrega en 24-48 horas.'
    },

    // Video / Dance add-ons
    {
      id: 'video-extra-take',
      category: 'video',
      nameEn: 'Extra Single-Take Video',
      nameEs: 'Vídeo Extra en Plano Secuencia',
      price: 35,
      priceType: 'quantity',
      defaultQty: 1,
      priceSuffixEn: ' / video',
      priceSuffixEs: ' / vídeo',
      descriptionEn: 'Additional continuous-take dance video filmed within the booked session.',
      descriptionEs: 'Vídeo en plano secuencia adicional dentro de la sesión reservada.'
    },
    {
      id: 'video-extra-time-30m',
      category: 'video',
      nameEn: 'Extra Shooting Time (30 min)',
      nameEs: 'Tiempo Extra de Grabación (30 min)',
      price: 25,
      priceType: 'quantity',
      defaultQty: 1,
      priceSuffixEn: ' / 30 min',
      priceSuffixEs: ' / 30 min',
      descriptionEn: 'Extend shoot by 30 minutes for additional takes or costume changes.',
      descriptionEs: 'Amplía el rodaje en 30 minutos para tomas adicionales o cambios de vestuario.'
    },
    {
      id: 'video-extra-time',
      category: 'video',
      nameEn: 'Extra Shooting Time (1 hour)',
      nameEs: 'Tiempo Extra de Grabación (1 hora)',
      price: 40,
      priceType: 'quantity',
      defaultQty: 1,
      priceSuffixEn: ' / hour',
      priceSuffixEs: ' / hora',
      descriptionEn: 'Extend shoot by 1 hour for deeper rehearsal and multi-look variations.',
      descriptionEs: 'Amplía el rodaje en 1 hora para ensayos detallados y variaciones de vestuario.'
    },
    {
      id: 'video-location',
      category: 'video',
      nameEn: 'Additional Location (nearby)',
      nameEs: 'Localización Adicional (cercana)',
      price: 25,
      priceType: 'editable',
      priceSuffixEn: ' (starting)',
      priceSuffixEs: ' (desde)',
      descriptionEn: 'Add a second nearby location with transit and dedicated setup.',
      descriptionEs: 'Añade una segunda localización cercana con desplazamiento y montaje.'
    },
    {
      id: 'video-dynamic-edit',
      category: 'video',
      nameEn: 'Multi-Take Dynamic Edit',
      nameEs: 'Edición Dinámica Multitoma',
      price: 40,
      priceType: 'quantity',
      defaultQty: 1,
      priceSuffixEn: ' / video',
      priceSuffixEs: ' / vídeo',
      descriptionEn: 'Upgrade continuous one-shot into a rhythmic, multi-angle dynamic cut.',
      descriptionEs: 'Convierte la toma continua en una edición dinámica rítmica multi-ángulo.'
    },
    {
      id: 'video-rush',
      category: 'video',
      nameEn: 'Video Rush Delivery',
      nameEs: 'Entrega Urgente de Vídeo',
      price: 30,
      priceType: 'editable',
      priceSuffixEn: ' (starting)',
      priceSuffixEs: ' (desde)',
      descriptionEn: 'Fast-track video editing and export delivered within 48 hours.',
      descriptionEs: 'Montaje prioritario y entrega de los vídeos en 48 horas.'
    }
  ];

  const PRESET_IMAGES = [
    { label: 'Clean Portrait 1', url: 'images/portfolio/clean1.jpg' },
    { label: 'Clean Portrait 2', url: 'images/portfolio/clean2.jpg' },
    { label: 'Editorial 1', url: 'images/portfolio/editorial1.jpg' },
    { label: 'Editorial 2', url: 'images/portfolio/editorial2.jpg' },
    { label: 'Color & Creative 1', url: 'images/portfolio/color1.jpg' },
    { label: 'Color & Creative 2', url: 'images/portfolio/color2.jpg' },
    { label: 'Dark & Moody 1', url: 'images/portfolio/dark1.jpg' },
    { label: 'Dark & Moody 2', url: 'images/portfolio/dark2.jpg' },
    { label: 'Lifestyle 1', url: 'images/portfolio/lifestyle1.jpg' },
    { label: 'Studio Space 1', url: 'images/studio-1.png' },
    { label: 'Studio Equipment', url: 'images/studio-equipment.png' },
    { label: 'Dance Frame 1', url: 'videos/dance-1.jpg' },
    { label: 'Dance Frame 2', url: 'videos/dance-2.jpg' },
    { label: 'Dance Frame 3', url: 'videos/dance-3.jpg' }
  ];

  // ─── UTILITY HELPERS ───────────────────────────────────────────────────────
  /**
   * Converts Google Drive sharing links (view, uc, edit, open) into reliable direct thumbnail URLs
   */
  function normalizeImageUrl(url) {
    if (!url) return '';
    let clean = url.trim();

    // Check for Google Drive file / folder link
    const fileDMatch = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${fileDMatch[1]}&sz=w2000`;
    }

    const idMatch = clean.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1] && (clean.includes('drive.google.com') || clean.includes('docs.google.com'))) {
      return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w2000`;
    }

    return clean;
  }

  function formatEUR(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) amount = 0;
    // If integer, display no decimals; if decimals, 2 places
    const isInt = Math.round(amount * 100) % 100 === 0;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: isInt ? 0 : 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  function roundCents(num) {
    return Math.round((Number(num) || 0) * 100) / 100;
  }

  function generateId() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let res = 'P-';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  }

  function getTodayIso() {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }

  function getDefaultExpiryIso(daysAhead = 14) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  }

  // ─── CALCULATION ENGINE ────────────────────────────────────────────────────
  /**
   * Calculate all monetary totals step-by-step
   * Order:
   *  1. Subtotal = Base package price + Σ(Add-on price * qty) + Σ(Custom items)
   *  2. Discount = % of Subtotal or fixed € (capped at Subtotal)
   *  3. Net = Subtotal - Discount
   *  4. VAT = % of Net or fixed € (added on top)
   *  5. Total = Net + VAT
   *  6. Deposit = % of Total or fixed € (capped at Total)
   *  7. Balance = Total - Deposit
   */
  function calculateTotals(proposal) {
    const basePkg = PACKAGES.find(p => p.id === proposal.packageId) || PACKAGES[0];
    const basePrice = basePkg.isCustom ? (Number(proposal.customPackagePrice) || 0) : basePkg.price;

    // Addons
    let addonsSubtotal = 0;
    const selectedAddons = [];
    if (Array.isArray(proposal.addons)) {
      proposal.addons.forEach(a => {
        const catalogItem = ADDONS.find(item => item.id === a.id);
        if (!catalogItem) return;
        const qty = Math.max(1, Number(a.qty) || 1);
        const unitPrice = a.price !== undefined ? Number(a.price) : catalogItem.price;
        const lineTotal = roundCents(unitPrice * qty);
        addonsSubtotal += lineTotal;
        selectedAddons.push({
          id: a.id,
          nameEn: catalogItem.nameEn,
          nameEs: catalogItem.nameEs,
          unitPrice: roundCents(unitPrice),
          qty: qty,
          total: lineTotal,
          catalogItem: catalogItem
        });
      });
    }

    // Custom items
    let customItemsSubtotal = 0;
    const customItems = [];
    if (Array.isArray(proposal.customItems)) {
      proposal.customItems.forEach(ci => {
        const title = (ci.title || '').trim();
        const price = Number(ci.price) || 0;
        if (!title && price === 0) return;
        const lineTotal = roundCents(price);
        customItemsSubtotal += lineTotal;
        customItems.push({
          title: title || 'Custom Item',
          price: lineTotal
        });
      });
    }

    const subtotal = roundCents(basePrice + addonsSubtotal + customItemsSubtotal);

    // Discount
    const disc = proposal.money?.discount || { enabled: false, type: 'percent', value: 10 };
    let discountAmount = 0;
    if (disc.enabled) {
      if (disc.type === 'percent') {
        discountAmount = roundCents(subtotal * ((Number(disc.value) || 0) / 100));
      } else {
        discountAmount = roundCents(Number(disc.value) || 0);
      }
      discountAmount = Math.min(discountAmount, subtotal);
    }

    const net = roundCents(Math.max(0, subtotal - discountAmount));

    // VAT
    const vatConfig = proposal.money?.vat || { enabled: false, type: 'percent', value: 21 };
    let vatAmount = 0;
    if (vatConfig.enabled) {
      if (vatConfig.type === 'percent') {
        vatAmount = roundCents(net * ((Number(vatConfig.value) || 0) / 100));
      } else {
        vatAmount = roundCents(Number(vatConfig.value) || 0);
      }
    }

    const total = roundCents(net + vatAmount);

    // Deposit
    const depConfig = proposal.money?.deposit || { enabled: true, type: 'percent', value: 30 };
    let depositAmount = 0;
    if (depConfig.enabled) {
      if (depConfig.type === 'percent') {
        depositAmount = roundCents(total * ((Number(depConfig.value) || 0) / 100));
      } else {
        depositAmount = roundCents(Number(depConfig.value) || 0);
      }
      depositAmount = Math.min(depositAmount, total);
    }

    const balance = roundCents(Math.max(0, total - depositAmount));

    return {
      basePrice: roundCents(basePrice),
      basePackage: basePkg,
      selectedAddons: selectedAddons,
      customItems: customItems,
      subtotal: subtotal,
      discount: {
        enabled: Boolean(disc.enabled),
        type: disc.type,
        value: Number(disc.value) || 0,
        amount: discountAmount
      },
      net: net,
      vat: {
        enabled: Boolean(vatConfig.enabled),
        type: vatConfig.type,
        value: Number(vatConfig.value) || 0,
        amount: vatAmount
      },
      total: total,
      deposit: {
        enabled: Boolean(depConfig.enabled),
        type: depConfig.type,
        value: Number(depConfig.value) || 0,
        amount: depositAmount
      },
      balance: balance
    };
  }

  // ─── COMPRESSION & SERIALIZATION (deflate-raw + base64url) ─────────────────
  // Native web standard CompressionStream/DecompressionStream supported in modern browsers
  async function encodeProposal(proposal) {
    const jsonStr = JSON.stringify(proposal);
    const encoder = new TextEncoder();
    const rawData = encoder.encode(jsonStr);

    if (typeof CompressionStream !== 'undefined') {
      try {
        const stream = new Blob([rawData]).stream().pipeThrough(new CompressionStream('deflate-raw'));
        const compressedBuffer = await new Response(stream).arrayBuffer();
        return bufferToBase64Url(new Uint8Array(compressedBuffer));
      } catch (err) {
        console.warn('CompressionStream failed, falling back to base64url:', err);
      }
    }
    // Fallback: direct base64url without compression
    return bufferToBase64Url(rawData);
  }

  async function decodeProposal(encodedStr) {
    if (!encodedStr) return null;
    const cleaned = encodedStr.trim().replace(/^#p=/, '').replace(/^p=/, '');
    const bytes = base64UrlToBuffer(cleaned);

    if (typeof DecompressionStream !== 'undefined') {
      try {
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        const decompressedBuffer = await new Response(stream).arrayBuffer();
        const jsonStr = new TextDecoder().decode(decompressedBuffer);
        return JSON.parse(jsonStr);
      } catch (err) {
        // Might be uncompressed fallback
        try {
          const jsonStr = new TextDecoder().decode(bytes);
          return JSON.parse(jsonStr);
        } catch (e2) {
          throw new Error('Failed to decompress or parse proposal data: ' + err.message);
        }
      }
    }

    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr);
  }

  function bufferToBase64Url(uint8Array) {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const base64 = btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function base64UrlToBuffer(base64url) {
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  // ─── LOCAL STORAGE MANAGEMENT ──────────────────────────────────────────────
  const STORAGE_KEY = 'lmp_proposals_v1';

  function listSavedProposals() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      console.error('Failed to read saved proposals from localStorage', e);
      return [];
    }
  }

  function saveProposalLocally(proposal) {
    const list = listSavedProposals();
    const index = list.findIndex(p => p.id === proposal.id);
    const toSave = {
      ...proposal,
      updatedAt: new Date().toISOString()
    };
    if (index >= 0) {
      list[index] = toSave;
    } else {
      toSave.createdAt = toSave.createdAt || new Date().toISOString();
      list.unshift(toSave);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return toSave;
  }

  function deleteProposalLocally(id) {
    const list = listSavedProposals().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list;
  }

  function getProposalLocally(id) {
    const list = listSavedProposals();
    return list.find(p => p.id === id) || null;
  }

  // ─── URL SHORTENER ────────────────────────────────────────────────────────
  /**
   * Shorten a proposal link using client-side open-CORS shortener services.
   * Automatically replaces loopback addresses (localhost / 127.0.0.1) with production origin https://lmpstudio.onrender.com
   * Fallback chain: URLVanish -> Spoo.me
   */
  async function shortenUrl(longUrl) {
    if (!longUrl) throw new Error('No URL provided');
    let targetUrl = longUrl.toString();
    try {
      const parsed = new URL(targetUrl);
      if (parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost' || parsed.hostname === '0.0.0.0') {
        targetUrl = targetUrl.replace(parsed.origin, 'https://lmpstudio.onrender.com');
      }
    } catch (_) { }

    // 1. Try URLVanish (fast GET, CORS-friendly)
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`https://urlvanish.com/api/shorten?url=${encodeURIComponent(targetUrl)}`, {
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        if (data && data.shorturl && data.shorturl.startsWith('http')) {
          return { shortUrl: data.shorturl, provider: 'urlvanish' };
        }
      }
    } catch (err) {
      console.warn('URLVanish shortener attempt failed, trying fallback...', err);
    }

    // 2. Try Spoo.me (POST, CORS-friendly)
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch('https://spoo.me/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: `url=${encodeURIComponent(targetUrl)}`,
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        const short = data.short_url || data.url;
        if (short && short.startsWith('http')) {
          return { shortUrl: short.replace(/^http:\/\//i, 'https://'), provider: 'spoo.me' };
        }
      }
    } catch (err) {
      console.warn('Spoo.me shortener fallback failed:', err);
    }

    throw new Error('Could not shorten URL. Please use the Direct Link.');
  }

  // ─── WHATSAPP LINK BUILDER ────────────────────────────────────────────────
  function buildWhatsAppUrl(proposal, totals, lang = 'en', isExpired = false) {
    const phone = '34634518666';
    let text = '';
    const projTitle = proposal.projectTitle || 'Photography / Video Session';
    const ref = proposal.id || 'N/A';
    const totalStr = formatEUR(totals.total);

    if (isExpired) {
      if (lang === 'es') {
        text = `¡Hola Lutty! Me gustaría solicitar un presupuesto actualizado para '${projTitle}' (Ref: ${ref}).`;
      } else {
        text = `Hello Lutty! I would like to request an updated proposal for '${projTitle}' (Ref: ${ref}).`;
      }
    } else {
      if (lang === 'es') {
        text = `¡Hola Lutty! Acepto la propuesta para '${projTitle}' (Ref: ${ref}, Total: ${totalStr}). ¡Coordinemos fechas!`;
      } else {
        text = `Hello Lutty! I accept the proposal for '${projTitle}' (Ref: ${ref}, Total: ${totalStr}). Let's coordinate dates!`;
      }
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  // ─── SIMPLE MARKDOWN PARSER ───────────────────────────────────────────────
  // Sanitized subset: **bold**, *italic*, - list items, line breaks
  function renderMarkdown(text) {
    if (!text) return '';
    // Escape HTML first
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const lines = escaped.split(/\r?\n/);
    let html = '';
    let inList = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          html += '<ul class="space-y-1 my-2 list-disc list-inside text-on-surface-variant">';
          inList = true;
        }
        const itemContent = formatInline(trimmed.substring(2));
        html += `<li>${itemContent}</li>`;
      } else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        if (trimmed === '') {
          html += '<div class="h-2"></div>';
        } else {
          html += `<p class="leading-relaxed text-on-surface-variant">${formatInline(line)}</p>`;
        }
      }
    });

    if (inList) html += '</ul>';
    return html;
  }

  function formatInline(str) {
    return str
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-on-surface">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
  }

  // ─── DEFAULT BLANK PROPOSAL GENERATOR ─────────────────────────────────────
  function createBlankProposal() {
    return {
      id: generateId(),
      clientName: '',
      clientCompany: '',
      projectTitle: 'Studio Portrait & Creative Session',
      date: getTodayIso(),
      expirationDate: getDefaultExpiryIso(14),
      defaultLang: 'en',
      scope: '**Creative Direction:** Clean and contemporary studio setup highlighting personal style.\n- Full assistance with styling and posture\n- High-resolution delivery via secure private gallery',
      scopeEn: '', // Kept for legacy backwards-compatibility if loaded from older draft
      scopeEs: '',
      packageId: 'photo-1h',
      customPackageNameEn: '',
      customPackageNameEs: '',
      customPackagePrice: 0,
      customPackageFeaturesEn: '',
      customPackageFeaturesEs: '',
      addons: [], // Array of { id, qty, price }
      customItems: [], // Array of { title, price }
      deliverables: null, // Custom user-edited list of strings. If null/undefined, auto-generated from package + addons
      showHeroGallery: true,
      sectionVisibility: {
        scope: true,
        addons: true,
        customItems: true,
        deliverables: true,
        heroGallery: true,
        financial: true
      },
      images: [
        'images/portfolio/clean1.jpg',
        'images/portfolio/editorial1.jpg',
        'images/studio-1.png'
      ],
      money: {
        discount: { enabled: false, type: 'percent', value: 10 },
        vat: { enabled: false, type: 'percent', value: 21 },
        deposit: { enabled: true, type: 'percent', value: 30 }
      }
    };
  }

  // Helper to get default deliverables for a given package + addons selection
  function getDefaultDeliverables(packageId, addons = [], lang = 'en') {
    const isEs = lang === 'es';
    const items = [];
    const safeAddons = Array.isArray(addons) ? addons : [];
    const consumedAddonIds = new Set();

    const findAddon = (id) => safeAddons.find(a => a.id === id);
    const getQty = (id) => {
      const a = findAddon(id);
      return a ? Math.max(1, Number(a.qty) || 1) : 0;
    };

    if (packageId === 'video-dance') {
      // 1. Shooting duration
      const extra30mQty = getQty('video-extra-time-30m');
      const extra1hQty = getQty('video-extra-time');
      const totalExtraMinutes = (extra30mQty * 30) + (extra1hQty * 60);
      const totalMinutes = 60 + totalExtraMinutes;

      if (totalExtraMinutes > 0) {
        consumedAddonIds.add('video-extra-time-30m');
        consumedAddonIds.add('video-extra-time');
        const hours = totalMinutes / 60;
        const hoursStr = (hours % 1 === 0) ? hours.toString() : hours.toFixed(1).replace('.0', '');
        items.push(isEs
          ? `Hasta ${hoursStr} horas de grabación (sesión ampliada con tiempo extra)`
          : `Up to ${hoursStr} hours of shooting (extended session)`
        );
      } else {
        items.push(isEs ? 'Hasta 1 hora de grabación' : 'Up to 1 hour of shooting');
      }

      // 2. Locations
      const extraLocQty = getQty('video-location');
      if (extraLocQty > 0) {
        consumedAddonIds.add('video-location');
        const totalLocs = 1 + extraLocQty;
        items.push(isEs
          ? `${totalLocs} localizaciones de rodaje (1 exterior principal + ${extraLocQty} adicional${extraLocQty > 1 ? 'es' : ''} cercana${extraLocQty > 1 ? 's' : ''})`
          : `${totalLocs} shooting locations (1 outdoor primary + ${extraLocQty} additional nearby)`
        );
      } else {
        items.push(isEs ? '1 localización exterior' : '1 outdoor location');
      }

      // 3. Videos & Format
      const extraTakes = getQty('video-extra-take');
      const dynamicEdits = getQty('video-dynamic-edit');
      const totalVideos = 2 + extraTakes;

      if (extraTakes > 0) consumedAddonIds.add('video-extra-take');
      if (dynamicEdits > 0) consumedAddonIds.add('video-dynamic-edit');

      if (dynamicEdits >= totalVideos) {
        items.push(isEs
          ? `${totalVideos} vídeos con edición dinámica multi-toma (montaje rítmico multi-ángulo, etalonaje y sincronización musical)`
          : `${totalVideos} dynamic multi-angle cut videos (rhythmic multi-take edits with color grading & music sync)`
        );
      } else if (dynamicEdits > 0) {
        const oneShotCount = totalVideos - dynamicEdits;
        items.push(isEs
          ? `${dynamicEdits} vídeo${dynamicEdits > 1 ? 's' : ''} con edición dinámica multi-toma + ${oneShotCount} vídeo${oneShotCount > 1 ? 's' : ''} en plano secuencia continuo`
          : `${dynamicEdits} dynamic multi-angle cut video${dynamicEdits > 1 ? 's' : ''} + ${oneShotCount} one-shot continuous video${oneShotCount > 1 ? 's' : ''}`
        );
      } else if (extraTakes > 0) {
        items.push(isEs
          ? `${totalVideos} vídeos en plano secuencia, tomas continuas, grabados y editados profesionalmente`
          : `${totalVideos} one-shot videos, continuous takes, professionally recorded & color graded`
        );
      } else {
        items.push(isEs
          ? '2 vídeos en plano secuencia, toma continua, grabados y editados profesionalmente'
          : '2 one-shot videos, one continuous take, professionally recorded & color graded'
        );
      }

      // 4. Color correction & overlays
      items.push(isEs ? 'Corrección de color básica y sincronización musical' : 'Basic color correction & music sync');
      items.push(isEs ? 'Texto simple o grafismos si se requieren' : 'Simple text / branding overlays when needed');
      items.push(isEs ? 'Fotos de portada editadas para redes sociales' : 'Edited cover photos from the session for social media');

      // 5. Delivery
      if (findAddon('video-rush')) {
        consumedAddonIds.add('video-rush');
        items.push(isEs
          ? 'Entrega urgente prioritaria mediante galería privada (en 48 horas)'
          : 'Express rush delivery via private gallery (within 48 hours)'
        );
      } else {
        items.push(isEs ? 'Entrega estándar mediante galería privada' : 'Standard delivery via private gallery');
      }

    } else if (packageId === 'photo-1h' || packageId === 'photo-2h') {
      const is2h = packageId === 'photo-2h';

      // 1. Studio time
      items.push(isEs
        ? (is2h ? 'Hasta 2 horas de estudio (incluye montaje y recogida)' : 'Hasta 1 hora (incluye montaje y recogida)')
        : (is2h ? 'Up to 2 hours of studio time (includes setup & wrap-up)' : 'Up to 1 hour (includes setup & wrap-up)')
      );

      // 2. Photos count
      const extraPhotoBatches = getQty('photo-extra-photos');
      const extraPhotos = extraPhotoBatches * 10;
      if (extraPhotos > 0) {
        consumedAddonIds.add('photo-extra-photos');
        if (is2h) {
          items.push(isEs
            ? `40–80+ fotos editadas profesionalmente (incluye ${extraPhotos} fotos adicionales)`
            : `40–80+ professionally edited photos (includes ${extraPhotos} extra photos)`
          );
        } else {
          const minPhotos = 20 + extraPhotos;
          const maxPhotos = 40 + extraPhotos;
          items.push(isEs
            ? `${minPhotos}–${maxPhotos} fotos editadas profesionalmente (incluye ${extraPhotos} fotos adicionales)`
            : `${minPhotos}–${maxPhotos} professionally edited photos (includes ${extraPhotos} extra photos)`
          );
        }
      } else {
        items.push(isEs
          ? (is2h ? 'Doble tiempo de disparo = significativamente más fotos' : '20-40 fotos editadas profesionalmente')
          : (is2h ? 'Double shooting time = significantly more photos' : '20-40 professionally edited photos')
        );
      }

      // 3. Retouching
      const retouchQty = getQty('photo-retouch');
      if (retouchQty > 0) {
        consumedAddonIds.add('photo-retouch');
        items.push(isEs
          ? `Retoque de belleza avanzado (${retouchQty} hora${retouchQty > 1 ? 's' : ''} de separación de frecuencias y retoque editorial)`
          : `Advanced beauty retouching (${retouchQty} hour${retouchQty > 1 ? 's' : ''} of detailed frequency separation & editorial retouch)`
        );
      } else {
        items.push(isEs ? '2-3 retoques detallados incluidos' : '2-3 detailed edits included');
      }

      // 4. Studio & backdrops / Location
      if (findAddon('photo-outdoor')) {
        consumedAddonIds.add('photo-outdoor');
        items.push(isEs
          ? 'Sesión combinada de estudio y exterior en Poble Espanyol (fondos arquitectónicos e iluminación de estudio)'
          : 'Combined studio + outdoor session at Poble Espanyol (architectural backdrops & studio lighting)'
        );
      } else {
        items.push(isEs
          ? 'Acceso completo al estudio y equipo de iluminación'
          : 'Full studio access & lighting gear'
        );
        items.push(isEs
          ? 'Opciones de fondo (ciclorama blanco, pared texturizada, negro)'
          : 'Backdrop options available (white cyclorama, textured walls, black)'
        );
      }

      // 5. Outfits
      items.push(isEs
        ? (is2h ? 'Opción de múltiples esquemas de luz y cambios de look' : 'Hasta 3 cambios de vestuario')
        : (is2h ? 'Opportunity for multiple lighting setups & outfit changes' : 'Up to 3 outfits')
      );

      // 6. Video clip if selected
      if (findAddon('photo-video')) {
        consumedAddonIds.add('photo-video');
        items.push(isEs
          ? 'Clip de vídeo dinámico / reel grabado durante la sesión'
          : 'Dynamic video clip / social reel filmed during the session'
        );
      }

      // 7. Express delivery if selected
      if (findAddon('photo-express')) {
        consumedAddonIds.add('photo-express');
        items.push(isEs
          ? 'Entrega urgente 24-48h mediante galería privada'
          : 'Express 24-48h delivery via private gallery'
        );
      }

    } else {
      // Custom or generic package: start with package base features
      const pkgDef = PACKAGES.find(pkg => pkg.id === packageId) || PACKAGES[0];
      const baseFeatures = isEs ? (pkgDef.featuresEs || pkgDef.featuresEn) : pkgDef.featuresEn;
      if (Array.isArray(baseFeatures)) {
        baseFeatures.forEach(f => items.push(f));
      }
    }

    // Append any unconsumed add-ons (clean plain text format)
    safeAddons.forEach(a => {
      if (consumedAddonIds.has(a.id)) return;
      const addDef = ADDONS.find(item => item.id === a.id);
      if (!addDef) return;
      const desc = isEs ? addDef.descriptionEs : addDef.descriptionEn;
      const title = isEs ? addDef.nameEs : addDef.nameEn;
      const qtyStr = (a.qty && a.qty > 1) ? ` (${a.qty}x)` : '';
      items.push(`${title}${qtyStr}: ${desc}`);
    });

    return items;
  }

  return {
    PACKAGES,
    ADDONS,
    PRESET_IMAGES,
    normalizeImageUrl,
    formatEUR,
    roundCents,
    generateId,
    getTodayIso,
    getDefaultExpiryIso,
    calculateTotals,
    encodeProposal,
    decodeProposal,
    listSavedProposals,
    saveProposalLocally,
    deleteProposalLocally,
    getProposalLocally,
    shortenUrl,
    buildWhatsAppUrl,
    renderMarkdown,
    createBlankProposal,
    getDefaultDeliverables
  };
});
