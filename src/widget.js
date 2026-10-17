/* The five compact AQI widget layouts used on search home pages. */
const AqiWidget = (() => {
  const localeNames = {
    en: 'en', cn: 'zh-CN', hk: 'zh-TW', jp: 'ja', kr: 'ko', es: 'es', ru: 'ru',
    fr: 'fr', de: 'de', pt: 'pt-BR', it: 'it', id: 'id', ar: 'ar', hi: 'hi',
  };
  const uiText = {
    en: ['Drag air quality widget', 'Drag to move', 'history'],
    cn: ['拖动空气质量小部件', '拖动以移动', '历史数据'],
    hk: ['拖曳空氣品質小工具', '拖曳以移動', '歷史資料'],
    jp: ['大気質ウィジェットを移動', 'ドラッグして移動', '履歴'],
    kr: ['대기질 위젯 이동', '드래그하여 이동', '기록'],
    es: ['Mover el widget de calidad del aire', 'Arrastra para mover', 'historial'],
    ru: ['Переместить виджет качества воздуха', 'Перетащите для перемещения', 'история'],
    fr: ['Déplacer le widget de qualité de l’air', 'Faire glisser pour déplacer', 'historique'],
    de: ['Luftqualitätswidget verschieben', 'Zum Verschieben ziehen', 'Verlauf'],
    pt: ['Mover o widget de qualidade do ar', 'Arraste para mover', 'histórico'],
    it: ['Sposta il widget della qualità dell’aria', 'Trascina per spostare', 'cronologia'],
    id: ['Pindahkan widget kualitas udara', 'Seret untuk memindahkan', 'riwayat'],
    ar: ['نقل أداة جودة الهواء', 'اسحب للتحريك', 'السجل'],
    hi: ['वायु गुणवत्ता विजेट ले जाएँ', 'स्थानांतरित करने के लिए खींचें', 'इतिहास'],
  };

  function text(key, language) {
    const index = { drag: 0, dragHint: 1, history: 2 }[key];
    return (uiText[language] || uiText.en)[index];
  }
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const logoDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAABXElEQVQokZ2Tu0pDQRCGvzlZYqJRUEKMGgQJ2Ild7G2Sylax1cYX8BEsVQRLfQpLS228NcEiEFRMQI2XxCORg5ozFmsuGA+of7HMzs6//+zMrGS3lm6ApAio8hdUjIgkmztpLT9AO86snTAL6ec/yXVC3gtZbet25u2AhEG9QLJpx7eJEpvFSSyDGQDvisbtOrxddCu7O1ntfIwMTdI3t4E4IetRResP1PdWoeGhXhURaSoLqorExjDjGczIdIsI2MC+OLH5XQDeC/t4h5sIPqZ09EEklSK1soaEozbAdYOLNDqD62dwTw4w5eMPhuNpaufF7shme7616akU5u6kgfEJ8XJZpucsH6j2/b5qvkBDHWRxalslJIxODNLb3xM4I83i1R5fuS+7oFhl9ZXrYg3HkeAJw46v+goSQlBMLnr6q3R/gslF/k92gIr9EDZfOwCCiCC07ZbvywYqnwLPdpYyuPVQAAAAAElFTkSuQmCC';

  function element(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content != null) node.textContent = String(content);
    return node;
  }

  function dateFromApi(value) {
    if (typeof value === 'number') return new Date(value);
    if (typeof value !== 'string') return new Date(NaN);
    const parts = value.split(/[^0-9]/).filter(Boolean).map(Number);
    return new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1,
      parts[3] || 0, parts[4] || 0, parts[5] || 0);
  }

  function dateText(value, locale, options) {
    const date = dateFromApi(value);
    return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(locale, options).format(date);
  }

  function svg(tag, attributes) {
    const node = document.createElementNS(svgNamespace, tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
    return node;
  }

  function chartRow(label, values, language) {
    const row = element('div', 'aqicn-widget__chart-row');
    row.append(element('span', 'aqicn-widget__chart-label', label));
    const chart = svg('svg', { viewBox: '0 0 168 28', role: 'img', 'aria-label': `${label} ${text('history', language)}` });
    const recent = values.slice(0, 24).reverse().map((point) => Number(point?.v));
    const max = Math.max(100, ...recent.filter(Number.isFinite));
    recent.forEach((value, index) => {
      if (!Number.isFinite(value)) return;
      const height = Math.max(2, Math.min(24, 22 * value / max));
      const bar = svg('rect', {
        x: index * 7,
        y: 24 - height,
        width: 6,
        height,
        fill: Aqi.palette(value).background,
      });
      chart.append(bar);
    });
    row.append(chart);
    return row;
  }

  function history(feed, design) {
    const section = element('div', 'aqicn-widget__history');
    const pollutantNames = design === 'iaqi' ? ['pm25', 'pm10', 'o3'] : ['aqi'];
    for (const name of pollutantNames) {
      const values = name === 'aqi' ? compositeHistory(feed.historic || {}) : feed.historic?.[name] || [];
      if (values.length) section.append(chartRow(name === 'aqi' ? 'AQI' : name.toUpperCase().replace('PM25', 'PM2.5'), values, feed.rtsettings?.lang));
    }
    return section;
  }

  function compositeHistory(historic) {
    const names = ['pm25', 'pm10', 'o3'];
    return Array.from({ length: 24 }, (_, index) => {
      const values = names.map((name) => Number(historic[name]?.[index]?.v)).filter(Number.isFinite);
      return values.length ? { v: Math.max(...values) } : null;
    });
  }

  function forecast(feed, locale) {
    const days = new Map();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (const entry of feed.forecast?.aqi || []) {
      const date = dateFromApi(entry.t);
      if (Number.isNaN(date.getTime()) || date < today || date.getHours() < 7 || date.getHours() > 21) continue;
      const range = entry.v?.pm25 || entry.v;
      if (!Array.isArray(range)) continue;
      const average = (Number(range[0]) + Number(range[1])) / 2;
      if (!Number.isFinite(average)) continue;
      const key = date.toDateString();
      const list = days.get(key) || { date, values: [] };
      list.values.push(average);
      days.set(key, list);
    }
    const section = element('div', 'aqicn-widget__forecast');
    for (const { date, values } of [...days.values()].slice(0, 4)) {
      if (!values.length) continue;
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      const day = element('span', 'aqicn-widget__day',
        new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date));
      const palette = Aqi.palette(average);
      day.style.backgroundColor = palette.background;
      day.style.color = palette.foreground;
      section.append(day);
    }
    if (!section.childElementCount) {
      const unavailable = {
        'zh-CN': '暂无预报数据', 'zh-TW': '暫無預報資料', ja: '予報データなし',
        ko: '예보 데이터 없음', es: 'Pronóstico no disponible', ru: 'Прогноз недоступен',
        fr: 'Prévisions indisponibles', de: 'Keine Vorhersage verfügbar',
        'pt-BR': 'Previsão indisponível', it: 'Previsioni non disponibili',
        id: 'Prakiraan tidak tersedia', ar: 'التوقعات غير متاحة', hi: 'पूर्वानुमान उपलब्ध नहीं',
      };
      section.append(element('span', 'aqicn-widget__forecast-unavailable',
        unavailable[locale] || 'Forecast unavailable'));
    }
    return section;
  }

  function create(feed) {
    const design = feed.rtsettings?.design || 'aqi';
    const locale = localeNames[feed.rtsettings?.lang] || 'en';
    const outer = element('div', `aqicn-widget aqicn-widget--${design}`);
    const header = element('div', 'aqicn-widget__header');
    const icon = element('img', 'aqicn-widget__logo');
    icon.src = logoDataUrl;
    icon.alt = '';
    const title = element('span', 'aqicn-widget__title', `${Aqi.stationName(feed, feed.rtsettings?.lang)} AQI`);
    const badge = element('span', 'aqicn-widget__badge', feed.aqi ?? '-');
    const palette = Aqi.palette(feed.aqi);
    badge.style.backgroundColor = palette.background;
    badge.style.color = palette.foreground;
    badge.title = Aqi.label(feed.aqi, feed.rtsettings?.lang);
    header.append(icon, title, badge);
    outer.append(header);

    if (design === 'tiny') {
      const time = element('span', 'aqicn-widget__time-inline',
        dateText(feed.time?.v, locale, { hour: 'numeric', hour12: true }));
      header.insertBefore(time, badge);
      return outer;
    }

    outer.append(element('div', 'aqicn-widget__time',
      dateText(feed.time?.v, locale, { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })));
    if (design === 'aqi' || design === 'iaqi') {
      const chart = history(feed, design);
      if (chart.childElementCount) outer.append(chart);
    }
    if (design !== 'small') {
      const days = forecast(feed, locale);
      if (design === 'forecast' || days.querySelector('.aqicn-widget__day')) outer.append(days);
    }
    return outer;
  }

  return { create, dateFromApi, compositeHistory, text };
})();
