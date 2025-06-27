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
            var n, r, o = e.exports = {};

            function i() {
                throw new Error("setTimeout has not been defined")
            }

            function s() {
                throw new Error("clearTimeout has not been defined")
            }

            function c(e) {
                if (n === setTimeout) return setTimeout(e, 0);
                if ((n === i || !n) && setTimeout) return n = setTimeout, setTimeout(e, 0);
                try {
                    return n(e, 0)
                } catch (t) {
                    try {
                        return n.call(null, e, 0)
                    } catch (t) {
                        return n.call(this, e, 0)
                    }
                }
            } ! function () {
                try {
                    n = "function" == typeof setTimeout ? setTimeout : i
                } catch (e) {
                    n = i
                }
                try {
                    r = "function" == typeof clearTimeout ? clearTimeout : s
                } catch (e) {
                    r = s
                }
            }();
            var u, a = [],
                l = !1,
                f = -1;

            function d() {
                l && u && (l = !1, u.length ? a = u.concat(a) : f = -1, a.length && h())
            }

            function h() {
                if (!l) {
                    var e = c(d);
                    l = !0;
                    for (var t = a.length; t;) {
                        for (u = a, a = []; ++f < t;) u && u[f].run();
                        f = -1, t = a.length
                    }
                    u = null, l = !1,
                        function (e) {
                            if (r === clearTimeout) return clearTimeout(e);
                            if ((r === s || !r) && clearTimeout) return r = clearTimeout, clearTimeout(e);
                            try {
                                r(e)
                            } catch (t) {
                                try {
                                    return r.call(null, e)
                                } catch (t) {
                                    return r.call(this, e)
                                }
                            }
                        }(e)
                }
            }

            function g(e, t) {
                this.fun = e, this.array = t
            }

            function p() { }
            o.nextTick = function (e) {
                var t = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
                a.push(new g(e, t)), 1 !== a.length || l || c(h)
            }, g.prototype.run = function () {
                this.fun.apply(null, this.array)
            }, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = p, o.addListener = p, o.once = p, o.off = p, o.removeListener = p, o.removeAllListeners = p, o.emit = p, o.prependListener = p, o.prependOnceListener = p, o.listeners = function (e) {
                return []
            }, o.binding = function (e) {
                throw new Error("process.binding is not supported")
            }, o.cwd = function () {
                return "/"
            }, o.chdir = function (e) {
                throw new Error("process.chdir is not supported")
            }, o.umask = function () {
                return 0
            }
        },
        function (e, t) {
            var n;
            n = function () {
                return this
            }();
            try {
                n = n || Function("return this")() || (0, eval)("this")
            } catch (e) {
                "object" == typeof window && (n = window)
            }
            e.exports = n
        }, , ,
        function (module, exports, __webpack_require__) {
            "use strict";
            exports.__esModule = !0;
            var decoder_1 = __webpack_require__(8),
                Background = function () {
                    function Background() {
                        var e = this;
                        this.timeout = null, console.log("----- background ------- starting! -----"), chrome.tabs.onUpdated.addListener(function () {
                            e.loader()
                        }), this.loader()
                    }
                    return Background.prototype.loadJSON = function (dname) {
                        return new Promise(function (resolve, reject) {
                            var xhttp;
                            xhttp = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"), xhttp.open("GET", dname), xhttp.onload = function () {
                                var obj;
                                try {
                                    obj = eval("(" + xhttp.response + ")")
                                } catch (e) {
                                    return void reject(e)
                                }
                                resolve(obj)
                            }, xhttp.onerror = function (e) {
                                reject(e)
                            }, xhttp.send()
                        })
                    }, Background.prototype.getCityObject = function () {
                        try {
                            var obj = localStorage.selectedCity;
                            if (obj) {
                                var o = eval("(" + obj + ")");
                                return o.clang = this.getLang(), o
                            }
                        } catch (e) {
                            console.log("getCityObject -> error " + e)
                        }
                        return console.log("getCityObject -> null"), null
                    }, Background.prototype.setIcon = function (e) {
                        if (console.log("Set Icon:", e), null != e) {
                            var t = "../img/aqicons/aqi." + e.aqi + ".png";
                            console.log("Setting icon " + t), chrome.browserAction.setIcon({
                                path: t
                            })
                        } else console.log("Data is null in the local storage!")
                    }, Background.prototype.loadFeed = function (e) {
                        var t = this;
                        void 0 === e && (e = !1);
                        var n = localStorage.FeedTime,
                            r = Math.abs(n - Date.now());
                        if (!e && r < 6e4) console.log("Using cached data");
                        else {
                            var o = this.getCityObject();
                            if (null != o) {
                                var i = "http://api.waqi.info/api/feed/";
                                o.idx ? i += "@" + o.idx : i += "!" + o.key, i += "/obs." + this.getLang() + ".json", console.log("Loading " + i + " (dt=" + r + ") - type=", o), i += "?_t=" + (new Date).getTime(), i += "&from=chrome-extension", this.loadJSON(i).then(function (e) {
                                    if (null != e) {
                                        console.log("Loaded!");
                                        try {
                                            var n = decoder_1.decodeFeed(e);
                                            localStorage.FeedData = JSON.stringify(n), localStorage.FeedTime = Date.now(), t.setIcon(n), n.rtsettings = {
                                                design: t.getDesign(),
                                                lang: t.getLang()
                                            };
                                            chrome.runtime.sendMessage({
                                                method: "onFeedUpdate",
                                                aqi: n
                                            }), chrome.tabs.getSelected(null, function (e) {
                                                e.id >= 0 ? (console.log("Sending to tab", e), chrome.tabs.sendMessage(e.id, {
                                                    method: "onFeedUpdate",
                                                    aqi: n
                                                })) : console.log("Not sending to tab (none active)")
                                            })
                                        } catch (e) {
                                            console.log("Oops, error with feed: ", e)
                                        }
                                    } else console.log("Loading error!")
                                })
                            } else console.log("Can not get the city Object!")
                        }
                    }, Background.prototype.saveOptions = function (e) {
                        var t = {};
                        return ["optcheckedbaidu", "optcheckedbing", "optcheckedgoogle", "optcheckedqwant", "lang"].forEach(function (n) {
                            var r = e[n];
                            void 0 === r && (r = "true"), r = "true" == r, t.opt = r, localStorage[n] = r
                        }), t
                    }, Background.prototype.getLang = function () {
                        var e = localStorage.lang;
                        return void 0 === e && (e = "zh-CN" == (e = chrome.i18n.getUILanguage()) ? "cn" : "zh-HK" == e ? "hk" : "zh-TW" == e ? "hk" : "ja" == e ? "jp" : "ko" == e ? "kr" : "en"), ["kr", "jp", "hk", "cn"].indexOf(e) < 0 && (e = "en"), console.log("getLang() -> " + e + " (" + chrome.i18n.getUILanguage() + ")"), e
                    }, Background.prototype.setLang = function (e) {
                        return localStorage.lang = e, localStorage.lang
                    }, Background.prototype.getDesign = function () {
                        var e = localStorage.design || "aqi";
                        return ["tiny", "small", "forecast", "aqi", "iaqi"].indexOf(e) < 0 && (e = "aqi"), e
                    }, Background.prototype.setDesign = function (e) {
                        return localStorage.design = e, localStorage.design
                    }, Background.prototype.checkOption = function (e) {
                        var t = localStorage["optchecked" + e];
                        return console.log("checkOption", e, ":", t), console.log("checkOption", e, ":", typeof t), void 0 === t && (console.log("checkOption", e, ":", "It is undefined!"), t = "true"), console.log("checkOption", e, ":", "true" == t ? "checked" : "unchecked"), "true" == t
                    }, Background.prototype.loader = function (e) {
                        var t = this;
                        void 0 === e && (e = 0), console.log("AQI feed loader - count = " + e), this.timeout && clearTimeout(this.timeout), this.loadFeed(0 == e), e > 300 || (this.timeout = setTimeout(function () {
                            t.timeout = null, t.loader(e + 1)
                        }, 6e4))
                    }, Background
                }(),
                background = new Background;
            chrome.runtime && chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                if (console.log("received Message ", request.method, " from the UI"), "getSelectedCity" == request.method) sendResponse(background.getCityObject());
                else if ("setSelectedCity" == request.method) localStorage.selectedCity = JSON.stringify(request.city), background.loadFeed(!0);
                else if ("loadFeed" == request.method) {
                    var aqi = localStorage.FeedData;
                    aqi = eval("(" + aqi + ")"), null != aqi && (aqi.rtsettings = {
                        lang: background.getLang(),
                        design: background.getDesign()
                    }, sendResponse(aqi)), background.loadFeed()
                } else "setLang" == request.method ? (sendResponse(background.setLang(request.lang)), background.loadFeed(!0)) : "setDesign" == request.method ? (sendResponse(background.setDesign(request.design)), background.loadFeed(!0)) : "saveOptions" == request.method ? (sendResponse(background.saveOptions(request.options)), background.loadFeed(!0)) : "checkOption" == request.method ? (sendResponse(background.checkOption(request.opt)), background.loadFeed(!0)) : sendResponse({})
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
                        if (console.log("time:", moment(1e3 * i.timestamp).format("LLLL"), i.time), i.historic = s, "string" == typeof i.time.v) {
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