# aqicn-widget

A chrome extension ‘world-air-quality-index’ with bug-fixed.

### 新增功能：
1. 增加自动判断当前位置空气质量的按钮
2. 兼容Firefox

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

### 使用方法：

1. 下载到本地并解压
2. 打开chrome扩展管理，加载已解压的扩展程序，添加目录即可。
