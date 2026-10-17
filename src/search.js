/* City search used by the popup and options page. */
class CitySearch {
  constructor() {
    this.input = document.getElementById('cityinput');
    this.results = document.getElementById('searchresults');
    this.widget = document.getElementById('cityaqiwidget');
    this.currentRequest = null;
    this.widgetRequest = null;
    this.timer = null;
    this.city = null;
    this.widgetData = null;
    this.input?.addEventListener('input', () => this.scheduleSearch());
    document.getElementById('searchform')?.addEventListener('submit', (event) => event.preventDefault());
    document.getElementById('locate-btn')?.addEventListener('click', () => this.locate());
    Aqi.message('getSelectedCity').then((city) => {
      if (city) this.select(city, false);
      else this.input.placeholder = Aqi.t('search_enter_city');
    });
  }

  async select(city, save = true) {
    this.city = city;
    city.clang = Aqi.currentLanguage();
    let saveRequest = Promise.resolve();
    if (save) {
      saveRequest = Aqi.message('setSelectedCity', { city });
    }
    for (const id of ['selectedcity', 'selectedcitytitle']) {
      const element = document.getElementById(id);
      if (element) element.textContent = city.name || '';
    }
    this.input.placeholder = Aqi.t('search_select_another');
    this.input.value = '';
    this.results.replaceChildren();
    this.results.hidden = true;
    await Promise.all([saveRequest, this.loadWidget(city)]);
  }

  scheduleSearch() {
    clearTimeout(this.timer);
    this.currentRequest?.abort();
    const query = this.input.value.trim();
    if (!query) {
      this.results.replaceChildren();
      this.results.hidden = true;
      return;
    }
    this.timer = setTimeout(() => this.search(query), 250);
  }

  async search(query) {
    const controller = new AbortController();
    this.currentRequest = controller;
    try {
      const url = `https://aqicn.org/browser-widget/xsearch/places/${encodeURIComponent(query)}?from=chrome-extension`;
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (controller.signal.aborted) return;
      this.showResults(data.results || []);
    } catch (error) {
      if (error.name !== 'AbortError') this.showError(error, this.results);
    }
  }

