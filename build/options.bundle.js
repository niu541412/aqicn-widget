! function (t) {
    var e = {};

    function n(i) {
        if (e[i]) return e[i].exports;
        var o = e[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return t[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }
    n.m = t, n.c = e, n.d = function (t, e, i) {
        n.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: i
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
        var i = Object.create(null);
        if (n.r(i), Object.defineProperty(i, "default", {
            enumerable: !0,
            value: t
        }), 2 & e && "string" != typeof t)
            for (var o in t) n.d(i, o, function (e) {
                return t[e]
            }.bind(null, o));
        return i
    }, n.n = function (t) {
        var e = t && t.__esModule ? function () {
            return t.default
        } : function () {
            return t
        };
        return n.d(e, "a", e), e
    }, n.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, n.p = "", n(n.s = 10)
}([function (t, e, n) {
    "use strict";
    e.__esModule = !0;
    var o = function () {
        function t() { }
        return t.prototype.getAqiText = function (t, e) {
            console.log("getAqiText(" + t + "," + e + ")");
            var n = function (t) {
                return "-" == t ? 0 : t <= 50 ? 1 : t <= 100 ? 2 : t <= 150 ? 3 : t <= 200 ? 4 : t <= 300 ? 5 : 6
            },
                i = "aqivalues" + e,
                o = chrome.i18n.getMessage(i).split(",");
            return console.log("labels:", i, "->", o), o[n(t = o[n(t)])].trim()
        }, t.prototype.getText = function (t, e) {
            var n = {
                air_quality: {
                    en: " Air Quality",
                    cn: "空气污染",
                    hk: "空氣污染",
                    jp: "大気汚染",
                    kr: "대기 오염"
                }
            };
            return void 0 !== n[t] ? void 0 !== n[t][e] ? n[t][e] : n[t].en : "???"
        }, t.prototype.getTitle = function (t) {
            return t.city.name + this.getText("air_quality", t.clang)
        }, t.prototype.getShortTitle = function (t) {
            return t.city.name + " AQI"
        }, t
    }();
    e.aqiLang = new o;
    var r = function () {
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
            if (t) return t.forecast && (void 0 !== t.forecast[t.clang] ? t.weather = t.forecast[t.clang] : t.weather = t.forecast.en), void 0 !== t["info" + t.clang] && (t.info = t["info" + t.clang]), "hk" == t.clang && void 0 !== t.infocn && (t.info = t.infocn), void 0 !== t["utime" + t.clang] && (t.utime = t["utime" + t.clang]), "hk" == t.clang && void 0 !== t.utimecn && (t.utime = t.utimecn), "cn" == t.clang || "hk" == t.clang || "jp" == t.clang || "kr" == t.clang ? t.name = t.namena : t.name = t.nameen, t
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
                i = "on" + t + "Update";
            chrome.runtime.onMessage.addListener(function (o, r, a) {
                o.method == i ? e(n.updateData(t, o.aqi)) : console.log("Received unknown message:", o.method)
            }), chrome.runtime.sendMessage({
                method: "load" + t
            }, function (i) {
                e(n.updateData(t, i))
            })
        }, t
    }();
    e.AqiSettings = r
}, function (t, e, n) {
    "use strict";
    e.__esModule = !0;
    var i = function () {
        function t(t) {
            t && "string" == typeof t && "#" == t[0] ? this.node = document.getElementById(t.substr(1)) : t && "object" == typeof t && 1 == t.nodeType ? this.node = t : t && console.log("s3: Creating from unknown object", t)
        }
        return t.prototype.c = function (e, n, i, o) {
            var r;
            if (void 0 === n && (n = null), void 0 === i && (i = null), void 0 === o && (o = null), n && "string" != typeof n && (o = i, i = n, n = null), r = "svg:" == e.substr(0, 4) ? document.createElementNS("http://www.w3.org/2000/svg", e.substr(4)) : document.createElement(e), n && (r.className = n), i)
                for (var a in i) r.style[a] = i[a];
            return o && (r.innerHTML = o), this.node && this.node.appendChild(r), new t(r)
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
    e.S3 = i, e.s3 = function (t) {
        return void 0 === t && (t = null), new i(t)
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
    // useless in option.js
    "use strict";
    e.__esModule = !0;
    var i = n(0),
        o = n(1);

    function r(t) {
        return "-" != t && t ? t <= 50 ? "#009966" : t <= 100 ? "#ffde33" : t <= 150 ? "#ff9933" : t <= 200 ? "#cc0033" : t <= 300 ? "#660099" : "#7e0023" : "#aaaaaa"
    }

    function a(t) {
        return "-" != t && t ? t <= 50 ? "#ffffff" : t <= 100 ? "#000000" : t <= 150 ? "#000000" : "#ffffff" : "#eeeeee"
    }
    e.bgcolor = r, e.fgcolor = a
        , e.getWidget = function (t, e) {
            var c = t.rtsettings.design,
                s = t.rtsettings.lang;
            var locale_id;
            "cn" == s ? s = "zh-CN" : "hk" == s ? s = "zh-TW" : "jp" == s ? s = "ja" : "kr" == s && (s = "ko"), locale_id = s;
            var u = i.aqiLang.getShortTitle(t),
                l = o.s3().c("div", {
                    fontSize: "13px"
                });
            l.c("img", {
                verticalAlign: "text-top"
            }).a({
                src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAABXElEQVQokZ2Tu0pDQRCGvzlZYqJRUEKMGgQJ2Ild7G2Sylax1cYX8BEsVQRLfQpLS228NcEiEFRMQI2XxCORg5ozFmsuGA+of7HMzs6//+zMrGS3lm6ApAio8hdUjIgkmztpLT9AO86snTAL6ec/yXVC3gtZbet25u2AhEG9QLJpx7eJEpvFSSyDGQDvisbtOrxddCu7O1ntfIwMTdI3t4E4IetRResP1PdWoeGhXhURaSoLqorExjDjGczIdIsI2MC+OLH5XQDeC/t4h5sIPqZ09EEklSK1soaEozbAdYOLNDqD62dwTw4w5eMPhuNpaufF7shme7616akU5u6kgfEJ8XJZpucsH6j2/b5qvkBDHWRxalslJIxODNLb3xM4I83i1R5fuS+7oFhl9ZXrYg3HkeAJw46v+goSQlBMLnr6q3R/gslF/k92gIr9EDZfOwCCiCC07ZbvywYqnwLPdpYyuPVQAAAAAElFTkSuQmCC"
            }), l.c("span", "waqi-widget-title").t(u), e && "tiny" != c || l.c("span", {
                color: "#aaa",
                padding: "0 3px 0 0"
            }).c("small").t(getHour12AMPM(t.time.v));
            var f = {
                minWidth: "20px",
                textAlign: "center",
                backgroundColor: r(t.aqi),
                color: a(t.aqi)
            };
            return e && (f.float = "right"), l.c("span", "waqi-widget-aqi", f).c("span").t(t.aqi.toString()), e && ("tiny" != c && (l.c("div", {
                color: "#aaa",
                marginTop: "3px"
            }).c("small").t(formatFullDate(t.time.v, 'en', false)), "small" != c && (l.c("div", {
                borderTop: "1px solid #ccc",
                paddingTop: "5px"
            }), "forecast" != c && l.i(function (t, e) {
                void 0 === e && (e = 24);
                var n = "iaqi" == t.rtsettings.design,
                    i = n ? 30 : 20,
                    a = o.s3().c("svg:svg", {
                        margin: 0,
                        padding: 0,
                        borderBottom: "1px solid #eee",
                        height: 18 * (n ? 3 : 1) + 12 + "px",
                        width: 120 + i + "px"
                    });
                try {
                    for (var c = 24 - new Date(t.time.v).getHours(), s = 0, u = {}, l = ["PM2.5", "PM10", "O3", "time"], f = 0; f < l.length; f++) {
                        for (var d = null, h = null, m = l[f].replace(".", "").toLowerCase(), g = 0; g < e; g++) {
                            var p = e - g - 1;
                            if (t.historic[m] && t.historic[m][p]) {
                                var v = t.historic[m][p].v;
                                (null == d || d > v) && (d = v), (null == h || h < v) && (h = v), t[p] ? t[p].v = Math.max(t[p].v, v) : t[p] = {
                                    v: v
                                }
                            }
                        }
                        u[m] = {
                            min: d,
                            max: h
                        }, u.aqi || (u.aqi = {
                            min: d,
                            max: h
                        }), u.aqi.min > d && (u.aqi.min = d), u.aqi.max < h && (u.aqi.max = h)
                    }
                    for (t.historic.aqi = t, n || (l = ["AQI", "time"]), f = 0; f < l.length; f++) {
                        m = l[f].replace(".", "").toLowerCase();
                        var y = l[f];
                        for ("time" != y && a.c("svg:text", {
                            fontFamily: "sans-serif",
                            fontSize: 9
                        }).a({
                            x: 0,
                            y: s + 18 - 2
                        }).t(y), g = 0; g < e; g++) {
                            var w = g - c + e;
                            w < 24 && (w += 24), w > 24 && (w -= 24), 24 == w && (w = 0), p = e - g - 1;
                            var _ = 120 / e,
                                b = i + _ * g;
                            if ("time" == m) (6 == w || 12 == w || 0 == w || 18 == w) && (a.c("svg:rect", {
                                fill: "#888"
                            }).a({
                                x: b,
                                y: 0,
                                width: .5,
                                height: 18 * (l.length - 1) + 2
                            }), a.c("svg:text", {
                                fontFamily: "sans-serif",
                                fontSize: 8,
                                textAnchor: "middle",
                                fill: "#bbb"
                            }).a({
                                x: b,
                                y: s + 18 - 8
                            }).t(w.toString()));
                            else if (t.historic[m] && t.historic[m][p]) {
                                var q = t.historic[m][p].v,
                                    x = u[m],
                                    A = (d = x.min, 15 * (q - (d = 0)) / ((h = x.max) - d)),
                                    S = r(q);
                                a.c("svg:rect", {
                                    fill: S
                                }).a({
                                    x: b,
                                    y: s + 18 - A,
                                    width: _ - .5,
                                    height: A
                                })
                            }
                        }
                        s += 18
                    }
                } catch (t) {
                    console.log("Error " + t)
                }
                return a
            }(t)), l.c("center").i(function (t) {
                var e = [],
                    n = {},
                    i = new Date;
                i.setHours(0), t.forecast.aqi.forEach(function (t) {
                    var o = t.t.split(/[^0-9]/),
                        r = new Date(o[0], o[1] - 1 || 0, o[2] || 1, o[3] || 0, o[4] || 0, o[5] || 0, o[6] || 0);
                    if (!(r.getTime() < i.getTime())) {
                        var a = "D" + formatYMD(r);
                        if (e.indexOf(a) < 0 && (e.push(a), n[a] = {
                            date: r
                        }), r.getHours() >= 7 && r.getHours() <= 21) {
                            var c = t;
                            if (!(c = c.v.pm25 ? c.v.pm25 : c.v).o3) {
                                var s = c[0],
                                    u = c[1];
                                n[a].aqi = n[a].aqi || {
                                    min: s,
                                    max: u,
                                    count: 0,
                                    avg: 0
                                }, n[a].aqi.min = Math.min(n[a].aqi.min, s), n[a].aqi.max = Math.max(n[a].aqi.max, u), n[a].aqi.avg += (s + u) / 2, n[a].aqi.count += 1
                            }
                        }
                    }
                });
                var c = o.s3().c("div");
                return e.sort(), e.slice(0, 4).forEach(function (t, e) {
                    if (n[t].aqi && 0 != n[t].aqi.count) {
                        n[t].aqi && n[t].aqi.min, n[t].aqi && n[t].aqi.max;
                        var i = n[t].aqi ? n[t].aqi.avg / n[t].aqi.count : "-",
                            o = formatShortWeekday(n[t].date, locale_id);
                        c.c("div", {
                            display: "inline-block"
                        }).c("div", "waqi-forecast-day-aqi", {
                            fontSize: "10px",
                            backgroundColor: r(i),
                            color: a(i) + "cc"
                        }).t(o)
                    }
                }), c
            }(t)))), l = o.s3().c("div", "waqi-widget-outer").i(l)), l
        }
}
    , function (t, e, n) {
        "use strict";
        e.__esModule = !0;
        var i = n(0),
            o = n(5),
            r = function () {
                function t() {
                    var t = this;
                    this.aqiSettings = new i.AqiSettings;
                    this.clearResultsTimer = null;
                    var e = document.getElementById("searchresults");
                    if (e) e.style.display = "none";
                    var n = document.getElementById("cityaqiwidget");
                    if (n) n.style.display = "none";
                    this.aqiSettings.cityObject().then(function (e) {
                        if (e) {
                            var n = document.getElementById("selectedcitytitle");
                            if (n) n.innerHTML = e.name;
                            var i = document.getElementById("selectedcity");
                            if (i) i.innerHTML = chrome.i18n.getMessage("search_selected_city") + " <b> " + e.name;
                            var o = document.getElementById("cityinput");
                            if (o) o.setAttribute("placeholder", chrome.i18n.getMessage("search_select_another"));
                            t.loadWidget();
                        } else {
                            var o = document.getElementById("cityinput");
                            if (o) o.setAttribute("placeholder", chrome.i18n.getMessage("search_enter_city"));
                            var i = document.getElementById("selectedcity");
                            if (i) i.innerHTML = "";
                        }
                    });
                    document.getElementById("cityinput").onkeyup = function () {
                        t.onKeyUp();
                    }
                    t.locateMyself();
                }
                return t.prototype.url = function (t) {
                    var e = "https://aqicn.org/browser-widget/xsearch/places/" + t + "?";
                    return e += "&t=" + Date.now(), e += "&from=chrome-extension"
                }, t.prototype.formatData = function (t, e) {
                    var n = this, i = "<table class='citysearch'>";
                    t.forEach(function (e, n) {
                        e.uid;
                        e.station.url && e.station.url;
                        var r = `${formatShortWeekday(e.time.vtime * 1000, 'en')}, ${getHour12AMPM(e.time.vtime * 1000)}`,
                            a = o.bgcolor(e.aqi),
                            c = o.fgcolor(e.aqi),
                            s = e.aqi,
                            u = e.station.name,
                            l = n != t.length - 1 ? "marker" : "";
                        i += "<tr class='" + l + "' id='cityitem" + n + "' >";
                        i += "<td class='cityentryname'>" + u + "<small> " + r + "</small></span>";
                        i += "<td><span class='cityentryaqitag' style='background-color:" + a + ";color:" + c + "'>" + s + "</span>";
                    });
                    if (t.length == 0) i += "<tr><td class='cityentryname'>" + chrome.i18n.getMessage("search_no_result") + "</td></tr>";
                    i += "</table>";
                    var r = document.getElementById(e);
                    if (r) {
                        r.innerHTML = i;
                        r.style.display = "";
                    }
                    t.forEach(function (t, e) {
                        var i = document.getElementById("cityitem" + e);
                        if (i) i.onclick = function () {
                            var e = {
                                utime: t.time.vtime,
                                name: t.station.name,
                                aqi: t.aqi,
                                idx: t.uid
                            };
                            n.onClick(e);
                        }
                    })
                }, t.prototype.onWidgetLoaded = function (t, e) {
                    console.log("Widget loaded!");
                    var r = document.getElementById("cityaqiwidget");
                    if (r) {
                        r.innerHTML = t.xxl;
                        r.style.display = "";
                    }
                    var n = document.getElementById("selectedcity");
                    if (n) n.innerHTML = "";
                    var o = document.getElementById("aqiwgtmsg");
                    var a = o ? o.innerHTML : "";
                    var c = i.aqiLang.getAqiText(a, e);
                    if (o) o.innerHTML = c;
                }, t.prototype.loadWidget = function () {
                    var t = this;
                    var r = document.getElementById("cityaqiwidget");
                    if (r) {
                        r.innerHTML = "<div style='width:100%'><div class='aqiloader'></div></div>";
                        r.style.display = "";
                    }
                    this.aqiSettings.cityObject().then(function (e) {
                        if (e.key || e.idx) {
                            var n = "https://aqicn.org/webwgt/";
                            n += e.idx ? "@" + e.idx : e.key;
                            n += "/widget.v1.json?" + Date.now();
                            n += "&from=chrome-extension";
                            fetch(n).then(function (t) {
                                return t.json();
                            }).then(function (n) {
                                t.onWidgetLoaded(n, e.clang);
                            }).catch(function (t) {
                                var e = chrome.i18n.getMessage("search_load_error") + "<br>" + t;
                                var o = document.getElementById("cityaqiwidget");
                                if (o) {
                                    o.innerHTML = "<div style='width:100%'>" + e + "</div>";
                                    o.style.display = "";
                                }
                            })
                        } else {
                            var o = document.getElementById("cityaqiwidget");
                            if (o) {
                                o.innerHTML = "Oops.. can not load the widget";
                                o.style.display = "";
                            }
                        }
                    });
                }, t.prototype.onClick = function (t) {
                    this.aqiSettings.setCityObject(t);
                    var e = document.getElementById("selectedcitytitle");
                    if (e) e.innerHTML = t.name;
                    var n = document.getElementById("selectedcity");
                    if (n) n.innerHTML = chrome.i18n.getMessage("search_selected_city") + " <b>" + t.name;
                    this.loadWidget();
                    this.clearResultsTimer && clearTimeout(this.clearResultsTimer);
                    this.clearResultsTimer = setTimeout(function () {
                        var r = document.getElementById("searchresults");
                        if (r) {
                            r.style.transition = "height 0.2s ease";
                            r.style.overflow = "hidden";
                            r.style.height = "0px";
                            setTimeout(function () {
                                r.style.display = "none";
                                r.style.height = "";
                                r.style.transition = "";
                                r.style.overflow = "";
                            }, 200);
                        }
                        var o = document.getElementById("cityinput");
                        if (o) o.value = "";
                    }, 1e3)
                }, t.prototype.onKeyUp = function () {
                    var t = this;
                    this.clearResultsTimer && clearTimeout(this.clearResultsTimer);
                    var e = document.getElementById("cityinput").value;
                    "" != e && null != e && fetch(this.url(e)).then(function (t) {
                        return t.json()
                    }).then(function (e) {
                        document.getElementById("cityinput").className = "", t.formatData(e.results, "searchresults")
                    })
                }, t.prototype.locateMyself = function () {
                    var n = this
                    const locateBtn = document.getElementById("locate-btn");
                    locateBtn.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAatJREFUSEvVVb0yBEEQ7p4n8AgIyRDzAjjB9FxChiqRkhA6IYkSqUJGctsT+LkXcDEyQu4R7gm2mauZqzG3d7elbHCTbG1tb3/d3/d1D0LJY4xpiMixC0fEkyzLGmV+xTJBLmZyAbTWNQDQiLgKAFO+466ItADAWmsfRrEwlKJ6vb6Q5/k5ACyPobGtlDpoNptvRXGFAES0DgChso6IXCJii5k/XBIimhORVUTcA4Bpn7jGzI8pyACAr/zVu+Umy7KdER2gMeZKRLZdjFJqMe1kAICInh0tiDgueR/XGHPtQdrMvBIX9AvACYqI9wDQYeZZABAX7LtyvndCu9NSSjXiaonoy9ElIhux8CnALSJuisiRtfYsSv7i5iuhSpRSSwFEa32IiKcicmet3QqxjsP+RIrIvrfifCSoE25tiA5PzOwM0RP+5/EOAF1EvOgDEFGPhvgwc79aIsoLqg/hwswqvBTlwsoBKqcopkZr/f8iJwCxTWfCtxI2dVR/jrWpd0N1gxb5Pl4Vu2HgiqwaTXG5VeG7qG7ZJbxXs65T4Su5cFK+J/dODp38tYNvnVpLKPvXIUEAAAAASUVORK5CYII=";
                    locateBtn.addEventListener("click", function () {
                        fetch("https://mapq.waqi.info/mapq/nearest/?n=10")
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log(JSON.stringify(data.d, null, 2));
                                for (const station of data.d) {
                                    const vNum = Number(station.v);
                                    if (!isNaN(vNum)) {
                                        var my_location = {
                                            utime: station.t,
                                            name: `${station.nlo} (${station.nna})`,
                                            aqi: station.v,
                                            idx: station.x
                                        }
                                        break;
                                    }
                                }
                                console.log("My location is ", my_location.nna);
                                n.onClick(my_location);
                            })
                            .catch(error => {
                                console.error("Fetch error:", error);
                            });
                    })
                }, t
            }();
        e.CitySearch = r
    }, , , , function (t, e, n) {
        "use strict";
        e.__esModule = !0;
        var i = n(0),
            o = n(6);
        function saveMessage(msg = "Hello World") {
            const r = document.getElementById("status");
            if (r) {
                r.innerHTML = msg;
                r.style.display = "block";
                r.style.opacity = "1";
                setTimeout(() => {
                    r.style.opacity = "0";
                    setTimeout(() => {
                        r.style.display = "none";
                    }, 300);
                }, 750);
            }
        }
        function r() {
            var t = ["baidu", "bing", "google", "qwant"];
            for (var e in t) {
                e = t[e];
                var n = document.getElementById(e).checked;
                console.log(e, n);
                chrome.storage.local.set({ ["optchecked" + e]: n });
            }
            saveMessage(chrome.i18n.getMessage("opt_save"));
        }
        document.addEventListener("DOMContentLoaded", function () {
            new o.CitySearch,
                function () {
                    var t = ["cn", "en", "hk", "jp", "kr"];

                    function e(e) {
                        t.forEach(function (t) {
                            var n = document.getElementById("lang" + t);
                            n && (n.checked = e == t)
                        });
                    }
                    chrome.storage.local.get("lang", function (r) {
                        if (r.lang === undefined || r.lang === "false" || r.lang === null) {
                            chrome.storage.local.set({ lang: "en" }, function () {
                                e("en");
                            });
                        } else {
                            e(r.lang);
                        }
                        t.forEach(function (t) {
                            var n = document.getElementById("lang" + t);
                            n && (n.onclick = function () {
                                e(t);
                                chrome.storage.local.set({ "lang": t });
                                chrome.runtime.sendMessage({
                                    method: "setLang",
                                    lang: t
                                }, function (t) { });
                                saveMessage(chrome.i18n.getMessage("opt_save"));
                            });
                        });
                    });
                }(),
                function () {
                    var t = "design",
                        e = ["tiny", "small", "forecast", "aqi", "iaqi"];

                    function n(n) {
                        console.log("Set[" + t + "]: ", n), e.forEach(function (e) {
                            var i = document.getElementById(t + "_" + e);
                            i && (i.checked = n == e)
                        })
                    }
                    chrome.storage.local.get([t], result => {
                        if (typeof result[t] == "undefined" || result[t] == "false" || result[t] == null)
                            chrome.storage.local.set({ [t]: "aqi" });
                        var i = document.getElementById(t + "_selection");
                        e.forEach(function (e) {
                            var o = document.createElement("input");
                            o.id = t + "_" + e, o.type = "radio";
                            var r = document.createElement("img");
                            r.src = "../img/design/" + e + ".png", r.style.verticalAlign = "middle", r.style.width = "180px", r.style.cursor = "pointer";
                            var a = function () {
                                chrome.storage.local.set({ [t]: e });
                                chrome.runtime.sendMessage({
                                    method: "setDesign",
                                    design: e
                                }, function (t) { })
                                saveMessage(chrome.i18n.getMessage("opt_save"));
                            };
                            o.onclick = a, r.onclick = a, i.appendChild(o), i.appendChild(r), i.appendChild(document.createElement("div"))
                        })//, n(localStorage[t])
                            , chrome.storage.local.get(t, result => {
                                n(result[t]);
                            });
                    });

                }(),
                function () {
                    var t = ["baidu", "bing", "google", "qwant"];
                    t.forEach(e => {
                        chrome.storage.local.get(["optchecked" + e], result => {
                            let n = String(result["optchecked" + e]);
                            void 0 === n && (n = "true");
                            var i = document.getElementById(e);
                            i && (i.checked = "true" == n, i.onclick = function () {
                                r()
                            })
                        });
                    });
                }(),
                document.querySelectorAll(".i18n").forEach(function (t) {
                    var e = t.getAttribute("id");
                    if (chrome.i18n) {
                        var n = chrome.i18n.getMessage(e);
                        console.log("Localizing " + e + " -> " + n);
                        var r = document.getElementById(e);
                        if (r) r.innerHTML = n;
                    }
                }), (new i.AqiSettings).onFeedUpdate(function (t) { })
        })
    }]);