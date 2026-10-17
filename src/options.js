document.addEventListener('DOMContentLoaded', async () => {
  const engines = ['bing', 'google', 'baidu', 'qwant', 'duckduckgo', 'brave', 'ecosia', 'startpage', 'yahoo', 'sogou'];
  const keys = ['lang', 'iconType', 'design', 'locationMode', 'waqiToken',
    'aqiAlertEnabled', 'aqiAlertThreshold',
    ...engines.map((id) => `optchecked${id}`)];
  const stored = await BrowserApi.storage.local.get(keys);
  const languages = ['en', 'cn', 'hk', 'jp', 'es', 'ru', 'kr', 'fr', 'de', 'pt', 'it', 'id', 'ar', 'hi'];
  const language = languages.includes(stored.lang) ? stored.lang : Aqi.defaultLanguage();
  await Aqi.setLanguage(language);
  Aqi.localize();
  const search = new CitySearch();
  const status = document.getElementById('status');
  let statusTimer;
  function saved() {
    status.textContent = Aqi.t('opt_save');
    status.hidden = false;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { status.hidden = true; }, 1500);
  }

  for (const code of languages) {
    const input = document.getElementById(`lang${code}`);
    input.name = 'language';
    input.checked = code === language;
    input.addEventListener('change', async () => {
      await Aqi.setLanguage(code);
      if (!input.checked) return;
      Aqi.localize();
      search.updateLanguage(code);
      await BrowserApi.storage.local.set({ lang: code });
      await Aqi.message('setLang', { lang: code });
      saved();
    });
  }

  for (const [id, value] of [['defaulticon', '1'], ['badgeicon', '2']]) {
    const input = document.getElementById(id);
    input.name = 'iconType';
    input.checked = value === String(stored.iconType || '1');
    document.getElementById(`${id}_img`).src = `../img/icon/${id}.png`;
    input.addEventListener('change', async () => {
      await BrowserApi.storage.local.set({ iconType: value });
      await Aqi.message('setIcon');
      saved();
    });
  }

  const designs = document.getElementById('design_selection');
  for (const design of ['tiny', 'small', 'forecast', 'aqi', 'iaqi']) {
    const label = document.createElement('label');
    label.className = 'design-choice';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'design';
    input.value = design;
    input.checked = design === (stored.design || 'aqi');
    input.addEventListener('change', async () => {
      await Aqi.message('setDesign', { design });
      saved();
    });
    const image = document.createElement('img');
    image.src = `../img/design/${design}.png`;
    image.alt = design;
    label.append(input, image);
    designs.append(label);
  }

  for (const engine of engines) {
    const input = document.getElementById(engine);
    input.checked = stored[`optchecked${engine}`] !== false;
    input.addEventListener('change', async () => {
      await BrowserApi.storage.local.set({ [`optchecked${engine}`]: input.checked });
      saved();
    });
  }

  for (const [buttonId, checked] of [['engine_select_all', true], ['engine_select_none', false]]) {
    document.getElementById(buttonId).addEventListener('click', async () => {
      const choices = Object.fromEntries(engines.map((engine) => [`optchecked${engine}`, checked]));
      await BrowserApi.storage.local.set(choices);
      for (const engine of engines) document.getElementById(engine).checked = checked;
      saved();
    });
  }

  for (const mode of ['ip', 'browser']) {
    const input = document.getElementById(`location-${mode}`);
    input.checked = mode === (stored.locationMode || 'ip');
    input.addEventListener('change', async () => {
      await BrowserApi.storage.local.set({ locationMode: mode });
      saved();
    });
  }
  const token = document.getElementById('waqi-token');
  token.value = stored.waqiToken || '';
  token.addEventListener('change', async () => {
    await BrowserApi.storage.local.set({ waqiToken: token.value.trim() });
    saved();
  });

  const alertEnabled = document.getElementById('alert-enabled');
  const alertThreshold = document.getElementById('alert-threshold');
  alertEnabled.checked = stored.aqiAlertEnabled === true;
  alertThreshold.value = String(Number.isInteger(stored.aqiAlertThreshold)
    ? stored.aqiAlertThreshold : 100);
  async function saveAlert() {
    if (!alertThreshold.reportValidity()) {
      alertEnabled.checked = stored.aqiAlertEnabled === true;
      return;
    }
    const threshold = Number(alertThreshold.value);
    const values = { aqiAlertEnabled: alertEnabled.checked, aqiAlertThreshold: threshold };
    await BrowserApi.storage.local.set(values);
    Object.assign(stored, values);
    saved();
  }
  alertEnabled.addEventListener('change', saveAlert);
  alertThreshold.addEventListener('change', saveAlert);
});
