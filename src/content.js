/* Floating AQI widget on supported search engine home pages. */
(() => {
  const hostname = location.hostname;
  const engine = hostname === 'so.com' || hostname === 'www.so.com' ? 'so'
    : hostname.includes('bing.') ? 'bing' : hostname.includes('baidu.') ? 'baidu'
      : hostname.includes('qwant.') ? 'qwant' : hostname.includes('duckduckgo.') ? 'duckduckgo'
        : hostname === 'search.brave.com' ? 'brave' : hostname.includes('ecosia.') ? 'ecosia'
          : hostname.includes('startpage.') ? 'startpage' : hostname === 'search.yahoo.com' ? 'yahoo'
            : hostname.includes('sogou.') ? 'sogou' : 'google';
  const positionKey = `aqicnWidgetPosition:${engine}`;
  let feed = null;
  let overlay = null;
  let position = null;
  let renderQueued = false;

  function isHomePage() {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    const query = new URLSearchParams(location.search);
    if (['q', 'wd', 'query', 'p', 'text'].some((key) => query.has(key))) return false;
    if (engine === 'google') {
      return (path === '/' || path === '/webhp')
        && !!document.querySelector('textarea[name="q"], input[name="q"]');
    }
    if (engine === 'bing') return path === '/' && !!document.querySelector('#sb_form_q, #sb_form');
    if (engine === 'baidu') return path === '/' && !!document.querySelector('#kw');
    return path === '/' && !!document.querySelector(
      'input[name="q"], input[name="p"], input[name="query"], input[type="search"], textarea[name="q"], #query, #searchbox',
    );
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), Math.max(min, max));
  }

  function applyPosition() {
    if (!overlay || !position) return;
    overlay.style.right = 'auto';
    overlay.style.bottom = 'auto';
    overlay.style.left = `${clamp(position.x, 8, window.innerWidth - overlay.offsetWidth - 8)}px`;
    overlay.style.top = `${clamp(position.y, 8, window.innerHeight - overlay.offsetHeight - 8)}px`;
  }

  function enableDrag(handle) {
    let start = null;
    handle.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      const box = overlay.getBoundingClientRect();
      start = { x: event.clientX, y: event.clientY, left: box.left, top: box.top };
      overlay.style.right = 'auto';
      overlay.style.bottom = 'auto';
      overlay.style.left = `${box.left}px`;
      overlay.style.top = `${box.top}px`;
      handle.setPointerCapture(event.pointerId);
      handle.classList.add('is-dragging');
      event.preventDefault();
    });
    handle.addEventListener('pointermove', (event) => {
      if (!start) return;
      position = {
        x: clamp(start.left + event.clientX - start.x, 8, window.innerWidth - overlay.offsetWidth - 8),
        y: clamp(start.top + event.clientY - start.y, 8, window.innerHeight - overlay.offsetHeight - 8),
      };
      applyPosition();
    });
    function finish(event) {
      if (!start) return;
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
      handle.classList.remove('is-dragging');
      start = null;
      if (position) BrowserApi.storage.local.set({ [positionKey]: position });
    }
    handle.addEventListener('pointerup', finish);
    handle.addEventListener('pointercancel', finish);
  }

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'aqicn-widget-overlay';
    overlay.className = `aqicn-widget-overlay aqicn-widget-overlay--${engine}`;
    const handle = document.createElement('button');
    handle.type = 'button';
    handle.className = 'aqicn-widget__drag-handle';
    handle.setAttribute('aria-label', AqiWidget.text('drag', feed?.rtsettings?.lang));
    handle.title = AqiWidget.text('dragHint', feed?.rtsettings?.lang);
    const grip = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    grip.setAttribute('viewBox', '0 0 12 18');
    grip.setAttribute('aria-hidden', 'true');
    grip.setAttribute('focusable', 'false');
    for (const y of [4, 9, 14]) {
      for (const x of [3, 9]) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', x);
        dot.setAttribute('cy', y);
        dot.setAttribute('r', 1);
        grip.append(dot);
      }
    }
    handle.append(grip);
    const link = document.createElement('a');
    link.className = 'aqicn-widget__link';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    overlay.append(handle, link);
    document.body.append(overlay);
    enableDrag(handle);
    applyPosition();
    return overlay;
  }

  function render() {
    if (!feed?.city?.url || !isHomePage()) {
      overlay?.remove();
      overlay = null;
      return;
    }
    const root = ensureOverlay();
    const handle = root.querySelector('.aqicn-widget__drag-handle');
    handle.setAttribute('aria-label', AqiWidget.text('drag', feed.rtsettings?.lang));
    handle.title = AqiWidget.text('dragHint', feed.rtsettings?.lang);
    const link = root.querySelector('.aqicn-widget__link');
    link.href = feed.city.url;
    link.title = `${Aqi.stationName(feed, feed.rtsettings?.lang)}: ${feed.aqi} AQI`;
    link.replaceChildren(AqiWidget.create(feed));
    applyPosition();
  }

  function scheduleRender() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => {
      renderQueued = false;
      render();
    });
  }

  Aqi.message('checkOption', { opt: engine }).then(async (enabled) => {
    if (!enabled) return;
    const stored = await BrowserApi.storage.local.get(positionKey);
    position = stored[positionKey] || null;
    Aqi.onFeed((newFeed) => {
      feed = newFeed;
      scheduleRender();
    });
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => !overlay?.contains(mutation.target))) scheduleRender();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('popstate', scheduleRender);
    window.addEventListener('hashchange', scheduleRender);
    window.addEventListener('resize', applyPosition);
  });
})();
