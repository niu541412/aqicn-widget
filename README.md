# aqicn-widget

The extension ‘world-air-quality-index’ with bug-fixed for modern browsers.

<img src="img/aqicn.128.png" width=96 >

移植自Chrome同名扩展，原扩展下载[地址](https://chromewebstore.google.com/detail/hhhfnanaabgcafkmlplbifbhknnbmidl)。
由于官方常年未维护(处于过期的manifest v2版本)，联系后也无回复。若有侵权，请联系我删除。

### 下载地址

[Chrome 商店](https://chromewebstore.google.com/detail/ggogokejhhpnbpbgaajaillhlfhghhmp),
[Firefox Add-on](https://addons.mozilla.org/zh-CN/firefox/addon/world-air-quality-index-fork)

<!-- ，[Edge商店](https://microsoftedge.microsoft.com/addons/detail/jijkhdficgnnikdijnkienfnmfbolmpb) -->

### 新增功能：

1. 增加自动判断当前位置空气质量的按钮
2. 兼容Firefox
3. 增加图标样式选项

### 修复内容：

1. 空气质量数值和污染程度的文案错乱，总是显示严重污染
2. 窗口内容显示不全，Wind被遮挡
3. 修复百度首页一直显示插件，以及位置有遮挡
4. 修复其他搜索页面显示功能

### 其他更改:

1. 修正并添加部分翻译
2. 完全移除moment.js
3. 完全移除jQuery
4. 完全移除es6-promise
5. 使用OffscreenCanvas动态绘制图标，移除静态图片
6. 迁移同步localStorage到异步chrome.storage.local
