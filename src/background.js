/* Service worker in Chrome; background script in Firefox. */
if (typeof importScripts === 'function') {
  importScripts('shared.js');
}

const FEED_INTERVAL_MINUTES = 1;
const FEED_CACHE_MS = 60_000;
const ALERT_COOLDOWN_MS = 60 * 60_000;
const LOCATION_REFRESH_MS = 10 * 60_000;
const OFFSCREEN_DOCUMENT = 'html/offscreen.html';
let feedRequest = null;
let offscreenDocumentCreation = null;

function decodeHistory(iaqi = {}) {
  const history = {};
  for (const item of Object.values(iaqi)) {
    if (!item?.h || !item.p) continue;
    const [start, divisor, encoded] = item.h;
    let time = new Date(start).getTime();
    let total = 0;
    const points = [];
    for (const part of encoded) {
      const values = typeof part === 'string' ? [...part] : [part];
      for (const value of values) {
        let delta;
        let steps = 1;
        if (typeof value === 'string') {
          const code = value.charCodeAt(0);
          delta = code >= 97 ? code - 97 : -(code - 65) - 1;
        } else if (typeof value === 'number') {
          delta = value;
        } else {
          [steps, delta] = value;
        }
        time -= steps * 3_600_000;
        total += delta / divisor;
        points.push({ t: time, v: total, s: steps });
      }
    }
    history[item.p] = points;
  }
  return history;
}

function decodeFeed(data) {
  const observation = data?.model || data?.rxs?.obs?.find((entry) => entry.status === 'ok')?.msg;
  if (!observation) throw new Error('No valid AQI observation');
  observation.historic = decodeHistory(observation.iaqi);
  if (typeof observation.time?.v === 'string') {
    const timestamp = Date.parse(observation.time.v);
    if (Number.isFinite(timestamp)) observation.time.v = timestamp;
  }
  if (observation.city?.url) {
    observation.city.url = observation.city.url.replace(/^http:/, 'https:');
  }
  return observation;
}

async function settings() {
  const values = await BrowserApi.storage.local.get(['lang', 'design']);
  return {
    lang: ['en', 'cn', 'hk', 'jp', 'kr', 'ru', 'es', 'fr', 'de', 'pt', 'it', 'id', 'ar', 'hi'].includes(values.lang)
      ? values.lang : Aqi.defaultLanguage(),
    design: ['tiny', 'small', 'forecast', 'aqi', 'iaqi'].includes(values.design) ? values.design : 'aqi',
  };
}

async function selectedCity() {
  const { selectedCity } = await BrowserApi.storage.local.get('selectedCity');
  if (!selectedCity) return null;
  try {
    const city = typeof selectedCity === 'string' ? JSON.parse(selectedCity) : selectedCity;
    city.clang = (await settings()).lang;
    return city;
  } catch (error) {
    console.error('Invalid saved city', error);
    return null;
  }
}

function stationIdentifier(city) {
  if (city?.idx != null) return `idx:${city.idx}`;
  if (city?.key) return `key:${city.key}`;
  return null;
}

async function hasOffscreenDocument() {
  const url = BrowserApi.runtime.getURL(OFFSCREEN_DOCUMENT);
  if (BrowserApi.runtime.getContexts) {
    const contexts = await BrowserApi.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
      documentUrls: [url],
    });
    return contexts.length > 0;
  }
  if (typeof clients !== 'undefined') {
    const extensionClients = await clients.matchAll({ includeUncontrolled: true, type: 'window' });
    return extensionClients.some((client) => client.url === url);
  }
  return false;
}

async function ensureOffscreenDocument() {
  if (!BrowserApi.offscreen?.createDocument) {
    throw new Error('Background geolocation is unavailable in this browser context');
  }
  if (await hasOffscreenDocument()) return;
  if (!offscreenDocumentCreation) {
    offscreenDocumentCreation = BrowserApi.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT,
      reasons: [BrowserApi.offscreen.Reason?.GEOLOCATION || 'DOM_SCRAPING'],
      justification: 'Access navigator.geolocation from the MV3 service worker and refresh the nearby AQI station when browser location is enabled.',
    });
  }
  try {
    await offscreenDocumentCreation;
  } finally {
    offscreenDocumentCreation = null;
  }
}

function readGeolocation(geolocation) {
  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition((position) => {
      resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    }, reject, {
      enableHighAccuracy: false,
      timeout: 12_000,
      maximumAge: 60_000,
    });
  });
}

