#!/usr/bin/env python3
"""Check the release archives against the intended browser manifests."""
import json
from pathlib import Path
from zipfile import ZipFile

root = Path(__file__).resolve().parents[1]
chrome_manifest = json.loads((root / 'manifest.json').read_text())
for browser in ('chrome', 'firefox'):
    package = root / 'dist' / browser
    manifest = json.loads((package / 'manifest.json').read_text())
    locales = {'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'ru', 'fr', 'de', 'pt_BR', 'it', 'id', 'ar', 'hi'}
    assert {path.name for path in (package / '_locales').iterdir()} == locales
    english = json.loads((package / '_locales/en/messages.json').read_text())
    for locale in locales:
        messages = json.loads((package / f'_locales/{locale}/messages.json').read_text())
        assert set(messages) == set(english), locale
        assert all(entry.get('message', '').strip() for entry in messages.values()), locale
        assert all(messages['alert_message']['message'].count(token) == 1
                   for token in ('{city}', '{aqi}', '{threshold}')), locale
    assert manifest['manifest_version'] == 3
    assert 'alarms' in manifest['permissions']
    assert 'notifications' in manifest['permissions']
    assert 'tabs' not in manifest['permissions']
    assert 'http://aqicn.org/*' not in manifest['host_permissions']
    assert len(manifest['content_scripts']) == 5
    assert all(entry['js'] == ['src/shared.js', 'src/widget.js', 'src/content.js'] for entry in manifest['content_scripts'])
    google = manifest['content_scripts'][4]['matches']
    assert '*://google.com/*' in google and '*://www.google.com/*' in google
    if browser == 'chrome':
        assert manifest == chrome_manifest
        assert manifest['background'] == {'service_worker': 'src/background.js'}
        assert 'browser_specific_settings' not in manifest
    else:
        assert manifest['background'] == {'scripts': ['src/shared.js', 'src/background.js']}
        assert manifest['browser_specific_settings']['gecko']['id']
        assert manifest['browser_specific_settings']['gecko']['data_collection_permissions'] == {
            'required': ['locationInfo'],
        }
    archive = next((root / 'dist').glob(f'aqicn-widget-{browser}-*.zip'))
    with ZipFile(archive) as zipped:
        expected = {str(path.relative_to(package)) for path in package.rglob('*') if path.is_file()}
        assert set(zipped.namelist()) == expected
        assert json.loads(zipped.read('manifest.json')) == manifest
    print(f'{browser}: {len(expected)} files checked')
