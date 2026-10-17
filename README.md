# AQICN Widget

基于原版 World Air Quality Index 浏览器扩展维护的 Chrome / Firefox 版本，当前版本为 2.1.0。原版扩展及商店页面见 [Chrome Web Store](https://chromewebstore.google.com/detail/hhhfnanaabgcafkmlplbifbhknnbmidl)。

此项目移植自 Chrome 同名扩展。原扩展长期未维护，联系原作者后未获回复；如涉及侵权，请联系仓库维护者。

## 扩展商店

[Chrome 商店](https://chromewebstore.google.com/detail/ggogokejhhpnbpbgaajaillhlfhghhmp) · [Firefox Add-on](https://addons.mozilla.org/zh-CN/firefox/addon/world-air-quality-index-fork)。商店版本可能晚于仓库中的代码更新。

## 本地构建

需要 Python 3.10+，不依赖 npm：

```sh
python3 scripts/build.py
python3 scripts/check.py
```

构建结果位于 `dist/chrome/`、`dist/firefox/`；同目录会生成两个可发布的 ZIP。Chrome 可在 `chrome://extensions` 开启开发者模式后直接加载项目根目录，也可以加载 `dist/chrome/`。Firefox 可从 `about:debugging` 的“临时载入附加组件”选择 `dist/firefox/manifest.json`。GitHub Actions 在每次 push、PR 和手动触发时构建，并上传两个 ZIP 为工作流 artifact；推送与清单版本一致的 `vX.Y.Z` 标签时，还会自动发布包含两个 ZIP 的 GitHub Release。

## 目录

- `manifest.json`：根目录的 Chrome 清单，也是构建来源；构建脚本为 Firefox 加入后台脚本和 Gecko ID。
- `src/`：可维护的背景、搜索、设置和搜索首页脚本。
- `html/`、`css/`、`img/`、`_locales/`：扩展页面和静态资源。
- `scripts/`：打包和产物校验。

搜索首页的小部件默认显示在页面左上角，可拖动并按搜索引擎记住位置；支持 Google、Bing、百度、Qwant、DuckDuckGo、Brave Search、Ecosia、Startpage、Yahoo 和搜狗。设置页的网站名称可点击打开官网。五种小部件样式（tiny、small、forecast、aqi、iaqi）由设置页切换。语言、图标样式和是否在各搜索引擎显示也可在设置中调整。

语言设置支持简体中文、繁体中文、英语、日语、韩语、西班牙语、俄语、法语、德语、葡萄牙语、意大利语、印尼语、阿拉伯语和印地语。设置页与弹窗会按所选语言更新，不依赖浏览器界面语言。

自动定位默认沿用按 IP 地址估算位置。也可以在设置中选择浏览器定位，并填写自己的 [AQICN API Token](https://aqicn.org/data-platform/token/)。点击定位按钮时，扩展取得浏览器经纬度，调用 AQICN 的地理位置查询接口找到站点；经纬度不会保存到扩展存储中。

Firefox 安装包在清单中申报 `locationInfo`：查询站点空气质量时会向 AQICN 发送与所选地点有关的站点信息；使用浏览器定位时，用户点击定位按钮后还会发送经纬度。扩展不收集使用统计或浏览历史。

设置页可开启 AQI 超标提醒，并输入 0–1000 的整数阈值。扩展仅在成功取得所选站点的新数据且 AQI 严格大于阈值时通知；同一浏览器最多每 60 分钟通知一次。提醒默认关闭。

## 本轮回归修复

- 自动定位按钮改为搜索框内较小的准星图标。
- 搜索首页按所选五种样式渲染小部件；按右上角拖动柄移动，位置按搜索引擎保存。
- Google 同时匹配裸域名与 `www` 域名，首页识别不再依赖旧版 Logo 类名。
- 工具栏图标与详情改用同一份站点数据；切换城市时清除旧图标与缓存，核对接口返回的站点编号，避免旧请求覆盖新城市。切换两种图标样式会用当前站点数据重绘；画布图标不可用时回退到徽章图标。
- AQI 详情加载时显示转圈，并恢复原来的衬线字体。
- AQI 详情弹窗恢复原版约 480px 的宽度：460px 详情内容，两侧各留 10px；恢复原版详情数字的居中与字体样式。
- 详情内容不再受 AQICN 返回的 420px 固定高度裁切；设置页完整展开，工具栏弹窗在超过可见高度时显示滚动条。
- 搜索引擎显示设置增加“全选”和“全不选”，一次保存所有开关。
- 搜索引擎名称可直接打开各自官网；语言设置会立即更新设置页、弹窗文案及 AQI 小部件，并补齐所有语言的翻译。

## 已处理的问题

- Firefox 清单此前引用 `../js/date-tools.js`，路径在扩展包外。
- 旧后台的 `loadFeed` 在无缓存时不响应消息，可能使页面一直等待；现在始终返回结果。
- 旧代码的 `saveOptions` 调用了不存在的方法；已移除无效消息分支。
- 搜索结果曾通过字符串拼接写入 `innerHTML`；现在用文本节点构建。
- 定位接口没有可用站点时，旧代码会读取未定义的 `my_location.name`；现在给出错误状态。
- Manifest V3 后台定时器在服务工作线程休眠后不可靠；现在用 `chrome.alarms` 定期更新。

扩展商店发布需由维护者单独操作。