async function currentCoordinates() {
  if (BrowserApi.offscreen?.createDocument) {
    await ensureOffscreenDocument();
    try {
      const position = await BrowserApi.runtime.sendMessage({
        target: 'aqicn-offscreen',
        method: 'getCurrentLocation',
      });
      if (position?.error) {
        const error = new Error(position.error.message || 'Could not get browser location');
        error.code = position.error.code;
        throw error;
      }
      if (!Number.isFinite(position?.latitude) || !Number.isFinite(position?.longitude)) {
        throw new Error('Browser location returned invalid coordinates');
      }
      return { latitude: position.latitude, longitude: position.longitude };
    } finally {
      try {
        await BrowserApi.offscreen.closeDocument();
      } catch (error) {
        console.warn('Could not close location helper document', error);
      }
    }
  }
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    return readGeolocation(navigator.geolocation);
  }
  throw new Error('Browser geolocation is unavailable');
}

async function automaticLocation(locationMode, token) {
  if (locationMode === 'browser') {
    if (!token?.trim()) throw new Error('Browser location requires an AQICN API token');
    const { latitude, longitude } = await currentCoordinates();
    const url = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${encodeURIComponent(token.trim())}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Location API HTTP ${response.status}`);
    const result = await response.json();
    if (result.status !== 'ok' || result.data?.idx == null
      || !Number.isFinite(Number(result.data.idx))) {
      throw new Error(result.data?.message || String(result.data || 'Location lookup failed'));
    }
    return {
      name: result.data.city?.name || '',
      aqi: result.data.aqi,
      idx: result.data.idx,
      utime: result.data.time?.v,
    };
  }

  const response = await fetch('https://mapq.waqi.info/mapq/nearest/?n=10');
  if (!response.ok) throw new Error(`Location API HTTP ${response.status}`);
  const result = await response.json();
  const station = result.d?.find((item) => Number.isFinite(Number(item.v)));
  if (!station) throw new Error('No nearby station found from IP location');
  return {
    name: `${station.nlo || station.nna} (${station.nna || station.nlo})`,
    aqi: station.v,
    idx: station.x,
    utime: station.t,
  };
}

async function refreshAutomaticLocation(city) {
  const stored = await BrowserApi.storage.local.get([
    'locationMode', 'waqiToken', 'locationCheckedAt',
  ]);
  const locationMode = stored.locationMode || 'ip';
  if (Date.now() - (stored.locationCheckedAt || 0) < LOCATION_REFRESH_MS) {
    return { city, changed: false };
  }

  const checkedAt = Date.now();
  try {
    const locatedCity = await automaticLocation(locationMode, stored.waqiToken);
    const latestSettings = await BrowserApi.storage.local.get(['locationMode', 'waqiToken']);
    const latestCity = await selectedCity();
    if ((latestSettings.locationMode || 'ip') !== locationMode
      || (locationMode === 'browser' && latestSettings.waqiToken !== stored.waqiToken)
      || stationIdentifier(latestCity) !== stationIdentifier(city)) {
      return { city: latestCity || city, changed: false };
    }

    const changed = stationIdentifier(locatedCity) !== stationIdentifier(city);
    const update = { selectedCity: locatedCity, locationCheckedAt: checkedAt };
    if (changed) Object.assign(update, { FeedData: null, FeedTime: 0, FeedSource: null });
    await BrowserApi.storage.local.set(update);
    return { city: locatedCity, changed };
  } catch (error) {
    console.warn(`Could not refresh ${locationMode} location; keeping the current station`, error);
    const latestSettings = await BrowserApi.storage.local.get(['locationMode', 'waqiToken']);
    if ((latestSettings.locationMode || 'ip') === locationMode
      && (locationMode !== 'browser' || latestSettings.waqiToken === stored.waqiToken)) {
      await BrowserApi.storage.local.set({ locationCheckedAt: checkedAt });
    }
    return { city, changed: false };
  }
}

async function setBadgeIcon(value, background, foreground) {
  try {
    await BrowserApi.action.setIcon({ path: { 32: '/img/aqicn.32.png' } });
  } catch (error) {
    console.warn('Could not load logo icon; using a drawn fallback', error);
    try {
      await setFallbackLogo();
    } catch (fallbackError) {
      console.warn('Could not draw fallback icon', fallbackError);
    }
  }
  await BrowserApi.action.setBadgeText({ text: value });
  await BrowserApi.action.setBadgeBackgroundColor({ color: background });
  if (BrowserApi.action.setBadgeTextColor) {
    await BrowserApi.action.setBadgeTextColor({ color: foreground });
  }
}

async function setFallbackLogo() {
  if (typeof OffscreenCanvas === 'undefined') return;
  const canvas = new OffscreenCanvas(32, 32);
  const context = canvas.getContext('2d');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, 32, 32);
  context.fillStyle = '#3b765b';
  context.font = 'bold 12px Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('AQI', 16, 16);
  await BrowserApi.action.setIcon({ imageData: { 32: context.getImageData(0, 0, 32, 32) } });
}

async function setIcon(feed) {
  const { iconType } = await BrowserApi.storage.local.get('iconType');
  const value = String(feed.aqi ?? '-');
  const { background, foreground } = Aqi.palette(value);
  if (String(iconType || '1') === '2' || typeof OffscreenCanvas === 'undefined') {
    await setBadgeIcon(value, background, foreground);
    return;
  }
  try {
    const canvas = new OffscreenCanvas(32, 32);
    const context = canvas.getContext('2d');
    context.fillStyle = background;
    context.beginPath();
    if (typeof context.roundRect === 'function') context.roundRect(0, 0, 32, 32, 6);
    else context.rect(0, 0, 32, 32);
    context.fill();
    context.fillStyle = foreground;
    context.font = `bold ${value.length > 3 ? 13 : 17}px Arial, sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(value, 16, 16);
    await BrowserApi.action.setIcon({ imageData: { 32: context.getImageData(0, 0, 32, 32) } });
    await BrowserApi.action.setBadgeText({ text: '' });
  } catch (error) {
    console.warn('Canvas icon failed; using badge icon', error);
    await setBadgeIcon(value, background, foreground);
  }
}

