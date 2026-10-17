#!/usr/bin/env python3
"""Create unpacked Chrome/Firefox extensions and release ZIPs without dependencies."""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
ASSETS = ('_locales', 'css', 'html', 'img', 'src')


def make_manifest(browser: str) -> dict:
    manifest = json.loads((ROOT / 'manifest.json').read_text())
    if browser == 'firefox':
        manifest['background'] = {'scripts': ['src/shared.js', 'src/background.js']}
        manifest['browser_specific_settings'] = {
            'gecko': {
                'id': '{fc8371f0-d3cb-4a84-964f-3f5b805f5ab2}',
                'data_collection_permissions': {'required': ['locationInfo']},
            },
        }
    return manifest


def validate(package: Path) -> None:
    manifest = json.loads((package / 'manifest.json').read_text())
    references = list(manifest['background'].get('scripts', []))
    if 'service_worker' in manifest['background']:
        references.append(manifest['background']['service_worker'])
    references += [manifest['action']['default_popup'], manifest['options_ui']['page']]
    for entry in manifest['content_scripts']:
        references.extend(entry['css'] + entry['js'])
    for reference in references:
        if '..' in Path(reference).parts or not (package / reference).is_file():
            raise ValueError(f'Invalid extension file: {reference}')


def build(browser: str) -> Path:
    package = DIST / browser
    package.mkdir(parents=True)
    for directory in ASSETS:
        shutil.copytree(ROOT / directory, package / directory)
    manifest = make_manifest(browser)
    (package / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    validate(package)
    archive = DIST / f'aqicn-widget-{browser}-{manifest["version"]}.zip'
    with ZipFile(archive, 'w', ZIP_DEFLATED) as output:
        for path in sorted(package.rglob('*')):
            if path.is_file():
                output.write(path, path.relative_to(package))
    return archive


def main() -> None:
    validate(ROOT)
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
    for browser in ('chrome', 'firefox'):
        print(build(browser).relative_to(ROOT))


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(f'Build failed: {error}', file=sys.stderr)
        sys.exit(1)
