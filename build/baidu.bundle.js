! function (t) {
    var e = {};

    function n(r) {
        if (e[r]) return e[r].exports;
        var i = e[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return t[r].call(i.exports, i, i.exports, n), i.l = !0, i.exports
    }
    n.m = t, n.c = e, n.d = function (t, e, r) {
        n.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: r
        })
    }, n.r = function (t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, n.t = function (t, e) {
        if (1 & e && (t = n(t)), 8 & e) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var r = Object.create(null);
        if (n.r(r), Object.defineProperty(r, "default", {
            enumerable: !0,
            value: t
        }), 2 & e && "string" != typeof t)
            for (var i in t) n.d(r, i, function (e) {
                return t[e]
            }.bind(null, i));
        return r
    }, n.n = function (t) {
        var e = t && t.__esModule ? function () {
            return t.default
        } : function () {
            return t
        };
        return n.d(e, "a", e), e
    }, n.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, n.p = "", n(n.s = 12)
}([function (t, e, n) {
    "use strict";
    e.__esModule = !0;
    var i = function () {
        function t() { }
        return t.prototype.getAqiText = function (t, e) {
            console.log("getAqiText(" + t + "," + e + ")");
            var n = function (t) {
                return "-" == t ? 0 : t <= 50 ? 1 : t <= 100 ? 2 : t <= 150 ? 3 : t <= 200 ? 4 : t <= 300 ? 5 : 6
            },
                r = "aqivalues" + e,
                i = chrome.i18n.getMessage(r).split(",");
            return console.log("labels:", r, "->", i), i[n(t = i[n(t)])].trim()
        }, t.prototype.getText = function (t, e) {
            var n = {
                air_quality: {
                    en: "Air Quality",
                    cn: "空气质量",
                    hk: "空氣質量",
                    jp: "空気質",
                    kr: "대기질",
                    es: "Calidad del aire",
                    ru: "Внешний вид"
                }
            };
            return void 0 !== n[t] ? void 0 !== n[t][e] ? n[t][e] : n[t].en : "???"
        }, t.prototype.getTitle = function (t) {
            return t.city.name + this.getText("air_quality", t.clang)
        }, t.prototype.getShortTitle = function (t) {
            return t.city.name + " AQI"
        }, t
    }();
    e.aqiLang = new i;
    var o = function () {
        function t() { }
        return t.prototype.cityObject = function () {
            return new Promise(function (t) {
                chrome.runtime.sendMessage({
                    method: "getSelectedCity"
                }, function (e) {
                    t(e)
                })
            })
        }, t.prototype.setCityObject = function (t) {
            chrome.runtime.sendMessage({
                method: "setSelectedCity",
                city: t
            }, function (t) { })
        }, t.prototype.updateAQI = function (t) {
            if (t) return t.forecast && (void 0 !== t.forecast[t.clang] ? t.weather = t.forecast[t.clang] : t.weather = t.forecast.en), void 0 !== t["info" + t.clang] && (t.info = t["info" + t.clang]), "hk" == t.clang && void 0 !== t.infocn && (t.info = t.infocn), void 0 !== t["utime" + t.clang] && (t.utime = t["utime" + t.clang]), "hk" == t.clang && void 0 !== t.utimecn && (t.utime = t.utimecn), "cn" == t.clang || "hk" == t.clang || "jp" == t.clang || "ru" == t.clang || "es" == t.clang || "kr" == t.clang ? t.name = t.namena : t.name = t.nameen, t
        }, t.prototype.updateFeed = function (t) {
            return t
        }, t.prototype.updateData = function (t, e) {
            return "Aqi" == t ? this.updateAQI(e) : e
        }, t.prototype.checkOption = function (t) {
            return new Promise(function (e) {
                chrome.runtime.sendMessage({
                    method: "checkOption",
                    opt: t
                }, function (t) {
                    e(t)
                })
            })
        }, t.prototype.onFeedUpdate = function (t) {
            this.onDataUpdate("Feed", t)
        }, t.prototype.onDataUpdate = function (t, e) {
            var n = this,
                r = "on" + t + "Update";
            chrome.runtime.onMessage.addListener(function (i, o, a) {
                i.method == r ? e(n.updateData(t, i.aqi)) : console.log("Received unknown message:", i.method)
            }), chrome.runtime.sendMessage({
                method: "load" + t
            }, function (r) {
                e(n.updateData(t, r))
            })
        }, t
    }();
    e.AqiSettings = o
}, function (t, e, n) {
    "use strict";
    e.__esModule = !0;
    var r = function () {
        function t(t) {
            t && "string" == typeof t && "#" == t[0] ? this.node = document.getElementById(t.substr(1)) : t && "object" == typeof t && 1 == t.nodeType ? this.node = t : t && console.log("s3: Creating from unknown object", t)
        }
        return t.prototype.c = function (e, n, r, i) {
            var o;
            if (void 0 === n && (n = null), void 0 === r && (r = null), void 0 === i && (i = null), n && "string" != typeof n && (i = r, r = n, n = null), o = "svg:" == e.substr(0, 4) ? document.createElementNS("http://www.w3.org/2000/svg", e.substr(4)) : document.createElement(e), n && (o.className = n), r)
                for (var a in r) o.style[a] = r[a];
            return i && (o.innerHTML = i), this.node && this.node.appendChild(o), new t(o)
        }, t.prototype.a = function (t) {
            for (var e in t) this.node.setAttribute(e, t[e]);
            return this
        }, t.prototype.i = function (t) {
            return t.node ? this.node.appendChild(t.node) : (console.log("i:", "trying to insert a non-existant node", t), window.sdlkfjslk()), this
        }, t.prototype.t = function (t) {
            if ("string" == typeof t) {
                var e = document.createTextNode(t);
                this.node.appendChild(e)
            }
            return this
        }, t.prototype.empty = function () {
            for (; this.node && this.node.firstChild;) this.node.firstChild.remove();
            return this
        }, t.prototype.up = function () {
            return this.node = this.node.parent(), this
        }, t
    }();
    e.S3 = r, e.s3 = function (t) {
        return void 0 === t && (t = null), new r(t)
    }
}, , function (t, e) {
}, function (e, t) {
    var n = (typeof globalThis !== 'undefined') ? globalThis :
        (typeof self !== 'undefined') ? self :
            (typeof window !== 'undefined') ? window :
                (typeof global !== 'undefined') ? global :
                    {};
    e.exports = n;
}, function (t, e, n) {
    "use strict";
    e.__esModule = !0;
    var r = n(0),
        i = n(1);

    function o(t) {
        return "-" != t && t ? t <= 50 ? "#009966" : t <= 100 ? "#ffde33" : t <= 150 ? "#ff9933" : t <= 200 ? "#cc0033" : t <= 300 ? "#660099" : "#7e0023" : "#aaaaaa"
    }

    function a(t) {
        return "-" != t && t ? t <= 50 ? "#ffffff" : t <= 100 ? "#000000" : t <= 150 ? "#000000" : "#ffffff" : "#eeeeee"
    }
    e.bgcolor = o, e.fgcolor = a, e.getWidget = function (t, e) {
        var u = t.rtsettings.design,
            c = t.rtsettings.lang;
        var locale_id;
        "cn" == c ? c = "zh-CN" : "hk" == c ? c = "zh-TW" : "jp" == c ? c = "ja" : "ru" == c ? c = "ru" : "es" == c ? c = "es" : "kr" == c && (c = "ko"), locale_id = c;
        var s = r.aqiLang.getShortTitle(t),
            l = i.s3().c("div", {
                fontSize: "13px"
            });
        l.c("img", {
            verticalAlign: "text-top"
        }).a({
            src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAABXElEQVQokZ2Tu0pDQRCGvzlZYqJRUEKMGgQJ2Ild7G2Sylax1cYX8BEsVQRLfQpLS228NcEiEFRMQI2XxCORg5ozFmsuGA+of7HMzs6//+zMrGS3lm6ApAio8hdUjIgkmztpLT9AO86snTAL6ec/yXVC3gtZbet25u2AhEG9QLJpx7eJEpvFSSyDGQDvisbtOrxddCu7O1ntfIwMTdI3t4E4IetRResP1PdWoeGhXhURaSoLqorExjDjGczIdIsI2MC+OLH5XQDeC/t4h5sIPqZ09EEklSK1soaEozbAdYOLNDqD62dwTw4w5eMPhuNpaufF7shme7616akU5u6kgfEJ8XJZpucsH6j2/b5qvkBDHWRxalslJIxODNLb3xM4I83i1R5fuS+7oFhl9ZXrYg3HkeAJw46v+goSQlBMLnr6q3R/gslF/k92gIr9EDZfOwCCiCC07ZbvywYqnwLPdpYyuPVQAAAAAElFTkSuQmCC"
        }), l.c("span", "waqi-widget-title").t(s), e && "tiny" != u || l.c("span", {
            color: "#aaa",
            padding: "0 3px 0 0"
        }).c("small").t(getHour12AMPM(t.time.v));
        var f = {
            minWidth: "20px",
            textAlign: "center",
            backgroundColor: o(t.aqi),
            color: a(t.aqi)
        };
        return e && (f.float = "right"), l.c("span", "waqi-widget-aqi", f).c("span").t(t.aqi.toString()), e && ("tiny" != u && (l.c("div", {
            color: "#aaa",
            marginTop: "3px"
        }).c("small").t(formatFullDate(t.time.v, 'en', false)), "small" != u && (l.c("div", {
            borderTop: "1px solid #ccc",
            paddingTop: "5px"
        }), "forecast" != u && l.i(function (t, e) {
            void 0 === e && (e = 24);
            var n = "iaqi" == t.rtsettings.design,
                r = n ? 30 : 20,
                a = i.s3().c("svg:svg", {
                    margin: 0,
                    padding: 0,
                    borderBottom: "1px solid #eee",
                    height: 18 * (n ? 3 : 1) + 12 + "px",
                    width: 120 + r + "px"
                });
            try {
                for (var u = 24 - new Date(t.time.v).getHours(), c = 0, s = {}, l = ["PM2.5", "PM10", "O3", "time"], f = 0; f < l.length; f++) {
                    for (var d = null, h = null, p = l[f].replace(".", "").toLowerCase(), v = 0; v < e; v++) {
                        var m = e - v - 1;
                        if (t.historic[p] && t.historic[p][m]) {
                            var g = t.historic[p][m].v;
                            (null == d || d > g) && (d = g), (null == h || h < g) && (h = g), t[m] ? t[m].v = Math.max(t[m].v, g) : t[m] = {
                                v: g
                            }
                        }
                    }
                    s[p] = {
                        min: d,
                        max: h
                    }, s.aqi || (s.aqi = {
                        min: d,
                        max: h
                    }), s.aqi.min > d && (s.aqi.min = d), s.aqi.max < h && (s.aqi.max = h)
                }
                for (t.historic.aqi = t, n || (l = ["AQI", "time"]), f = 0; f < l.length; f++) {
                    p = l[f].replace(".", "").toLowerCase();
                    var y = l[f];
                    for ("time" != y && a.c("svg:text", {
                        fontFamily: "sans-serif",
                        fontSize: 9
                    }).a({
                        x: 0,
                        y: c + 18 - 2
                    }).t(y), v = 0; v < e; v++) {
                        var w = v - u + e;
                        w < 24 && (w += 24), w > 24 && (w -= 24), 24 == w && (w = 0), m = e - v - 1;
                        var b = 120 / e,
                            _ = r + b * v;
                        if ("time" == p) (6 == w || 12 == w || 0 == w || 18 == w) && (a.c("svg:rect", {
                            fill: "#888"
                        }).a({
                            x: _,
                            y: 0,
                            width: .5,
                            height: 18 * (l.length - 1) + 2
                        }), a.c("svg:text", {
                            fontFamily: "sans-serif",
                            fontSize: 8,
                            textAnchor: "middle",
                            fill: "#bbb"
                        }).a({
                            x: _,
                            y: c + 18 - 8
                        }).t(w.toString()));
                        else if (t.historic[p] && t.historic[p][m]) {
                            var A = t.historic[p][m].v,
                                x = s[p],
                                q = (d = x.min, 15 * (A - (d = 0)) / ((h = x.max) - d)),
                                T = o(A);
                            a.c("svg:rect", {
                                fill: T
                            }).a({
                                x: _,
                                y: c + 18 - q,
                                width: b - .5,
                                height: q
                            })
                        }
                    }
                    c += 18
                }
            } catch (t) {
                console.log("Error " + t)
            }
            return a
        }(t)), l.c("center").i(function (t) {
            var e = [],
                n = {},
                r = new Date;
            r.setHours(0), t.forecast.aqi.forEach(function (t) {
                var i = t.t.split(/[^0-9]/),
                    o = new Date(i[0], i[1] - 1 || 0, i[2] || 1, i[3] || 0, i[4] || 0, i[5] || 0, i[6] || 0);
                if (!(o.getTime() < r.getTime())) {
                    var a = "D" + formatYMD(o);
                    if (e.indexOf(a) < 0 && (e.push(a), n[a] = {
                        date: o
                    }), o.getHours() >= 7 && o.getHours() <= 21) {
                        var u = t;
                        if (!(u = u.v.pm25 ? u.v.pm25 : u.v).o3) {
                            var c = u[0],
                                s = u[1];
                            n[a].aqi = n[a].aqi || {
                                min: c,
                                max: s,
                                count: 0,
                                avg: 0
                            }, n[a].aqi.min = Math.min(n[a].aqi.min, c), n[a].aqi.max = Math.max(n[a].aqi.max, s), n[a].aqi.avg += (c + s) / 2, n[a].aqi.count += 1
                        }
                    }
                }
            });
            var u = i.s3().c("div");
            return e.sort(), e.slice(0, 4).forEach(function (t, e) {
                if (n[t].aqi && 0 != n[t].aqi.count) {
                    n[t].aqi && n[t].aqi.min, n[t].aqi && n[t].aqi.max;
                    var r = n[t].aqi ? n[t].aqi.avg / n[t].aqi.count : "-",
                        i = formatShortWeekday(n[t].date, locale_id);
                    u.c("div", {
                        display: "inline-block"
                    }).c("div", "waqi-forecast-day-aqi", {
                        fontSize: "10px",
                        backgroundColor: o(r),
                        color: a(r) + "cc"
                    }).t(i)
                }
            }), u
        }(t)))), l = i.s3().c("div", "waqi-widget-outer").i(l)), l
    }
}, , , , , , , function (t, e, n) {
    "use strict";
    e.__esModule = !0;
    var r = n(0),
        i = n(5),
        o = n(1);
    ! function () {
        function t(t, e) {
            if (null != t) {
                var n = i.getWidget(t, !e),
                    r = "waqi-widget-" + (e ? "small" : "large");
                n = o.s3().c("div", r).i(n);
                var a = "waqi-baidu-tile",
                    u = document.getElementById(a);
                u || (u = document.createElement("div"), document.body.insertBefore(u, document.body.firstChild), u.id = a), o.s3(u).empty().i(n), u.onclick = function () {
                    location.assign(t.city.url)
                }
            }
        }
        var e = new r.AqiSettings;
        e.checkOption("baidu").then(function (n) {
            if (n) {
                var r = document.getElementById("kw");
                if (null != r) {
                    var i = null,
                        o = "" != r.value;
                    r.onkeyup = function () {
                        o = o || "" != r.value, t(i, o)
                    }, e.onFeedUpdate(function (e) {
                        t(e, o), i = e
                    })
                }
            }
        })
    }()
}]);