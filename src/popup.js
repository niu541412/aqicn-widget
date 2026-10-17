document.addEventListener('DOMContentLoaded', async () => {
  const { lang } = await BrowserApi.storage.local.get('lang');
  await Aqi.setLanguage(lang);
  Aqi.localize();
  new CitySearch();
});
