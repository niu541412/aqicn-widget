# AQICN Widget

![AQICN Widget 图标](img/aqicn.128.png)

World Air Quality Index 浏览器扩展的维护版本，支持 Chrome 和 Firefox。

项目基于[原版扩展](https://chromewebstore.google.com/detail/hhhfnanaabgcafkmlplbifbhknnbmidl)修改。原版长期未维护，联系原作者后未获回复；如有权利相关问题，请联系仓库维护者。版本变更见 [CHANGELOG.md](CHANGELOG.md)。

## 安装

- [Chrome 网上应用店](https://chromewebstore.google.com/detail/ggogokejhhpnbpbgaajaillhlfhghhmp)
- [Firefox 附加组件商店](https://addons.mozilla.org/zh-CN/firefox/addon/world-air-quality-index-fork)
- [GitHub Releases](https://github.com/niu541412/aqicn-widget/releases)：下载对应浏览器的 ZIP。商店版本可能晚于 GitHub 发布版本。

如需加载本地构建，Chrome 在 `chrome://extensions` 开启开发者模式后加载 `dist/chrome/`；Firefox 在 `about:debugging` 的“临时载入附加组件”中选择 `dist/firefox/manifest.json`。

## 功能与设置

- 在工具栏图标和弹窗中查看所选城市的 AQI 与详情，并搜索、切换城市。
- 在 Google、Bing、百度、Qwant、DuckDuckGo、Brave Search、Ecosia、Startpage、Yahoo 和搜狗的搜索首页显示 AQI 小部件。小部件默认位于左上角，可拖动；位置按搜索引擎保存。设置页可选择网站并一键全选或全不选。
- 提供 `tiny`、`small`、`forecast`、`aqi`、`iaqi` 五种小部件样式和两种工具栏图标样式。
- 支持简体中文、繁体中文、英语、日语、韩语、西班牙语、俄语、法语、德语、葡萄牙语、意大利语、印尼语、阿拉伯语和印地语。语言切换后，设置页和弹窗会立即更新。
- 可设置 AQI 超标提醒阈值（0–1000）。只有新数据的 AQI 严格高于阈值时才通知，同一浏览器最多每 60 分钟通知一次；默认关闭。

### 自动定位

默认使用 IP 地址估算位置。设置页也提供浏览器定位选项；使用前需填写自己的 [AQICN API Token](https://aqicn.org/data-platform/token/)。点击定位按钮时，扩展读取浏览器经纬度，并向 AQICN 查询附近站点。设置页可以切换 Token 的遮盖与明文显示。

浏览器定位仅在点击定位按钮时发送经纬度，不将经纬度保存到扩展存储中。Firefox 清单会申报 `locationInfo`：查询 AQI 时会向 AQICN 发送与所选站点有关的信息。扩展不收集使用统计或浏览历史。

## 本地构建

需要 Python 3.10+，无需 npm：

```sh
python3 scripts/build.py
python3 scripts/check.py
```

构建脚本根据根目录的 `manifest.json` 分别生成 Chrome 和 Firefox 版本，输出到 `dist/chrome/`、`dist/firefox/`，并打包 `dist/aqicn-widget-<browser>-<version>.zip`。

GitHub Actions 在 push、PR 和手动触发时检查 JavaScript 语法、构建并校验两个安装包。推送与清单版本一致的 `vX.Y.Z` 标签后，工作流会将两个 ZIP 发布到 GitHub Release。浏览器商店的上架由维护者另行操作。
