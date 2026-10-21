/* Shared browser extension helpers. Loaded before the page scripts. */
const BrowserApi = typeof browser === 'undefined' ? chrome : browser;

const Aqi = (() => {
  const locales = {
    en: 'en', cn: 'zh_CN', hk: 'zh_TW', jp: 'ja', kr: 'ko', es: 'es', ru: 'ru',
    fr: 'fr', de: 'de', pt: 'pt_BR', it: 'it', id: 'id', ar: 'ar', hi: 'hi',
  };
  const languageTags = {
    cn: 'zh-CN', hk: 'zh-TW', jp: 'ja', kr: 'ko', pt: 'pt-BR',
  };
  const localeCache = new Map();
  let activeLanguage = null;
  let messages = null;
  let languageRequest = 0;

  function defaultLanguage() {
    const locale = chrome.i18n.getUILanguage().toLowerCase();
    if (locale.startsWith('zh')) return /-(tw|hk|mo)/.test(locale) ? 'hk' : 'cn';
    if (locale.startsWith('ja')) return 'jp';
    if (locale.startsWith('ko')) return 'kr';
    const code = locale.split('-')[0];
    return locales[code] ? code : 'en';
  }

  async function setLanguage(language) {
    const code = locales[language] ? language : defaultLanguage();
    const request = ++languageRequest;
    if (!localeCache.has(code)) {
      const url = BrowserApi.runtime.getURL(`_locales/${locales[code]}/messages.json`);
      localeCache.set(code, fetch(url).then((response) => {
        if (!response.ok) throw new Error(`Locale HTTP ${response.status}`);
        return response.json();
      }).catch((error) => {
        localeCache.delete(code);
        throw error;
      }));
    }
    try {
      const loaded = await localeCache.get(code);
      if (request === languageRequest) {
        messages = loaded;
        activeLanguage = code;
      }
    } catch (error) {
      console.warn('Could not load selected language', code, error);
      if (request === languageRequest) {
        messages = null;
        activeLanguage = code;
      }
    }
    return code;
  }

  function t(key) {
    return messages?.[key]?.message || chrome.i18n.getMessage(key) || key;
  }

  function localize(root = document) {
    for (const element of root.querySelectorAll('.i18n')) element.textContent = t(element.id);
    for (const element of root.querySelectorAll('[data-i18n-link]')) {
      const url = element.dataset.i18nLink;
      const label = url.replace(/^https?:\/\//, '');
      const message = t(element.id);
      const position = message.indexOf(label);
      if (position < 0) {
        element.textContent = message;
        continue;
      }
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = label;
      element.replaceChildren(message.slice(0, position), link, message.slice(position + label.length));
    }
    for (const element of root.querySelectorAll('[data-i18n-aria-label]')) {
      element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    }
    for (const element of root.querySelectorAll('[data-i18n-title]')) {
      element.title = t(element.dataset.i18nTitle);
    }
    for (const element of root.querySelectorAll('[data-i18n-alt]')) {
      element.alt = t(element.dataset.i18nAlt);
    }
    document.documentElement.lang = languageTags[activeLanguage] || activeLanguage || 'en';
    if (root === document) document.title = t('waqi_title');
  }

  function currentLanguage() {
    return activeLanguage || defaultLanguage();
  }

  function stationLanguage(language) {
    return { cn: 'zh-CN', hk: 'zh-TW', jp: 'ja', kr: 'ko' }[language] || language || 'en';
  }

  function stationName(feed, language) {
    const localized = feed?.i18n?.name?.[stationLanguage(language)];
    return typeof localized === 'string' && localized.trim()
      ? localized.trim() : feed?.city?.name || feed?.name || '';
  }

  const ranges = [50, 100, 150, 200, 300];
  const colors = ['#009966', '#ffde33', '#ff9933', '#cc0033', '#660099', '#7e0023'];
  const textColors = ['#fff', '#222', '#222', '#fff', '#fff', '#fff'];

  function band(value) {
    const number = Number(value);
    if (value === '-' || value == null || !Number.isFinite(number)) return -1;
    return ranges.findIndex((limit) => number <= limit) < 0
      ? colors.length - 1
      : ranges.findIndex((limit) => number <= limit);
  }

  function palette(value) {
    const index = band(value);
    return index < 0
      ? { background: '#868b92', foreground: '#fff' }
      : { background: colors[index], foreground: textColors[index] };
  }

  const labels = {
    en: ['No data', 'Good', 'Moderate', 'Unhealthy for sensitive groups', 'Unhealthy', 'Very unhealthy', 'Hazardous'],
    cn: ['无数据', '优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'],
    hk: ['無數據', '優', '良', '輕度污染', '中度污染', '重度污染', '嚴重污染'],
    jp: ['データなし', '良好', '普通', '敏感な人に影響', '健康に悪い', '非常に悪い', '危険'],
    kr: ['데이터 없음', '좋음', '보통', '민감군에 나쁨', '나쁨', '매우 나쁨', '위험'],
    es: ['Sin datos', 'Buena', 'Moderada', 'Insalubre para grupos sensibles', 'Insalubre', 'Muy insalubre', 'Peligrosa'],
    ru: ['Нет данных', 'Хорошо', 'Умеренно', 'Вредно для чувствительных групп', 'Вредно', 'Очень вредно', 'Опасно'],
    fr: ['Aucune donnée', 'Bon', 'Modéré', 'Mauvais pour les personnes sensibles', 'Mauvais', 'Très mauvais', 'Dangereux'],
    de: ['Keine Daten', 'Gut', 'Mäßig', 'Ungesund für empfindliche Gruppen', 'Ungesund', 'Sehr ungesund', 'Gefährlich'],
    pt: ['Sem dados', 'Bom', 'Moderado', 'Ruim para grupos sensíveis', 'Ruim', 'Muito ruim', 'Perigoso'],
    it: ['Nessun dato', 'Buona', 'Moderata', 'Insalubre per i gruppi sensibili', 'Insalubre', 'Molto insalubre', 'Pericolosa'],
    id: ['Tidak ada data', 'Baik', 'Sedang', 'Tidak sehat bagi kelompok sensitif', 'Tidak sehat', 'Sangat tidak sehat', 'Berbahaya'],
    ar: ['لا توجد بيانات', 'جيد', 'معتدل', 'غير صحي للفئات الحساسة', 'غير صحي', 'غير صحي للغاية', 'خطير'],
    hi: ['डेटा उपलब्ध नहीं', 'अच्छा', 'मध्यम', 'संवेदनशील समूहों के लिए अस्वास्थ्यकर', 'अस्वास्थ्यकर', 'बहुत अस्वास्थ्यकर', 'खतरनाक'],
  };

  function label(value, language = 'en') {
    return (labels[language] || labels.en)[band(value) + 1];
  }

  function message(method, details = {}) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ method, ...details }, (result) => {
        if (chrome.runtime.lastError) {
          console.warn(method, chrome.runtime.lastError.message);
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  function onFeed(callback) {
    chrome.runtime.onMessage.addListener((request) => {
      if (request.method === 'onFeedUpdate' && request.aqi) callback(request.aqi);
    });
    message('loadFeed').then((feed) => {
      if (feed) callback(feed);
    });
  }

  return { band, palette, label, message, onFeed, defaultLanguage, currentLanguage,
    stationLanguage, stationName, setLanguage, t, localize };
})();
