!function (t) {
    var e = {};
    function n(i) {
        if (e[i])
            return e[i].exports;
        var r = e[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return t[i].call(r.exports, r, r.exports, n),
            r.l = !0,
            r.exports
    }
    n.m = t,
        n.c = e,
        n.d = function (t, e, i) {
            n.o(t, e) || Object.defineProperty(t, e, {
                enumerable: !0,
                get: i
            })
        }
        ,
        n.r = function (t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            }),
                Object.defineProperty(t, "__esModule", {
                    value: !0
                })
        }
        ,
        n.t = function (t, e) {
            if (1 & e && (t = n(t)),
                8 & e)
                return t;
            if (4 & e && "object" == typeof t && t && t.__esModule)
                return t;
            var i = Object.create(null);
            if (n.r(i),
                Object.defineProperty(i, "default", {
                    enumerable: !0,
                    value: t
                }),
                2 & e && "string" != typeof t)
                for (var r in t)
                    n.d(i, r, function (e) {
                        return t[e]
                    }
                        .bind(null, r));
            return i
        }
        ,
        n.n = function (t) {
            var e = t && t.__esModule ? function () {
                return t.default
            }
                : function () {
                    return t
                }
                ;
            return n.d(e, "a", e),
                e
        }
        ,
        n.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }
        ,
        n.p = "",
        n(n.s = 9)
}([function (t, e, n) {
    "use strict";
    e.__esModule = !0;
    var r = function () {
        function t() { }
        return t.prototype.getAqiText = function (t, e) {
            console.log("getAqiText(" + t + "," + e + ")");
            var n = function (t) {
                return "-" == t ? 0 : t <= 50 ? 1 : t <= 100 ? 2 : t <= 150 ? 3 : t <= 200 ? 4 : t <= 300 ? 5 : 6
            }
                , i = "aqivalues" + e
                , r = chrome.i18n.getMessage(i).split(",");
            return console.log("labels:", i, "->", r),
                r[n(t)].trim()
        }
            ,
            t.prototype.getText = function (t, e) {
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
            }
            ,
            t.prototype.getTitle = function (t) {
                return t.city.name + this.getText("air_quality", t.clang)
            }
            ,
            t.prototype.getShortTitle = function (t) {
                return t.city.name + " AQI"
            }
            ,
            t
    }();
    e.aqiLang = new r;
    var o = function () {
        function t() { }
        return t.prototype.cityObject = function () {
            return new Promise(function (t) {
                chrome.runtime.sendMessage({
                    method: "getSelectedCity"
                }, function (e) {
                    t(e)
                })
            }
            )
        }
            ,
            t.prototype.setCityObject = function (t) {
                chrome.runtime.sendMessage({
                    method: "setSelectedCity",
                    city: t
                }, function (t) { })
            }
            ,
            t.prototype.updateAQI = function (t) {
                if (t)
                    return t.forecast && (void 0 !== t.forecast[t.clang] ? t.weather = t.forecast[t.clang] : t.weather = t.forecast.en),
                        void 0 !== t["info" + t.clang] && (t.info = t["info" + t.clang]),
                        "hk" == t.clang && void 0 !== t.infocn && (t.info = t.infocn),
                        void 0 !== t["utime" + t.clang] && (t.utime = t["utime" + t.clang]),
                        "hk" == t.clang && void 0 !== t.utimecn && (t.utime = t.utimecn),
                        "cn" == t.clang || "hk" == t.clang || "jp" == t.clang || "kr" == t.clang ? t.name = t.namena : t.name = t.nameen,
                        t
            }
            ,
            t.prototype.updateFeed = function (t) {
                return t
            }
            ,
            t.prototype.updateData = function (t, e) {
                return "Aqi" == t ? this.updateAQI(e) : e
            }
            ,
            t.prototype.checkOption = function (t) {
                return new Promise(function (e) {
                    chrome.runtime.sendMessage({
                        method: "checkOption",
                        opt: t
                    }, function (t) {
                        e(t)
                    })
                }
                )
            }
            ,
            t.prototype.onFeedUpdate = function (t) {
                this.onDataUpdate("Feed", t)
            }
            ,
            t.prototype.onDataUpdate = function (t, e) {
                var n = this
                    , i = "on" + t + "Update";
                chrome.runtime.onMessage.addListener(function (r, o, a) {
                    r.method == i ? e(n.updateData(t, r.aqi)) : console.log("Received unknown message:", r.method)
                }),
                    chrome.runtime.sendMessage({
                        method: "load" + t
                    }, function (i) {
                        e(n.updateData(t, i))
                    })
            }
            ,
            t
    }();
    e.AqiSettings = o
}
    , function (t, e, n) {
        "use strict";
        e.__esModule = !0;
        var i = function () {
            function t(t) {
                t && "string" == typeof t && "#" == t[0] ? this.node = document.getElementById(t.substr(1)) : t && "object" == typeof t && 1 == t.nodeType ? this.node = t : t && console.log("s3: Creating from unknown object", t)
            }
            return t.prototype.c = function (e, n, i, r) {
                var o;
                if (void 0 === n && (n = null),
                    void 0 === i && (i = null),
                    void 0 === r && (r = null),
                    n && "string" != typeof n && (r = i,
                        i = n,
                        n = null),
                    o = "svg:" == e.substr(0, 4) ? document.createElementNS("http://www.w3.org/2000/svg", e.substr(4)) : document.createElement(e),
                    n && (o.className = n),
                    i)
                    for (var a in i)
                        o.style[a] = i[a];
                return r && (o.innerHTML = r),
                    this.node && this.node.appendChild(o),
                    new t(o)
            }
                ,
                t.prototype.a = function (t) {
                    for (var e in t)
                        this.node.setAttribute(e, t[e]);
                    return this
                }
                ,
                t.prototype.i = function (t) {
                    return t.node ? this.node.appendChild(t.node) : (console.log("i:", "trying to insert a non-existant node", t),
                        window.sdlkfjslk()),
                        this
                }
                ,
                t.prototype.t = function (t) {
                    if ("string" == typeof t) {
                        var e = document.createTextNode(t);
                        this.node.appendChild(e)
                    }
                    return this
                }
                ,
                t.prototype.empty = function () {
                    for (; this.node && this.node.firstChild;)
                        this.node.firstChild.remove();
                    return this
                }
                ,
                t.prototype.up = function () {
                    return this.node = this.node.parent(),
                        this
                }
                ,
                t
        }();
        e.S3 = i,
            e.s3 = function (t) {
                return void 0 === t && (t = null),
                    new i(t)
            }
    }
    , , function (t, e) {
        var n, i, r = t.exports = {};
        function o() {
            throw new Error("setTimeout has not been defined")
        }
        function a() {
            throw new Error("clearTimeout has not been defined")
        }
        function s(t) {
            if (n === setTimeout)
                return setTimeout(t, 0);
            if ((n === o || !n) && setTimeout)
                return n = setTimeout,
                    setTimeout(t, 0);
            try {
                return n(t, 0)
            } catch (e) {
                try {
                    return n.call(null, t, 0)
                } catch (e) {
                    return n.call(this, t, 0)
                }
            }
        }
        !function () {
            try {
                n = "function" == typeof setTimeout ? setTimeout : o
            } catch (t) {
                n = o
            }
            try {
                i = "function" == typeof clearTimeout ? clearTimeout : a
            } catch (t) {
                i = a
            }
        }();
        var c, u = [], l = !1, f = -1;
        function h() {
            l && c && (l = !1,
                c.length ? u = c.concat(u) : f = -1,
                u.length && d())
        }
        function d() {
            if (!l) {
                var t = s(h);
                l = !0;
                for (var e = u.length; e;) {
                    for (c = u,
                        u = []; ++f < e;)
                        c && c[f].run();
                    f = -1,
                        e = u.length
                }
                c = null,
                    l = !1,
                    function (t) {
                        if (i === clearTimeout)
                            return clearTimeout(t);
                        if ((i === a || !i) && clearTimeout)
                            return i = clearTimeout,
                                clearTimeout(t);
                        try {
                            i(t)
                        } catch (e) {
                            try {
                                return i.call(null, t)
                            } catch (e) {
                                return i.call(this, t)
                            }
                        }
                    }(t)
            }
        }
        function m(t, e) {
            this.fun = t,
                this.array = e
        }
        function p() { }
        r.nextTick = function (t) {
            var e = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var n = 1; n < arguments.length; n++)
                    e[n - 1] = arguments[n];
            u.push(new m(t, e)),
                1 !== u.length || l || s(d)
        }
            ,
            m.prototype.run = function () {
                this.fun.apply(null, this.array)
            }
            ,
            r.title = "browser",
            r.browser = !0,
            r.env = {},
            r.argv = [],
            r.version = "",
            r.versions = {},
            r.on = p,
            r.addListener = p,
            r.once = p,
            r.off = p,
            r.removeListener = p,
            r.removeAllListeners = p,
            r.emit = p,
            r.prependListener = p,
            r.prependOnceListener = p,
            r.listeners = function (t) {
                return []
            }
            ,
            r.binding = function (t) {
                throw new Error("process.binding is not supported")
            }
            ,
            r.cwd = function () {
                return "/"
            }
            ,
            r.chdir = function (t) {
                throw new Error("process.chdir is not supported")
            }
            ,
            r.umask = function () {
                return 0
            }
    }
    , function (t, e) {
        var n;
        n = function () {
            return this
        }();
        try {
            n = n || Function("return this")() || (0,
                eval)("this")
        } catch (t) {
            "object" == typeof window && (n = window)
        }
        t.exports = n
    }
    , function (t, e, n) {
        "use strict";
        e.__esModule = !0;
        var i = n(0)
            , r = n(1);
        function o(t) {
            return "-" != t && t ? t <= 50 ? "#009966" : t <= 100 ? "#ffde33" : t <= 150 ? "#ff9933" : t <= 200 ? "#cc0033" : t <= 300 ? "#660099" : "#7e0023" : "#aaaaaa"
        }
        function a(t) {
            return "-" != t && t ? t <= 50 ? "#ffffff" : t <= 100 ? "#000000" : t <= 150 ? "#000000" : "#ffffff" : "#eeeeee"
        }
        e.bgcolor = o,
            e.fgcolor = a,
            e.getWidget = function (t, e) {
                var n = moment(t.time.v)
                    , s = t.rtsettings.design
                    , c = t.rtsettings.lang;
                "cn" == c ? c = "zh-CN" : "hk" == c ? c = "zh-TW" : "jp" == c ? c = "ja" : "kr" == c && (c = "ko"),
                    moment.locale(c);
                var u = i.aqiLang.getShortTitle(t)
                    , l = r.s3().c("div", {
                        fontSize: "13px"
                    });
                l.c("img", {
                    verticalAlign: "text-top"
                }).a({
                    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAABXElEQVQokZ2Tu0pDQRCGvzlZYqJRUEKMGgQJ2Ild7G2Sylax1cYX8BEsVQRLfQpLS228NcEiEFRMQI2XxCORg5ozFmsuGA+of7HMzs6//+zMrGS3lm6ApAio8hdUjIgkmztpLT9AO86snTAL6ec/yXVC3gtZbet25u2AhEG9QLJpx7eJEpvFSSyDGQDvisbtOrxddCu7O1ntfIwMTdI3t4E4IetRResP1PdWoeGhXhURaSoLqorExjDjGczIdIsI2MC+OLH5XQDeC/t4h5sIPqZ09EEklSK1soaEozbAdYOLNDqD62dwTw4w5eMPhuNpaufF7shme7616akU5u6kgfEJ8XJZpucsH6j2/b5qvkBDHWRxalslJIxODNLb3xM4I83i1R5fuS+7oFhl9ZXrYg3HkeAJw46v+goSQlBMLnr6q3R/gslF/k92gIr9EDZfOwCCiCC07ZbvywYqnwLPdpYyuPVQAAAAAElFTkSuQmCC"
                }),
                    l.c("span", "waqi-widget-title").t(u),
                    e && "tiny" != s || l.c("span", {
                        color: "#aaa",
                        padding: "0 3px 0 0"
                    }).c("small").t(n.format("hA"));
                var f = {
                    minWidth: "20px",
                    textAlign: "center",
                    backgroundColor: o(t.aqi),
                    color: a(t.aqi)
                };
                return e && (f.float = "right"),
                    l.c("span", "waqi-widget-aqi", f).c("span").t(t.aqi.toString()),
                    e && ("tiny" != s && (l.c("div", {
                        color: "#aaa",
                        marginTop: "3px"
                    }).c("small").t(n.format("LLL")),
                        "small" != s && (l.c("div", {
                            borderTop: "1px solid #ccc",
                            paddingTop: "5px"
                        }),
                            "forecast" != s && l.i(function (t, e) {
                                void 0 === e && (e = 24);
                                var n = "iaqi" == t.rtsettings.design
                                    , i = n ? 30 : 20
                                    , a = r.s3().c("svg:svg", {
                                        margin: 0,
                                        padding: 0,
                                        borderBottom: "1px solid #eee",
                                        height: 18 * (n ? 3 : 1) + 12 + "px",
                                        width: 120 + i + "px"
                                    });
                                try {
                                    for (var s = 24 - moment(t.time.v).hour(), c = 0, u = {}, l = ["PM2.5", "PM10", "O3", "time"], f = 0; f < l.length; f++) {
                                        for (var h = null, d = null, m = l[f].replace(".", "").toLowerCase(), p = 0; p < e; p++) {
                                            var g = e - p - 1;
                                            if (t.historic[m] && t.historic[m][g]) {
                                                var v = t.historic[m][g].v;
                                                (null == h || h > v) && (h = v),
                                                    (null == d || d < v) && (d = v),
                                                    t[g] ? t[g].v = Math.max(t[g].v, v) : t[g] = {
                                                        v: v
                                                    }
                                            }
                                        }
                                        u[m] = {
                                            min: h,
                                            max: d
                                        },
                                            u.aqi || (u.aqi = {
                                                min: h,
                                                max: d
                                            }),
                                            u.aqi.min > h && (u.aqi.min = h),
                                            u.aqi.max < d && (u.aqi.max = d)
                                    }
                                    for (t.historic.aqi = t,
                                        n || (l = ["AQI", "time"]),
                                        f = 0; f < l.length; f++) {
                                        m = l[f].replace(".", "").toLowerCase();
                                        var y = l[f];
                                        for ("time" != y && a.c("svg:text", {
                                            fontFamily: "sans-serif",
                                            fontSize: 9
                                        }).a({
                                            x: 0,
                                            y: c + 18 - 2
                                        }).t(y),
                                            p = 0; p < e; p++) {
                                            var w = p - s + e;
                                            w < 24 && (w += 24),
                                                w > 24 && (w -= 24),
                                                24 == w && (w = 0),
                                                g = e - p - 1;
                                            var _ = 120 / e
                                                , b = i + _ * p;
                                            if ("time" == m)
                                                (6 == w || 12 == w || 0 == w || 18 == w) && (a.c("svg:rect", {
                                                    fill: "#888"
                                                }).a({
                                                    x: b,
                                                    y: 0,
                                                    width: .5,
                                                    height: 18 * (l.length - 1) + 2
                                                }),
                                                    a.c("svg:text", {
                                                        fontFamily: "sans-serif",
                                                        fontSize: 8,
                                                        textAnchor: "middle",
                                                        fill: "#bbb"
                                                    }).a({
                                                        x: b,
                                                        y: c + 18 - 8
                                                    }).t(w.toString()));
                                            else if (t.historic[m] && t.historic[m][g]) {
                                                var q = t.historic[m][g].v
                                                    , A = u[m]
                                                    , x = (h = A.min,
                                                        15 * (q - (h = 0)) / ((d = A.max) - h))
                                                    , T = o(q);
                                                a.c("svg:rect", {
                                                    fill: T
                                                }).a({
                                                    x: b,
                                                    y: c + 18 - x,
                                                    width: _ - .5,
                                                    height: x
                                                })
                                            }
                                        }
                                        c += 18
                                    }
                                } catch (t) {
                                    console.log("Error " + t)
                                }
                                return a
                            }(t)),
                            l.c("center").i(function (t) {
                                var e = []
                                    , n = {}
                                    , i = new Date;
                                i.setHours(0),
                                    t.forecast.aqi.forEach(function (t) {
                                        var r = t.t.split(/[^0-9]/)
                                            , o = new Date(r[0], r[1] - 1 || 0, r[2] || 1, r[3] || 0, r[4] || 0, r[5] || 0, r[6] || 0);
                                        if (!(o.getTime() < i.getTime())) {
                                            var a = "D" + moment(o).format("YMD");
                                            if (e.indexOf(a) < 0 && (e.push(a),
                                                n[a] = {
                                                    date: o
                                                }),
                                                o.getHours() >= 7 && o.getHours() <= 21) {
                                                var s = t;
                                                if (!(s = s.v.pm25 ? s.v.pm25 : s.v).o3) {
                                                    var c = s[0]
                                                        , u = s[1];
                                                    n[a].aqi = n[a].aqi || {
                                                        min: c,
                                                        max: u,
                                                        count: 0,
                                                        avg: 0
                                                    },
                                                        n[a].aqi.min = Math.min(n[a].aqi.min, c),
                                                        n[a].aqi.max = Math.max(n[a].aqi.max, u),
                                                        n[a].aqi.avg += (c + u) / 2,
                                                        n[a].aqi.count += 1
                                                }
                                            }
                                        }
                                    });
                                var s = r.s3().c("div");
                                return e.sort(),
                                    e.slice(0, 4).forEach(function (t, e) {
                                        if (n[t].aqi && 0 != n[t].aqi.count) {
                                            n[t].aqi && n[t].aqi.min,
                                                n[t].aqi && n[t].aqi.max;
                                            var i = n[t].aqi ? n[t].aqi.avg / n[t].aqi.count : "-"
                                                , r = moment(n[t].date).format("ddd");
                                            s.c("div", {
                                                display: "inline-block"
                                            }).c("div", "waqi-forecast-day-aqi", {
                                                fontSize: "10px",
                                                backgroundColor: o(i),
                                                color: a(i) + "cc"
                                            }).t(r)
                                        }
                                    }),
                                    s
                            }(t)))),
                        l = r.s3().c("div", "waqi-widget-outer").i(l)),
                    l
            }
    }
    , function (t, e, n) {
        "use strict";
        e.__esModule = !0;
        var i = n(0)
            , r = n(5)
            , o = function () {
                function t() {
                    var t = this;
                    this.aqiSettings = new i.AqiSettings;
                    this.clearResultsTimer = null;
                    var e = document.getElementById("searchresults");
                    if (e) e.style.display = "none";
                    var n = document.getElementById("cityaqiwidget");
                    if (n) n.style.display = "none";
                    this.aqiSettings.cityObject().then(function (e) {
                        var n = document.getElementById("selectedcitytitle");
                        if (e) {
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
                        t.onKeyUp()
                    }
                }
                return t.prototype.url = function (t) {
                    var e = "https://aqicn.org/browser-widget/xsearch/places/" + t + "?";
                    return e += "&t=" + (new Date).getTime(),
                        e += "&from=chrome-extension"
                }
                    ,
                    t.prototype.formatData = function (t, e) {
                        var n = this
                            , i = "<table class='citysearch'>";
                        t.forEach(function (e, n) {
                            e.uid;
                            e.station.url && e.station.url;
                            var o = moment(1e3 * e.time.vtime).format("ddd, hA")
                                , a = r.bgcolor(e.aqi)
                                , s = r.fgcolor(e.aqi)
                                , c = e.aqi
                                , u = e.station.name
                                , l = n != t.length - 1 ? "marker" : "";
                            i += "<tr class='" + l + "' id='cityitem" + n + "' >",
                                i += "<td class='cityentryname'>" + u + "<small> " + o + "</small></span>",
                                i += "<td><span class='cityentryaqitag' style='background-color:" + a + ";color:" + s + "'>" + c + "</span>"
                        }),
                            0 == t.length && (i += "<tr><td class='cityentryname'>" + chrome.i18n.getMessage("search_no_result") + "</td></tr>"),
                            i += "</table>",
                            o = document.getElementById(e),
                            o.innerHTML = i,
                            o.style.display = "",
                            t.forEach(function (t, e) {
                                document.getElementById("cityitem" + e).onclick = function () {
                                    var e = {
                                        utime: t.time.vtime,
                                        name: t.station.name,
                                        aqi: t.aqi,
                                        idx: t.uid
                                    };
                                    n.onClick(e)
                                }
                            })
                    }
                    ,
                    t.prototype.onWidgetLoaded = function (t, e) {
                        var xxl = t.xxl.replace('420px', '440px');
                        console.log("Widget loaded!");
                        var n = document.getElementById("cityaqiwidget");
                        if (n) {
                            n.innerHTML = xxl;
                            n.style.display = "";
                        }
                        var r = document.getElementById("selectedcity");
                        if (r) r.innerHTML = "";
                        var o = document.getElementById("aqiwgttitle1");
                        if (o) o.setAttribute("target", "_blank");
                        var n = document.getElementById("aqiwgtmsg");
                        var r = i.aqiLang.getAqiText(n ? n.innerHTML : "", e);
                        if (n) n.innerHTML = r;
                    }
                    ,
                    t.prototype.loadWidget = function () {
                        var t = this;
                        var e = document.getElementById("cityaqiwidget");
                        if (e) {
                            e.innerHTML = "<div style='width:100%'><div class='aqiloader'></div></div>";
                            e.style.display = "";
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
                                    var n = chrome.i18n.getMessage("search_load_error") + "<br>" + t;
                                    var i = document.getElementById("cityaqiwidget");
                                    if (i) {
                                        i.innerHTML = "<div style='width:100%'>" + n + "</div>";
                                        i.style.display = "";
                                    }
                                });
                            } else {
                                var i = document.getElementById("cityaqiwidget");
                                if (i) {
                                    i.innerHTML = "Oops.. can not load the widget";
                                    i.style.display = "";
                                }
                            }
                        });
                    }
                    ,
                    t.prototype.onClick = function (t) {
                        this.aqiSettings.setCityObject(t);
                        var e = document.getElementById("selectedcitytitle");
                        if (e) e.innerHTML = t.name;
                        var n = document.getElementById("selectedcity");
                        if (n) n.innerHTML = chrome.i18n.getMessage("search_selected_city") + " <b>" + t.name;
                        this.loadWidget();
                        this.clearResultsTimer && clearTimeout(this.clearResultsTimer);
                        this.clearResultsTimer = setTimeout(function () {
                            var e = document.getElementById("searchresults");
                            if (e) {
                                e.style.transition = "height 0.2s ease";
                                e.style.overflow = "hidden";
                                e.style.height = "0px";
                                setTimeout(function () {
                                    e.style.display = "none";
                                    e.style.height = "";
                                    e.style.transition = "";
                                    e.style.overflow = "";
                                }, 200);
                            }
                            var n = document.getElementById("cityinput");
                            if (n) n.value = "";
                        }, 1e3);
                    }
                    ,
                    t.prototype.onKeyUp = function () {
                        var t = this;
                        this.clearResultsTimer && clearTimeout(this.clearResultsTimer);
                        var e = document.getElementById("cityinput").value;
                        "" != e && null != e && fetch(this.url(e)).then(function (t) {
                            return t.json()
                        }).then(function (e) {
                            document.getElementById("cityinput").className = "",
                                t.formatData(e.results, "searchresults")
                        })
                    }
                    ,
                    t
            }();
        e.CitySearch = o
    }
    , , , function (t, e, n) {
        "use strict";
        e.__esModule = !0;
        var i = n(6);
        document.addEventListener("DOMContentLoaded", function () {
            new i.CitySearch;
            var r = document.querySelectorAll(".i18n");
            r.forEach(function (t) {
                var e = t.getAttribute("id")
                    , n = chrome.i18n.getMessage(e);
                console.log("Localizing " + e + " -> " + n);
                var i = document.getElementById(e);
                if (i) i.innerHTML = n;
            });
        });
    }
]);