async function clearIcon() {
  try {
    await BrowserApi.action.setBadgeText({ text: '-' });
    await BrowserApi.action.setBadgeBackgroundColor({ color: '#868b92' });
  } catch (error) {
    console.warn('Could not reset toolbar badge', error);
  }
}

async function updateIconSafely(feed) {
  if (!feed) return;
  try {
    await setIcon(feed);
  } catch (error) {
    console.warn('Could not update toolbar icon', error);
  }
}

async function broadcast(feed) {
  const payload = { method: 'onFeedUpdate', aqi: feed };
  try {
    await BrowserApi.runtime.sendMessage(payload);
  } catch (_) {
    // No popup or options page is open.
  }
  const tabs = await BrowserApi.tabs.query({});
  await Promise.all(tabs.filter((tab) => tab.id != null).map(async (tab) => {
    try {
      await BrowserApi.tabs.sendMessage(tab.id, payload);
    } catch (_) {
      // Most tabs do not contain a matching content script.
    }
  }));
}

async function updateCachedSettings() {
  const { FeedData, FeedSource } = await BrowserApi.storage.local.get(['FeedData', 'FeedSource']);
  if (!FeedData || FeedSource !== 'widget-v1') return loadFeed(true);
  const feed = typeof FeedData === 'string' ? JSON.parse(FeedData) : FeedData;
  feed.rtsettings = await settings();
  await BrowserApi.storage.local.set({ FeedData: feed });
  await broadcast(feed);
  return feed;
}

async function maybeNotifyAqi(feed, language) {
  const stored = await BrowserApi.storage.local.get([
    'aqiAlertEnabled', 'aqiAlertThreshold', 'aqiAlertLastAt',
  ]);
  if (stored.aqiAlertEnabled !== true) return;
  const threshold = stored.aqiAlertThreshold;
  const aqi = Number(feed.aqi);
  if (!Number.isInteger(threshold) || threshold < 0 || threshold > 1000
    || !Number.isFinite(aqi) || aqi <= threshold) return;
  const now = Date.now();
  if (now - (stored.aqiAlertLastAt || 0) < ALERT_COOLDOWN_MS) return;
  try {
    await Aqi.setLanguage(language);
    const city = Aqi.stationName(feed, language) || Aqi.t('waqi_title');
    const message = Aqi.t('alert_message')
      .replace('{city}', city).replace('{aqi}', String(aqi))
      .replace('{threshold}', String(threshold));
    await BrowserApi.notifications.create('aqi-threshold', {
      type: 'basic',
      iconUrl: BrowserApi.runtime.getURL('img/aqicn.128.png'),
      title: Aqi.t('alert_title'),
      message,
    });
    await BrowserApi.storage.local.set({ aqiAlertLastAt: now });
  } catch (error) {
    console.warn('Could not show AQI alert', error);
  }
}