  showResults(results) {
    this.results.replaceChildren();
    this.results.hidden = false;
    if (!results.length) {
      this.results.textContent = Aqi.t('search_no_result');
      return;
    }
    for (const item of results) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'city-result';
      const name = document.createElement('span');
      name.textContent = item.station?.name || '';
      const badge = document.createElement('span');
      badge.className = 'city-result__aqi';
      badge.textContent = String(item.aqi ?? '-');
      const palette = Aqi.palette(item.aqi);
      badge.style.backgroundColor = palette.background;
      badge.style.color = palette.foreground;
      button.append(name, badge);
      button.addEventListener('click', () => this.select({
        name: item.station?.name,
        aqi: item.aqi,
        idx: item.uid,
        utime: item.time?.vtime,
      }));
      this.results.append(button);
    }
  }

  async loadWidget(city) {
    if (!this.widget) return;
    this.widget.hidden = false;
    this.widget.replaceChildren();
    const loading = document.createElement('div');
    loading.className = 'aqicn-loader';
    loading.setAttribute('role', 'status');
    loading.setAttribute('aria-label', Aqi.t('search_loading'));
    loading.append(document.createElement('span'));
    this.widget.append(loading);
    const id = city.idx ? `@${city.idx}` : city.key;
    if (!id) {
      this.showError(new Error('No station identifier'), this.widget);
      return;
    }
    this.widgetRequest?.abort();
    const controller = new AbortController();
    this.widgetRequest = controller;
    try {
      const widgetId = city.idx ? `@${encodeURIComponent(String(city.idx))}` : encodeURIComponent(id);
      const url = `https://aqicn.org/webwgt/${widgetId}/widget.v1.json?from=chrome-extension&_t=${Date.now()}`;
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (controller.signal.aborted) return;
      this.widgetData = data.model || null;
      if (data.model?.aqi != null) city.aqi = data.model.aqi;
      // The API supplies markup; strip executable elements and event handlers.
      const documentFragment = new DOMParser().parseFromString(data.xxl || '', 'text/html');
      for (const element of [...documentFragment.body.querySelectorAll('*')]) {
        if (['SCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'FORM', 'BASE', 'LINK', 'META'].includes(element.tagName)) {
          element.remove();
          continue;
        }
        for (const attribute of [...element.attributes]) {
          if (attribute.name.toLowerCase().startsWith('on')
            || (['href', 'src'].includes(attribute.name.toLowerCase())
              && !/^(https?:|data:image\/|#|\/)/i.test(attribute.value.trim()))) {
            element.removeAttribute(attribute.name);
          }
        }
      }
      this.widget.replaceChildren(...documentFragment.body.childNodes);
      const captionKeys = {
        current: 'detail_current', 'past 2 days': 'detail_past_two_days',
        min: 'detail_min', max: 'detail_max', 'Temp.': 'detail_temperature',
        Pressure: 'detail_pressure', Humidity: 'detail_humidity', Wind: 'detail_wind',
      };
      for (const element of this.widget.querySelectorAll('td, span')) {
        if (element.children.length) continue;
        const key = captionKeys[element.textContent.trim()];
        if (key) element.dataset.aqiCaption = key;
      }
      const details = this.widget.querySelector('.aqiwidget-xxl');
      if (details) {
        // AQICN's fixed 420px wrapper hides the last measurement rows.
        details.style.height = 'auto';
        details.style.overflow = 'visible';
      }
      const popupSelection = document.getElementById('selectedcity');
      if (popupSelection) popupSelection.textContent = '';
      const title = this.widget.querySelector('#aqiwgttitle1');
      if (title) {
        title.target = '_blank';
        title.rel = 'noopener noreferrer';
      }
      this.updateLanguage(city.clang || Aqi.defaultLanguage());
    } catch (error) {
      if (error.name !== 'AbortError') this.showError(error, this.widget);
    }
  }

  updateLanguage(language) {
    if (this.city) this.city.clang = language;
    this.input.placeholder = Aqi.t(this.city ? 'search_select_another' : 'search_enter_city');
    const widgetLanguage = Aqi.stationLanguage(language);
    const localizedName = this.widgetData?.i18n?.name?.[widgetLanguage];
    const cityHeading = document.getElementById('selectedcitytitle');
    if (cityHeading && localizedName) cityHeading.textContent = localizedName;
    const title = this.widget?.querySelector('#aqiwgttitle1');
    const localizedTitle = this.widgetData?.i18n?.title?.[widgetLanguage];
    if (title && localizedTitle) {
      title.textContent = localizedTitle;
      title.title = localizedName || localizedTitle;
    }
    const subtitle = this.widget?.querySelector('#aqiwgttitle2');
    if (subtitle) subtitle.textContent = Aqi.t('detail_live_aqi');
    const label = this.widget?.querySelector('#aqiwgtmsg');
    if (label && this.city) label.textContent = Aqi.label(this.city.aqi, language);
    const value = this.widget?.querySelector('#aqiwgtvalue');
    if (value && this.city) value.title = Aqi.label(this.city.aqi, language);
    const time = this.widget?.querySelector('#aqiwgtutime');
    const localizedTime = this.widgetData?.time?.s?.[widgetLanguage]?.time;
    if (time && localizedTime) time.textContent = localizedTime;
    const pollutant = this.widget?.querySelector('#aqiwgtxtrainfo');
    const pollutantName = pollutant?.querySelector('b');
    if (pollutantName) pollutant.replaceChildren(`${Aqi.t('detail_primary_pollutant')}: `, pollutantName);
    for (const caption of this.widget?.querySelectorAll('[data-aqi-caption]') || []) {
      caption.textContent = Aqi.t(caption.dataset.aqiCaption);
    }
  }

  async locate() {
    try {
      const { locationMode, waqiToken } = await BrowserApi.storage.local.get(['locationMode', 'waqiToken']);
      if (locationMode === 'browser') {
        if (!waqiToken?.trim()) throw new Error('location_token_required');
        if (!navigator.geolocation) throw new Error('location_unavailable');
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false, timeout: 12000, maximumAge: 300000,
          });
        });
        const { latitude, longitude } = position.coords;
        const url = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${encodeURIComponent(waqiToken.trim())}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.status !== 'ok' || !Number.isFinite(Number(data.data?.idx))) {
          throw new Error(data.data || 'location_lookup_failed');
        }
        await this.select({
          name: data.data.city?.name || '',
          aqi: data.data.aqi,
          idx: data.data.idx,
          utime: data.data.time?.v,
        });
        return;
      }
      const response = await fetch('https://mapq.waqi.info/mapq/nearest/?n=10');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const station = data.d?.find((item) => Number.isFinite(Number(item.v)));
      if (!station) throw new Error('No nearby station found');
      await this.select({
        name: `${station.nlo || station.nna} (${station.nna || station.nlo})`,
        aqi: station.v,
        idx: station.x,
        utime: station.t,
      });
    } catch (error) {
      this.showError(error, this.results);
    }
  }

  showError(error, target = this.results) {
    console.error('City search failed', error);
    target.hidden = false;
    const key = error.message === 'location_token_required' ? 'location_token_required'
      : error.code === 1 ? 'location_permission_denied' : 'search_load_error';
    target.textContent = Aqi.t(key);
  }
}
