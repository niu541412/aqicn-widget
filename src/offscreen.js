/* Provides geolocation to the Chrome MV3 service worker. */
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.target !== 'aqicn-offscreen' || request.method !== 'getCurrentLocation') return false;

  navigator.geolocation.getCurrentPosition((position) => {
    sendResponse({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }, (error) => {
    sendResponse({ error: { code: error.code, message: error.message } });
  }, {
    enableHighAccuracy: false,
    timeout: 12_000,
    maximumAge: 60_000,
  });
  return true;
});