async function loadFeed(force = false) {
  if (feedRequest) {
    if (!force) return feedRequest;
    await feedRequest;
  }
  feedRequest = (async () => {
    const cached = await BrowserApi.storage.local.get(['FeedData', 'FeedTime', 'FeedSource']);
    let previous = cached.FeedData || null;
    if (typeof previous === 'string') {
      try { previous = JSON.parse(previous); } catch (_) { previous = null; }
    }
    if (cached.FeedSource !== 'widget-v1') previous = null;
    if (previous) previous.rtsettings = await settings();
    if (!force && previous && Date.now() - (cached.FeedTime || 0) < FEED_CACHE_MS) {
      await updateIconSafely(previous);
      return previous;
    }
    let city = await selectedCity();
    const location = await refreshAutomaticLocation(city);
    city = location.city;
    if (location.changed) previous = null;
    if (!city?.idx && !city?.key) {
      await updateIconSafely(previous);
      return previous;
    }
    const { lang, design } = await settings();
    const id = city.idx ? `@${encodeURIComponent(String(city.idx))}` : encodeURIComponent(city.key);
    const url = `https://aqicn.org/webwgt/${id}/widget.v1.json?from=chrome-extension&_t=${Date.now()}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const feed = decodeFeed(await response.json());
      if (city.idx && String(feed.city?.idx) !== String(city.idx)) {
        throw new Error(`Station mismatch: requested ${city.idx}, received ${feed.city?.idx}`);
      }
      const latestCity = await selectedCity();
      if (String(latestCity?.idx || latestCity?.key) !== String(city.idx || city.key)) return null;
      feed.rtsettings = { lang, design };
      await BrowserApi.storage.local.set({ FeedData: feed, FeedTime: Date.now(), FeedSource: 'widget-v1' });
      await updateIconSafely(feed);
      await broadcast(feed);
      await maybeNotifyAqi(feed, lang);
      return feed;
    } catch (error) {
      console.error('AQI feed failed', error);
      if (!force && previous) {
        await updateIconSafely(previous);
        await broadcast(previous);
        return previous;
      }
      await clearIcon();
      return null;
    }
  })().finally(() => { feedRequest = null; });
  return feedRequest;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.target === 'aqicn-offscreen') return false;
  (async () => {
    switch (request.method) {
      case 'getSelectedCity': return selectedCity();
      case 'setSelectedCity':
        await BrowserApi.storage.local.set({
          selectedCity: request.city,
          FeedData: null,
          FeedTime: 0,
          FeedSource: null,
          locationCheckedAt: Date.now(),
        });
        await clearIcon();
        return loadFeed(true);
      case 'loadFeed': return loadFeed();
      case 'setLang':
        await BrowserApi.storage.local.set({ lang: request.lang });
        return updateCachedSettings();
      case 'setDesign': {
        await BrowserApi.storage.local.set({ design: request.design });
        return updateCachedSettings();
      }
      case 'setIcon': {
        const { FeedData, FeedSource } = await BrowserApi.storage.local.get(['FeedData', 'FeedSource']);
        const feed = typeof FeedData === 'string' ? JSON.parse(FeedData) : FeedData;
        if (feed && FeedSource === 'widget-v1') {
          await updateIconSafely(feed);
          return feed;
        }
        await clearIcon();
        return loadFeed(true);
      }
      case 'checkOption': {
        const key = `optchecked${request.opt}`;
        const stored = await BrowserApi.storage.local.get(key);
        return stored[key] !== false;
      }
      default: return null;
    }
  })().then(sendResponse).catch((error) => {
    console.error('Message failed', request.method, error);
    sendResponse(null);
  });
  return true;
});

chrome.alarms.create('refreshFeed', { periodInMinutes: FEED_INTERVAL_MINUTES });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'refreshFeed') loadFeed();
});

BrowserApi.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local' || (!changes.locationMode && !changes.waqiToken)) return;
  (async () => {
    const { locationMode } = await BrowserApi.storage.local.get('locationMode');
    if (changes.locationMode || locationMode === 'browser') {
      await BrowserApi.storage.local.set({ locationCheckedAt: 0 });
      await loadFeed(true);
    }
  })().catch((error) => console.error('Could not refresh after location settings changed', error));
});

chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create('refreshFeed', { periodInMinutes: FEED_INTERVAL_MINUTES });
  loadFeed();
});
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('refreshFeed', { periodInMinutes: FEED_INTERVAL_MINUTES });
  loadFeed();
});
