if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.getBrowserInfo) {
    browser.runtime.getBrowserInfo().then(info => {
        console.log("Running in Firefox:", info.name, info.version);
    });
} else {
    console.log("Running in Chrome or other Chromium-based browser");
    importScripts("../js/date-tools.js");
}
! function (e) {
    var t = {};

    function n(r) {
        if (t[r]) return t[r].exports;
        var o = t[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }
    n.m = e, n.c = t, n.d = function (e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: r
        })
    }, n.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function (e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (n.r(r), Object.defineProperty(r, "default", {
            enumerable: !0,
            value: e
        }), 2 & t && "string" != typeof e)
            for (var o in e) n.d(r, o, function (t) {
                return e[t]
            }.bind(null, o));
        return r
    }, n.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 7)
}
    ([, , ,
        function (e, t) {
        },
        function (e, t) {
            var n = (typeof globalThis !== 'undefined') ? globalThis :
                (typeof self !== 'undefined') ? self :
                    (typeof window !== 'undefined') ? window :
                        (typeof global !== 'undefined') ? global :
                            {};
            e.exports = n;
        }, , ,
        function (module, exports, __webpack_require__) {
            "use strict";
            exports.__esModule = !0;
            var Decoder = __webpack_require__(8),
                Background = function () {
                    function Background() {
                        var e = this;
                        this.timeout = null, console.log("----- background ------- starting! -----"), chrome.tabs.onUpdated.addListener(function () {
                            e.loader()
                        }), this.loader()
                    }
                    return Background.prototype.loadJSON = function (dname) {
                        return fetch(dname)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.json(); // 自动解析 JSON
                            });
                    }, Background.prototype.getCityObject = function () {
                        return new Promise((resolve) => {
                            chrome.storage.local.get(["selectedCity", "lang"], (result) => {
                                const obj = result.selectedCity;
                                if (obj) {
                                    try {
                                        const o = JSON.parse(obj);
                                        o.clang = result.lang;
                                        resolve(o);
                                    } catch (e) {
                                        console.error("getCityObject -> parse error:", e);
                                        resolve(null);
                                    }
                                } else {
                                    console.log("getCityObject -> null");
                                    resolve(null)
                                }
                            });
                        });
                    }, Background.prototype.getAqiColor = function (aqi) {
                        if (aqi === "-" || aqi == null) return { color: "#aaaaaa", textColor: "#eeeeee" };
                        let color = "#aaaaaa";
                        let textColor = "#eeeeee";
                        if (aqi <= 50) {
                            color = "#009966"; textColor = "#ffffff";
                        } else if (aqi <= 100) {
                            color = "#ffde33"; textColor = "#000000";
                        } else if (aqi <= 150) {
                            color = "#ff9933"; textColor = "#000000";
                        } else if (aqi <= 200) {
                            color = "#cc0033"; textColor = "#ffffff";
                        } else if (aqi <= 300) {
                            color = "#660099"; textColor = "#ffffff";
                        } else {
                            color = "#7e0023"; textColor = "#ffffff";
                        }
                        return { color, textColor };
                    }, Background.prototype.setIcon = function (e) {
                        if (console.log("Set Icon:", e), null != e) {
                            const aqi = e.aqi;
                            const { color, textColor } = this.getAqiColor(aqi);
                            const iconsize = 32;
                            const cvs = new OffscreenCanvas(iconsize, iconsize);
                            const ctx = cvs.getContext('2d');
                            ctx.roundRect(0, 0, iconsize, iconsize, 6);
                            ctx.fillStyle = color;
                            ctx.fill();
                            // ctx.font = 'bold 18px sans-serif, "Noto Serif", Cambria, "Palatino Linotype", "Book Antiqua", "URW Palladio L", serif';
                            ctx.font = 'bold 17px Arial, sans-serif, Times';
                            ctx.fillStyle = textColor;
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle";
                            ctx.fillText(aqi, iconsize / 2, iconsize / 2);
                            ctx.globalAlpha = 1;
                            console.log("Setting AQI" + aqi + "icon...");
                            chrome.action.setIcon({
                                imageData: { 32: ctx.getImageData(0, 0, iconsize, iconsize) },
                            });
                        } else console.log("Draw logo error!")
                    }, Background.prototype.loadFeed = function (e) {
                        var t = this;
                        void 0 === e && (e = !1);
                        chrome.storage.local.get(["FeedTime"], (result) => {
                            var n = result.FeedTime;
                            var r = Math.abs(n - Date.now());
                            if (!e && r < 6e4) console.log("Using cached data");
                            else {
                                this.getCityObject().then((o) => {
                                    if (null != o) {
                                        var i = "http://api.waqi.info/api/feed/";
                                        t.getLang().then(lang => {
                                            o.idx ? i += "@" + o.idx : i += "!" + o.key, i += "/obs." + lang + ".json", console.log("Loading " + i + " (dt=" + r + ") - type=", o), i += "?_t=" + Date.now(), i += "&from=chrome-extension", this.loadJSON(i).then(
                                                function (e) {
                                                    if (e != null) {
                                                        console.log("Loaded!");
                                                        try {
                                                            var n = Decoder.decodeFeed(e);
                                                            t.setIcon(n);
                                                            chrome.storage.local.set({
                                                                "FeedData": JSON.stringify(n),
                                                                "FeedTime": Date.now()
                                                            });
                                                            t.getDesign().then(design => {
                                                                n.rtsettings = {
                                                                    design: design,
                                                                    lang: lang
                                                                };
                                                                chrome.runtime.sendMessage({
                                                                    method: "onFeedUpdate",
                                                                    aqi: n
                                                                });
                                                                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                                                                    if (tabs.length > 0 && tabs[0].id >= 0) {
                                                                        const tab = tabs[0];
                                                                        console.log("Sending to tab", tab);
                                                                        chrome.tabs.sendMessage(tab.id, {
                                                                            method: "onFeedUpdate",
                                                                            aqi: n
                                                                        });
                                                                    } else {
                                                                        console.log("Not sending to tab (none active)");
                                                                    }
                                                                });
                                                            });
                                                        } catch (err) {
                                                            console.log("Oops, error with feed: ", err);
                                                        }
                                                    } else console.log("Loading error!");
                                                })
                                        })
                                    } else console.log("Can not get the city Object!")
                                })
                            }
                        })
                    }, Background.prototype.getLang = function () {
                        return new Promise((resolve) => {
                            chrome.storage.local.get(["lang"], (result) => {
                                let e = result.lang;
                                void 0 === e && (e = "zh-CN" == (e = chrome.i18n.getUILanguage()) ? "cn" : "zh-HK" == e ? "hk" : "zh-TW" == e ? "hk" : "ja" == e ? "jp" : "ru" == e ? "ru" : "es" == e ? "es" : "ko" == e ? "kr" : "en"), ["cn", "hk", "jp", "ru", "es", "kr"].indexOf(e) < 0 && (e = "en"), console.log("getLang() -> " + e + " (" + chrome.i18n.getUILanguage() + ")");
                                resolve(e);
                            });
                        });
                    }, Background.prototype.setLang = function (e) {
                        chrome.storage.local.set({ "lang": e });
                        return e;
                    }, Background.prototype.getDesign = function () {
                        return new Promise((resolve) => {
                            chrome.storage.local.get(["design"], (result) => {
                                let e = result.design || "aqi";
                                ["tiny", "small", "forecast", "aqi", "iaqi"].indexOf(e) < 0 && (e = "aqi");
                                resolve(e);
                            });
                        });
                    }, Background.prototype.setDesign = function (e) {
                        chrome.storage.local.set({ "design": e });
                        return e;
                    }, Background.prototype.checkOption = function (e) {
                        return new Promise((resolve) => {
                            const key = "optchecked" + e;
                            chrome.storage.local.get([key], (result) => {
                                let t = result[key];
                                console.log("checkOption", e, ":", t, 'type:', typeof t);
                                if (typeof t === "undefined") {
                                    console.log("checkOption", e, ":", "It is undefined!");
                                    t = true;
                                }
                                resolve(t);
                            });
                        });
                    }, Background.prototype.loader = function (e) {
                        var t = this;
                        void 0 === e && (e = 0), console.log("AQI feed loader - count = " + e), this.timeout && clearTimeout(this.timeout), this.loadFeed(0 == e), e > 300 || (this.timeout = setTimeout(function () {
                            t.timeout = null, t.loader(e + 1)
                        }, 6e4))
                    }, Background
                }(),
                background = new Background;
            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                if (console.log("received Message ", request.method, " from the UI"), "getSelectedCity" == request.method) {
                    background.getCityObject().then((cityObj) => {
                        sendResponse(cityObj);
                    }).catch((err) => {
                        console.error("getCityObject failed:", err);
                        sendResponse(null);
                    });
                    return true;
                } else if ("setSelectedCity" == request.method) {
                    chrome.storage.local.set({ "selectedCity": JSON.stringify(request.city) });
                    background.loadFeed(!0);
                } else if ("loadFeed" == request.method) {
                    chrome.storage.local.get(["FeedData"], (result) => {
                        var aqi = result.FeedData;
                        aqi = JSON.parse(aqi);
                        if (aqi != null) {
                            Promise.all([background.getLang(), background.getDesign()])
                                .then(([lang, design]) => {
                                    aqi.rtsettings = { lang, design };
                                    sendResponse(aqi);
                                }).catch(err => {
                                    console.error("Failed to get lang/design:", err);
                                    sendResponse(null);
                                });
                            background.loadFeed();
                        }
                    })
                } else if ("setLang" == request.method) {
                    sendResponse(background.setLang(request.lang));
                    background.loadFeed(true);
                } else if ("setDesign" == request.method) {
                    sendResponse(background.setDesign(request.design));
                    background.loadFeed(true);
                } else if ("saveOptions" == request.method) {
                    sendResponse(background.saveOptions(request.options));
                    background.loadFeed(true);
                } else if ("checkOption" == request.method) {
                    background.checkOption(request.opt).then(result => {
                        sendResponse(result);
                        background.loadFeed(true);
                    });
                    return true;
                } else {
                    sendResponse({});
                }
            })
        },
        function (e, t, n) {
            "use strict";

            function r(e) {
                var t = {};
                for (var n in e) {
                    var r = e[n],
                        o = r.p,
                        i = r.h[0],
                        s = [],
                        c = new Date(i).getTime(),
                        u = r.h[1];
                    r.h[2].forEach(function (e, t) {
                        if ("string" == typeof e)
                            for (var n in e) {
                                c -= 36e5;
                                var r = e.charCodeAt(n);
                                r >= 97 ? r -= 97 : r = -(r - 65) - 1, s.push({
                                    t: c,
                                    v: r / u,
                                    s: 1
                                })
                            } else "number" == typeof e ? (c -= 36e5, s.push({
                                t: c,
                                v: e / u,
                                s: 1
                            })) : (c -= 36e5 * e[0], s.push({
                                t: c,
                                v: e[1] / u,
                                s: e[0]
                            }))
                    });
                    var a = 0;
                    s.forEach(function (e) {
                        e.v += a, a = e.v
                    }), t[o] = s
                }
                return t
            }
            t.__esModule = !0, t.decodeFeed = function (e) {
                for (var t = 0, n = e.rxs.obs; t < n.length; t++) {
                    var o = n[t];
                    if ("ok" == o.status) {
                        var i = o.msg,
                            s = r(i.iaqi);
                        if (console.log("time:", formatFullDate(i.timestamp * 1000, 'en'), i.time), i.historic = s, "string" == typeof i.time.v) {
                            var c = i.time.v.split(/[^0-9]/),
                                u = new Date(c[0], c[1] - 1 || 0, c[2] || 1, c[3] || 0, c[4] || 0, c[5] || 0, c[6] || 0);
                            i.time.v = u.getTime()
                        }
                        return i.city.url = i.city.url.replace("http://", "https://"), i
                    }
                }
                return null
            }
        }]);