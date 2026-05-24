/* @license GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(($, Drupal, once) => {
    function initAutocomplete(locationAutocomplete) {
        let sessionToken;
        const autocompleteService = new google.maps.places.AutocompleteService();
        const placesService = new google.maps.places.PlacesService(document.createElement('div'));
        const geocoder = new google.maps.Geocoder();
        let options = {
            input: '',
            types: ['geocode'],
            sessionToken,
            componentRestrictions: {
                country: ['us', 'gu', 'pr', 'mp', 'vi']
            }
        };
        $(locationAutocomplete).autocomplete({
            source: function(request, response) {
                if (!sessionToken) sessionToken = new google.maps.places.AutocompleteSessionToken();
                options.input = request.term;
                autocompleteService.getPlacePredictions(options, (predictions, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        let data = [];
                        predictions.forEach((prediction) => {
                            data.push({
                                label: prediction.description,
                                value: prediction.description,
                                id: prediction.place_id
                            });
                        });
                        response(data);
                    } else {
                        response([{
                            label: Drupal.t('No results found'),
                            value: response.term,
                            id: null
                        }]);
                        console.error('Places Autocomplete API request failed:', status);
                    }
                });
            },
            autoFocus: true,
            classes: {
                "ui-autocomplete": "ui-autocomplete ui-autocomplete-location-autocomplete"
            },
            minLength: 2,
            select: function(event, ui) {
                if (ui.item.id === null) event.preventDefault();
                const placeId = ui.item.id;
                placesService.getDetails({
                    placeId,
                    sessionToken
                }, (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        const latitude = place.geometry.location.lat();
                        const longitude = place.geometry.location.lng();
                        const formattedAddress = place.formatted_address;
                        if (place.address_components.length === 2) {
                            let country = '';
                            let state = '';
                            place.address_components.forEach((component) => {
                                switch (component.types[0]) {
                                    case 'country':
                                        country = component.short_name;
                                        break;
                                    case 'administrative_area_level_1':
                                        state = component.short_name;
                                        break;
                                }
                            });
                            let redirectUrl = `/federal-court-finder/find?coordinates=${latitude},${longitude}&location=${encodeURIComponent(formattedAddress)}&filter=default`;
                            if (country) redirectUrl += `&country=${encodeURIComponent(country)}`;
                            if (country === 'US' && state) redirectUrl += `&state=${encodeURIComponent(state)}`;
                            sessionToken = null;
                            document.location.href = redirectUrl;
                        } else geocoder.geocode({
                            location: {
                                lat: latitude,
                                lng: longitude
                            }
                        }, (results, status) => {
                            if (status === google.maps.GeocoderStatus.OK && results[0]) {
                                const addressComponents = results[0].address_components;
                                let country = '';
                                let state = '';
                                let county = '';
                                let zip = '';
                                addressComponents.forEach((component) => {
                                    switch (component.types[0]) {
                                        case 'country':
                                            country = component.short_name;
                                            break;
                                        case 'administrative_area_level_1':
                                            state = component.short_name;
                                            break;
                                        case 'administrative_area_level_2':
                                            county = component.long_name.replace(/( County| Parish)$/, '');
                                            break;
                                        case 'postal_code':
                                            zip = component.short_name;
                                            break;
                                    }
                                });
                                let redirectUrl = `/federal-court-finder/find?coordinates=${latitude},${longitude}&location=${encodeURIComponent(formattedAddress)}&filter=default`;
                                if (country) redirectUrl += `&country=${encodeURIComponent(country)}`;
                                if (country === 'US') {
                                    if (state) redirectUrl += `&state=${encodeURIComponent(state)}`;
                                    if (county) redirectUrl += `&county=${encodeURIComponent(county)}`;
                                }
                                if (zip) redirectUrl += `&zip=${encodeURIComponent(zip)}`;
                                sessionToken = null;
                                document.location.href = redirectUrl;
                            } else console.error('Geocoding API request failed:', status);
                        });
                    } else console.error('Place Details API request failed:', status);
                });
            }
        });
    }

    function handleClearButtonIcon(element) {
        const clearButton = element.parentElement.querySelector('button.court-finder-block__form-clear');
        element.addEventListener('keydown', (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                return false;
            }
        });
        element.addEventListener('keyup', (event) => {
            const value = event.target.value;
            if (value.trim() === '') clearButton.style.display = 'none';
            else clearButton.style.display = 'block';
        });
    }

    function handleClearButton(element) {
        const locationInput = element.parentElement.querySelector('input.court-finder-block__input');
        element.addEventListener('click', (e) => {
            element.style.display = 'none';
            locationInput.value = '';
        });
    }
    Drupal.behaviors.placesAutocomplete = {
        attach(context) {
            once('places-autocomplete', '.court-finder-block__form--location .court-finder-block__input', context).forEach(initAutocomplete);
            once('places-autocomplete-show-clear-button', '.court-finder-block__input', context).forEach(handleClearButtonIcon);
            once('places-autocomplete-clear-button', 'button.court-finder-block__form-clear', context).forEach(handleClearButton);
        }
    };
})(jQuery, Drupal, once);;
/* @license MIT https://github.com/splidejs/splide/blob/master/LICENSE */
function At(n, t) {
    for (var i = 0; i < t.length; i++) {
        var r = t[i];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(n, r.key, r)
    }
}
/*!
 * Splide.js
 * Version  : 3.6.12
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */
var n, t;
n = this, t = function() {
    "use strict";
    var m = "splide",
        a = "data-" + m,
        n = {
            CREATED: 1,
            MOUNTED: 2,
            IDLE: 3,
            MOVING: 4,
            DESTROYED: 5
        },
        R = 10;

    function _(n) {
        n.length = 0
    }

    function I(n) {
        return !u(n) && "object" == typeof n
    }

    function r(n) {
        return Array.isArray(n)
    }

    function D(n) {
        return "string" == typeof n
    }

    function O(n) {
        return void 0 === n
    }

    function u(n) {
        return null === n
    }

    function y(n) {
        return n instanceof HTMLElement
    }

    function w(n) {
        return r(n) ? n : [n]
    }

    function b(n, t) {
        w(n).forEach(t)
    }

    function x(n, t) {
        return -1 < n.indexOf(t)
    }

    function k(n, t) {
        return n.push.apply(n, w(t)), n
    }
    var o = Array.prototype;

    function s(n, t, i) {
        return o.slice.call(n, t, i)
    }

    function E(t, n, i) {
        t && b(n, function(n) {
            n && t.classList[i ? "add" : "remove"](n)
        })
    }

    function A(n, t) {
        E(n, D(t) ? t.split(" ") : t, !0)
    }

    function L(n, t) {
        b(t, n.appendChild.bind(n))
    }

    function S(n, i) {
        b(n, function(n) {
            var t = i.parentNode;
            t && t.insertBefore(n, i)
        })
    }

    function W(n, t) {
        return y(n) && (n.msMatchesSelector || n.matches).call(n, t)
    }

    function z(n, t) {
        return n ? s(n.children).filter(function(n) {
            return W(n, t)
        }) : []
    }

    function P(n, t) {
        return t ? z(n, t)[0] : n.firstElementChild
    }

    function e(n, t, i) {
        if (n)
            for (var r = Object.keys(n), r = i ? r.reverse() : r, u = 0; u < r.length; u++) {
                var o = r[u];
                if ("__proto__" !== o && !1 === t(n[o], o)) break
            }
        return n
    }

    function M(r) {
        return s(arguments, 1).forEach(function(i) {
            e(i, function(n, t) {
                r[t] = i[t]
            })
        }), r
    }

    function l(i, n) {
        return e(n, function(n, t) {
            r(n) ? i[t] = n.slice() : I(n) ? i[t] = l(I(i[t]) ? i[t] : {}, n) : i[t] = n
        }), i
    }

    function T(t, n) {
        t && b(n, function(n) {
            t.removeAttribute(n)
        })
    }

    function j(i, n, t) {
        I(n) ? e(n, function(n, t) {
            j(i, t, n)
        }) : u(t) ? T(i, n) : i.setAttribute(n, String(t))
    }

    function F(n, t, i) {
        n = document.createElement(n);
        return t && (D(t) ? A : j)(n, t), i && L(i, n), n
    }

    function C(n, t, i) {
        if (O(i)) return getComputedStyle(n)[t];
        u(i) || (n = n.style)[t] !== (i = "" + i) && (n[t] = i)
    }

    function N(n, t) {
        C(n, "display", t)
    }

    function X(n, t) {
        return n.getAttribute(t)
    }

    function B(n, t) {
        return n && n.classList.contains(t)
    }

    function G(n) {
        return n.getBoundingClientRect()
    }

    function H(n) {
        b(n, function(n) {
            n && n.parentNode && n.parentNode.removeChild(n)
        })
    }

    function Y(n) {
        return P((new DOMParser).parseFromString(n, "text/html").body)
    }

    function U(n, t) {
        n.preventDefault(), t && (n.stopPropagation(), n.stopImmediatePropagation())
    }

    function q(n, t) {
        return n && n.querySelector(t)
    }

    function J(n, t) {
        return s(n.querySelectorAll(t))
    }

    function K(n, t) {
        E(n, t, !1)
    }

    function V(n) {
        return D(n) ? n : n ? n + "px" : ""
    }

    function Q(n, t) {
        if (void 0 === t && (t = ""), !n) throw new Error("[" + m + "] " + t)
    }

    function g(n) {
        setTimeout(n)
    }

    function Z() {}

    function v(n) {
        return requestAnimationFrame(n)
    }
    var $ = Math.min,
        nn = Math.max,
        tn = Math.floor,
        rn = Math.ceil,
        un = Math.abs;

    function on(n, t, i, r) {
        var u = $(t, i),
            i = nn(t, i);
        return r ? u < n && n < i : u <= n && n <= i
    }

    function en(n, t, i) {
        var r = $(t, i),
            i = nn(t, i);
        return $(nn(r, n), i)
    }

    function cn(n) {
        return (0 < n) - (n < 0)
    }

    function fn(t, n) {
        return b(n, function(n) {
            t = t.replace("%s", "" + n)
        }), t
    }

    function an(n) {
        return n < 10 ? "0" + n : "" + n
    }
    var sn = {};

    function c() {
        var o = {};

        function r(n, r) {
            t(n, function(n, t) {
                var i = o[n];
                o[n] = i && i.filter(function(n) {
                    return n.n ? n.n !== r : r || n.t !== t
                })
            })
        }

        function t(n, t) {
            w(n).join(" ").split(" ").forEach(function(n) {
                n = n.split(".");
                t(n[0], n[1])
            })
        }
        return {
            on: function(n, i, r, u) {
                void 0 === u && (u = R), t(n, function(n, t) {
                    o[n] = o[n] || [], k(o[n], {
                        i: n,
                        r: i,
                        t: t,
                        u: u,
                        n: r
                    }).sort(function(n, t) {
                        return n.u - t.u
                    })
                })
            },
            off: r,
            offBy: function(i) {
                e(o, function(n, t) {
                    r(t, i)
                })
            },
            emit: function(n) {
                var t = arguments;
                (o[n] || []).forEach(function(n) {
                    n.r.apply(n, s(t, 1))
                })
            },
            destroy: function() {
                o = {}
            }
        }
    }
    var ln = "mounted",
        dn = "move",
        vn = "moved",
        hn = "shifted",
        pn = "click",
        gn = "active",
        mn = "inactive",
        yn = "visible",
        wn = "hidden",
        _n = "slide:keydown",
        bn = "refresh",
        xn = "updated",
        kn = "resize",
        An = "resized",
        Ln = "repositioned",
        En = "scrolled",
        f = "destroy",
        Sn = "navigation:mounted",
        zn = "lazyload:loaded";

    function Pn(n) {
        var r = n.event,
            u = {},
            o = [];

        function t(n, t, r) {
            e(n, t, function(t, i) {
                o = o.filter(function(n) {
                    return !!(n[0] !== t || n[1] !== i || r && n[2] !== r) || (t.removeEventListener(i, n[2], n[3]), !1)
                })
            })
        }

        function e(n, t, i) {
            b(n, function(n) {
                n && t.split(" ").forEach(i.bind(null, n))
            })
        }

        function i() {
            o = o.filter(function(n) {
                return t(n[0], n[1])
            }), r.offBy(u)
        }
        return r.on(f, i, u), {
            on: function(n, t, i) {
                r.on(n, t, u, i)
            },
            off: function(n) {
                r.off(n, u)
            },
            emit: r.emit,
            bind: function(n, t, i, r) {
                e(n, t, function(n, t) {
                    o.push([n, t, i, r]), n.addEventListener(t, i, r)
                })
            },
            unbind: t,
            destroy: i
        }
    }

    function Rn(t, i, r, u) {
        var o, n, e = Date.now,
            c = 0,
            f = !0,
            a = 0;

        function s() {
            if (!f) {
                var n = e() - o;
                if (t <= n ? (c = 1, o = e()) : c = n / t, r && r(c), 1 === c && (i(), u && ++a >= u)) return l();
                v(s)
            }
        }

        function l() {
            f = !0
        }

        function d() {
            cancelAnimationFrame(n), f = !(n = c = 0)
        }
        return {
            start: function(n) {
                n || d(), o = e() - (n ? c * t : 0), f = !1, v(s)
            },
            rewind: function() {
                o = e(), c = 0, r && r(c)
            },
            pause: l,
            cancel: d,
            set: function(n) {
                t = n
            },
            isPaused: function() {
                return f
            }
        }
    }

    function d(n) {
        var t = n;
        return {
            set: function(n) {
                t = n
            },
            is: function(n) {
                return x(w(n), t)
            }
        }
    }

    function Dn(i, r) {
        var u;
        return function() {
            var n = arguments,
                t = this;
            u || (u = Rn(r || 0, function() {
                i.apply(t, n), u = null
            }, null, 1)).start()
        }
    }
    var h = {
        marginRight: ["marginBottom", "marginLeft"],
        autoWidth: ["autoHeight"],
        fixedWidth: ["fixedHeight"],
        paddingLeft: ["paddingTop", "paddingRight"],
        paddingRight: ["paddingBottom", "paddingLeft"],
        width: ["height"],
        left: ["top", "right"],
        right: ["bottom", "left"],
        x: ["y"],
        X: ["Y"],
        Y: ["X"],
        ArrowLeft: ["ArrowUp", "ArrowRight"],
        ArrowRight: ["ArrowDown", "ArrowLeft"]
    };
    var On = m,
        Mn = m + "__slider",
        Tn = m + "__track",
        jn = m + "__list",
        Fn = m + "__slide",
        In = Fn + "--clone",
        Wn = Fn + "__container",
        Cn = m + "__arrows",
        t = m + "__arrow",
        Nn = t + "--prev",
        Xn = t + "--next",
        i = m + "__pagination",
        Bn = m + "__progress",
        Gn = Bn + "__bar",
        Hn = m + "__autoplay",
        Yn = m + "__play",
        Un = m + "__pause",
        qn = "is-active",
        Jn = "is-prev",
        Kn = "is-next",
        Vn = "is-visible",
        Qn = "is-loading",
        Zn = [qn, Vn, Jn, Kn, Qn];
    var $n = "role",
        nt = "aria-controls",
        tt = "aria-current",
        it = "aria-label",
        rt = "aria-hidden",
        ut = "tabindex",
        p = "aria-orientation",
        ot = [$n, nt, tt, it, rt, p, ut, "disabled"],
        et = "slide",
        ct = "loop",
        ft = "fade";

    function at(u, i, r, o) {
        var t, n = Pn(u),
            e = n.on,
            c = n.emit,
            f = n.bind,
            a = n.destroy,
            s = u.Components,
            l = u.root,
            d = u.options,
            v = d.isNavigation,
            h = d.updateOnMove,
            p = s.Direction.resolve,
            g = X(o, "style"),
            m = -1 < r,
            y = P(o, "." + Wn),
            w = d.focusableNodes && J(o, d.focusableNodes);

        function _() {
            var n = m ? r : i,
                t = fn(d.i18n.slideX, n + 1),
                n = u.splides.map(function(n) {
                    return n.splide.root.id
                }).join(" ");
            j(o, it, t), j(o, nt, n), j(o, $n, "menuitem"), k(A())
        }

        function b() {
            t || x()
        }

        function x() {
            var n;
            t || (n = u.index, k(A()), function(n) {
                var t = !n && (!A() || m);
                j(o, rt, t || null), j(o, ut, !t && d.slideFocus ? 0 : null), w && w.forEach(function(n) {
                    j(n, ut, t ? -1 : null)
                });
                n !== B(o, Vn) && (E(o, Vn, n), c(n ? yn : wn, L))
            }(function() {
                if (u.is(ft)) return A();
                var n = G(s.Elements.track),
                    t = G(o),
                    i = p("left"),
                    r = p("right");
                return tn(n[i]) <= rn(t[i]) && tn(t[r]) <= rn(n[r])
            }()), E(o, Jn, i === n - 1), E(o, Kn, i === n + 1))
        }

        function k(n) {
            n !== B(o, qn) && (E(o, qn, n), v && j(o, tt, n || null), c(n ? gn : mn, L))
        }

        function A() {
            var n = u.index;
            return n === i || d.cloneStatus && n === r
        }
        var L = {
            index: i,
            slideIndex: r,
            slide: o,
            container: y,
            isClone: m,
            mount: function() {
                m || (o.id = l.id + "-slide" + an(i + 1)), f(o, "click keydown", function(n) {
                    c("click" === n.type ? pn : _n, L, n)
                }), e([bn, Ln, hn, vn, En], x), e(Sn, _), h && e(dn, b)
            },
            destroy: function() {
                t = !0, a(), K(o, Zn), T(o, ot), j(o, "style", g)
            },
            update: x,
            style: function(n, t, i) {
                C(i && y || o, n, t)
            },
            isWithin: function(n, t) {
                return n = un(n - i), (n = !m && (d.rewind || u.is(ct)) ? $(n, u.length - n) : n) <= t
            }
        };
        return L
    }
    var st = a + "-interval";
    var lt = {
            passive: !1,
            capture: !0
        },
        dt = "touchmove mousemove",
        vt = "touchend touchcancel mouseup";
    var ht = ["Left", "Right", "Up", "Down"],
        pt = "keydown";
    var gt = a + "-lazy",
        mt = gt + "-srcset",
        yt = "[" + gt + "], [" + mt + "]";
    var wt = [" ", "Enter", "Spacebar"];
    var _t = Object.freeze({
            __proto__: null,
            Options: function(t, n, r) {
                var u, o, i, e = Dn(f);

                function c(n) {
                    n && removeEventListener("resize", e)
                }

                function f() {
                    var n = (n = function(n) {
                        return n[1].matches
                    }, s(o).filter(n)[0] || []);
                    n[0] !== i && function(n) {
                        n = r.breakpoints[n] || u;
                        n.destroy ? (t.options = u, t.destroy("completely" === n.destroy)) : (t.state.is(5) && (c(!0), t.mount()), t.options = n)
                    }(i = n[0])
                }
                return {
                    setup: function() {
                        try {
                            l(r, JSON.parse(X(t.root, a)))
                        } catch (n) {
                            Q(!1, n.message)
                        }
                        u = l({}, r);
                        var i, n = r.breakpoints;
                        n && (i = "min" === r.mediaQuery, o = Object.keys(n).sort(function(n, t) {
                            return i ? +t - +n : +n - +t
                        }).map(function(n) {
                            return [n, matchMedia("(" + (i ? "min" : "max") + "-width:" + n + "px)")]
                        }), f())
                    },
                    mount: function() {
                        o && addEventListener("resize", e)
                    },
                    destroy: c
                }
            },
            Direction: function(n, t, r) {
                return {
                    resolve: function(n, t) {
                        var i = r.direction;
                        return h[n]["rtl" !== i || t ? "ttb" === i ? 0 : -1 : 1] || n
                    },
                    orient: function(n) {
                        return n * ("rtl" === r.direction ? 1 : -1)
                    }
                }
            },
            Elements: function(n, t, i) {
                var r, u, o, e, c = Pn(n).on,
                    f = n.root,
                    a = {},
                    s = [];

                function l() {
                    var n;
                    ! function() {
                        u = P(f, "." + Mn), o = q(f, "." + Tn), e = P(o, "." + jn), Q(o && e, "A track/list element is missing."), k(s, z(e, "." + Fn + ":not(." + In + ")"));
                        var n = p("." + Hn),
                            t = p("." + Cn);
                        M(a, {
                            root: f,
                            slider: u,
                            track: o,
                            list: e,
                            slides: s,
                            arrows: t,
                            autoplay: n,
                            prev: q(t, "." + Nn),
                            next: q(t, "." + Xn),
                            bar: q(p("." + Bn), "." + Gn),
                            play: q(n, "." + Yn),
                            pause: q(n, "." + Un)
                        })
                    }(), n = f.id || function(n) {
                        return "" + n + an(sn[n] = (sn[n] || 0) + 1)
                    }(m), f.id = n, o.id = o.id || n + "-track", e.id = e.id || n + "-list", A(f, r = g())
                }

                function d() {
                    [f, o, e].forEach(function(n) {
                        T(n, "style")
                    }), _(s), K(f, r)
                }

                function v() {
                    d(), l()
                }

                function h() {
                    K(f, r), A(f, r = g())
                }

                function p(n) {
                    return P(f, n) || P(u, n)
                }

                function g() {
                    return [On + "--" + i.type, On + "--" + i.direction, i.drag && On + "--draggable", i.isNavigation && On + "--nav", qn]
                }
                return M(a, {
                    setup: l,
                    mount: function() {
                        c(bn, v, R - 2), c(xn, h)
                    },
                    destroy: d
                })
            },
            Slides: function(r, u, o) {
                var n = Pn(r),
                    t = n.on,
                    e = n.emit,
                    c = n.bind,
                    f = (n = u.Elements).slides,
                    a = n.list,
                    s = [];

                function i() {
                    f.forEach(function(n, t) {
                        v(n, t, -1)
                    })
                }

                function l() {
                    p(function(n) {
                        n.destroy()
                    }), _(s)
                }

                function d() {
                    l(), i()
                }

                function v(n, t, i) {
                    n = at(r, t, i, n);
                    n.mount(), s.push(n)
                }

                function h(n) {
                    return n ? g(function(n) {
                        return !n.isClone
                    }) : s
                }

                function p(n, t) {
                    h(t).forEach(n)
                }

                function g(t) {
                    return s.filter("function" == typeof t ? t : function(n) {
                        return D(t) ? W(n.slide, t) : x(w(t), n.index)
                    })
                }
                return {
                    mount: function() {
                        i(), t(bn, d), t([ln, bn], function() {
                            s.sort(function(n, t) {
                                return n.index - t.index
                            })
                        })
                    },
                    destroy: l,
                    update: function() {
                        p(function(n) {
                            n.update()
                        })
                    },
                    register: v,
                    get: h,
                    getIn: function(n) {
                        var t = u.Controller,
                            i = t.toIndex(n),
                            r = t.hasFocus() ? 1 : o.perPage;
                        return g(function(n) {
                            return on(n.index, i, i + r - 1)
                        })
                    },
                    getAt: function(n) {
                        return g(n)[0]
                    },
                    add: function(n, u) {
                        b(n, function(n) {
                            var t, i, r;
                            y(n = D(n) ? Y(n) : n) && ((t = f[u]) ? S(n, t) : L(a, n), A(n, o.classes.slide), n = n, i = e.bind(null, kn), n = J(n, "img"), (r = n.length) ? n.forEach(function(n) {
                                c(n, "load error", function() {
                                    --r || i()
                                })
                            }) : i())
                        }), e(bn)
                    },
                    remove: function(n) {
                        H(g(n).map(function(n) {
                            return n.slide
                        })), e(bn)
                    },
                    forEach: p,
                    filter: g,
                    style: function(t, i, r) {
                        p(function(n) {
                            n.style(t, i, r)
                        })
                    },
                    getLength: function(n) {
                        return (n ? f : s).length
                    },
                    isEnough: function() {
                        return s.length > o.perPage
                    }
                }
            },
            Layout: function(n, t, i) {
                var r, u, o = Pn(n),
                    e = o.on,
                    c = o.bind,
                    f = o.emit,
                    a = t.Slides,
                    s = t.Direction.resolve,
                    l = (t = t.Elements).root,
                    d = t.track,
                    v = t.list,
                    h = a.getAt;

                function p() {
                    u = null, r = "ttb" === i.direction, C(l, "maxWidth", V(i.width)), C(d, s("paddingLeft"), m(!1)), C(d, s("paddingRight"), m(!0)), g()
                }

                function g() {
                    var n = G(l);
                    u && u.width === n.width && u.height === n.height || (C(d, "height", function() {
                        var n = "";
                        r && (Q(n = y(), "height or heightRatio is missing."), n = "calc(" + n + " - " + m(!1) + " - " + m(!0) + ")");
                        return n
                    }()), a.style(s("marginRight"), V(i.gap)), a.style("width", (i.autoWidth ? "" : V(i.fixedWidth) || (r ? "" : w())) || null), a.style("height", V(i.fixedHeight) || (r ? i.autoHeight ? "" : w() : y()) || null, !0), u = n, f(An))
                }

                function m(n) {
                    var t = i.padding,
                        n = s(n ? "right" : "left");
                    return t && V(t[n] || (I(t) ? 0 : t)) || "0px"
                }

                function y() {
                    return V(i.height || G(v).width * i.heightRatio)
                }

                function w() {
                    var n = V(i.gap);
                    return "calc((100%" + (n && " + " + n) + ")/" + (i.perPage || 1) + (n && " - " + n) + ")"
                }

                function _(n, t) {
                    var i = h(n);
                    if (i) {
                        n = G(i.slide)[s("right")], i = G(v)[s("left")];
                        return un(n - i) + (t ? 0 : b())
                    }
                    return 0
                }

                function b() {
                    var n = h(0);
                    return n && parseFloat(C(n.slide, s("marginRight"))) || 0
                }
                return {
                    mount: function() {
                        p(), c(window, "resize load", Dn(f.bind(this, kn))), e([xn, bn], p), e(kn, g)
                    },
                    listSize: function() {
                        return G(v)[s("width")]
                    },
                    slideSize: function(n, t) {
                        return (n = h(n || 0)) ? G(n.slide)[s("width")] + (t ? 0 : b()) : 0
                    },
                    sliderSize: function() {
                        return _(n.length - 1, !0) - _(-1, !0)
                    },
                    totalSize: _,
                    getPadding: function(n) {
                        return parseFloat(C(d, s("padding" + (n ? "Right" : "Left")))) || 0
                    }
                }
            },
            Clones: function(c, n, f) {
                var t, i = Pn(c),
                    r = i.on,
                    u = i.emit,
                    a = n.Elements,
                    s = n.Slides,
                    o = n.Direction.resolve,
                    l = [];

                function e() {
                    (t = p()) && (function(u) {
                        var o = s.get().slice(),
                            e = o.length;
                        if (e) {
                            for (; o.length < u;) k(o, o);
                            k(o.slice(-u), o.slice(0, u)).forEach(function(n, t) {
                                var i = t < u,
                                    r = function(n, t) {
                                        n = n.cloneNode(!0);
                                        return A(n, f.classes.clone), n.id = c.root.id + "-clone" + an(t + 1), n
                                    }(n.slide, t);
                                i ? S(r, o[0].slide) : L(a.list, r), k(l, r), s.register(r, t - u + (i ? 0 : e), n.index)
                            })
                        }
                    }(t), u(kn))
                }

                function d() {
                    H(l), _(l)
                }

                function v() {
                    d(), e()
                }

                function h() {
                    t < p() && u(bn)
                }

                function p() {
                    var n, t, i = f.clones;
                    return c.is(ct) ? i || (n = a.list, D(t = f[o("fixedWidth")]) && (t = G(n = F("div", {
                        style: "width: " + t + "; position: absolute;"
                    }, n)).width, H(n)), i = ((t = t) && rn(G(a.track)[o("width")] / t) || f[o("autoWidth")] && c.length || f.perPage) * (f.drag ? (f.flickMaxPages || 1) + 1 : 2)) : i = 0, i
                }
                return {
                    mount: function() {
                        e(), r(bn, v), r([xn, kn], h)
                    },
                    destroy: d
                }
            },
            Move: function(e, c, f) {
                var a, n = Pn(e),
                    t = n.on,
                    s = n.emit,
                    r = (n = c.Layout).slideSize,
                    i = n.getPadding,
                    u = n.totalSize,
                    o = n.listSize,
                    l = n.sliderSize,
                    d = (n = c.Direction).resolve,
                    v = n.orient,
                    h = (n = c.Elements).list,
                    p = n.track;

                function g() {
                    k() || (c.Scroll.cancel(), m(e.index), s(Ln))
                }

                function m(n) {
                    y(_(n, !0))
                }

                function y(n, t) {
                    e.is(ft) || (t = t ? n : function(n) {
                        {
                            var t, i;
                            e.is(ct) && (i = v(n - b()), t = A(!1, n) && i < 0, i = A(!0, n) && 0 < i, (t || i) && (n = w(n, i)))
                        }
                        return n
                    }(n), h.style.transform = "translate" + d("X") + "(" + t + "px)", n !== t && s(hn))
                }

                function w(n, t) {
                    var i = n - x(t),
                        r = l();
                    return n -= v(r * (rn(un(i) / r) || 1)) * (t ? 1 : -1)
                }

                function _(n, t) {
                    var i = v(u(n - 1) - (i = n, "center" === (n = f.focus) ? (o() - r(i, !0)) / 2 : +n * r(i) || 0));
                    return t ? function(n) {
                        f.trimSpace && e.is(et) && (n = en(n, 0, v(l() - o())));
                        return n
                    }(i) : i
                }

                function b() {
                    var n = d("left");
                    return G(h)[n] - G(p)[n] + v(i(!1))
                }

                function x(n) {
                    return _(n ? c.Controller.getEnd() : 0, !!f.trimSpace)
                }

                function k() {
                    return e.state.is(4) && f.waitForTransition
                }

                function A(n, t) {
                    t = O(t) ? b() : t;
                    var i = !0 !== n && v(t) < v(x(!1)),
                        t = !1 !== n && v(t) > v(x(!0));
                    return i || t
                }
                return {
                    mount: function() {
                        a = c.Transition, t([ln, An, xn, bn], g)
                    },
                    destroy: function() {
                        T(h, "style")
                    },
                    move: function(n, t, i, r) {
                        var u, o;
                        k() || (u = e.state.set, o = b(), n !== t && (a.cancel(), y(w(o, t < n), !0)), u(4), s(dn, t, i, n), a.start(t, function() {
                            u(3), s(vn, t, i, n), "move" === f.trimSpace && n !== i && o === b() ? c.Controller.go(i < n ? ">" : "<", !1, r) : r && r()
                        }))
                    },
                    jump: m,
                    translate: y,
                    shift: w,
                    cancel: function() {
                        y(b()), a.cancel()
                    },
                    toIndex: function(n) {
                        for (var t = c.Slides.get(), i = 0, r = 1 / 0, u = 0; u < t.length; u++) {
                            var o = t[u].index,
                                e = un(_(o, !0) - n);
                            if (!(e <= r)) break;
                            r = e, i = o
                        }
                        return i
                    },
                    toPosition: _,
                    getPosition: b,
                    getLimit: x,
                    isBusy: k,
                    exceededLimit: A
                }
            },
            Controller: function(n, e, u) {
                var o, c, f, t = Pn(n).on,
                    a = e.Move,
                    s = a.getPosition,
                    l = a.getLimit,
                    i = e.Slides,
                    d = i.isEnough,
                    r = i.getLength,
                    v = n.is(ct),
                    h = n.is(et),
                    p = u.start || 0,
                    g = p;

                function m() {
                    o = r(!0), c = u.perMove, f = u.perPage, p = en(p, 0, o - 1)
                }

                function y(n, t, i, r, u) {
                    var o = t ? n : S(n);
                    e.Scroll.scroll(t || i ? a.toPosition(o, !0) : n, r, function() {
                        z(a.toIndex(a.getPosition())), u && u()
                    })
                }

                function w(n) {
                    return b(!1, n)
                }

                function _(n) {
                    return b(!0, n)
                }

                function b(n, t) {
                    var i, r, u = c || (P() ? 1 : f),
                        o = x(p + u * (n ? -1 : 1), p);
                    return -1 !== o || !h || (i = s(), r = l(!n), u = 1, un(i - r) < u) ? t ? o : A(o) : n ? 0 : k()
                }

                function x(n, t, i) {
                    var r;
                    return d() ? (r = k(), n < 0 || r < n ? n = on(0, n, t, !0) || on(r, t, n, !0) ? L(E(n)) : v ? c || P() ? n : n < 0 ? -(o % f || f) : o : u.rewind ? n < 0 ? r : 0 : -1 : i || n === t || (n = c ? n : L(E(t) + (n < t ? -1 : 1)))) : n = -1, n
                }

                function k() {
                    var n = o - f;
                    return (P() || v && c) && (n = o - 1), nn(n, 0)
                }

                function A(n) {
                    return v ? d() ? n % o + (n < 0 ? o : 0) : -1 : n
                }

                function L(n) {
                    return en(P() ? n : f * n, 0, k())
                }

                function E(n) {
                    return P() || (n = on(n, o - f, o - 1) ? o - 1 : n, n = tn(n / f)), n
                }

                function S(n) {
                    n = a.toIndex(n);
                    return h ? en(n, 0, k()) : n
                }

                function z(n) {
                    n !== p && (g = p, p = n)
                }

                function P() {
                    return !O(u.focus) || u.isNavigation
                }
                return {
                    mount: function() {
                        m(), t([xn, bn], m, R - 1)
                    },
                    go: function(n, t, i) {
                        var r = function(n) {
                            var t = p; {
                                var i, r;
                                D(n) ? (r = n.match(/([+\-<>])(\d+)?/) || [], i = r[1], r = r[2], "+" === i || "-" === i ? t = x(p + +("" + i + (+r || 1)), p, !0) : ">" === i ? t = r ? L(+r) : w(!0) : "<" === i && (t = _(!0))) : t = v ? n : en(n, 0, k())
                            }
                            return t
                        }(n);
                        u.useScroll ? y(r, !0, !0, u.speed, i) : -1 < (n = A(r)) && !a.isBusy() && (t || n !== p) && (z(n), a.move(r, n, g, i))
                    },
                    scroll: y,
                    getNext: w,
                    getPrev: _,
                    getAdjacent: b,
                    getEnd: k,
                    setIndex: z,
                    getIndex: function(n) {
                        return n ? g : p
                    },
                    toIndex: L,
                    toPage: E,
                    toDest: S,
                    hasFocus: P
                }
            },
            Arrows: function(u, n, i) {
                var r, t = Pn(u),
                    o = t.on,
                    e = t.bind,
                    c = t.emit,
                    f = i.classes,
                    a = i.i18n,
                    s = n.Elements,
                    l = n.Controller,
                    d = s.arrows,
                    v = s.prev,
                    h = s.next,
                    p = {};

                function g() {
                    var n, t;
                    i.arrows && (v && h || (d = F("div", f.arrows), v = m(!0), h = m(!1), r = !0, L(d, [v, h]), S(d, P("slider" === i.arrows && s.slider || u.root)))), v && h && (p.prev ? N(d, !1 === i.arrows ? "none" : "") : (n = s.track.id, j(v, nt, n), j(h, nt, n), p.prev = v, p.next = h, t = l.go, o([ln, vn, xn, bn, En], y), e(h, "click", function() {
                        t(">", !0)
                    }), e(v, "click", function() {
                        t("<", !0)
                    }), c("arrows:mounted", v, h)))
                }

                function m(n) {
                    return Y('<button class="' + f.arrow + " " + (n ? f.prev : f.next) + '" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40"><path d="' + (i.arrowPath || "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z") + '" />')
                }

                function y() {
                    var n = u.index,
                        t = l.getPrev(),
                        i = l.getNext(),
                        r = -1 < t && n < t ? a.last : a.prev,
                        n = -1 < i && i < n ? a.first : a.next;
                    v.disabled = t < 0, h.disabled = i < 0, j(v, it, r), j(h, it, n), c("arrows:updated", v, h, t, i)
                }
                return {
                    arrows: p,
                    mount: function() {
                        g(), o(xn, g)
                    },
                    destroy: function() {
                        r ? H(d) : (T(v, ot), T(h, ot))
                    }
                }
            },
            Autoplay: function(t, i, r) {
                var u, o, e, n = Pn(t),
                    c = n.on,
                    f = n.bind,
                    a = n.emit,
                    s = Rn(r.interval, t.go.bind(t, ">"), function(n) {
                        var t = d.bar;
                        t && C(t, "width", 100 * n + "%"), a("autoplay:playing", n)
                    }),
                    l = s.isPaused,
                    d = i.Elements;

                function v(n) {
                    var t = n ? "pause" : "play",
                        i = d[t];
                    i && (j(i, nt, d.track.id), j(i, it, r.i18n[t]), f(i, "click", n ? p : h))
                }

                function h() {
                    l() && i.Slides.isEnough() && (s.start(!r.resetProgress), o = u = e = !1, a("autoplay:play"))
                }

                function p(n) {
                    void 0 === n && (n = !0), l() || (s.pause(), a("autoplay:pause")), e = n
                }

                function g() {
                    e || (u || o ? p(!1) : h())
                }

                function m() {
                    var n = i.Slides.getAt(t.index);
                    s.set(n && +X(n.slide, st) || r.interval)
                }
                return {
                    mount: function() {
                        var n = r.autoplay;
                        n && (v(!0), v(!1), function() {
                            var n = d.root;
                            r.pauseOnHover && f(n, "mouseenter mouseleave", function(n) {
                                u = "mouseenter" === n.type, g()
                            });
                            r.pauseOnFocus && f(n, "focusin focusout", function(n) {
                                o = "focusin" === n.type, g()
                            });
                            c([dn, "scroll", bn], s.rewind), c(dn, m)
                        }(), "pause" !== n && h())
                    },
                    destroy: s.cancel,
                    play: h,
                    pause: p,
                    isPaused: l
                }
            },
            Cover: function(n, t, i) {
                var r = Pn(n).on;

                function u(i) {
                    t.Slides.forEach(function(n) {
                        var t = P(n.container || n.slide, "img");
                        t && t.src && o(i, t, n)
                    })
                }

                function o(n, t, i) {
                    i.style("background", n ? 'center/cover no-repeat url("' + t.src + '")' : "", !0), N(t, n ? "none" : "")
                }
                return {
                    mount: function() {
                        i.cover && (r(zn, function(n, t) {
                            o(!0, n, t)
                        }), r([ln, xn, bn], u.bind(null, !0)))
                    },
                    destroy: function() {
                        u(!1)
                    }
                }
            },
            Scroll: function(c, n, f) {
                var a, s, t = Pn(c),
                    i = t.on,
                    l = t.emit,
                    d = n.Move,
                    v = d.getPosition,
                    h = d.getLimit,
                    p = d.exceededLimit;

                function g(r, n, t, u) {
                    var i, o = v(),
                        e = 1;
                    n = n || (i = un(r - o), nn(i / 1.5, 800)), s = t, y(), a = Rn(n, m, function(n) {
                        var t = v(),
                            i = (o + (r - o) * (i = n, (n = f.easingFunc) ? n(i) : 1 - Math.pow(1 - i, 4)) - v()) * e;
                        d.translate(t + i), c.is(et) && !u && p() && (e *= .6, un(i) < 10 && (i = p(!1), g(h(!i), 600, null, !0)))
                    }, 1), l("scroll"), a.start()
                }

                function m() {
                    var n = v(),
                        t = d.toIndex(n);
                    on(t, 0, c.length - 1) || d.translate(d.shift(n, 0 < t), !0), s && s(), l(En)
                }

                function y() {
                    a && a.cancel()
                }

                function r() {
                    a && !a.isPaused() && (y(), m())
                }
                return {
                    mount: function() {
                        i(dn, y), i([xn, bn], r)
                    },
                    destroy: y,
                    scroll: g,
                    cancel: r
                }
            },
            Drag: function(u, o, e) {
                var c, f, a, s, l, d, v, r, h, n = Pn(u),
                    t = n.on,
                    p = n.emit,
                    g = n.bind,
                    m = n.unbind,
                    y = o.Move,
                    w = o.Scroll,
                    _ = o.Controller,
                    b = o.Elements.track,
                    i = (n = o.Direction).resolve,
                    x = n.orient,
                    k = y.getPosition,
                    A = y.exceededLimit,
                    L = !1;

                function E() {
                    var n = e.drag;
                    F(!n), l = "free" === n
                }

                function S(n) {
                    var t, i;
                    r || (i = e.noDrag, t = j(n), i = !i || !W(n.target, i), v = !1, !i || !t && n.button || (y.isBusy() ? U(n, !0) : (h = t ? b : window, s = a = null, g(h, dt, z, lt), g(h, vt, P, lt), y.cancel(), w.cancel(), R(n))))
                }

                function z(n) {
                    var t, i, r;
                    s || p("drag"), (s = n).cancelable && (t = M(n) - M(f), d ? (y.translate(c + t / (L && u.is(et) ? 5 : 1)), i = 200 < T(n) - T(f), r = L !== (L = A()), (i || r) && R(n), p("dragging"), v = !0, U(n)) : (r = I(r = e.dragMinThreshold) ? r : {
                        mouse: 0,
                        touch: +r || 10
                    }, d = un(t) > (j(n) ? r.touch : r.mouse), O() && U(n)))
                }

                function P(n) {
                    m(h, dt, z), m(h, vt, P);
                    var t, i, r = u.index;
                    s ? ((d || n.cancelable && O()) && (t = function(n) {
                        if (u.is(ct) || !L) {
                            var t = f === s && a || f,
                                i = M(s) - M(t),
                                t = T(n) - T(t),
                                n = T(n) - T(s) < 200;
                            if (t && n) return i / t
                        }
                        return 0
                    }(n), i = t, i = k() + cn(i) * $(un(i) * (e.flickPower || 600), l ? 1 / 0 : o.Layout.listSize() * (e.flickMaxPages || 1)), l ? _.scroll(i) : u.is(ft) ? _.go(r + x(cn(t))) : _.go(_.toDest(i), !0), U(n)), p("dragged")) : l || k() === y.toPosition(r) || _.go(r, !0), d = !1
                }

                function R(n) {
                    a = f, f = n, c = k()
                }

                function D(n) {
                    !r && v && U(n, !0)
                }

                function O() {
                    var n = un(M(s) - M(f));
                    return un(M(s, !0) - M(f, !0)) < n
                }

                function M(n, t) {
                    return (j(n) ? n.touches[0] : n)["page" + i(t ? "Y" : "X")]
                }

                function T(n) {
                    return n.timeStamp
                }

                function j(n) {
                    return "undefined" != typeof TouchEvent && n instanceof TouchEvent
                }

                function F(n) {
                    r = n
                }
                return {
                    mount: function() {
                        g(b, dt, Z, lt), g(b, vt, Z, lt), g(b, "touchstart mousedown", S, lt), g(b, "click", D, {
                            capture: !0
                        }), g(b, "dragstart", U), t([ln, xn], E)
                    },
                    disable: F,
                    isDragging: function() {
                        return d
                    }
                }
            },
            Keyboard: function(t, n, i) {
                var r, u, o = Pn(t),
                    e = o.on,
                    c = o.bind,
                    f = o.unbind,
                    a = t.root,
                    s = n.Direction.resolve;

                function l() {
                    var n = i.keyboard;
                    n && ("focused" === n ? j(r = a, ut, 0) : r = window, c(r, pt, p))
                }

                function d() {
                    f(r, pt), y(r) && T(r, ut)
                }

                function v() {
                    var n = u;
                    u = !0, g(function() {
                        u = n
                    })
                }

                function h() {
                    d(), l()
                }

                function p(n) {
                    u || (n = n.key, (n = x(ht, n) ? "Arrow" + n : n) === s("ArrowLeft") ? t.go("<") : n === s("ArrowRight") && t.go(">"))
                }
                return {
                    mount: function() {
                        l(), e(xn, h), e(dn, v)
                    },
                    destroy: d,
                    disable: function(n) {
                        u = n
                    }
                }
            },
            LazyLoad: function(i, n, e) {
                var t = Pn(i),
                    r = t.on,
                    u = t.off,
                    o = t.bind,
                    c = t.emit,
                    f = "sequential" === e.lazyLoad,
                    a = [],
                    s = 0;

                function l() {
                    v(), d()
                }

                function d() {
                    n.Slides.forEach(function(o) {
                        J(o.slide, yt).forEach(function(n) {
                            var t, i, r = X(n, gt),
                                u = X(n, mt);
                            r === n.src && u === n.srcset || (t = e.classes.spinner, j(i = P(i = n.parentElement, "." + t) || F("span", t, i), $n, "presentation"), a.push({
                                o: n,
                                e: o,
                                src: r,
                                srcset: u,
                                c: i
                            }), n.src || N(n, "none"))
                        })
                    }), f && g()
                }

                function v() {
                    s = 0, a = []
                }

                function h() {
                    (a = a.filter(function(n) {
                        var t = e.perPage * ((e.preloadPages || 1) + 1) - 1;
                        return !n.e.isWithin(i.index, t) || p(n)
                    })).length || u(vn)
                }

                function p(t) {
                    var i = t.o;
                    A(t.e.slide, Qn), o(i, "load error", function(n) {
                        ! function(n, t) {
                            var i = n.e;
                            K(i.slide, Qn), t || (H(n.c), N(n.o, ""), c(zn, n.o, i), c(kn));
                            f && g()
                        }(t, "error" === n.type)
                    }), ["srcset", "src"].forEach(function(n) {
                        t[n] && (j(i, n, t[n]), T(i, "src" === n ? gt : mt))
                    })
                }

                function g() {
                    s < a.length && p(a[s++])
                }
                return {
                    mount: function() {
                        e.lazyLoad && (d(), r(bn, l), f || r([ln, bn, vn, En], h))
                    },
                    destroy: v
                }
            },
            Pagination: function(l, n, d) {
                var v, t = Pn(l),
                    i = t.on,
                    r = t.emit,
                    h = t.bind,
                    u = t.unbind,
                    p = n.Slides,
                    g = n.Elements,
                    o = n.Controller,
                    m = o.hasFocus,
                    e = o.getIndex,
                    y = [];

                function c() {
                    f(), d.pagination && p.isEnough() && (function() {
                        var n = l.length,
                            t = d.classes,
                            i = d.i18n,
                            r = d.perPage,
                            u = "slider" === d.pagination && g.slider || g.root,
                            o = m() ? n : rn(n / r);
                        v = F("ul", t.pagination, u);
                        for (var e = 0; e < o; e++) {
                            var c = F("li", null, v),
                                f = F("button", {
                                    class: t.page,
                                    type: "button"
                                }, c),
                                a = p.getIn(e).map(function(n) {
                                    return n.slide.id
                                }),
                                s = !m() && 1 < r ? i.pageX : i.slideX;
                            h(f, "click", w.bind(null, e)), j(f, nt, a.join(" ")), j(f, it, fn(s, e + 1)), y.push({
                                li: c,
                                button: f,
                                page: e
                            })
                        }
                    }(), r("pagination:mounted", {
                        list: v,
                        items: y
                    }, a(l.index)), s())
                }

                function f() {
                    v && (H(v), y.forEach(function(n) {
                        u(n.button, "click")
                    }), _(y), v = null)
                }

                function w(t) {
                    o.go(">" + t, !0, function() {
                        var n = p.getAt(o.toIndex(t));
                        n && ((n = n.slide).setActive && n.setActive() || n.focus({
                            preventScroll: !0
                        }))
                    })
                }

                function a(n) {
                    return y[o.toPage(n)]
                }

                function s() {
                    var n = a(e(!0)),
                        t = a(e());
                    n && (K(n.button, qn), T(n.button, tt)), t && (A(t.button, qn), j(t.button, tt, !0)), r("pagination:updated", {
                        list: v,
                        items: y
                    }, n, t)
                }
                return {
                    items: y,
                    mount: function() {
                        c(), i([xn, bn], c), i([dn, En], s)
                    },
                    destroy: f,
                    getAt: a,
                    update: s
                }
            },
            Sync: function(u, n, i) {
                var r = n.Elements.list,
                    o = [];

                function t() {
                    var n, t;
                    u.splides.forEach(function(n) {
                        var i;
                        n.isParent || (i = n.splide, [u, i].forEach(function(n) {
                            var t = Pn(n),
                                r = n === u ? i : u;
                            t.on(dn, function(n, t, i) {
                                r.go(r.is(ct) ? i : n)
                            }), o.push(t)
                        }))
                    }), i.isNavigation && (n = Pn(u), (t = n.on)(pn, f), t(_n, a), t([ln, xn], c), j(r, $n, "menu"), o.push(n), n.emit(Sn, u.splides))
                }

                function e() {
                    T(r, ot), o.forEach(function(n) {
                        n.destroy()
                    }), _(o)
                }

                function c() {
                    j(r, p, "ttb" !== i.direction ? "horizontal" : null)
                }

                function f(n) {
                    u.go(n.index)
                }

                function a(n, t) {
                    x(wt, t.key) && (f(n), U(t))
                }
                return {
                    mount: t,
                    destroy: e,
                    remount: function() {
                        e(), t()
                    }
                }
            },
            Wheel: function(i, r, u) {
                var n = Pn(i).bind;

                function t(n) {
                    var t;
                    !n.cancelable || (t = n.deltaY) && (i.go((t = t < 0) ? "<" : ">"), t = t, u.releaseWheel && !i.state.is(4) && -1 === r.Controller.getAdjacent(t) || U(n))
                }
                return {
                    mount: function() {
                        u.wheel && n(r.Elements.track, "wheel", t, lt)
                    }
                }
            }
        }),
        bt = {
            type: "slide",
            speed: 400,
            waitForTransition: !0,
            perPage: 1,
            cloneStatus: !0,
            arrows: !0,
            pagination: !0,
            interval: 5e3,
            pauseOnHover: !0,
            pauseOnFocus: !0,
            resetProgress: !0,
            keyboard: !0,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
            drag: !0,
            direction: "ltr",
            slideFocus: !0,
            trimSpace: !0,
            focusableNodes: "a, button, textarea, input, select, iframe",
            classes: {
                slide: Fn,
                clone: In,
                arrows: Cn,
                arrow: t,
                prev: Nn,
                next: Xn,
                pagination: i,
                page: i + "__page",
                spinner: m + "__spinner"
            },
            i18n: {
                prev: "Previous slide",
                next: "Next slide",
                first: "Go to first slide",
                last: "Go to last slide",
                slideX: "Go to slide %s",
                pageX: "Go to page %s",
                play: "Start autoplay",
                pause: "Pause autoplay"
            }
        };

    function xt(n, r, t) {
        var i = Pn(n).on;
        return {
            mount: function() {
                i([ln, bn], function() {
                    g(function() {
                        r.Slides.style("transition", "opacity " + t.speed + "ms " + t.easing)
                    })
                })
            },
            start: function(n, t) {
                var i = r.Elements.track;
                C(i, "height", V(G(i).height)), g(function() {
                    t(), C(i, "height", "")
                })
            },
            cancel: Z
        }
    }

    function kt(o, n, e) {
        var c, t = Pn(o).bind,
            f = n.Move,
            a = n.Controller,
            i = n.Elements.list;

        function r() {
            s("")
        }

        function s(n) {
            C(i, "transition", n)
        }
        return {
            mount: function() {
                t(i, "transitionend", function(n) {
                    n.target === i && c && (r(), c())
                })
            },
            start: function(n, t) {
                var i = f.toPosition(n, !0),
                    r = f.getPosition(),
                    u = function(n) {
                        var t = e.rewindSpeed;
                        if (o.is(et) && t) {
                            var i = a.getIndex(!0),
                                r = a.getEnd();
                            if (0 === i && r <= n || r <= i && 0 === n) return t
                        }
                        return e.speed
                    }(n);
                1 <= un(i - r) && 1 <= u ? (s("transform " + u + "ms " + e.easing), f.translate(i, !0), c = t) : (f.jump(n), t())
            },
            cancel: r
        }
    }
    i = function() {
        function i(n, t) {
            this.event = c(), this.Components = {}, this.state = d(1), this.splides = [], this.f = {}, this.a = {};
            n = D(n) ? q(document, n) : n;
            Q(n, n + " is invalid."), this.root = n, l(bt, i.defaults), l(l(this.f, bt), t || {})
        }
        var n, t, r = i.prototype;
        return r.mount = function(n, t) {
            var i = this,
                r = this.state,
                u = this.Components;
            return Q(r.is([1, 5]), "Already mounted!"), r.set(1), this.s = u, this.l = t || this.l || (this.is(ft) ? xt : kt), this.a = n || this.a, e(M({}, _t, this.a, {
                Transition: this.l
            }), function(n, t) {
                n = n(i, u, i.f);
                (u[t] = n).setup && n.setup()
            }), e(u, function(n) {
                n.mount && n.mount()
            }), this.emit(ln), A(this.root, "is-initialized"), r.set(3), this.emit("ready"), this
        }, r.sync = function(n) {
            return this.splides.push({
                splide: n
            }), n.splides.push({
                splide: this,
                isParent: !0
            }), this.state.is(3) && (this.s.Sync.remount(), n.Components.Sync.remount()), this
        }, r.go = function(n) {
            return this.s.Controller.go(n), this
        }, r.on = function(n, t) {
            return this.event.on(n, t, null, 20), this
        }, r.off = function(n) {
            return this.event.off(n), this
        }, r.emit = function(n) {
            var t;
            return (t = this.event).emit.apply(t, [n].concat(s(arguments, 1))), this
        }, r.add = function(n, t) {
            return this.s.Slides.add(n, t), this
        }, r.remove = function(n) {
            return this.s.Slides.remove(n), this
        }, r.is = function(n) {
            return this.f.type === n
        }, r.refresh = function() {
            return this.emit(bn), this
        }, r.destroy = function(t) {
            void 0 === t && (t = !0);
            var n = this.event,
                i = this.state;
            return i.is(1) ? n.on("ready", this.destroy.bind(this, t), this) : (e(this.s, function(n) {
                n.destroy && n.destroy(t)
            }, !0), n.emit(f), n.destroy(), t && _(this.splides), i.set(5)), this
        }, n = i, (r = [{
            key: "options",
            get: function() {
                return this.f
            },
            set: function(n) {
                var t = this.f;
                l(t, n), this.state.is(1) || this.emit(xn, t)
            }
        }, {
            key: "length",
            get: function() {
                return this.s.Slides.getLength(!0)
            }
        }, {
            key: "index",
            get: function() {
                return this.s.Controller.getIndex()
            }
        }]) && At(n.prototype, r), t && At(n, t), Object.defineProperty(n, "prototype", {
            writable: !1
        }), i
    }();
    return i.defaults = {}, i.STATES = n, i
}, "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (n = "undefined" != typeof globalThis ? globalThis : n || self).Splide = t();;
/* @license MIT https://github.com/splidejs/splide-extension-video/blob/master/LICENSE */
function bt(t, n) {
    t.prototype = Object.create(n.prototype), e(t.prototype.constructor = t, n)
}

function e(t, n) {
    return (e = Object.setPrototypeOf || function(t, n) {
        return t.__proto__ = n, t
    })(t, n)
}
/*!
 * Splide.js
 * Version  : 0.5.0
 * License  : MIT
 * Copyright: 2021 Naotoshi Fujita
 */
var t;
t = function() {
    "use strict";
    var e = 10;

    function s(t) {
        return Array.isArray(t) ? t : [t]
    }
    var r = Array.prototype;

    function i() {
        var u = {};

        function i(t, i) {
            n(t, function(t, n) {
                var e = u[t];
                u[t] = e && e.filter(function(t) {
                    return t.t ? t.t !== i : t.n !== n
                })
            })
        }

        function n(t, n) {
            s(t).join(" ").split(" ").forEach(function(t) {
                t = t.split(".");
                n(t[0], t[1])
            })
        }
        return {
            on: function(t, i, r, o) {
                void 0 === o && (o = e), n(t, function(t, n) {
                    var e;
                    u[t] = u[t] || [], e = u[t], n = {
                        e: t,
                        i: i,
                        n: n,
                        r: o,
                        t: r
                    }, e.push.apply(e, s(n)), e.sort(function(t, n) {
                        return t.r - n.r
                    })
                })
            },
            off: i,
            offBy: function(e) {
                ! function(t, n) {
                    if (t)
                        for (var e = Object.keys(t), i = 0; i < e.length; i++) {
                            var r = e[i];
                            if ("__proto__" !== r && !1 === n(t[r], r)) break
                        }
                }(u, function(t, n) {
                    i(n, e)
                })
            },
            emit: function(t) {
                var e = arguments;
                (u[t] || []).forEach(function(t) {
                    var n;
                    t.i.apply(t, (t = 1, r.slice.call(e, t, n)))
                })
            },
            destroy: function() {
                u = {}
            }
        }
    }
    var c = "destroy";

    function o(t) {
        var i = t.event,
            r = {},
            o = [];

        function n(t, n) {
            u(t, n, function(n, e) {
                o = o.filter(function(t) {
                    return t[0] !== n || t[1] !== e || (n.removeEventListener(e, t[2], t[3]), !1)
                })
            })
        }

        function u(t, n, e) {
            var i;
            i = function(t) {
                t && n.split(" ").forEach(e.bind(null, t))
            }, s(t).forEach(i)
        }

        function e() {
            o = o.filter(function(t) {
                return n(t[0], t[1])
            }), i.offBy(r)
        }
        return i.on(c, e, r), {
            on: function(t, n, e) {
                i.on(t, n, r, e)
            },
            off: function(t) {
                i.off(t, r)
            },
            emit: i.emit,
            bind: function(t, n, e, i) {
                u(t, n, function(t, n) {
                    o.push([t, n, e, i]), t.addEventListener(n, e, i)
                })
            },
            unbind: n,
            destroy: e
        }
    }

    function u(t) {
        var e = t;
        return {
            set: function(t) {
                e = t
            },
            is: function(t) {
                return n = s(t), t = e, -1 < n.indexOf(t);
                var n
            }
        }
    }

    function a(t) {
        return !l(t) && "object" == typeof t
    }

    function f(t) {
        return Array.isArray(t)
    }

    function h(t) {
        return "string" == typeof t
    }

    function l(t) {
        return null === t
    }

    function d(t, n) {
        (f(t = t) ? t : [t]).forEach(n)
    }
    var v = Array.prototype;

    function y(t, n, e) {
        return v.slice.call(t, n, e)
    }

    function p(n, t, e) {
        n && d(t, function(t) {
            t && n.classList[e ? "add" : "remove"](t)
        })
    }

    function w(t, n) {
        p(t, h(n) ? n.split(" ") : n, !0)
    }

    function m(t, n) {
        return t ? y(t.children).filter(function(t) {
            return ((t = t).msMatchesSelector || t.matches).call(t, n)
        }) : []
    }

    function k(t, n) {
        if (t)
            for (var e = Object.keys(t), i = 0; i < e.length; i++) {
                var r = e[i];
                if ("__proto__" !== r && !1 === n(t[r], r)) break
            }
        return t
    }

    function b(i) {
        return y(arguments, 1).forEach(function(e) {
            k(e, function(t, n) {
                i[n] = e[n]
            })
        }), i
    }

    function g(e, t) {
        return k(t, function(t, n) {
            f(t) ? e[n] = t.slice() : a(t) ? e[n] = g(a(e[n]) ? e[n] : {}, t) : e[n] = t
        }), e
    }

    function E(e, t, n) {
        var i, r;
        a(t) ? k(t, function(t, n) {
            E(e, n, t)
        }) : l(n) ? (r = t, (i = e) && d(r, function(t) {
            i.removeAttribute(t)
        })) : e.setAttribute(t, String(n))
    }

    function T(t, n, e) {
        t = document.createElement(t);
        return n && (h(n) ? w : E)(t, n), e && d(t, e.appendChild.bind(e)), t
    }

    function _(t, n) {
        ! function(e, t) {
            if (h(t)) return getComputedStyle(e)[t];
            k(t, function(t, n) {
                l(t) || (e.style[n] = "" + t)
            })
        }(t, {
            display: n
        })
    }
    var P = Math.min,
        F = Math.max;
    Math.floor, Math.ceil, Math.abs;

    function C(t, n, e) {
        var i = P(n, e),
            e = F(n, e);
        return P(F(i, t), e)
    }
    var j = "splide__video",
        M = {
            hideControls: !1,
            loop: !1,
            mute: !1,
            volume: .2
        },
        x = "video:click",
        t = function() {
            function t(t, n, e) {
                this.state = u(1), this.event = i(), this.target = t, this.videoId = n, this.options = e || {}, this.onPlay = this.onPlay.bind(this), this.onPause = this.onPause.bind(this), this.onEnded = this.onEnded.bind(this), this.onPlayerReady = this.onPlayerReady.bind(this), this.onError = this.onError.bind(this)
            }
            var n = t.prototype;
            return n.on = function(t, n) {
                this.event.on(t, n)
            }, n.play = function() {
                var t = this.state;
                if (!t.is(9)) return this.event.emit("play"), t.is(2) ? t.set(4) : t.is(3) ? (this.player = this.createPlayer(this.videoId), t.set(4)) : void(t.is([4, 8]) || t.is(5) && (t.set(6), this.playVideo()));
                console.error("[splide] Can not play this video.")
            }, n.pause = function() {
                var t = this.state;
                if (!t.is(9)) return this.event.emit("pause"), t.is(4) ? t.set(2) : t.is(6) ? t.set(7) : void(t.is(8) && (this.pauseVideo(), this.state.set(5)))
            }, n.destroy = function() {
                this.event.destroy()
            }, n.onPlayerReady = function() {
                var t = this.state,
                    n = t.is(4);
                t.set(5), n && this.play()
            }, n.onPlay = function() {
                var t = this.state,
                    n = t.is(7);
                t.set(8), n ? this.pause() : this.event.emit("played")
            }, n.onPause = function() {
                this.state.set(5), this.event.emit("paused")
            }, n.onEnded = function() {
                this.state.set(5), this.event.emit("ended")
            }, n.onError = function() {
                this.state.set(9)
            }, t
        }(),
        n = function(i) {
            function t(t, n, e) {
                return (e = i.call(this, t, n, e = void 0 === e ? {} : e) || this).state.set(3), e
            }
            bt(t, i);
            var n = t.prototype;
            return n.createPlayer = function(t) {
                var n = this.options,
                    e = this.options.playerOptions,
                    i = void 0 === e ? {} : e,
                    e = T("video", {
                        src: t
                    }, this.target),
                    t = e.addEventListener.bind(e);
                return b(e, {
                    controls: !n.hideControls,
                    loop: n.loop,
                    volume: C(n.volume, 0, 1),
                    muted: n.mute
                }, i.htmlVideo || {}), t("play", this.onPlay), t("pause", this.onPause), t("ended", this.onEnded), t("loadeddata", this.onPlayerReady), t("error", this.onError), e
            }, n.playVideo = function() {
                var t = this;
                this.player.play().catch(function() {
                    t.state.is(7) && t.state.set(5)
                })
            }, n.pauseVideo = function() {
                this.player.pause()
            }, n.destroy = function() {
                i.prototype.destroy.call(this);
                var t = this.player,
                    t = t.addEventListener.bind(t);
                t("play", this.onPlay), t("pause", this.onPause), t("ended", this.onEnded), t("loadeddata", this.onPlayerReady)
            }, t
        }(t);

    function I(t, n) {
        for (var e = 0; e < n.length; e++) {
            var i = n[e];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
        }
    }
    var R = "undefined" != typeof global && "[object global]" === {}.toString.call(global);

    function A(t, n) {
        return 0 === t.indexOf(n.toLowerCase()) ? t : "".concat(n.toLowerCase()).concat(t.substr(0, 1).toUpperCase()).concat(t.substr(1))
    }

    function S(t) {
        return /^(https?:)?\/\/((player|www)\.)?vimeo\.com(?=$|\/)/.test(t)
    }

    function q(t) {
        var n = 0 < arguments.length && void 0 !== t ? t : {},
            e = n.id,
            t = n.url,
            n = e || t;
        if (!n) throw new Error("An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.");
        if (t = n, !isNaN(parseFloat(t)) && isFinite(t) && Math.floor(t) == t) return "https://vimeo.com/".concat(n);
        if (S(n)) return n.replace("http:", "https:");
        if (e) throw new TypeError("“".concat(e, "” is not a valid video id."));
        throw new TypeError("“".concat(n, "” is not a vimeo.com url."))
    }
    var O = void 0 !== Array.prototype.indexOf,
        N = "undefined" != typeof window && void 0 !== window.postMessage;
    if (!(R || O && N)) throw new Error("Sorry, the Vimeo Player API is not available in this browser.");
    var V, z, W = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};

    function Y() {
        if (void 0 === this) throw new TypeError("Constructor WeakMap requires 'new'");
        if (z(this, "_id", "_WeakMap_" + L() + "." + L()), 0 < arguments.length) throw new TypeError("WeakMap iterable is not supported")
    }

    function B(t, n) {
        if (!Q(t) || !V.call(t, "_id")) throw new TypeError(n + " method called on incompatible receiver " + typeof t)
    }

    function L() {
        return Math.random().toString().substring(2)
    }

    function Q(t) {
        return Object(t) === t
    }(N = "undefined" != typeof self ? self : "undefined" != typeof window ? window : W).WeakMap || (V = Object.prototype.hasOwnProperty, N.WeakMap = ((z = function(t, n, e) {
        Object.defineProperty ? Object.defineProperty(t, n, {
            configurable: !0,
            writable: !0,
            value: e
        }) : t[n] = e
    })(Y.prototype, "delete", function(t) {
        if (B(this, "delete"), !Q(t)) return !1;
        var n = t[this.o];
        return !(!n || n[0] !== t) && (delete t[this.o], !0)
    }), z(Y.prototype, "get", function(t) {
        if (B(this, "get"), Q(t)) {
            var n = t[this.o];
            return n && n[0] === t ? n[1] : void 0
        }
    }), z(Y.prototype, "has", function(t) {
        if (B(this, "has"), !Q(t)) return !1;
        var n = t[this.o];
        return !(!n || n[0] !== t)
    }), z(Y.prototype, "set", function(t, n) {
        if (B(this, "set"), !Q(t)) throw new TypeError("Invalid value used as weak map key");
        var e = t[this.o];
        return e && e[0] === t ? e[1] = n : z(t, this.o, [t, n]), this
    }), z(Y, "_polyfill", !0), Y));
    var U, D = (function(t) {
            var n, e, i;
            i = function() {
                var n, e, i, r, o, t = Object.prototype.toString,
                    u = "undefined" != typeof setImmediate ? function(t) {
                        return setImmediate(t)
                    } : setTimeout;
                try {
                    Object.defineProperty({}, "x", {}), n = function(t, n, e, i) {
                        return Object.defineProperty(t, n, {
                            value: e,
                            writable: !0,
                            configurable: !1 !== i
                        })
                    }
                } catch (t) {
                    n = function(t, n, e) {
                        return t[n] = e, t
                    }
                }

                function s(t, n) {
                    this.fn = t, this.self = n, this.next = void 0
                }

                function c(t, n) {
                    w.add(t, n), e = e || u(w.drain)
                }

                function a(t) {
                    var n, e = typeof t;
                    return "function" == typeof(n = null != t && ("object" == e || "function" == e) ? t.then : n) && n
                }

                function f() {
                    for (var t = 0; t < this.chain.length; t++) ! function(t, n, e) {
                        var i, r;
                        try {
                            !1 === n ? e.reject(t.msg) : (i = !0 === n ? t.msg : n.call(void 0, t.msg)) === e.promise ? e.reject(TypeError("Promise-chain cycle")) : (r = a(i)) ? r.call(i, e.resolve, e.reject) : e.resolve(i)
                        } catch (t) {
                            e.reject(t)
                        }
                    }(this, 1 === this.state ? this.chain[t].success : this.chain[t].failure, this.chain[t]);
                    this.chain.length = 0
                }

                function h(t) {
                    var e, i = this;
                    if (!i.triggered) {
                        i.triggered = !0, i.def && (i = i.def);
                        try {
                            (e = a(t)) ? c(function() {
                                var n = new v(i);
                                try {
                                    e.call(t, function() {
                                        h.apply(n, arguments)
                                    }, function() {
                                        l.apply(n, arguments)
                                    })
                                } catch (t) {
                                    l.call(n, t)
                                }
                            }): (i.msg = t, i.state = 1, 0 < i.chain.length && c(f, i))
                        } catch (t) {
                            l.call(new v(i), t)
                        }
                    }
                }

                function l(t) {
                    var n = this;
                    n.triggered || (n.triggered = !0, (n = n.def ? n.def : n).msg = t, n.state = 2, 0 < n.chain.length && c(f, n))
                }

                function d(t, e, i, r) {
                    for (var n = 0; n < e.length; n++) ! function(n) {
                        t.resolve(e[n]).then(function(t) {
                            i(n, t)
                        }, r)
                    }(n)
                }

                function v(t) {
                    this.def = t, this.triggered = !1
                }

                function y(t) {
                    this.promise = t, this.state = 0, this.triggered = !1, this.chain = [], this.msg = void 0
                }

                function p(t) {
                    if ("function" != typeof t) throw TypeError("Not a function");
                    if (0 !== this.u) throw TypeError("Not a promise");
                    this.u = 1;
                    var i = new y(this);
                    this.then = function(t, n) {
                        var e = {
                            success: "function" != typeof t || t,
                            failure: "function" == typeof n && n
                        };
                        return e.promise = new this.constructor(function(t, n) {
                            if ("function" != typeof t || "function" != typeof n) throw TypeError("Not a function");
                            e.resolve = t, e.reject = n
                        }), i.chain.push(e), 0 !== i.state && c(f, i), e.promise
                    }, this.catch = function(t) {
                        return this.then(void 0, t)
                    };
                    try {
                        t.call(void 0, function(t) {
                            h.call(i, t)
                        }, function(t) {
                            l.call(i, t)
                        })
                    } catch (t) {
                        l.call(i, t)
                    }
                }
                var w = {
                        add: function(t, n) {
                            o = new s(t, n), r ? r.next = o : i = o, r = o, o = void 0
                        },
                        drain: function() {
                            var t = i;
                            for (i = r = e = void 0; t;) t.fn.call(t.self), t = t.next
                        }
                    },
                    m = n({}, "constructor", p, !1);
                return n(p.prototype = m, "__NPO__", 0, !1), n(p, "resolve", function(e) {
                    return e && "object" == typeof e && 1 === e.u ? e : new this(function(t, n) {
                        if ("function" != typeof t || "function" != typeof n) throw TypeError("Not a function");
                        t(e)
                    })
                }), n(p, "reject", function(e) {
                    return new this(function(t, n) {
                        if ("function" != typeof t || "function" != typeof n) throw TypeError("Not a function");
                        n(e)
                    })
                }), n(p, "all", function(n) {
                    var u = this;
                    return "[object Array]" != t.call(n) ? u.reject(TypeError("Not an array")) : 0 === n.length ? u.resolve([]) : new u(function(e, t) {
                        if ("function" != typeof e || "function" != typeof t) throw TypeError("Not a function");
                        var i = n.length,
                            r = Array(i),
                            o = 0;
                        d(u, n, function(t, n) {
                            r[t] = n, ++o === i && e(r)
                        }, t)
                    })
                }), n(p, "race", function(n) {
                    var i = this;
                    return "[object Array]" != t.call(n) ? i.reject(TypeError("Not an array")) : new i(function(e, t) {
                        if ("function" != typeof e || "function" != typeof t) throw TypeError("Not a function");
                        d(i, n, function(t, n) {
                            e(n)
                        }, t)
                    })
                }), p
            }, (e = W)[n = "Promise"] = e[n] || i(), t.exports && (t.exports = e[n])
        }(U = {
            exports: {}
        }), U.exports),
        H = new WeakMap;

    function J(t, n, e) {
        var i = H.get(t.element) || {};
        n in i || (i[n] = []), i[n].push(e), H.set(t.element, i)
    }

    function X(t, n) {
        return (H.get(t.element) || {})[n] || []
    }

    function $(t, n, e) {
        var i = H.get(t.element) || {};
        if (!i[n]) return !0;
        if (!e) return i[n] = [], H.set(t.element, i), !0;
        e = i[n].indexOf(e);
        return -1 !== e && i[n].splice(e, 1), H.set(t.element, i), i[n] && 0 === i[n].length
    }
    var G = ["autopause", "autoplay", "background", "byline", "color", "controls", "dnt", "height", "id", "keyboard", "loop", "maxheight", "maxwidth", "muted", "playsinline", "portrait", "responsive", "speed", "texttrack", "title", "transparent", "url", "width"];

    function K(i, t) {
        return G.reduce(function(t, n) {
            var e = i.getAttribute("data-vimeo-".concat(n));
            return !e && "" !== e || (t[n] = "" === e ? 1 : e), t
        }, 1 < arguments.length && void 0 !== t ? t : {})
    }

    function Z(t, n) {
        var e = t.html;
        if (!n) throw new TypeError("An element must be provided");
        if (null !== n.getAttribute("data-vimeo-initialized")) return n.querySelector("iframe");
        t = document.createElement("div");
        return t.innerHTML = e, n.appendChild(t.firstChild), n.setAttribute("data-vimeo-initialized", "true"), n.querySelector("iframe")
    }

    function tt(o, t, n) {
        var u = 1 < arguments.length && void 0 !== t ? t : {},
            s = 2 < arguments.length ? n : void 0;
        return new Promise(function(n, e) {
            if (!S(o)) throw new TypeError("“".concat(o, "” is not a vimeo.com url."));
            var t, i = "https://vimeo.com/api/oembed.json?url=".concat(encodeURIComponent(o));
            for (t in u) u.hasOwnProperty(t) && (i += "&".concat(t, "=").concat(encodeURIComponent(u[t])));
            var r = new("XDomainRequest" in window ? XDomainRequest : XMLHttpRequest);
            r.open("GET", i, !0), r.onload = function() {
                if (404 !== r.status)
                    if (403 !== r.status) try {
                        var t = JSON.parse(r.responseText);
                        if (403 === t.domain_status_code) return Z(t, s), void e(new Error("“".concat(o, "” is not embeddable.")));
                        n(t)
                    } catch (t) {
                        e(t)
                    } else e(new Error("“".concat(o, "” is not embeddable.")));
                    else e(new Error("“".concat(o, "” was not found.")))
            }, r.onerror = function() {
                var t = r.status ? " (".concat(r.status, ")") : "";
                e(new Error("There was an error fetching the embed code from Vimeo".concat(t, ".")))
            }, r.send()
        })
    }

    function nt(t) {
        function e(t) {
            "console" in window && console.error && console.error("There was an error creating an embed: ".concat(t))
        }
        t = 0 < arguments.length && void 0 !== t ? t : document, t = [].slice.call(t.querySelectorAll("[data-vimeo-id], [data-vimeo-url]"));
        t.forEach(function(n) {
            try {
                if (null !== n.getAttribute("data-vimeo-defer")) return;
                var t = K(n);
                tt(q(t), t, n).then(function(t) {
                    return Z(t, n)
                }).catch(e)
            } catch (t) {
                e(t)
            }
        })
    }

    function et(t) {
        if ("string" == typeof t) try {
            t = JSON.parse(t)
        } catch (t) {
            return console.warn(t), {}
        }
        return t
    }

    function it(t, n, e) {
        t.element.contentWindow && t.element.contentWindow.postMessage && (n = {
            method: n
        }, void 0 !== e && (n.value = e), 8 <= (e = parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/, "$1"))) && e < 10 && (n = JSON.stringify(n)), t.element.contentWindow.postMessage(n, t.origin))
    }

    function rt(e, i) {
        var n, t, r, o, u = [];
        (i = et(i)).event ? ("error" === i.event && X(e, i.data.method).forEach(function(t) {
            var n = new Error(i.data.message);
            n.name = i.data.name, t.reject(n), $(e, i.data.method, t)
        }), u = X(e, "event:".concat(i.event)), n = i.data) : i.method && (t = e, r = i.method, (o = !((o = X(t, r)).length < 1) && (o = o.shift(), $(t, r, o), o)) && (u.push(o), n = i.value)), u.forEach(function(t) {
            try {
                if ("function" == typeof t) return void t.call(e, n);
                t.resolve(n)
            } catch (t) {}
        })
    }
    var ot, ut, st, ct = new WeakMap,
        at = new WeakMap,
        ft = {},
        N = function() {
            function r(o) {
                var t, u = this,
                    n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
                if (! function(t, n) {
                        if (!(t instanceof n)) throw new TypeError("Cannot call a class as a function")
                    }(this, r), window.jQuery && o instanceof jQuery && (1 < o.length && window.console && console.warn && console.warn("A jQuery object with multiple elements was passed, using the first element."), o = o[0]), "undefined" != typeof document && "string" == typeof o && (o = document.getElementById(o)), t = o, !Boolean(t && 1 === t.nodeType && "nodeName" in t && t.ownerDocument && t.ownerDocument.defaultView)) throw new TypeError("You must pass either a valid element or a valid id.");
                if ("IFRAME" === o.nodeName || (i = o.querySelector("iframe")) && (o = i), "IFRAME" === o.nodeName && !S(o.getAttribute("src") || "")) throw new Error("The player element passed isn’t a Vimeo embed.");
                if (ct.has(o)) return ct.get(o);
                this.s = o.ownerDocument.defaultView, this.element = o, this.origin = "*";
                var e, i = new D(function(i, r) {
                    var t;
                    u.c = function(t) {
                        if (S(t.origin) && u.element.contentWindow === t.source) {
                            "*" === u.origin && (u.origin = t.origin);
                            var n = et(t.data);
                            if (n && "error" === n.event && n.data && "ready" === n.data.method) {
                                var e = new Error(n.data.message);
                                return e.name = n.data.name, void r(e)
                            }
                            t = n && "ready" === n.event, e = n && "ping" === n.method;
                            if (t || e) return u.element.setAttribute("data-ready", "true"), void i();
                            rt(u, n)
                        }
                    }, u.s.addEventListener("message", u.c), "IFRAME" !== u.element.nodeName && tt(q(t = K(o, n)), t, o).then(function(t) {
                        var n, e, i = Z(t, o);
                        return u.element = i, u.a = o, n = o, e = i, i = H.get(n), H.set(e, i), H.delete(n), ct.set(u.element, u), t
                    }).catch(r)
                });
                return at.set(this, i), ct.set(this.element, this), "IFRAME" === this.element.nodeName && it(this, "ping"), ft.isEnabled && (e = function() {
                    return ft.exit()
                }, ft.on("fullscreenchange", function() {
                    (ft.isFullscreen ? J : $)(u, "event:exitFullscreen", e), u.ready().then(function() {
                        it(u, "fullscreenchange", ft.isFullscreen)
                    })
                })), this
            }
            var t, n, e;
            return t = r, (n = [{
                key: "callMethod",
                value: function(e) {
                    var i = this,
                        r = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
                    return new D(function(t, n) {
                        return i.ready().then(function() {
                            J(i, e, {
                                resolve: t,
                                reject: n
                            }), it(i, e, r)
                        }).catch(n)
                    })
                }
            }, {
                key: "get",
                value: function(e) {
                    var i = this;
                    return new D(function(t, n) {
                        return e = A(e, "get"), i.ready().then(function() {
                            J(i, e, {
                                resolve: t,
                                reject: n
                            }), it(i, e)
                        }).catch(n)
                    })
                }
            }, {
                key: "set",
                value: function(e, i) {
                    var r = this;
                    return new D(function(t, n) {
                        if (e = A(e, "set"), null == i) throw new TypeError("There must be a value to set.");
                        return r.ready().then(function() {
                            J(r, e, {
                                resolve: t,
                                reject: n
                            }), it(r, e, i)
                        }).catch(n)
                    })
                }
            }, {
                key: "on",
                value: function(t, n) {
                    if (!t) throw new TypeError("You must pass an event name.");
                    if (!n) throw new TypeError("You must pass a callback function.");
                    if ("function" != typeof n) throw new TypeError("The callback must be a function.");
                    0 === X(this, "event:".concat(t)).length && this.callMethod("addEventListener", t).catch(function() {}), J(this, "event:".concat(t), n)
                }
            }, {
                key: "off",
                value: function(t, n) {
                    if (!t) throw new TypeError("You must pass an event name.");
                    if (n && "function" != typeof n) throw new TypeError("The callback must be a function.");
                    $(this, "event:".concat(t), n) && this.callMethod("removeEventListener", t).catch(function(t) {})
                }
            }, {
                key: "loadVideo",
                value: function(t) {
                    return this.callMethod("loadVideo", t)
                }
            }, {
                key: "ready",
                value: function() {
                    var t = at.get(this) || new D(function(t, n) {
                        n(new Error("Unknown player. Probably unloaded."))
                    });
                    return D.resolve(t)
                }
            }, {
                key: "addCuePoint",
                value: function(t) {
                    return this.callMethod("addCuePoint", {
                        time: t,
                        data: 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}
                    })
                }
            }, {
                key: "removeCuePoint",
                value: function(t) {
                    return this.callMethod("removeCuePoint", t)
                }
            }, {
                key: "enableTextTrack",
                value: function(t, n) {
                    if (!t) throw new TypeError("You must pass a language.");
                    return this.callMethod("enableTextTrack", {
                        language: t,
                        kind: n
                    })
                }
            }, {
                key: "disableTextTrack",
                value: function() {
                    return this.callMethod("disableTextTrack")
                }
            }, {
                key: "pause",
                value: function() {
                    return this.callMethod("pause")
                }
            }, {
                key: "play",
                value: function() {
                    return this.callMethod("play")
                }
            }, {
                key: "requestFullscreen",
                value: function() {
                    return ft.isEnabled ? ft.request(this.element) : this.callMethod("requestFullscreen")
                }
            }, {
                key: "exitFullscreen",
                value: function() {
                    return ft.isEnabled ? ft.exit() : this.callMethod("exitFullscreen")
                }
            }, {
                key: "getFullscreen",
                value: function() {
                    return ft.isEnabled ? D.resolve(ft.isFullscreen) : this.get("fullscreen")
                }
            }, {
                key: "requestPictureInPicture",
                value: function() {
                    return this.callMethod("requestPictureInPicture")
                }
            }, {
                key: "exitPictureInPicture",
                value: function() {
                    return this.callMethod("exitPictureInPicture")
                }
            }, {
                key: "getPictureInPicture",
                value: function() {
                    return this.get("pictureInPicture")
                }
            }, {
                key: "unload",
                value: function() {
                    return this.callMethod("unload")
                }
            }, {
                key: "destroy",
                value: function() {
                    var e = this;
                    return new D(function(t) {
                        var n;
                        at.delete(e), ct.delete(e.element), e.a && (ct.delete(e.a), e.a.removeAttribute("data-vimeo-initialized")), e.element && "IFRAME" === e.element.nodeName && e.element.parentNode && (e.element.parentNode.parentNode && e.a && e.a !== e.element.parentNode ? e.element.parentNode.parentNode.removeChild(e.element.parentNode) : e.element.parentNode.removeChild(e.element)), e.element && "DIV" === e.element.nodeName && e.element.parentNode && (e.element.removeAttribute("data-vimeo-initialized"), (n = e.element.querySelector("iframe")) && n.parentNode && (n.parentNode.parentNode && e.a && e.a !== n.parentNode ? n.parentNode.parentNode.removeChild(n.parentNode) : n.parentNode.removeChild(n))), e.s.removeEventListener("message", e.c), t()
                    })
                }
            }, {
                key: "getAutopause",
                value: function() {
                    return this.get("autopause")
                }
            }, {
                key: "setAutopause",
                value: function(t) {
                    return this.set("autopause", t)
                }
            }, {
                key: "getBuffered",
                value: function() {
                    return this.get("buffered")
                }
            }, {
                key: "getCameraProps",
                value: function() {
                    return this.get("cameraProps")
                }
            }, {
                key: "setCameraProps",
                value: function(t) {
                    return this.set("cameraProps", t)
                }
            }, {
                key: "getChapters",
                value: function() {
                    return this.get("chapters")
                }
            }, {
                key: "getCurrentChapter",
                value: function() {
                    return this.get("currentChapter")
                }
            }, {
                key: "getColor",
                value: function() {
                    return this.get("color")
                }
            }, {
                key: "setColor",
                value: function(t) {
                    return this.set("color", t)
                }
            }, {
                key: "getCuePoints",
                value: function() {
                    return this.get("cuePoints")
                }
            }, {
                key: "getCurrentTime",
                value: function() {
                    return this.get("currentTime")
                }
            }, {
                key: "setCurrentTime",
                value: function(t) {
                    return this.set("currentTime", t)
                }
            }, {
                key: "getDuration",
                value: function() {
                    return this.get("duration")
                }
            }, {
                key: "getEnded",
                value: function() {
                    return this.get("ended")
                }
            }, {
                key: "getLoop",
                value: function() {
                    return this.get("loop")
                }
            }, {
                key: "setLoop",
                value: function(t) {
                    return this.set("loop", t)
                }
            }, {
                key: "setMuted",
                value: function(t) {
                    return this.set("muted", t)
                }
            }, {
                key: "getMuted",
                value: function() {
                    return this.get("muted")
                }
            }, {
                key: "getPaused",
                value: function() {
                    return this.get("paused")
                }
            }, {
                key: "getPlaybackRate",
                value: function() {
                    return this.get("playbackRate")
                }
            }, {
                key: "setPlaybackRate",
                value: function(t) {
                    return this.set("playbackRate", t)
                }
            }, {
                key: "getPlayed",
                value: function() {
                    return this.get("played")
                }
            }, {
                key: "getQualities",
                value: function() {
                    return this.get("qualities")
                }
            }, {
                key: "getQuality",
                value: function() {
                    return this.get("quality")
                }
            }, {
                key: "setQuality",
                value: function(t) {
                    return this.set("quality", t)
                }
            }, {
                key: "getSeekable",
                value: function() {
                    return this.get("seekable")
                }
            }, {
                key: "getSeeking",
                value: function() {
                    return this.get("seeking")
                }
            }, {
                key: "getTextTracks",
                value: function() {
                    return this.get("textTracks")
                }
            }, {
                key: "getVideoEmbedCode",
                value: function() {
                    return this.get("videoEmbedCode")
                }
            }, {
                key: "getVideoId",
                value: function() {
                    return this.get("videoId")
                }
            }, {
                key: "getVideoTitle",
                value: function() {
                    return this.get("videoTitle")
                }
            }, {
                key: "getVideoWidth",
                value: function() {
                    return this.get("videoWidth")
                }
            }, {
                key: "getVideoHeight",
                value: function() {
                    return this.get("videoHeight")
                }
            }, {
                key: "getVideoUrl",
                value: function() {
                    return this.get("videoUrl")
                }
            }, {
                key: "getVolume",
                value: function() {
                    return this.get("volume")
                }
            }, {
                key: "setVolume",
                value: function(t) {
                    return this.set("volume", t)
                }
            }]) && I(t.prototype, n), e && I(t, e), r
        }();
    R || (ot = function() {
        for (var t, n = [
                ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
                ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
                ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
                ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
                ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
            ], e = 0, i = n.length, r = {}; e < i; e++)
            if ((t = n[e]) && t[1] in document) {
                for (e = 0; e < t.length; e++) r[n[0][e]] = t[e];
                return r
            }
        return !1
    }(), ut = {
        fullscreenchange: ot.fullscreenchange,
        fullscreenerror: ot.fullscreenerror
    }, st = {
        request: function(r) {
            return new Promise(function(t, n) {
                function e() {
                    st.off("fullscreenchange", e), t()
                }
                st.on("fullscreenchange", e);
                var i = (r = r || document.documentElement)[ot.requestFullscreen]();
                i instanceof Promise && i.then(e).catch(n)
            })
        },
        exit: function() {
            return new Promise(function(n, t) {
                var e, i;
                st.isFullscreen ? (e = function t() {
                    st.off("fullscreenchange", t), n()
                }, st.on("fullscreenchange", e), (i = document[ot.exitFullscreen]()) instanceof Promise && i.then(e).catch(t)) : n()
            })
        },
        on: function(t, n) {
            t = ut[t];
            t && document.addEventListener(t, n)
        },
        off: function(t, n) {
            t = ut[t];
            t && document.removeEventListener(t, n)
        }
    }, Object.defineProperties(st, {
        isFullscreen: {
            get: function() {
                return Boolean(document[ot.fullscreenElement])
            }
        },
        element: {
            enumerable: !0,
            get: function() {
                return document[ot.fullscreenElement]
            }
        },
        isEnabled: {
            enumerable: !0,
            get: function() {
                return Boolean(document[ot.fullscreenEnabled])
            }
        }
    }), ft = st, nt(), function(t) {
        var i = 0 < arguments.length && void 0 !== t ? t : document;
        window.VimeoPlayerResizeEmbeds_ || (window.VimeoPlayerResizeEmbeds_ = !0, window.addEventListener("message", function(t) {
            if (S(t.origin) && t.data && "spacechange" === t.data.event)
                for (var n = i.querySelectorAll("iframe"), e = 0; e < n.length; e++)
                    if (n[e].contentWindow === t.source) {
                        n[e].parentElement.style.paddingBottom = "".concat(t.data.data[0].bottom, "px");
                        break
                    }
        }))
    }());
    var ht = N,
        N = function(i) {
            function t(t, n, e) {
                return (e = i.call(this, t, n, e = void 0 === e ? {} : e) || this).state.set(3), e
            }
            bt(t, i);
            var n = t.prototype;
            return n.createPlayer = function(t) {
                var n = this.options,
                    e = this.options.playerOptions,
                    e = void 0 === e ? {} : e,
                    t = 0 === t.indexOf("http") ? {
                        url: t
                    } : {
                        id: +t
                    },
                    e = new ht(this.target, b(t, {
                        controls: !n.hideControls,
                        loop: n.loop,
                        muted: n.mute
                    }, e.vimeo || {}));
                return e.on("play", this.onPlay), e.on("pause", this.onPause), e.on("ended", this.onEnded), e.ready().then(this.onPlayerReady, this.onError), e.getMuted() || e.setVolume(C(n.volume, 0, 1)), e
            }, n.playVideo = function() {
                var t = this;
                this.player.play().catch(function() {
                    t.state.is(7) && t.state.set(5)
                })
            }, n.pauseVideo = function() {
                this.player.pause()
            }, t
        }(t),
        lt = "//www.youtube.com/player_api",
        dt = function() {
            function t() {}
            var n = t.prototype;
            return n.load = function(t) {
                if (window.YT && "function" == typeof window.YT.Player) return t();
                this.attachCallback(t), this.shouldLoad() && T("script", {
                    src: location.protocol + lt
                }, document.head)
            }, n.shouldLoad = function() {
                return t = document, n = "script", !y(t.querySelectorAll(n)).some(function(t) {
                    return t.src.replace(/^https?:/, "") === lt
                });
                var t, n
            }, n.attachCallback = function(t) {
                var n;
                void 0 !== window.onYouTubeIframeAPIReady && (n = window.onYouTubeIframeAPIReady), window.onYouTubeIframeAPIReady = function() {
                    n && n(), t()
                }
            }, t
        }(),
        t = function(i) {
            function t(t, n, e) {
                return (e = i.call(this, t, n, e = void 0 === e ? {} : e) || this).videoId = e.parseVideoId(n), e.videoId && (e.state.set(2), (new dt).load(e.onAPIReady.bind(function(t) {
                    if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return t
                }(e)))), e
            }
            bt(t, i);
            var n = t.prototype;
            return n.onAPIReady = function() {
                var t = this.state,
                    n = t.is(4);
                t.set(3), n && this.play()
            }, n.createPlayer = function(t) {
                var n = this.options,
                    e = this.options.playerOptions;
                return new YT.Player(this.target, {
                    videoId: t,
                    playerVars: b({
                        controls: n.hideControls ? 0 : 1,
                        iv_load_policy: 3,
                        loop: n.loop ? 1 : 0,
                        playlist: n.loop ? t : void 0,
                        rel: 0,
                        autoplay: 0,
                        mute: n.mute ? 1 : 0
                    }, (void 0 === e ? {} : e).youtube || {}),
                    events: {
                        onReady: this.onPlayerReady.bind(this),
                        onStateChange: this.onPlayerStateChange.bind(this),
                        onError: this.onError.bind(this)
                    }
                })
            }, n.onPlayerReady = function() {
                i.prototype.onPlayerReady.call(this), this.player.setVolume(100 * C(this.options.volume, 0, 1))
            }, n.onPlayerStateChange = function(t) {
                var n = YT.PlayerState,
                    e = n.PLAYING,
                    i = n.PAUSED,
                    n = n.ENDED;
                switch (!0) {
                    case t.data === e:
                        this.onPlay();
                        break;
                    case t.data === i:
                        this.onPause();
                        break;
                    case t.data === n:
                        this.onEnded()
                }
            }, n.playVideo = function() {
                this.player.playVideo()
            }, n.pauseVideo = function() {
                this.player.pauseVideo()
            }, n.parseVideoId = function(t) {
                return 0 === t.indexOf("http") ? this.parseUrl(t) : t
            }, n.parseUrl = function(t) {
                var n = t.split(/[#?]/)[1],
                    n = (t = n.split("&"), n = function(t) {
                        return 0 === t.indexOf("v=")
                    }, y(t).filter(n)[0]);
                return n && n.replace("v=", "")
            }, t
        }(t),
        vt = "splide__slide",
        yt = vt + "__container",
        pt = "Play Video",
        wt = function() {
            function t(t, n) {
                this.event = i(), this.Splide = t, this.slide = n, this.init(), this.create(), this.show(), this.listen()
            }
            var n = t.prototype;
            return n.init = function() {
                var t, n, t = (t = this.slide, (n = "." + yt) ? m(t, n)[0] : t.firstElementChild);
                this.parent = t || this.slide, this.modifier = (t ? yt : vt) + "--has-video", w(this.parent, this.modifier)
            }, n.create = function() {
                this.video = T("div", j, this.parent), this.wrapper = T("div", "splide__video__wrapper", this.video), this.placeholder = T("div", null, this.wrapper), this.playButton = T("button", {
                    class: "splide__video__play",
                    type: "button",
                    "aria-label": this.Splide.options.i18n.playVideo || pt
                }, this.video)
            }, n.listen = function() {
                var t = this;
                this.parent.addEventListener("click", function() {
                    t.event.emit("click")
                })
            }, n.toggleButton = function(t) {
                _(this.playButton, t ? "" : "none")
            }, n.toggleWrapper = function(t) {
                _(this.wrapper, t ? "" : "none")
            }, n.getPlaceholder = function() {
                return this.placeholder
            }, n.hide = function() {
                this.toggleButton(!1), this.toggleWrapper(!0)
            }, n.show = function() {
                this.disabled || this.toggleButton(!0), this.toggleWrapper(!1)
            }, n.disable = function(t) {
                (this.disabled = t) && this.toggleButton(!1)
            }, n.on = function(t, n) {
                this.event.on(t, n)
            }, n.destroy = function() {
                var t, n;
                t = this.parent, n = this.modifier, p(t, n, !1), d(this.video, function(t) {
                    t && t.parentNode && t.parentNode.removeChild(t)
                }), this.event.destroy()
            }, t
        }(),
        mt = [
            ["data-splide-youtube", t],
            ["data-splide-vimeo", N],
            ["data-splide-html-video", n]
        ],
        kt = function() {
            function t(t, n) {
                this.Splide = t, this.slide = n, this.event = o(t), this.options = g(g({}, M), this.Splide.options.video), this.createPlayer(n), this.player && this.listen()
            }
            var n = t.prototype;
            return n.createPlayer = function(e) {
                var i = this;
                mt.forEach(function(t) {
                    var n = t[0],
                        t = t[1],
                        n = e.getAttribute(n);
                    n && (i.ui = new wt(i.Splide, e), i.player = new t(i.ui.getPlaceholder(), n, i.options), i.ui.disable(i.options.disableOverlayUI))
                })
            }, n.listen = function() {
                var t = this.player,
                    n = this.event;
                this.ui.on("click", this.onClick.bind(this)), t.on("play", this.onPlay.bind(this)), t.on("played", this.onPlayed.bind(this)), t.on("pause", this.onPause.bind(this)), t.on("paused", this.onPaused.bind(this)), t.on("ended", this.onEnded.bind(this)), n.on(["move", "drag", "scroll"], this.pause.bind(this)), n.on(x, this.onVideoClick.bind(this)), this.options.autoplay && n.on(["mounted", "moved", "scrolled"], this.onAutoplayRequested.bind(this))
            }, n.onClick = function() {
                this.play(), this.event.emit(x, this)
            }, n.onVideoClick = function(t) {
                this !== t && this.pause()
            }, n.onPlay = function() {
                this.ui.hide()
            }, n.onPlayed = function() {
                this.ui.hide(), this.togglePlaying(!0), this.event.emit("video:play", this)
            }, n.onPause = function() {
                this.ui.show()
            }, n.onPaused = function() {
                this.togglePlaying(!1), this.event.emit("video:pause", this)
            }, n.onEnded = function() {
                this.togglePlaying(!1), this.event.emit("video:ended", this)
            }, n.onAutoplayRequested = function() {
                this.Splide.Components.Slides.getAt(this.Splide.index).slide === this.slide && this.play()
            }, n.togglePlaying = function(t) {
                p(this.Splide.root, "is-playing", t)
            }, n.play = function() {
                this.player && this.player.play()
            }, n.pause = function() {
                this.player && this.player.pause()
            }, n.destroy = function() {
                this.player && (this.ui.destroy(), this.player.destroy())
            }, t
        }();
    "undefined" != typeof window && (window.splide = window.splide || {}, window.splide.Extensions = window.splide.Extensions || {}, window.splide.Extensions.Video = function(n, t, e) {
        var i = [];
        return {
            mount: function() {
                t.Slides.forEach(function(t) {
                    i.push(new kt(n, t.slide))
                }), n.emit("resize")
            },
            destroy: function() {
                i.forEach(function(t) {
                    t.destroy()
                })
            }
        }
    })
    /*!
     * Splide.js
     * Version  : 3.0.0
     * License  : MIT
     * Copyright: 2021 Naotoshi Fujita
     */
    /*!
     * weakmap-polyfill v2.0.1 - ECMAScript6 WeakMap polyfill
     * https://github.com/polygonplanet/weakmap-polyfill
     * Copyright (c) 2015-2020 Polygon Planet <polygon.planet.aqua@gmail.com>
     * @license MIT
     */
    /*! @vimeo/player v2.16.0 | (c) 2021 Vimeo | MIT License | https://github.com/vimeo/player.js */
    /*! Native Promise Only
          v0.8.1 (c) Kyle Simpson
          MIT License: http://getify.mit-license.org
      */
}, "function" == typeof define && define.amd ? define(t) : t();;
/* @license MIT https://github.com/biati-digital/glightbox/blob/master/LICENSE.md */
! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self).GLightbox = t()
}(this, (function() {
    "use strict";

    function e(t) {
        return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        })(t)
    }

    function t(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function i(e, t) {
        for (var i = 0; i < t.length; i++) {
            var n = t[i];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
        }
    }

    function n(e, t, n) {
        return t && i(e.prototype, t), n && i(e, n), e
    }
    var s = Date.now();

    function l() {
        var e = {},
            t = !0,
            i = 0,
            n = arguments.length;
        "[object Boolean]" === Object.prototype.toString.call(arguments[0]) && (t = arguments[0], i++);
        for (var s = function(i) {
                for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (t && "[object Object]" === Object.prototype.toString.call(i[n]) ? e[n] = l(!0, e[n], i[n]) : e[n] = i[n])
            }; i < n; i++) {
            var o = arguments[i];
            s(o)
        }
        return e
    }

    function o(e, t) {
        if ((k(e) || e === window || e === document) && (e = [e]), A(e) || L(e) || (e = [e]), 0 != P(e))
            if (A(e) && !L(e))
                for (var i = e.length, n = 0; n < i && !1 !== t.call(e[n], e[n], n, e); n++);
            else if (L(e))
            for (var s in e)
                if (O(e, s) && !1 === t.call(e[s], e[s], s, e)) break
    }

    function r(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
            i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
            n = e[s] = e[s] || [],
            l = {
                all: n,
                evt: null,
                found: null
            };
        return t && i && P(n) > 0 && o(n, (function(e, n) {
            if (e.eventName == t && e.fn.toString() == i.toString()) return l.found = !0, l.evt = n, !1
        })), l
    }

    function a(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            i = t.onElement,
            n = t.withCallback,
            s = t.avoidDuplicate,
            l = void 0 === s || s,
            a = t.once,
            h = void 0 !== a && a,
            d = t.useCapture,
            c = void 0 !== d && d,
            u = arguments.length > 2 ? arguments[2] : void 0,
            g = i || [];

        function v(e) {
            T(n) && n.call(u, e, this), h && v.destroy()
        }
        return C(g) && (g = document.querySelectorAll(g)), v.destroy = function() {
            o(g, (function(t) {
                var i = r(t, e, v);
                i.found && i.all.splice(i.evt, 1), t.removeEventListener && t.removeEventListener(e, v, c)
            }))
        }, o(g, (function(t) {
            var i = r(t, e, v);
            (t.addEventListener && l && !i.found || !l) && (t.addEventListener(e, v, c), i.all.push({
                eventName: e,
                fn: v
            }))
        })), v
    }

    function h(e, t) {
        o(t.split(" "), (function(t) {
            return e.classList.add(t)
        }))
    }

    function d(e, t) {
        o(t.split(" "), (function(t) {
            return e.classList.remove(t)
        }))
    }

    function c(e, t) {
        return e.classList.contains(t)
    }

    function u(e, t) {
        for (; e !== document.body;) {
            if (!(e = e.parentElement)) return !1;
            if ("function" == typeof e.matches ? e.matches(t) : e.msMatchesSelector(t)) return e
        }
    }

    function g(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
            i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        if (!e || "" === t) return !1;
        if ("none" == t) return T(i) && i(), !1;
        var n = x(),
            s = t.split(" ");
        o(s, (function(t) {
            h(e, "g" + t)
        })), a(n, {
            onElement: e,
            avoidDuplicate: !1,
            once: !0,
            withCallback: function(e, t) {
                o(s, (function(e) {
                    d(t, "g" + e)
                })), T(i) && i()
            }
        })
    }

    function v(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
        if ("" == t) return e.style.webkitTransform = "", e.style.MozTransform = "", e.style.msTransform = "", e.style.OTransform = "", e.style.transform = "", !1;
        e.style.webkitTransform = t, e.style.MozTransform = t, e.style.msTransform = t, e.style.OTransform = t, e.style.transform = t
    }

    function f(e) {
        e.style.display = "block"
    }

    function p(e) {
        e.style.display = "none"
    }

    function m(e) {
        var t = document.createDocumentFragment(),
            i = document.createElement("div");
        for (i.innerHTML = e; i.firstChild;) t.appendChild(i.firstChild);
        return t
    }

    function y() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        }
    }

    function x() {
        var e, t = document.createElement("fakeelement"),
            i = {
                animation: "animationend",
                OAnimation: "oAnimationEnd",
                MozAnimation: "animationend",
                WebkitAnimation: "webkitAnimationEnd"
            };
        for (e in i)
            if (void 0 !== t.style[e]) return i[e]
    }

    function b(e, t, i, n) {
        if (e()) t();
        else {
            var s;
            i || (i = 100);
            var l = setInterval((function() {
                e() && (clearInterval(l), s && clearTimeout(s), t())
            }), i);
            n && (s = setTimeout((function() {
                clearInterval(l)
            }), n))
        }
    }

    function S(e, t, i) {
        if (I(e)) console.error("Inject assets error");
        else if (T(t) && (i = t, t = !1), C(t) && t in window) T(i) && i();
        else {
            var n;
            if (-1 !== e.indexOf(".css")) {
                if ((n = document.querySelectorAll('link[href="' + e + '"]')) && n.length > 0) return void(T(i) && i());
                var s = document.getElementsByTagName("head")[0],
                    l = s.querySelectorAll('link[rel="stylesheet"]'),
                    o = document.createElement("link");
                return o.rel = "stylesheet", o.type = "text/css", o.href = e, o.media = "all", l ? s.insertBefore(o, l[0]) : s.appendChild(o), void(T(i) && i())
            }
            if ((n = document.querySelectorAll('script[src="' + e + '"]')) && n.length > 0) {
                if (T(i)) {
                    if (C(t)) return b((function() {
                        return void 0 !== window[t]
                    }), (function() {
                        i()
                    })), !1;
                    i()
                }
            } else {
                var r = document.createElement("script");
                r.type = "text/javascript", r.src = e, r.onload = function() {
                    if (T(i)) {
                        if (C(t)) return b((function() {
                            return void 0 !== window[t]
                        }), (function() {
                            i()
                        })), !1;
                        i()
                    }
                }, document.body.appendChild(r)
            }
        }
    }

    function w() {
        return "navigator" in window && window.navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i)
    }

    function T(e) {
        return "function" == typeof e
    }

    function C(e) {
        return "string" == typeof e
    }

    function k(e) {
        return !(!e || !e.nodeType || 1 != e.nodeType)
    }

    function E(e) {
        return Array.isArray(e)
    }

    function A(e) {
        return e && e.length && isFinite(e.length)
    }

    function L(t) {
        return "object" === e(t) && null != t && !T(t) && !E(t)
    }

    function I(e) {
        return null == e
    }

    function O(e, t) {
        return null !== e && hasOwnProperty.call(e, t)
    }

    function P(e) {
        if (L(e)) {
            if (e.keys) return e.keys().length;
            var t = 0;
            for (var i in e) O(e, i) && t++;
            return t
        }
        return e.length
    }

    function M(e) {
        return !isNaN(parseFloat(e)) && isFinite(e)
    }

    function z() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : -1,
            t = document.querySelectorAll(".gbtn[data-taborder]:not(.disabled)");
        if (!t.length) return !1;
        if (1 == t.length) return t[0];
        "string" == typeof e && (e = parseInt(e));
        var i = [];
        o(t, (function(e) {
            i.push(e.getAttribute("data-taborder"))
        }));
        var n = Math.max.apply(Math, i.map((function(e) {
                return parseInt(e)
            }))),
            s = e < 0 ? 1 : e + 1;
        s > n && (s = "1");
        var l = i.filter((function(e) {
                return e >= parseInt(s)
            })),
            r = l.sort()[0];
        return document.querySelector('.gbtn[data-taborder="'.concat(r, '"]'))
    }

    function X(e) {
        if (e.events.hasOwnProperty("keyboard")) return !1;
        e.events.keyboard = a("keydown", {
            onElement: window,
            withCallback: function(t, i) {
                var n = (t = t || window.event).keyCode;
                if (9 == n) {
                    var s = document.querySelector(".gbtn.focused");
                    if (!s) {
                        var l = !(!document.activeElement || !document.activeElement.nodeName) && document.activeElement.nodeName.toLocaleLowerCase();
                        if ("input" == l || "textarea" == l || "button" == l) return
                    }
                    t.preventDefault();
                    var o = document.querySelectorAll(".gbtn[data-taborder]");
                    if (!o || o.length <= 0) return;
                    if (!s) {
                        var r = z();
                        return void(r && (r.focus(), h(r, "focused")))
                    }
                    var a = z(s.getAttribute("data-taborder"));
                    d(s, "focused"), a && (a.focus(), h(a, "focused"))
                }
                39 == n && e.nextSlide(), 37 == n && e.prevSlide(), 27 == n && e.close()
            }
        })
    }

    function Y(e) {
        return Math.sqrt(e.x * e.x + e.y * e.y)
    }

    function q(e, t) {
        var i = function(e, t) {
            var i = Y(e) * Y(t);
            if (0 === i) return 0;
            var n = function(e, t) {
                return e.x * t.x + e.y * t.y
            }(e, t) / i;
            return n > 1 && (n = 1), Math.acos(n)
        }(e, t);
        return function(e, t) {
            return e.x * t.y - t.x * e.y
        }(e, t) > 0 && (i *= -1), 180 * i / Math.PI
    }
    var N = function() {
        function e(i) {
            t(this, e), this.handlers = [], this.el = i
        }
        return n(e, [{
            key: "add",
            value: function(e) {
                this.handlers.push(e)
            }
        }, {
            key: "del",
            value: function(e) {
                e || (this.handlers = []);
                for (var t = this.handlers.length; t >= 0; t--) this.handlers[t] === e && this.handlers.splice(t, 1)
            }
        }, {
            key: "dispatch",
            value: function() {
                for (var e = 0, t = this.handlers.length; e < t; e++) {
                    var i = this.handlers[e];
                    "function" == typeof i && i.apply(this.el, arguments)
                }
            }
        }]), e
    }();

    function D(e, t) {
        var i = new N(e);
        return i.add(t), i
    }
    var _ = function() {
        function e(i, n) {
            t(this, e), this.element = "string" == typeof i ? document.querySelector(i) : i, this.start = this.start.bind(this), this.move = this.move.bind(this), this.end = this.end.bind(this), this.cancel = this.cancel.bind(this), this.element.addEventListener("touchstart", this.start, !1), this.element.addEventListener("touchmove", this.move, !1), this.element.addEventListener("touchend", this.end, !1), this.element.addEventListener("touchcancel", this.cancel, !1), this.preV = {
                x: null,
                y: null
            }, this.pinchStartLen = null, this.zoom = 1, this.isDoubleTap = !1;
            var s = function() {};
            this.rotate = D(this.element, n.rotate || s), this.touchStart = D(this.element, n.touchStart || s), this.multipointStart = D(this.element, n.multipointStart || s), this.multipointEnd = D(this.element, n.multipointEnd || s), this.pinch = D(this.element, n.pinch || s), this.swipe = D(this.element, n.swipe || s), this.tap = D(this.element, n.tap || s), this.doubleTap = D(this.element, n.doubleTap || s), this.longTap = D(this.element, n.longTap || s), this.singleTap = D(this.element, n.singleTap || s), this.pressMove = D(this.element, n.pressMove || s), this.twoFingerPressMove = D(this.element, n.twoFingerPressMove || s), this.touchMove = D(this.element, n.touchMove || s), this.touchEnd = D(this.element, n.touchEnd || s), this.touchCancel = D(this.element, n.touchCancel || s), this.translateContainer = this.element, this._cancelAllHandler = this.cancelAll.bind(this), window.addEventListener("scroll", this._cancelAllHandler), this.delta = null, this.last = null, this.now = null, this.tapTimeout = null, this.singleTapTimeout = null, this.longTapTimeout = null, this.swipeTimeout = null, this.x1 = this.x2 = this.y1 = this.y2 = null, this.preTapPosition = {
                x: null,
                y: null
            }
        }
        return n(e, [{
            key: "start",
            value: function(e) {
                if (e.touches) {
                    if (e.target && e.target.nodeName && ["a", "button", "input"].indexOf(e.target.nodeName.toLowerCase()) >= 0) console.log("ignore drag for this touched element", e.target.nodeName.toLowerCase());
                    else {
                        this.now = Date.now(), this.x1 = e.touches[0].pageX, this.y1 = e.touches[0].pageY, this.delta = this.now - (this.last || this.now), this.touchStart.dispatch(e, this.element), null !== this.preTapPosition.x && (this.isDoubleTap = this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30, this.isDoubleTap && clearTimeout(this.singleTapTimeout)), this.preTapPosition.x = this.x1, this.preTapPosition.y = this.y1, this.last = this.now;
                        var t = this.preV;
                        if (e.touches.length > 1) {
                            this._cancelLongTap(), this._cancelSingleTap();
                            var i = {
                                x: e.touches[1].pageX - this.x1,
                                y: e.touches[1].pageY - this.y1
                            };
                            t.x = i.x, t.y = i.y, this.pinchStartLen = Y(t), this.multipointStart.dispatch(e, this.element)
                        }
                        this._preventTap = !1, this.longTapTimeout = setTimeout(function() {
                            this.longTap.dispatch(e, this.element), this._preventTap = !0
                        }.bind(this), 750)
                    }
                }
            }
        }, {
            key: "move",
            value: function(e) {
                if (e.touches) {
                    var t = this.preV,
                        i = e.touches.length,
                        n = e.touches[0].pageX,
                        s = e.touches[0].pageY;
                    if (this.isDoubleTap = !1, i > 1) {
                        var l = e.touches[1].pageX,
                            o = e.touches[1].pageY,
                            r = {
                                x: e.touches[1].pageX - n,
                                y: e.touches[1].pageY - s
                            };
                        null !== t.x && (this.pinchStartLen > 0 && (e.zoom = Y(r) / this.pinchStartLen, this.pinch.dispatch(e, this.element)), e.angle = q(r, t), this.rotate.dispatch(e, this.element)), t.x = r.x, t.y = r.y, null !== this.x2 && null !== this.sx2 ? (e.deltaX = (n - this.x2 + l - this.sx2) / 2, e.deltaY = (s - this.y2 + o - this.sy2) / 2) : (e.deltaX = 0, e.deltaY = 0), this.twoFingerPressMove.dispatch(e, this.element), this.sx2 = l, this.sy2 = o
                    } else {
                        if (null !== this.x2) {
                            e.deltaX = n - this.x2, e.deltaY = s - this.y2;
                            var a = Math.abs(this.x1 - this.x2),
                                h = Math.abs(this.y1 - this.y2);
                            (a > 10 || h > 10) && (this._preventTap = !0)
                        } else e.deltaX = 0, e.deltaY = 0;
                        this.pressMove.dispatch(e, this.element)
                    }
                    this.touchMove.dispatch(e, this.element), this._cancelLongTap(), this.x2 = n, this.y2 = s, i > 1 && e.preventDefault()
                }
            }
        }, {
            key: "end",
            value: function(e) {
                if (e.changedTouches) {
                    this._cancelLongTap();
                    var t = this;
                    e.touches.length < 2 && (this.multipointEnd.dispatch(e, this.element), this.sx2 = this.sy2 = null), this.x2 && Math.abs(this.x1 - this.x2) > 30 || this.y2 && Math.abs(this.y1 - this.y2) > 30 ? (e.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2), this.swipeTimeout = setTimeout((function() {
                        t.swipe.dispatch(e, t.element)
                    }), 0)) : (this.tapTimeout = setTimeout((function() {
                        t._preventTap || t.tap.dispatch(e, t.element), t.isDoubleTap && (t.doubleTap.dispatch(e, t.element), t.isDoubleTap = !1)
                    }), 0), t.isDoubleTap || (t.singleTapTimeout = setTimeout((function() {
                        t.singleTap.dispatch(e, t.element)
                    }), 250))), this.touchEnd.dispatch(e, this.element), this.preV.x = 0, this.preV.y = 0, this.zoom = 1, this.pinchStartLen = null, this.x1 = this.x2 = this.y1 = this.y2 = null
                }
            }
        }, {
            key: "cancelAll",
            value: function() {
                this._preventTap = !0, clearTimeout(this.singleTapTimeout), clearTimeout(this.tapTimeout), clearTimeout(this.longTapTimeout), clearTimeout(this.swipeTimeout)
            }
        }, {
            key: "cancel",
            value: function(e) {
                this.cancelAll(), this.touchCancel.dispatch(e, this.element)
            }
        }, {
            key: "_cancelLongTap",
            value: function() {
                clearTimeout(this.longTapTimeout)
            }
        }, {
            key: "_cancelSingleTap",
            value: function() {
                clearTimeout(this.singleTapTimeout)
            }
        }, {
            key: "_swipeDirection",
            value: function(e, t, i, n) {
                return Math.abs(e - t) >= Math.abs(i - n) ? e - t > 0 ? "Left" : "Right" : i - n > 0 ? "Up" : "Down"
            }
        }, {
            key: "on",
            value: function(e, t) {
                this[e] && this[e].add(t)
            }
        }, {
            key: "off",
            value: function(e, t) {
                this[e] && this[e].del(t)
            }
        }, {
            key: "destroy",
            value: function() {
                return this.singleTapTimeout && clearTimeout(this.singleTapTimeout), this.tapTimeout && clearTimeout(this.tapTimeout), this.longTapTimeout && clearTimeout(this.longTapTimeout), this.swipeTimeout && clearTimeout(this.swipeTimeout), this.element.removeEventListener("touchstart", this.start), this.element.removeEventListener("touchmove", this.move), this.element.removeEventListener("touchend", this.end), this.element.removeEventListener("touchcancel", this.cancel), this.rotate.del(), this.touchStart.del(), this.multipointStart.del(), this.multipointEnd.del(), this.pinch.del(), this.swipe.del(), this.tap.del(), this.doubleTap.del(), this.longTap.del(), this.singleTap.del(), this.pressMove.del(), this.twoFingerPressMove.del(), this.touchMove.del(), this.touchEnd.del(), this.touchCancel.del(), this.preV = this.pinchStartLen = this.zoom = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = this.twoFingerPressMove = null, window.removeEventListener("scroll", this._cancelAllHandler), null
            }
        }]), e
    }();

    function W(e) {
        var t = function() {
                var e, t = document.createElement("fakeelement"),
                    i = {
                        transition: "transitionend",
                        OTransition: "oTransitionEnd",
                        MozTransition: "transitionend",
                        WebkitTransition: "webkitTransitionEnd"
                    };
                for (e in i)
                    if (void 0 !== t.style[e]) return i[e]
            }(),
            i = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            n = c(e, "gslide-media") ? e : e.querySelector(".gslide-media"),
            s = u(n, ".ginner-container"),
            l = e.querySelector(".gslide-description");
        i > 769 && (n = s), h(n, "greset"), v(n, "translate3d(0, 0, 0)"), a(t, {
            onElement: n,
            once: !0,
            withCallback: function(e, t) {
                d(n, "greset")
            }
        }), n.style.opacity = "", l && (l.style.opacity = "")
    }

    function B(e) {
        if (e.events.hasOwnProperty("touch")) return !1;
        var t, i, n, s = y(),
            l = s.width,
            o = s.height,
            r = !1,
            a = null,
            g = null,
            f = null,
            p = !1,
            m = 1,
            x = 1,
            b = !1,
            S = !1,
            w = null,
            T = null,
            C = null,
            k = null,
            E = 0,
            A = 0,
            L = !1,
            I = !1,
            O = {},
            P = {},
            M = 0,
            z = 0,
            X = document.getElementById("glightbox-slider"),
            Y = document.querySelector(".goverlay"),
            q = new _(X, {
                touchStart: function(t) {
                    if (r = !0, (c(t.targetTouches[0].target, "ginner-container") || u(t.targetTouches[0].target, ".gslide-desc") || "a" == t.targetTouches[0].target.nodeName.toLowerCase()) && (r = !1), u(t.targetTouches[0].target, ".gslide-inline") && !c(t.targetTouches[0].target.parentNode, "gslide-inline") && (r = !1), r) {
                        if (P = t.targetTouches[0], O.pageX = t.targetTouches[0].pageX, O.pageY = t.targetTouches[0].pageY, M = t.targetTouches[0].clientX, z = t.targetTouches[0].clientY, a = e.activeSlide, g = a.querySelector(".gslide-media"), n = a.querySelector(".gslide-inline"), f = null, c(g, "gslide-image") && (f = g.querySelector("img")), (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) > 769 && (g = a.querySelector(".ginner-container")), d(Y, "greset"), t.pageX > 20 && t.pageX < window.innerWidth - 20) return;
                        t.preventDefault()
                    }
                },
                touchMove: function(s) {
                    if (r && (P = s.targetTouches[0], !b && !S)) {
                        if (n && n.offsetHeight > o) {
                            var a = O.pageX - P.pageX;
                            if (Math.abs(a) <= 13) return !1
                        }
                        p = !0;
                        var h, d = s.targetTouches[0].clientX,
                            c = s.targetTouches[0].clientY,
                            u = M - d,
                            m = z - c;
                        if (Math.abs(u) > Math.abs(m) ? (L = !1, I = !0) : (I = !1, L = !0), t = P.pageX - O.pageX, E = 100 * t / l, i = P.pageY - O.pageY, A = 100 * i / o, L && f && (h = 1 - Math.abs(i) / o, Y.style.opacity = h, e.settings.touchFollowAxis && (E = 0)), I && (h = 1 - Math.abs(t) / l, g.style.opacity = h, e.settings.touchFollowAxis && (A = 0)), !f) return v(g, "translate3d(".concat(E, "%, 0, 0)"));
                        v(g, "translate3d(".concat(E, "%, ").concat(A, "%, 0)"))
                    }
                },
                touchEnd: function() {
                    if (r) {
                        if (p = !1, S || b) return C = w, void(k = T);
                        var t = Math.abs(parseInt(A)),
                            i = Math.abs(parseInt(E));
                        if (!(t > 29 && f)) return t < 29 && i < 25 ? (h(Y, "greset"), Y.style.opacity = 1, W(g)) : void 0;
                        e.close()
                    }
                },
                multipointEnd: function() {
                    setTimeout((function() {
                        b = !1
                    }), 50)
                },
                multipointStart: function() {
                    b = !0, m = x || 1
                },
                pinch: function(e) {
                    if (!f || p) return !1;
                    b = !0, f.scaleX = f.scaleY = m * e.zoom;
                    var t = m * e.zoom;
                    if (S = !0, t <= 1) return S = !1, t = 1, k = null, C = null, w = null, T = null, void f.setAttribute("style", "");
                    t > 4.5 && (t = 4.5), f.style.transform = "scale3d(".concat(t, ", ").concat(t, ", 1)"), x = t
                },
                pressMove: function(e) {
                    if (S && !b) {
                        var t = P.pageX - O.pageX,
                            i = P.pageY - O.pageY;
                        C && (t += C), k && (i += k), w = t, T = i;
                        var n = "translate3d(".concat(t, "px, ").concat(i, "px, 0)");
                        x && (n += " scale3d(".concat(x, ", ").concat(x, ", 1)")), v(f, n)
                    }
                },
                swipe: function(t) {
                    if (!S)
                        if (b) b = !1;
                        else {
                            if ("Left" == t.direction) {
                                if (e.index == e.elements.length - 1) return W(g);
                                e.nextSlide()
                            }
                            if ("Right" == t.direction) {
                                if (0 == e.index) return W(g);
                                e.prevSlide()
                            }
                        }
                }
            });
        e.events.touch = q
    }
    var H = function() {
            function e(i, n) {
                var s = this,
                    l = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
                if (t(this, e), this.img = i, this.slide = n, this.onclose = l, this.img.setZoomEvents) return !1;
                this.active = !1, this.zoomedIn = !1, this.dragging = !1, this.currentX = null, this.currentY = null, this.initialX = null, this.initialY = null, this.xOffset = 0, this.yOffset = 0, this.img.addEventListener("mousedown", (function(e) {
                    return s.dragStart(e)
                }), !1), this.img.addEventListener("mouseup", (function(e) {
                    return s.dragEnd(e)
                }), !1), this.img.addEventListener("mousemove", (function(e) {
                    return s.drag(e)
                }), !1), this.img.addEventListener("click", (function(e) {
                    return s.slide.classList.contains("dragging-nav") ? (s.zoomOut(), !1) : s.zoomedIn ? void(s.zoomedIn && !s.dragging && s.zoomOut()) : s.zoomIn()
                }), !1), this.img.setZoomEvents = !0
            }
            return n(e, [{
                key: "zoomIn",
                value: function() {
                    var e = this.widowWidth();
                    if (!(this.zoomedIn || e <= 768)) {
                        var t = this.img;
                        if (t.setAttribute("data-style", t.getAttribute("style")), t.style.maxWidth = t.naturalWidth + "px", t.style.maxHeight = t.naturalHeight + "px", t.naturalWidth > e) {
                            var i = e / 2 - t.naturalWidth / 2;
                            this.setTranslate(this.img.parentNode, i, 0)
                        }
                        this.slide.classList.add("zoomed"), this.zoomedIn = !0
                    }
                }
            }, {
                key: "zoomOut",
                value: function() {
                    this.img.parentNode.setAttribute("style", ""), this.img.setAttribute("style", this.img.getAttribute("data-style")), this.slide.classList.remove("zoomed"), this.zoomedIn = !1, this.currentX = null, this.currentY = null, this.initialX = null, this.initialY = null, this.xOffset = 0, this.yOffset = 0, this.onclose && "function" == typeof this.onclose && this.onclose()
                }
            }, {
                key: "dragStart",
                value: function(e) {
                    e.preventDefault(), this.zoomedIn ? ("touchstart" === e.type ? (this.initialX = e.touches[0].clientX - this.xOffset, this.initialY = e.touches[0].clientY - this.yOffset) : (this.initialX = e.clientX - this.xOffset, this.initialY = e.clientY - this.yOffset), e.target === this.img && (this.active = !0, this.img.classList.add("dragging"))) : this.active = !1
                }
            }, {
                key: "dragEnd",
                value: function(e) {
                    var t = this;
                    e.preventDefault(), this.initialX = this.currentX, this.initialY = this.currentY, this.active = !1, setTimeout((function() {
                        t.dragging = !1, t.img.isDragging = !1, t.img.classList.remove("dragging")
                    }), 100)
                }
            }, {
                key: "drag",
                value: function(e) {
                    this.active && (e.preventDefault(), "touchmove" === e.type ? (this.currentX = e.touches[0].clientX - this.initialX, this.currentY = e.touches[0].clientY - this.initialY) : (this.currentX = e.clientX - this.initialX, this.currentY = e.clientY - this.initialY), this.xOffset = this.currentX, this.yOffset = this.currentY, this.img.isDragging = !0, this.dragging = !0, this.setTranslate(this.img, this.currentX, this.currentY))
                }
            }, {
                key: "onMove",
                value: function(e) {
                    if (this.zoomedIn) {
                        var t = e.clientX - this.img.naturalWidth / 2,
                            i = e.clientY - this.img.naturalHeight / 2;
                        this.setTranslate(this.img, t, i)
                    }
                }
            }, {
                key: "setTranslate",
                value: function(e, t, i) {
                    e.style.transform = "translate3d(" + t + "px, " + i + "px, 0)"
                }
            }, {
                key: "widowWidth",
                value: function() {
                    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
                }
            }]), e
        }(),
        V = function() {
            function e() {
                var i = this,
                    n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                t(this, e);
                var s = n.dragEl,
                    l = n.toleranceX,
                    o = void 0 === l ? 40 : l,
                    r = n.toleranceY,
                    a = void 0 === r ? 65 : r,
                    h = n.slide,
                    d = void 0 === h ? null : h,
                    c = n.instance,
                    u = void 0 === c ? null : c;
                this.el = s, this.active = !1, this.dragging = !1, this.currentX = null, this.currentY = null, this.initialX = null, this.initialY = null, this.xOffset = 0, this.yOffset = 0, this.direction = null, this.lastDirection = null, this.toleranceX = o, this.toleranceY = a, this.toleranceReached = !1, this.dragContainer = this.el, this.slide = d, this.instance = u, this.el.addEventListener("mousedown", (function(e) {
                    return i.dragStart(e)
                }), !1), this.el.addEventListener("mouseup", (function(e) {
                    return i.dragEnd(e)
                }), !1), this.el.addEventListener("mousemove", (function(e) {
                    return i.drag(e)
                }), !1)
            }
            return n(e, [{
                key: "dragStart",
                value: function(e) {
                    if (this.slide.classList.contains("zoomed")) this.active = !1;
                    else {
                        "touchstart" === e.type ? (this.initialX = e.touches[0].clientX - this.xOffset, this.initialY = e.touches[0].clientY - this.yOffset) : (this.initialX = e.clientX - this.xOffset, this.initialY = e.clientY - this.yOffset);
                        var t = e.target.nodeName.toLowerCase();
                        e.target.classList.contains("nodrag") || u(e.target, ".nodrag") || -1 !== ["input", "select", "textarea", "button", "a"].indexOf(t) ? this.active = !1 : (e.preventDefault(), (e.target === this.el || "img" !== t && u(e.target, ".gslide-inline")) && (this.active = !0, this.el.classList.add("dragging"), this.dragContainer = u(e.target, ".ginner-container")))
                    }
                }
            }, {
                key: "dragEnd",
                value: function(e) {
                    var t = this;
                    e && e.preventDefault(), this.initialX = 0, this.initialY = 0, this.currentX = null, this.currentY = null, this.initialX = null, this.initialY = null, this.xOffset = 0, this.yOffset = 0, this.active = !1, this.doSlideChange && (this.instance.preventOutsideClick = !0, "right" == this.doSlideChange && this.instance.prevSlide(), "left" == this.doSlideChange && this.instance.nextSlide()), this.doSlideClose && this.instance.close(), this.toleranceReached || this.setTranslate(this.dragContainer, 0, 0, !0), setTimeout((function() {
                        t.instance.preventOutsideClick = !1, t.toleranceReached = !1, t.lastDirection = null, t.dragging = !1, t.el.isDragging = !1, t.el.classList.remove("dragging"), t.slide.classList.remove("dragging-nav"), t.dragContainer.style.transform = "", t.dragContainer.style.transition = ""
                    }), 100)
                }
            }, {
                key: "drag",
                value: function(e) {
                    if (this.active) {
                        e.preventDefault(), this.slide.classList.add("dragging-nav"), "touchmove" === e.type ? (this.currentX = e.touches[0].clientX - this.initialX, this.currentY = e.touches[0].clientY - this.initialY) : (this.currentX = e.clientX - this.initialX, this.currentY = e.clientY - this.initialY), this.xOffset = this.currentX, this.yOffset = this.currentY, this.el.isDragging = !0, this.dragging = !0, this.doSlideChange = !1, this.doSlideClose = !1;
                        var t = Math.abs(this.currentX),
                            i = Math.abs(this.currentY);
                        if (t > 0 && t >= Math.abs(this.currentY) && (!this.lastDirection || "x" == this.lastDirection)) {
                            this.yOffset = 0, this.lastDirection = "x", this.setTranslate(this.dragContainer, this.currentX, 0);
                            var n = this.shouldChange();
                            if (!this.instance.settings.dragAutoSnap && n && (this.doSlideChange = n), this.instance.settings.dragAutoSnap && n) return this.instance.preventOutsideClick = !0, this.toleranceReached = !0, this.active = !1, this.instance.preventOutsideClick = !0, this.dragEnd(null), "right" == n && this.instance.prevSlide(), void("left" == n && this.instance.nextSlide())
                        }
                        if (this.toleranceY > 0 && i > 0 && i >= t && (!this.lastDirection || "y" == this.lastDirection)) {
                            this.xOffset = 0, this.lastDirection = "y", this.setTranslate(this.dragContainer, 0, this.currentY);
                            var s = this.shouldClose();
                            return !this.instance.settings.dragAutoSnap && s && (this.doSlideClose = !0), void(this.instance.settings.dragAutoSnap && s && this.instance.close())
                        }
                    }
                }
            }, {
                key: "shouldChange",
                value: function() {
                    var e = !1;
                    if (Math.abs(this.currentX) >= this.toleranceX) {
                        var t = this.currentX > 0 ? "right" : "left";
                        ("left" == t && this.slide !== this.slide.parentNode.lastChild || "right" == t && this.slide !== this.slide.parentNode.firstChild) && (e = t)
                    }
                    return e
                }
            }, {
                key: "shouldClose",
                value: function() {
                    var e = !1;
                    return Math.abs(this.currentY) >= this.toleranceY && (e = !0), e
                }
            }, {
                key: "setTranslate",
                value: function(e, t, i) {
                    var n = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                    e.style.transition = n ? "all .2s ease" : "", e.style.transform = "translate3d(".concat(t, "px, ").concat(i, "px, 0)")
                }
            }]), e
        }();

    function j(e, t, i, n) {
        var s = e.querySelector(".gslide-media"),
            l = new Image,
            o = "gSlideTitle_" + i,
            r = "gSlideDesc_" + i;
        l.addEventListener("load", (function() {
            T(n) && n()
        }), !1), l.src = t.href, "" != t.sizes && "" != t.srcset && (l.sizes = t.sizes, l.srcset = t.srcset), l.alt = "", I(t.alt) || "" === t.alt || (l.alt = t.alt), "" !== t.title && l.setAttribute("aria-labelledby", o), "" !== t.description && l.setAttribute("aria-describedby", r), t.hasOwnProperty("_hasCustomWidth") && t._hasCustomWidth && (l.style.width = t.width), t.hasOwnProperty("_hasCustomHeight") && t._hasCustomHeight && (l.style.height = t.height), s.insertBefore(l, s.firstChild)
    }

    function F(e, t, i, n) {
        var s = this,
            l = e.querySelector(".ginner-container"),
            o = "gvideo" + i,
            r = e.querySelector(".gslide-media"),
            a = this.getAllPlayers();
        h(l, "gvideo-container"), r.insertBefore(m('<div class="gvideo-wrapper"></div>'), r.firstChild);
        var d = e.querySelector(".gvideo-wrapper");
        S(this.settings.plyr.css, "Plyr");
        var c = t.href,
            u = location.protocol.replace(":", ""),
            g = "",
            v = "",
            f = !1;
        "file" == u && (u = "http"), r.style.maxWidth = t.width, S(this.settings.plyr.js, "Plyr", (function() {
            if (c.match(/vimeo\.com\/([0-9]*)/)) {
                var l = /vimeo.*\/(\d+)/i.exec(c);
                g = "vimeo", v = l[1]
            }
            if (c.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || c.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || c.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)) {
                var r = function(e) {
                    var t = "";
                    t = void 0 !== (e = e.replace(/(>|<)/gi, "").split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/))[2] ? (t = e[2].split(/[^0-9a-z_\-]/i))[0] : e;
                    return t
                }(c);
                g = "youtube", v = r
            }
            if (null !== c.match(/\.(mp4|ogg|webm|mov)$/)) {
                g = "local";
                var u = '<video id="' + o + '" ';
                u += 'style="background:#000; max-width: '.concat(t.width, ';" '), u += 'preload="metadata" ', u += 'x-webkit-airplay="allow" ', u += "playsinline ", u += "controls ", u += 'class="gvideo-local">';
                var p = c.toLowerCase().split(".").pop(),
                    y = {
                        mp4: "",
                        ogg: "",
                        webm: ""
                    };
                for (var x in y[p = "mov" == p ? "mp4" : p] = c, y)
                    if (y.hasOwnProperty(x)) {
                        var S = y[x];
                        t.hasOwnProperty(x) && (S = t[x]), "" !== S && (u += '<source src="'.concat(S, '" type="video/').concat(x, '">'))
                    }
                f = m(u += "</video>")
            }
            var w = f || m('<div id="'.concat(o, '" data-plyr-provider="').concat(g, '" data-plyr-embed-id="').concat(v, '"></div>'));
            h(d, "".concat(g, "-video gvideo")), d.appendChild(w), d.setAttribute("data-id", o), d.setAttribute("data-index", i);
            var C = O(s.settings.plyr, "config") ? s.settings.plyr.config : {},
                k = new Plyr("#" + o, C);
            k.on("ready", (function(e) {
                var t = e.detail.plyr;
                a[o] = t, T(n) && n()
            })), b((function() {
                return e.querySelector("iframe") && "true" == e.querySelector("iframe").dataset.ready
            }), (function() {
                s.resize(e)
            })), k.on("enterfullscreen", R), k.on("exitfullscreen", R)
        }))
    }

    function R(e) {
        var t = u(e.target, ".gslide-media");
        "enterfullscreen" == e.type && h(t, "fullscreen"), "exitfullscreen" == e.type && d(t, "fullscreen")
    }

    function G(e, t, i, n) {
        var s, l = this,
            o = e.querySelector(".gslide-media"),
            r = !(!O(t, "href") || !t.href) && t.href.split("#").pop().trim(),
            d = !(!O(t, "content") || !t.content) && t.content;
        if (d && (C(d) && (s = m('<div class="ginlined-content">'.concat(d, "</div>"))), k(d))) {
            "none" == d.style.display && (d.style.display = "block");
            var c = document.createElement("div");
            c.className = "ginlined-content", c.appendChild(d), s = c
        }
        if (r) {
            var u = document.getElementById(r);
            if (!u) return !1;
            var g = u.cloneNode(!0);
            g.style.height = t.height, g.style.maxWidth = t.width, h(g, "ginlined-content"), s = g
        }
        if (!s) return console.error("Unable to append inline slide content", t), !1;
        o.style.height = t.height, o.style.width = t.width, o.appendChild(s), this.events["inlineclose" + r] = a("click", {
            onElement: o.querySelectorAll(".gtrigger-close"),
            withCallback: function(e) {
                e.preventDefault(), l.close()
            }
        }), T(n) && n()
    }

    function Z(e, t, i, n) {
        var s = e.querySelector(".gslide-media"),
            l = function(e) {
                var t = e.url,
                    i = e.allow,
                    n = e.callback,
                    s = e.appendTo,
                    l = document.createElement("iframe");
                return l.className = "vimeo-video gvideo", l.src = t, l.style.width = "100%", l.style.height = "100%", i && l.setAttribute("allow", i), l.onload = function() {
                    h(l, "node-ready"), T(n) && n()
                }, s && s.appendChild(l), l
            }({
                url: t.href,
                callback: n
            });
        s.parentNode.style.maxWidth = t.width, s.parentNode.style.height = t.height, s.appendChild(l)
    }
    var $ = function() {
            function e() {
                var i = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                t(this, e), this.defaults = {
                    href: "",
                    sizes: "",
                    srcset: "",
                    title: "",
                    type: "",
                    description: "",
                    alt: "",
                    descPosition: "bottom",
                    effect: "",
                    width: "",
                    height: "",
                    content: !1,
                    zoomable: !0,
                    draggable: !0
                }, L(i) && (this.defaults = l(this.defaults, i))
            }
            return n(e, [{
                key: "sourceType",
                value: function(e) {
                    var t = e;
                    if (null !== (e = e.toLowerCase()).match(/\.(jpeg|jpg|jpe|gif|png|apn|webp|avif|svg)/)) return "image";
                    if (e.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || e.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || e.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)) return "video";
                    if (e.match(/vimeo\.com\/([0-9]*)/)) return "video";
                    if (null !== e.match(/\.(mp4|ogg|webm|mov)/)) return "video";
                    if (null !== e.match(/\.(mp3|wav|wma|aac|ogg)/)) return "audio";
                    if (e.indexOf("#") > -1 && "" !== t.split("#").pop().trim()) return "inline";
                    return e.indexOf("goajax=true") > -1 ? "ajax" : "external"
                }
            }, {
                key: "parseConfig",
                value: function(e, t) {
                    var i = this,
                        n = l({
                            descPosition: t.descPosition
                        }, this.defaults);
                    if (L(e) && !k(e)) {
                        O(e, "type") || (O(e, "content") && e.content ? e.type = "inline" : O(e, "href") && (e.type = this.sourceType(e.href)));
                        var s = l(n, e);
                        return this.setSize(s, t), s
                    }
                    var r = "",
                        a = e.getAttribute("data-glightbox"),
                        h = e.nodeName.toLowerCase();
                    if ("a" === h && (r = e.href), "img" === h && (r = e.src, n.alt = e.alt), n.href = r, o(n, (function(s, l) {
                            O(t, l) && "width" !== l && (n[l] = t[l]);
                            var o = e.dataset[l];
                            I(o) || (n[l] = i.sanitizeValue(o))
                        })), n.content && (n.type = "inline"), !n.type && r && (n.type = this.sourceType(r)), I(a)) {
                        if (!n.title && "a" == h) {
                            var d = e.title;
                            I(d) || "" === d || (n.title = d)
                        }
                        if (!n.title && "img" == h) {
                            var c = e.alt;
                            I(c) || "" === c || (n.title = c)
                        }
                    } else {
                        var u = [];
                        o(n, (function(e, t) {
                            u.push(";\\s?" + t)
                        })), u = u.join("\\s?:|"), "" !== a.trim() && o(n, (function(e, t) {
                            var s = a,
                                l = new RegExp("s?" + t + "s?:s?(.*?)(" + u + "s?:|$)"),
                                o = s.match(l);
                            if (o && o.length && o[1]) {
                                var r = o[1].trim().replace(/;\s*$/, "");
                                n[t] = i.sanitizeValue(r)
                            }
                        }))
                    }
                    if (n.description && "." === n.description.substring(0, 1)) {
                        var g;
                        try {
                            g = document.querySelector(n.description).innerHTML
                        } catch (e) {
                            if (!(e instanceof DOMException)) throw e
                        }
                        g && (n.description = g)
                    }
                    if (!n.description) {
                        var v = e.querySelector(".glightbox-desc");
                        v && (n.description = v.innerHTML)
                    }
                    return this.setSize(n, t, e), this.slideConfig = n, n
                }
            }, {
                key: "setSize",
                value: function(e, t) {
                    var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
                        n = "video" == e.type ? this.checkSize(t.videosWidth) : this.checkSize(t.width),
                        s = this.checkSize(t.height);
                    return e.width = O(e, "width") && "" !== e.width ? this.checkSize(e.width) : n, e.height = O(e, "height") && "" !== e.height ? this.checkSize(e.height) : s, i && "image" == e.type && (e._hasCustomWidth = !!i.dataset.width, e._hasCustomHeight = !!i.dataset.height), e
                }
            }, {
                key: "checkSize",
                value: function(e) {
                    return M(e) ? "".concat(e, "px") : e
                }
            }, {
                key: "sanitizeValue",
                value: function(e) {
                    return "true" !== e && "false" !== e ? e : "true" === e
                }
            }]), e
        }(),
        U = function() {
            function e(i, n, s) {
                t(this, e), this.element = i, this.instance = n, this.index = s
            }
            return n(e, [{
                key: "setContent",
                value: function() {
                    var e = this,
                        t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                        i = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                    if (c(t, "loaded")) return !1;
                    var n = this.instance.settings,
                        s = this.slideConfig,
                        l = w();
                    T(n.beforeSlideLoad) && n.beforeSlideLoad({
                        index: this.index,
                        slide: t,
                        player: !1
                    });
                    var o = s.type,
                        r = s.descPosition,
                        a = t.querySelector(".gslide-media"),
                        d = t.querySelector(".gslide-title"),
                        u = t.querySelector(".gslide-desc"),
                        g = t.querySelector(".gdesc-inner"),
                        v = i,
                        f = "gSlideTitle_" + this.index,
                        p = "gSlideDesc_" + this.index;
                    if (T(n.afterSlideLoad) && (v = function() {
                            T(i) && i(), n.afterSlideLoad({
                                index: e.index,
                                slide: t,
                                player: e.instance.getSlidePlayerInstance(e.index)
                            })
                        }), "" == s.title && "" == s.description ? g && g.parentNode.parentNode.removeChild(g.parentNode) : (d && "" !== s.title ? (d.id = f, d.innerHTML = s.title) : d.parentNode.removeChild(d), u && "" !== s.description ? (u.id = p, l && n.moreLength > 0 ? (s.smallDescription = this.slideShortDesc(s.description, n.moreLength, n.moreText), u.innerHTML = s.smallDescription, this.descriptionEvents(u, s)) : u.innerHTML = s.description) : u.parentNode.removeChild(u), h(a.parentNode, "desc-".concat(r)), h(g.parentNode, "description-".concat(r))), h(a, "gslide-".concat(o)), h(t, "loaded"), "video" !== o) {
                        if ("external" !== o) return "inline" === o ? (G.apply(this.instance, [t, s, this.index, v]), void(s.draggable && new V({
                            dragEl: t.querySelector(".gslide-inline"),
                            toleranceX: n.dragToleranceX,
                            toleranceY: n.dragToleranceY,
                            slide: t,
                            instance: this.instance
                        }))) : void("image" !== o ? T(v) && v() : j(t, s, this.index, (function() {
                            var i = t.querySelector("img");
                            s.draggable && new V({
                                dragEl: i,
                                toleranceX: n.dragToleranceX,
                                toleranceY: n.dragToleranceY,
                                slide: t,
                                instance: e.instance
                            }), s.zoomable && i.naturalWidth > i.offsetWidth && (h(i, "zoomable"), new H(i, t, (function() {
                                e.instance.resize()
                            }))), T(v) && v()
                        })));
                        Z.apply(this, [t, s, this.index, v])
                    } else F.apply(this.instance, [t, s, this.index, v])
                }
            }, {
                key: "slideShortDesc",
                value: function(e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 50,
                        i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                        n = document.createElement("div");
                    n.innerHTML = e;
                    var s = n.innerText,
                        l = i;
                    if ((e = s.trim()).length <= t) return e;
                    var o = e.substr(0, t - 1);
                    return l ? (n = null, o + '... <a href="#" class="desc-more">' + i + "</a>") : o
                }
            }, {
                key: "descriptionEvents",
                value: function(e, t) {
                    var i = this,
                        n = e.querySelector(".desc-more");
                    if (!n) return !1;
                    a("click", {
                        onElement: n,
                        withCallback: function(e, n) {
                            e.preventDefault();
                            var s = document.body,
                                l = u(n, ".gslide-desc");
                            if (!l) return !1;
                            l.innerHTML = t.description, h(s, "gdesc-open");
                            var o = a("click", {
                                onElement: [s, u(l, ".gslide-description")],
                                withCallback: function(e, n) {
                                    "a" !== e.target.nodeName.toLowerCase() && (d(s, "gdesc-open"), h(s, "gdesc-closed"), l.innerHTML = t.smallDescription, i.descriptionEvents(l, t), setTimeout((function() {
                                        d(s, "gdesc-closed")
                                    }), 400), o.destroy())
                                }
                            })
                        }
                    })
                }
            }, {
                key: "create",
                value: function() {
                    return m(this.instance.settings.slideHTML)
                }
            }, {
                key: "getConfig",
                value: function() {
                    k(this.element) || this.element.hasOwnProperty("draggable") || (this.element.draggable = this.instance.settings.draggable);
                    var e = new $(this.instance.settings.slideExtraAttributes);
                    return this.slideConfig = e.parseConfig(this.element, this.instance.settings), this.slideConfig
                }
            }]), e
        }(),
        J = w(),
        K = null !== w() || void 0 !== document.createTouch || "ontouchstart" in window || "onmsgesturechange" in window || navigator.msMaxTouchPoints,
        Q = document.getElementsByTagName("html")[0],
        ee = {
            selector: ".glightbox",
            elements: null,
            skin: "clean",
            theme: "clean",
            closeButton: !0,
            startAt: null,
            autoplayVideos: !0,
            autofocusVideos: !0,
            descPosition: "bottom",
            width: "900px",
            height: "506px",
            videosWidth: "960px",
            beforeSlideChange: null,
            afterSlideChange: null,
            beforeSlideLoad: null,
            afterSlideLoad: null,
            slideInserted: null,
            slideRemoved: null,
            slideExtraAttributes: null,
            onOpen: null,
            onClose: null,
            loop: !1,
            zoomable: !0,
            draggable: !0,
            dragAutoSnap: !1,
            dragToleranceX: 40,
            dragToleranceY: 65,
            preload: !0,
            oneSlidePerOpen: !1,
            touchNavigation: !0,
            touchFollowAxis: !0,
            keyboardNavigation: !0,
            closeOnOutsideClick: !0,
            plugins: !1,
            plyr: {
                css: "https://cdn.plyr.io/3.6.8/plyr.css",
                js: "https://cdn.plyr.io/3.6.8/plyr.js",
                config: {
                    ratio: "16:9",
                    fullscreen: {
                        enabled: !0,
                        iosNative: !0
                    },
                    youtube: {
                        noCookie: !0,
                        rel: 0,
                        showinfo: 0,
                        iv_load_policy: 3
                    },
                    vimeo: {
                        byline: !1,
                        portrait: !1,
                        title: !1,
                        transparent: !1
                    }
                }
            },
            openEffect: "zoom",
            closeEffect: "zoom",
            slideEffect: "slide",
            moreText: "See more",
            moreLength: 60,
            cssEfects: {
                fade: { in: "fadeIn",
                    out: "fadeOut"
                },
                zoom: { in: "zoomIn",
                    out: "zoomOut"
                },
                slide: { in: "slideInRight",
                    out: "slideOutLeft"
                },
                slideBack: { in: "slideInLeft",
                    out: "slideOutRight"
                },
                none: { in: "none",
                    out: "none"
                }
            },
            svg: {
                close: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g></svg>',
                next: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"> <g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g></svg>',
                prev: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg>'
            },
            slideHTML: '<div class="gslide">\n    <div class="gslide-inner-content">\n        <div class="ginner-container">\n            <div class="gslide-media">\n            </div>\n            <div class="gslide-description">\n                <div class="gdesc-inner">\n                    <h4 class="gslide-title"></h4>\n                    <div class="gslide-desc"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>',
            lightboxHTML: '<div id="glightbox-body" class="glightbox-container" tabindex="-1" role="dialog" aria-hidden="false">\n    <div class="gloader visible"></div>\n    <div class="goverlay"></div>\n    <div class="gcontainer">\n    <div id="glightbox-slider" class="gslider"></div>\n    <button class="gclose gbtn" aria-label="Close" data-taborder="3">{closeSVG}</button>\n    <button class="gprev gbtn" aria-label="Previous" data-taborder="2">{prevSVG}</button>\n    <button class="gnext gbtn" aria-label="Next" data-taborder="1">{nextSVG}</button>\n</div>\n</div>'
        },
        te = function() {
            function e() {
                var i = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                t(this, e), this.customOptions = i, this.settings = l(ee, i), this.effectsClasses = this.getAnimationClasses(), this.videoPlayers = {}, this.apiEvents = [], this.fullElementsList = !1
            }
            return n(e, [{
                key: "init",
                value: function() {
                    var e = this,
                        t = this.getSelector();
                    t && (this.baseEvents = a("click", {
                        onElement: t,
                        withCallback: function(t, i) {
                            t.preventDefault(), e.open(i)
                        }
                    })), this.elements = this.getElements()
                }
            }, {
                key: "open",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                        t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
                    if (0 == this.elements.length) return !1;
                    this.activeSlide = null, this.prevActiveSlideIndex = null, this.prevActiveSlide = null;
                    var i = M(t) ? t : this.settings.startAt;
                    if (k(e)) {
                        var n = e.getAttribute("data-gallery");
                        n && (this.fullElementsList = this.elements, this.elements = this.getGalleryElements(this.elements, n)), I(i) && (i = this.getElementIndex(e)) < 0 && (i = 0)
                    }
                    M(i) || (i = 0), this.build(), g(this.overlay, "none" == this.settings.openEffect ? "none" : this.settings.cssEfects.fade.in);
                    var s = document.body,
                        l = window.innerWidth - document.documentElement.clientWidth;
                    if (l > 0) {
                        var o = document.createElement("style");
                        o.type = "text/css", o.className = "gcss-styles", o.innerText = ".gscrollbar-fixer {margin-right: ".concat(l, "px}"), document.head.appendChild(o), h(s, "gscrollbar-fixer")
                    }
                    h(s, "glightbox-open"), h(Q, "glightbox-open"), J && (h(document.body, "glightbox-mobile"), this.settings.slideEffect = "slide"), this.showSlide(i, !0), 1 == this.elements.length ? (h(this.prevButton, "glightbox-button-hidden"), h(this.nextButton, "glightbox-button-hidden")) : (d(this.prevButton, "glightbox-button-hidden"), d(this.nextButton, "glightbox-button-hidden")), this.lightboxOpen = !0, this.trigger("open"), T(this.settings.onOpen) && this.settings.onOpen(), K && this.settings.touchNavigation && B(this), this.settings.keyboardNavigation && X(this)
                }
            }, {
                key: "openAt",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                    this.open(null, e)
                }
            }, {
                key: "showSlide",
                value: function() {
                    var e = this,
                        t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                        i = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                    f(this.loader), this.index = parseInt(t);
                    var n = this.slidesContainer.querySelector(".current");
                    n && d(n, "current"), this.slideAnimateOut();
                    var s = this.slidesContainer.querySelectorAll(".gslide")[t];
                    if (c(s, "loaded")) this.slideAnimateIn(s, i), p(this.loader);
                    else {
                        f(this.loader);
                        var l = this.elements[t],
                            o = {
                                index: this.index,
                                slide: s,
                                slideNode: s,
                                slideConfig: l.slideConfig,
                                slideIndex: this.index,
                                trigger: l.node,
                                player: null
                            };
                        this.trigger("slide_before_load", o), l.instance.setContent(s, (function() {
                            p(e.loader), e.resize(), e.slideAnimateIn(s, i), e.trigger("slide_after_load", o)
                        }))
                    }
                    this.slideDescription = s.querySelector(".gslide-description"), this.slideDescriptionContained = this.slideDescription && c(this.slideDescription.parentNode, "gslide-media"), this.settings.preload && (this.preloadSlide(t + 1), this.preloadSlide(t - 1)), this.updateNavigationClasses(), this.activeSlide = s
                }
            }, {
                key: "preloadSlide",
                value: function(e) {
                    var t = this;
                    if (e < 0 || e > this.elements.length - 1) return !1;
                    if (I(this.elements[e])) return !1;
                    var i = this.slidesContainer.querySelectorAll(".gslide")[e];
                    if (c(i, "loaded")) return !1;
                    var n = this.elements[e],
                        s = n.type,
                        l = {
                            index: e,
                            slide: i,
                            slideNode: i,
                            slideConfig: n.slideConfig,
                            slideIndex: e,
                            trigger: n.node,
                            player: null
                        };
                    this.trigger("slide_before_load", l), "video" == s || "external" == s ? setTimeout((function() {
                        n.instance.setContent(i, (function() {
                            t.trigger("slide_after_load", l)
                        }))
                    }), 200) : n.instance.setContent(i, (function() {
                        t.trigger("slide_after_load", l)
                    }))
                }
            }, {
                key: "prevSlide",
                value: function() {
                    this.goToSlide(this.index - 1)
                }
            }, {
                key: "nextSlide",
                value: function() {
                    this.goToSlide(this.index + 1)
                }
            }, {
                key: "goToSlide",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                    if (this.prevActiveSlide = this.activeSlide, this.prevActiveSlideIndex = this.index, !this.loop() && (e < 0 || e > this.elements.length - 1)) return !1;
                    e < 0 ? e = this.elements.length - 1 : e >= this.elements.length && (e = 0), this.showSlide(e)
                }
            }, {
                key: "insertSlide",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                        t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : -1;
                    t < 0 && (t = this.elements.length);
                    var i = new U(e, this, t),
                        n = i.getConfig(),
                        s = l({}, n),
                        o = i.create(),
                        r = this.elements.length - 1;
                    s.index = t, s.node = !1, s.instance = i, s.slideConfig = n, this.elements.splice(t, 0, s);
                    var a = null,
                        h = null;
                    if (this.slidesContainer) {
                        if (t > r) this.slidesContainer.appendChild(o);
                        else {
                            var d = this.slidesContainer.querySelectorAll(".gslide")[t];
                            this.slidesContainer.insertBefore(o, d)
                        }(this.settings.preload && 0 == this.index && 0 == t || this.index - 1 == t || this.index + 1 == t) && this.preloadSlide(t), 0 == this.index && 0 == t && (this.index = 1), this.updateNavigationClasses(), a = this.slidesContainer.querySelectorAll(".gslide")[t], h = this.getSlidePlayerInstance(t), s.slideNode = a
                    }
                    this.trigger("slide_inserted", {
                        index: t,
                        slide: a,
                        slideNode: a,
                        slideConfig: n,
                        slideIndex: t,
                        trigger: null,
                        player: h
                    }), T(this.settings.slideInserted) && this.settings.slideInserted({
                        index: t,
                        slide: a,
                        player: h
                    })
                }
            }, {
                key: "removeSlide",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : -1;
                    if (e < 0 || e > this.elements.length - 1) return !1;
                    var t = this.slidesContainer && this.slidesContainer.querySelectorAll(".gslide")[e];
                    t && (this.getActiveSlideIndex() == e && (e == this.elements.length - 1 ? this.prevSlide() : this.nextSlide()), t.parentNode.removeChild(t)), this.elements.splice(e, 1), this.trigger("slide_removed", e), T(this.settings.slideRemoved) && this.settings.slideRemoved(e)
                }
            }, {
                key: "slideAnimateIn",
                value: function(e, t) {
                    var i = this,
                        n = e.querySelector(".gslide-media"),
                        s = e.querySelector(".gslide-description"),
                        l = {
                            index: this.prevActiveSlideIndex,
                            slide: this.prevActiveSlide,
                            slideNode: this.prevActiveSlide,
                            slideIndex: this.prevActiveSlide,
                            slideConfig: I(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].slideConfig,
                            trigger: I(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].node,
                            player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
                        },
                        o = {
                            index: this.index,
                            slide: this.activeSlide,
                            slideNode: this.activeSlide,
                            slideConfig: this.elements[this.index].slideConfig,
                            slideIndex: this.index,
                            trigger: this.elements[this.index].node,
                            player: this.getSlidePlayerInstance(this.index)
                        };
                    if (n.offsetWidth > 0 && s && (p(s), s.style.display = ""), d(e, this.effectsClasses), t) g(e, this.settings.cssEfects[this.settings.openEffect].in, (function() {
                        i.settings.autoplayVideos && i.slidePlayerPlay(e), i.trigger("slide_changed", {
                            prev: l,
                            current: o
                        }), T(i.settings.afterSlideChange) && i.settings.afterSlideChange.apply(i, [l, o])
                    }));
                    else {
                        var r = this.settings.slideEffect,
                            a = "none" !== r ? this.settings.cssEfects[r].in : r;
                        this.prevActiveSlideIndex > this.index && "slide" == this.settings.slideEffect && (a = this.settings.cssEfects.slideBack.in), g(e, a, (function() {
                            i.settings.autoplayVideos && i.slidePlayerPlay(e), i.trigger("slide_changed", {
                                prev: l,
                                current: o
                            }), T(i.settings.afterSlideChange) && i.settings.afterSlideChange.apply(i, [l, o])
                        }))
                    }
                    setTimeout((function() {
                        i.resize(e)
                    }), 100), h(e, "current")
                }
            }, {
                key: "slideAnimateOut",
                value: function() {
                    if (!this.prevActiveSlide) return !1;
                    var e = this.prevActiveSlide;
                    d(e, this.effectsClasses), h(e, "prev");
                    var t = this.settings.slideEffect,
                        i = "none" !== t ? this.settings.cssEfects[t].out : t;
                    this.slidePlayerPause(e), this.trigger("slide_before_change", {
                        prev: {
                            index: this.prevActiveSlideIndex,
                            slide: this.prevActiveSlide,
                            slideNode: this.prevActiveSlide,
                            slideIndex: this.prevActiveSlideIndex,
                            slideConfig: I(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].slideConfig,
                            trigger: I(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].node,
                            player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
                        },
                        current: {
                            index: this.index,
                            slide: this.activeSlide,
                            slideNode: this.activeSlide,
                            slideIndex: this.index,
                            slideConfig: this.elements[this.index].slideConfig,
                            trigger: this.elements[this.index].node,
                            player: this.getSlidePlayerInstance(this.index)
                        }
                    }), T(this.settings.beforeSlideChange) && this.settings.beforeSlideChange.apply(this, [{
                        index: this.prevActiveSlideIndex,
                        slide: this.prevActiveSlide,
                        player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
                    }, {
                        index: this.index,
                        slide: this.activeSlide,
                        player: this.getSlidePlayerInstance(this.index)
                    }]), this.prevActiveSlideIndex > this.index && "slide" == this.settings.slideEffect && (i = this.settings.cssEfects.slideBack.out), g(e, i, (function() {
                        var t = e.querySelector(".ginner-container"),
                            i = e.querySelector(".gslide-media"),
                            n = e.querySelector(".gslide-description");
                        t.style.transform = "", i.style.transform = "", d(i, "greset"), i.style.opacity = "", n && (n.style.opacity = ""), d(e, "prev")
                    }))
                }
            }, {
                key: "getAllPlayers",
                value: function() {
                    return this.videoPlayers
                }
            }, {
                key: "getSlidePlayerInstance",
                value: function(e) {
                    var t = "gvideo" + e,
                        i = this.getAllPlayers();
                    return !(!O(i, t) || !i[t]) && i[t]
                }
            }, {
                key: "stopSlideVideo",
                value: function(e) {
                    if (k(e)) {
                        var t = e.querySelector(".gvideo-wrapper");
                        t && (e = t.getAttribute("data-index"))
                    }
                    console.log("stopSlideVideo is deprecated, use slidePlayerPause");
                    var i = this.getSlidePlayerInstance(e);
                    i && i.playing && i.pause()
                }
            }, {
                key: "slidePlayerPause",
                value: function(e) {
                    if (k(e)) {
                        var t = e.querySelector(".gvideo-wrapper");
                        t && (e = t.getAttribute("data-index"))
                    }
                    var i = this.getSlidePlayerInstance(e);
                    i && i.playing && i.pause()
                }
            }, {
                key: "playSlideVideo",
                value: function(e) {
                    if (k(e)) {
                        var t = e.querySelector(".gvideo-wrapper");
                        t && (e = t.getAttribute("data-index"))
                    }
                    console.log("playSlideVideo is deprecated, use slidePlayerPlay");
                    var i = this.getSlidePlayerInstance(e);
                    i && !i.playing && i.play()
                }
            }, {
                key: "slidePlayerPlay",
                value: function(e) {
                    if (k(e)) {
                        var t = e.querySelector(".gvideo-wrapper");
                        t && (e = t.getAttribute("data-index"))
                    }
                    var i = this.getSlidePlayerInstance(e);
                    i && !i.playing && (i.play(), this.settings.autofocusVideos && i.elements.container.focus())
                }
            }, {
                key: "setElements",
                value: function(e) {
                    var t = this;
                    this.settings.elements = !1;
                    var i = [];
                    e && e.length && o(e, (function(e, n) {
                        var s = new U(e, t, n),
                            o = s.getConfig(),
                            r = l({}, o);
                        r.slideConfig = o, r.instance = s, r.index = n, i.push(r)
                    })), this.elements = i, this.lightboxOpen && (this.slidesContainer.innerHTML = "", this.elements.length && (o(this.elements, (function() {
                        var e = m(t.settings.slideHTML);
                        t.slidesContainer.appendChild(e)
                    })), this.showSlide(0, !0)))
                }
            }, {
                key: "getElementIndex",
                value: function(e) {
                    var t = !1;
                    return o(this.elements, (function(i, n) {
                        if (O(i, "node") && i.node == e) return t = n, !0
                    })), t
                }
            }, {
                key: "getElements",
                value: function() {
                    var e = this,
                        t = [];
                    this.elements = this.elements ? this.elements : [], !I(this.settings.elements) && E(this.settings.elements) && this.settings.elements.length && o(this.settings.elements, (function(i, n) {
                        var s = new U(i, e, n),
                            o = s.getConfig(),
                            r = l({}, o);
                        r.node = !1, r.index = n, r.instance = s, r.slideConfig = o, t.push(r)
                    }));
                    var i = !1;
                    return this.getSelector() && (i = document.querySelectorAll(this.getSelector())), i ? (o(i, (function(i, n) {
                        var s = new U(i, e, n),
                            o = s.getConfig(),
                            r = l({}, o);
                        r.node = i, r.index = n, r.instance = s, r.slideConfig = o, r.gallery = i.getAttribute("data-gallery"), t.push(r)
                    })), t) : t
                }
            }, {
                key: "getGalleryElements",
                value: function(e, t) {
                    return e.filter((function(e) {
                        return e.gallery == t
                    }))
                }
            }, {
                key: "getSelector",
                value: function() {
                    return !this.settings.elements && (this.settings.selector && "data-" == this.settings.selector.substring(0, 5) ? "*[".concat(this.settings.selector, "]") : this.settings.selector)
                }
            }, {
                key: "getActiveSlide",
                value: function() {
                    return this.slidesContainer.querySelectorAll(".gslide")[this.index]
                }
            }, {
                key: "getActiveSlideIndex",
                value: function() {
                    return this.index
                }
            }, {
                key: "getAnimationClasses",
                value: function() {
                    var e = [];
                    for (var t in this.settings.cssEfects)
                        if (this.settings.cssEfects.hasOwnProperty(t)) {
                            var i = this.settings.cssEfects[t];
                            e.push("g".concat(i.in)), e.push("g".concat(i.out))
                        }
                    return e.join(" ")
                }
            }, {
                key: "build",
                value: function() {
                    var e = this;
                    if (this.built) return !1;
                    var t = document.body.childNodes,
                        i = [];
                    o(t, (function(e) {
                        e.parentNode == document.body && "#" !== e.nodeName.charAt(0) && e.hasAttribute && !e.hasAttribute("aria-hidden") && (i.push(e), e.setAttribute("aria-hidden", "true"))
                    }));
                    var n = O(this.settings.svg, "next") ? this.settings.svg.next : "",
                        s = O(this.settings.svg, "prev") ? this.settings.svg.prev : "",
                        l = O(this.settings.svg, "close") ? this.settings.svg.close : "",
                        r = this.settings.lightboxHTML;
                    r = m(r = (r = (r = r.replace(/{nextSVG}/g, n)).replace(/{prevSVG}/g, s)).replace(/{closeSVG}/g, l)), document.body.appendChild(r);
                    var d = document.getElementById("glightbox-body");
                    this.modal = d;
                    var g = d.querySelector(".gclose");
                    this.prevButton = d.querySelector(".gprev"), this.nextButton = d.querySelector(".gnext"), this.overlay = d.querySelector(".goverlay"), this.loader = d.querySelector(".gloader"), this.slidesContainer = document.getElementById("glightbox-slider"), this.bodyHiddenChildElms = i, this.events = {}, h(this.modal, "glightbox-" + this.settings.skin), this.settings.closeButton && g && (this.events.close = a("click", {
                        onElement: g,
                        withCallback: function(t, i) {
                            t.preventDefault(), e.close()
                        }
                    })), g && !this.settings.closeButton && g.parentNode.removeChild(g), this.nextButton && (this.events.next = a("click", {
                        onElement: this.nextButton,
                        withCallback: function(t, i) {
                            t.preventDefault(), e.nextSlide()
                        }
                    })), this.prevButton && (this.events.prev = a("click", {
                        onElement: this.prevButton,
                        withCallback: function(t, i) {
                            t.preventDefault(), e.prevSlide()
                        }
                    })), this.settings.closeOnOutsideClick && (this.events.outClose = a("click", {
                        onElement: d,
                        withCallback: function(t, i) {
                            e.preventOutsideClick || c(document.body, "glightbox-mobile") || u(t.target, ".ginner-container") || u(t.target, ".gbtn") || c(t.target, "gnext") || c(t.target, "gprev") || e.close()
                        }
                    })), o(this.elements, (function(t, i) {
                        e.slidesContainer.appendChild(t.instance.create()), t.slideNode = e.slidesContainer.querySelectorAll(".gslide")[i]
                    })), K && h(document.body, "glightbox-touch"), this.events.resize = a("resize", {
                        onElement: window,
                        withCallback: function() {
                            e.resize()
                        }
                    }), this.built = !0
                }
            }, {
                key: "resize",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
                    if ((e = e || this.activeSlide) && !c(e, "zoomed")) {
                        var t = y(),
                            i = e.querySelector(".gvideo-wrapper"),
                            n = e.querySelector(".gslide-image"),
                            s = this.slideDescription,
                            l = t.width,
                            o = t.height;
                        if (l <= 768 ? h(document.body, "glightbox-mobile") : d(document.body, "glightbox-mobile"), i || n) {
                            var r = !1;
                            if (s && (c(s, "description-bottom") || c(s, "description-top")) && !c(s, "gabsolute") && (r = !0), n)
                                if (l <= 768) n.querySelector("img");
                                else if (r) {
                                var a = s.offsetHeight,
                                    u = n.querySelector("img");
                                u.setAttribute("style", "max-height: calc(100vh - ".concat(a, "px)")), s.setAttribute("style", "max-width: ".concat(u.offsetWidth, "px;"))
                            }
                            if (i) {
                                var g = O(this.settings.plyr.config, "ratio") ? this.settings.plyr.config.ratio : "";
                                if (!g) {
                                    var v = i.clientWidth,
                                        f = i.clientHeight,
                                        p = v / f;
                                    g = "".concat(v / p, ":").concat(f / p)
                                }
                                var m = g.split(":"),
                                    x = this.settings.videosWidth,
                                    b = this.settings.videosWidth,
                                    S = (b = M(x) || -1 !== x.indexOf("px") ? parseInt(x) : -1 !== x.indexOf("vw") ? l * parseInt(x) / 100 : -1 !== x.indexOf("vh") ? o * parseInt(x) / 100 : -1 !== x.indexOf("%") ? l * parseInt(x) / 100 : parseInt(i.clientWidth)) / (parseInt(m[0]) / parseInt(m[1]));
                                if (S = Math.floor(S), r && (o -= s.offsetHeight), b > l || S > o || o < S && l > b) {
                                    var w = i.offsetWidth,
                                        T = i.offsetHeight,
                                        C = o / T,
                                        k = {
                                            width: w * C,
                                            height: T * C
                                        };
                                    i.parentNode.setAttribute("style", "max-width: ".concat(k.width, "px")), r && s.setAttribute("style", "max-width: ".concat(k.width, "px;"))
                                } else i.parentNode.style.maxWidth = "".concat(x), r && s.setAttribute("style", "max-width: ".concat(x, ";"))
                            }
                        }
                    }
                }
            }, {
                key: "reload",
                value: function() {
                    this.init()
                }
            }, {
                key: "updateNavigationClasses",
                value: function() {
                    var e = this.loop();
                    d(this.nextButton, "disabled"), d(this.prevButton, "disabled"), 0 == this.index && this.elements.length - 1 == 0 ? (h(this.prevButton, "disabled"), h(this.nextButton, "disabled")) : 0 !== this.index || e ? this.index !== this.elements.length - 1 || e || h(this.nextButton, "disabled") : h(this.prevButton, "disabled")
                }
            }, {
                key: "loop",
                value: function() {
                    var e = O(this.settings, "loopAtEnd") ? this.settings.loopAtEnd : null;
                    return e = O(this.settings, "loop") ? this.settings.loop : e, e
                }
            }, {
                key: "close",
                value: function() {
                    var e = this;
                    if (!this.lightboxOpen) {
                        if (this.events) {
                            for (var t in this.events) this.events.hasOwnProperty(t) && this.events[t].destroy();
                            this.events = null
                        }
                        return !1
                    }
                    if (this.closing) return !1;
                    this.closing = !0, this.slidePlayerPause(this.activeSlide), this.fullElementsList && (this.elements = this.fullElementsList), this.bodyHiddenChildElms.length && o(this.bodyHiddenChildElms, (function(e) {
                        e.removeAttribute("aria-hidden")
                    })), h(this.modal, "glightbox-closing"), g(this.overlay, "none" == this.settings.openEffect ? "none" : this.settings.cssEfects.fade.out), g(this.activeSlide, this.settings.cssEfects[this.settings.closeEffect].out, (function() {
                        if (e.activeSlide = null, e.prevActiveSlideIndex = null, e.prevActiveSlide = null, e.built = !1, e.events) {
                            for (var t in e.events) e.events.hasOwnProperty(t) && e.events[t].destroy();
                            e.events = null
                        }
                        var i = document.body;
                        d(Q, "glightbox-open"), d(i, "glightbox-open touching gdesc-open glightbox-touch glightbox-mobile gscrollbar-fixer"), e.modal.parentNode.removeChild(e.modal), e.trigger("close"), T(e.settings.onClose) && e.settings.onClose();
                        var n = document.querySelector(".gcss-styles");
                        n && n.parentNode.removeChild(n), e.lightboxOpen = !1, e.closing = null
                    }))
                }
            }, {
                key: "destroy",
                value: function() {
                    this.close(), this.clearAllEvents(), this.baseEvents && this.baseEvents.destroy()
                }
            }, {
                key: "on",
                value: function(e, t) {
                    var i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                    if (!e || !T(t)) throw new TypeError("Event name and callback must be defined");
                    this.apiEvents.push({
                        evt: e,
                        once: i,
                        callback: t
                    })
                }
            }, {
                key: "once",
                value: function(e, t) {
                    this.on(e, t, !0)
                }
            }, {
                key: "trigger",
                value: function(e) {
                    var t = this,
                        i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
                        n = [];
                    o(this.apiEvents, (function(t, s) {
                        var l = t.evt,
                            o = t.once,
                            r = t.callback;
                        l == e && (r(i), o && n.push(s))
                    })), n.length && o(n, (function(e) {
                        return t.apiEvents.splice(e, 1)
                    }))
                }
            }, {
                key: "clearAllEvents",
                value: function() {
                    this.apiEvents.splice(0, this.apiEvents.length)
                }
            }, {
                key: "version",
                value: function() {
                    return "3.1.1"
                }
            }]), e
        }();
    return function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
            t = new te(e);
        return t.init(), t
    }
}));;
/* @license GPL-2.0-or-later https://www.drupal.org/licensing/faq */
"use strict";
(function(Drupal) {
    Drupal.behaviors.splideGallery = {
        attach: function attach(context) {
            context.querySelectorAll('.usc-gallery:not(.gallery-processed)').forEach(function(galleryField) {
                var mainSlider = new Splide(galleryField.querySelector('.main-slider'), {
                    perPage: 2,
                    gap: '1.5rem',
                    arrows: true,
                    padding: {
                        left: 0,
                        right: '10%'
                    },
                    breakpoints: {
                        1400: {
                            perPage: 2
                        },
                        800: {
                            perPage: 1
                        }
                    }
                });
                mainSlider.mount(window.splide.Extensions);
                var lightbox = GLightbox({});
                galleryField.querySelectorAll('.main-slider .splide__slide__container a').forEach(function(image) {
                    image.addEventListener('click', function(e) {
                        var item_number = 0;
                        e.preventDefault();
                        var slider = this.closest(".splide__list");
                        var slideritems = [];
                        slider.querySelectorAll('.splide__slide .slide-content-wrapper').forEach(function(item) {
                            var current_slide = item.querySelector('.splide__slide__container a');
                            if (current_slide == image) item_number = slideritems.length;
                            var targetHref = current_slide.getAttribute('href');
                            var asset_url = item.querySelector('.splide__slide__container').getAttribute('asset-url');
                            if (asset_url != null && asset_url != '') targetHref = asset_url;
                            var title = '';
                            var description = '';
                            if (item.querySelector('.readmore-text') != null) description = item.querySelector('.readmore-text').innerHTML;
                            else {
                                if (item.querySelector('p') != null) description = item.querySelector('p').outerHTML;
                            }
                            if (item.querySelector('.details-box strong') != null) title = item.querySelector('.details-box strong').outerHTML;
                            slideritems.push({
                                'href': targetHref,
                                'description': title + description
                            });
                        });
                        lightbox.setElements(slideritems);
                        lightbox.openAt(item_number);
                    });
                });
                galleryField.classList.add('gallery-processed');
            });
        }
    };
})(Drupal);;
(function($) {
    $(document).ready(function() {
        let items = $('.in-this-section__list li');
        let total = items.length;
        let leftNum = 0;
        total % 2 === 0 ? leftNum = Math.ceil(total / 2) + 1 : leftNum = Math.ceil(total / 2);
        items.each(function(index) {
            let row = index < leftNum ? index + 1 : index + 2 - leftNum;
            let col = index < leftNum ? 1 : 2;
            $(this).css({
                "grid-row": row,
                "grid-col": col
            });
        });
        $("#court_type").on("click", function() {
            window.open('/federal-court-finder-help-definitions#court-type', '_blank');
        });
        $("#court_type").on("keydown", function(event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                window.open('/federal-court-finder-help-definitions#court-type', '_blank');
            }
        });
        $('.mobile-search__form, .desktop-search__form').on('submit', function(e) {
            const searchValue = $(this).find('#mobile-search-input, #desktop-search-input').val();
            window.dataLayer.push({
                'event': 'view_search_results',
                'search_term': searchValue
            });
        });
    });
})(jQuery);;
! function() {
    "use strict";
    var n, e = "usa-js-loading";

    function t() {
        document.documentElement.classList.remove(e)
    }
    document.documentElement.classList.add(e), n = setTimeout(t, 8e3), window.addEventListener("load", function e() {
        window.uswdsPresent && (clearTimeout(n), t(), window.removeEventListener("load", e, !0))
    }, !0)
}();

;
! function s(a, n, i) {
    function o(t, e) {
        if (!n[t]) {
            if (!a[t]) {
                var r = "function" == typeof require && require;
                if (!e && r) return r(t, !0);
                if (c) return c(t, !0);
                throw (e = new Error("Cannot find module '" + t + "'")).code = "MODULE_NOT_FOUND", e
            }
            r = n[t] = {
                exports: {}
            }, a[t][0].call(r.exports, function(e) {
                return o(a[t][1][e] || e)
            }, r, r.exports, s, a, n, i)
        }
        return n[t].exports
    }
    for (var c = "function" == typeof require && require, e = 0; e < i.length; e++) o(i[e]);
    return o
}({
    1: [function(e, t, r) {
        "use strict";
        var s;
        if ("document" in window.self)
            if ("classList" in document.createElement("_") && (!document.createElementNS || "classList" in document.createElementNS("http://www.w3.org/2000/svg", "g")))(a = document.createElement("_")).classList.add("c1", "c2"), a.classList.contains("c2") || ((i = function(e) {
                var s = DOMTokenList.prototype[e];
                DOMTokenList.prototype[e] = function(e) {
                    for (var t = arguments.length, r = 0; r < t; r++) s.call(this, arguments[r])
                }
            })("add"), i("remove")), a.classList.toggle("c3", !1), a.classList.contains("c3") && (s = DOMTokenList.prototype.toggle, DOMTokenList.prototype.toggle = function(e, t) {
                return 1 in arguments && !this.contains(e) == !t ? t : s.call(this, e)
            });
            else if ("Element" in (i = window.self)) {
            var a = "classList",
                n = "prototype",
                i = i.Element[n],
                o = Object,
                c = String[n].trim || function() {
                    return this.replace(/^\s+|\s+$/g, "")
                },
                l = Array[n].indexOf || function(e) {
                    for (var t = 0, r = this.length; t < r; t++)
                        if (t in this && this[t] === e) return t;
                    return -1
                },
                u = function(e, t) {
                    this.name = e, this.code = DOMException[e], this.message = t
                },
                d = function(e, t) {
                    if ("" === t) throw new u("SYNTAX_ERR", "An invalid or illegal string was specified");
                    if (/\s/.test(t)) throw new u("INVALID_CHARACTER_ERR", "String contains an invalid character");
                    return l.call(e, t)
                },
                p = function(e) {
                    for (var t = c.call(e.getAttribute("class") || ""), r = t ? t.split(/\s+/) : [], s = 0, a = r.length; s < a; s++) this.push(r[s]);
                    this._updateClassName = function() {
                        e.setAttribute("class", this.toString())
                    }
                },
                b = p[n] = [],
                f = function() {
                    return new p(this)
                };
            if (u[n] = Error[n], b.item = function(e) {
                    return this[e] || null
                }, b.contains = function(e) {
                    return -1 !== d(this, e += "")
                }, b.add = function() {
                    for (var e, t = arguments, r = 0, s = t.length, a = !1; - 1 === d(this, e = t[r] + "") && (this.push(e), a = !0), ++r < s;);
                    a && this._updateClassName()
                }, b.remove = function() {
                    var e, t, r = arguments,
                        s = 0,
                        a = r.length,
                        n = !1;
                    do {
                        for (t = d(this, e = r[s] + ""); - 1 !== t;) this.splice(t, 1), n = !0, t = d(this, e)
                    } while (++s < a);
                    n && this._updateClassName()
                }, b.toggle = function(e, t) {
                    var r = this.contains(e += ""),
                        s = r ? !0 !== t && "remove" : !1 !== t && "add";
                    return s && this[s](e), !0 === t || !1 === t ? t : !r
                }, b.toString = function() {
                    return this.join(" ")
                }, o.defineProperty) {
                b = {
                    get: f,
                    enumerable: !0,
                    configurable: !0
                };
                try {
                    o.defineProperty(i, a, b)
                } catch (e) {
                    -2146823252 === e.number && (b.enumerable = !1, o.defineProperty(i, a, b))
                }
            } else o[n].__defineGetter__ && i.__defineGetter__(a, f)
        }
    }, {}],
    2: [function(e, t, r) {
        "use strict";
        var s;
        "function" != typeof(s = window.Element.prototype).matches && (s.matches = s.msMatchesSelector || s.mozMatchesSelector || s.webkitMatchesSelector || function(e) {
            for (var t = (this.document || this.ownerDocument).querySelectorAll(e), r = 0; t[r] && t[r] !== this;) ++r;
            return Boolean(t[r])
        }), "function" != typeof s.closest && (s.closest = function(e) {
            for (var t = this; t && 1 === t.nodeType;) {
                if (t.matches(e)) return t;
                t = t.parentNode
            }
            return null
        })
    }, {}],
    3: [function(e, t, r) {
        "use strict";
        for (var s = {
                polyfill: function() {
                    if (!("KeyboardEvent" in window) || "key" in KeyboardEvent.prototype) return !1;
                    var e = {
                        get: function(e) {
                            var t = s.keys[this.which || this.keyCode];
                            return t = Array.isArray(t) ? t[+this.shiftKey] : t
                        }
                    };
                    return Object.defineProperty(KeyboardEvent.prototype, "key", e), e
                },
                keys: {
                    3: "Cancel",
                    6: "Help",
                    8: "Backspace",
                    9: "Tab",
                    12: "Clear",
                    13: "Enter",
                    16: "Shift",
                    17: "Control",
                    18: "Alt",
                    19: "Pause",
                    20: "CapsLock",
                    27: "Escape",
                    28: "Convert",
                    29: "NonConvert",
                    30: "Accept",
                    31: "ModeChange",
                    32: " ",
                    33: "PageUp",
                    34: "PageDown",
                    35: "End",
                    36: "Home",
                    37: "ArrowLeft",
                    38: "ArrowUp",
                    39: "ArrowRight",
                    40: "ArrowDown",
                    41: "Select",
                    42: "Print",
                    43: "Execute",
                    44: "PrintScreen",
                    45: "Insert",
                    46: "Delete",
                    48: ["0", ")"],
                    49: ["1", "!"],
                    50: ["2", "@"],
                    51: ["3", "#"],
                    52: ["4", "$"],
                    53: ["5", "%"],
                    54: ["6", "^"],
                    55: ["7", "&"],
                    56: ["8", "*"],
                    57: ["9", "("],
                    91: "OS",
                    93: "ContextMenu",
                    144: "NumLock",
                    145: "ScrollLock",
                    181: "VolumeMute",
                    182: "VolumeDown",
                    183: "VolumeUp",
                    186: [";", ":"],
                    187: ["=", "+"],
                    188: [",", "<"],
                    189: ["-", "_"],
                    190: [".", ">"],
                    191: ["/", "?"],
                    192: ["`", "~"],
                    219: ["[", "{"],
                    220: ["\\", "|"],
                    221: ["]", "}"],
                    222: ["'", '"'],
                    224: "Meta",
                    225: "AltGraph",
                    246: "Attn",
                    247: "CrSel",
                    248: "ExSel",
                    249: "EraseEof",
                    250: "Play",
                    251: "ZoomOut"
                }
            }, a = 1; a < 25; a++) s.keys[111 + a] = "F" + a;
        var n = "";
        for (a = 65; a < 91; a++) n = String.fromCharCode(a), s.keys[a] = [n.toLowerCase(), n.toUpperCase()];
        "function" == typeof define && define.amd ? define("keyboardevent-key-polyfill", s) : void 0 !== r && void 0 !== t ? t.exports = s : window && (window.keyboardeventKeyPolyfill = s)
    }, {}],
    4: [function(e, t, r) {
        "use strict";
        var c = Object.getOwnPropertySymbols,
            l = Object.prototype.hasOwnProperty,
            u = Object.prototype.propertyIsEnumerable;
        t.exports = function() {
            try {
                if (Object.assign) {
                    var e = new String("abc");
                    if (e[5] = "de", "5" !== Object.getOwnPropertyNames(e)[0]) {
                        for (var t = {}, r = 0; r < 10; r++) t["_" + String.fromCharCode(r)] = r;
                        var s, a = Object.getOwnPropertyNames(t).map(function(e) {
                            return t[e]
                        });
                        if ("0123456789" === a.join("")) return s = {}, "abcdefghijklmnopqrst".split("").forEach(function(e) {
                            s[e] = e
                        }), "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, s)).join("") ? 1 : void 0
                    }
                }
            } catch (e) {}
        }() ? Object.assign : function(e, t) {
            for (var r, s = function(e) {
                    if (null == e) throw new TypeError("Object.assign cannot be called with null or undefined");
                    return Object(e)
                }(e), a = 1; a < arguments.length; a++) {
                for (var n in r = Object(arguments[a])) l.call(r, n) && (s[n] = r[n]);
                if (c)
                    for (var i = c(r), o = 0; o < i.length; o++) u.call(r, i[o]) && (s[i[o]] = r[i[o]])
            }
            return s
        }
    }, {}],
    5: [function(e, t, r) {
        "use strict";
        const c = e("object-assign"),
            l = e("../delegate"),
            u = e("../delegateAll"),
            d = /^(.+):delegate\((.+)\)$/;

        function p(e, t) {
            var r = e[t];
            return delete e[t], r
        }
        t.exports = function(o, e) {
            const r = Object.keys(o).reduce(function(e, t) {
                r = o[t = t], (i = t.match(d)) && (t = i[1], s = i[2]), "object" == typeof r && (a = {
                    capture: p(r, "capture"),
                    passive: p(r, "passive")
                }), n = {
                    selector: s,
                    delegate: "object" == typeof r ? u(r) : s ? l(s, r) : r,
                    options: a
                };
                var r, s, a, n, i = -1 < t.indexOf(" ") ? t.split(" ").map(function(e) {
                    return c({
                        type: e
                    }, n)
                }) : (n.type = t, [n]);
                return e.concat(i)
            }, []);
            return c({
                add: function(t) {
                    r.forEach(function(e) {
                        t.addEventListener(e.type, e.delegate, e.options)
                    })
                },
                remove: function(t) {
                    r.forEach(function(e) {
                        t.removeEventListener(e.type, e.delegate, e.options)
                    })
                }
            }, e)
        }
    }, {
        "../delegate": 7,
        "../delegateAll": 8,
        "object-assign": 4
    }],
    6: [function(e, t, r) {
        "use strict";
        t.exports = function(e) {
            return function(t) {
                return e.some(function(e) {
                    return !1 === e.call(this, t)
                }, this)
            }
        }
    }, {}],
    7: [function(e, t, r) {
        "use strict";
        e("element-closest"), t.exports = function(r, s) {
            return function(e) {
                var t = e.target.closest(r);
                if (t) return s.call(t, e)
            }
        }
    }, {
        "element-closest": 2
    }],
    8: [function(e, t, r) {
        "use strict";
        const s = e("../delegate"),
            a = e("../compose");
        t.exports = function(r) {
            var e = Object.keys(r);
            return 1 === e.length && "*" === e[0] ? r["*"] : (e = e.reduce(function(e, t) {
                return e.push(s(t, r[t])), e
            }, []), a(e))
        }
    }, {
        "../compose": 6,
        "../delegate": 7
    }],
    9: [function(e, t, r) {
        "use strict";
        t.exports = function(t, r) {
            return function(e) {
                if (t !== e.target && !t.contains(e.target)) return r.call(this, e)
            }
        }
    }, {}],
    10: [function(e, t, r) {
        "use strict";
        t.exports = {
            behavior: e("./behavior"),
            delegate: e("./delegate"),
            delegateAll: e("./delegateAll"),
            ignore: e("./ignore"),
            keymap: e("./keymap")
        }
    }, {
        "./behavior": 5,
        "./delegate": 7,
        "./delegateAll": 8,
        "./ignore": 9,
        "./keymap": 11
    }],
    11: [function(e, t, r) {
        "use strict";
        e("keyboardevent-key-polyfill");
        const n = {
            Alt: "altKey",
            Control: "ctrlKey",
            Ctrl: "ctrlKey",
            Shift: "shiftKey"
        };
        t.exports = function(a) {
            const e = Object.keys(a).some(function(e) {
                return -1 < e.indexOf("+")
            });
            return function(r) {
                var s = function(e, t) {
                    var r = e.key;
                    if (t)
                        for (var s in n) !0 === e[n[s]] && (r = [s, r].join("+"));
                    return r
                }(r, e);
                return [s, s.toLowerCase()].reduce(function(e, t) {
                    return e = t in a ? a[s].call(this, r) : e
                }, void 0)
            }
        }, t.exports.MODIFIERS = n
    }, {
        "keyboardevent-key-polyfill": 3
    }],
    12: [function(e, t, r) {
        "use strict";
        t.exports = function(t, r) {
            function s(e) {
                return e.currentTarget.removeEventListener(e.type, s, r), t.call(this, e)
            }
            return s
        }
    }, {}],
    13: [function(e, t, r) {
        "use strict";
        var s = /(^\s+)|(\s+$)/g,
            a = /\s+/,
            n = String.prototype.trim ? function(e) {
                return e.trim()
            } : function(e) {
                return e.replace(s, "")
            };
        t.exports = function(e, t) {
            if ("string" != typeof e) throw new Error("Expected a string but got " + typeof e);
            var r = ((t = t || window.document).getElementById || function(e) {
                return this.querySelector('[id="' + e.replace(/"/g, '\\"') + '"]')
            }).bind(t);
            return 1 === (e = n(e).split(a)).length && "" === e[0] ? [] : e.map(function(e) {
                var t = r(e);
                if (t) return t;
                throw new Error('no element with id: "' + e + '"')
            })
        }
    }, {}],
    14: [function(e, t, r) {
        "use strict";
        var s = e("../../uswds-core/src/js/utils/behavior");
        const a = e("../../uswds-core/src/js/utils/toggle-form-input");
        var n = e("../../uswds-core/src/js/events")["CLICK"],
            e = e("../../uswds-core/src/js/config")["prefix"];
        t.exports = s({
            [n]: {
                [`.${e}-show-password`]: function(e) {
                    e.preventDefault(), a(this)
                }
            }
        })
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/events": 36,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/toggle-form-input": 55
    }],
    15: [function(e, t, r) {
        "use strict";
        const s = e("../../uswds-core/src/js/utils/select");
        var a = e("../../uswds-core/src/js/utils/behavior");
        const n = e("../../uswds-core/src/js/utils/toggle"),
            i = e("../../uswds-core/src/js/utils/is-in-viewport");
        var o = e("../../uswds-core/src/js/events")["CLICK"],
            e = e("../../uswds-core/src/js/config")["prefix"];
        const c = `.${e}-accordion, .${e}-accordion--bordered`,
            l = `.${e}-accordion__button[aria-controls]`,
            u = "aria-expanded",
            d = t => {
                return s(l, t).filter(e => e.closest(c) === t)
            },
            p = (t, e) => {
                var r = t.closest(c);
                if (!r) throw new Error(l + " is missing outer " + c);
                var e = n(t, e),
                    s = r.hasAttribute("data-allow-multiple");
                e && !s && d(r).forEach(e => {
                    e !== t && n(e, !1)
                })
            };
        e = a({
            [o]: {
                [l]() {
                    p(this), "true" !== this.getAttribute(u) || i(this) || this.scrollIntoView()
                }
            }
        }, {
            init(e) {
                s(l, e).forEach(e => {
                    var t = "true" === e.getAttribute(u);
                    p(e, t)
                })
            },
            ACCORDION: c,
            BUTTON: l,
            show: e => p(e, !0),
            hide: e => p(e, !1),
            toggle: p,
            getButtons: d
        });
        t.exports = e
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/events": 36,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/is-in-viewport": 48,
        "../../uswds-core/src/js/utils/select": 53,
        "../../uswds-core/src/js/utils/toggle": 56
    }],
    16: [function(e, t, r) {
        "use strict";
        var s = e("../../uswds-core/src/js/utils/behavior"),
            a = e("../../uswds-core/src/js/events")["CLICK"],
            e = e("../../uswds-core/src/js/config")["prefix"];
        const n = `.${e}-banner__header`,
            i = e + "-banner__header--expanded";
        t.exports = s({
            [a]: {
                [n + " [aria-controls]"]: function(e) {
                    e.preventDefault(), this.closest(n).classList.toggle(i)
                }
            }
        })
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/events": 36,
        "../../uswds-core/src/js/utils/behavior": 45
    }],
    17: [function(e, t, r) {
        "use strict";
        var s = e("receptor/keymap"),
            e = e("../../uswds-core/src/js/utils/behavior")({
                keydown: {
                    'a[class*="usa-button"]': s({
                        " ": e => {
                            e.preventDefault(), e.target.click()
                        }
                    })
                }
            });
        t.exports = e
    }, {
        "../../uswds-core/src/js/utils/behavior": 45,
        "receptor/keymap": 11
    }],
    18: [function(e, t, r) {
        "use strict";
        const s = e("../../uswds-core/src/js/utils/select");
        var a = e("../../uswds-core/src/js/utils/behavior"),
            n = e("../../uswds-core/src/js/utils/debounce"),
            e = e("../../uswds-core/src/js/config")["prefix"],
            i = e + "-character-count";
        const o = "." + i,
            c = `.${e}-character-count__field`,
            l = `.${e}-character-count__message`,
            u = "The content is too long.",
            d = e + "-character-count__status--invalid",
            p = i + "__status",
            b = i + "__sr-status",
            f = "." + p,
            h = "." + b,
            m = "characters allowed",
            v = e => {
                e = e.closest(o);
                if (!e) throw new Error(c + " is missing outer " + o);
                var t = e.querySelector(l);
                if (t) return {
                    characterCountEl: e,
                    messageEl: t
                };
                throw new Error(o + " is missing inner " + l)
            },
            g = e => {
                var t = document.createElement("div"),
                    r = document.createElement("div"),
                    s = e.dataset.maxlength + " " + m;
                t.classList.add("" + p, "usa-hint"), r.classList.add("" + b, "usa-sr-only"), t.setAttribute("aria-hidden", !0), r.setAttribute("aria-live", "polite"), t.textContent = s, r.textContent = s, e.append(t, r)
            },
            w = (e, t) => {
                let r = "";
                var s;
                return r = 0 === e ? t + " " + m : (s = Math.abs(t - e)) + ` ${"character"+(1===s?"":"s")} ` + (t < e ? "over limit" : "left")
            },
            y = n((e, t) => {
                e.textContent = t
            }, 1e3),
            A = e => {
                var t = v(e)["characterCountEl"],
                    r = e.value.length,
                    s = parseInt(t.getAttribute("data-maxlength"), 10),
                    a = t.querySelector(f),
                    t = t.querySelector(h),
                    n = w(r, s);
                s && (s = r && s < r, a.textContent = n, y(t, n), s && !e.validationMessage && e.setCustomValidity(u), s || e.validationMessage !== u || e.setCustomValidity(""), a.classList.toggle(d, s))
            },
            E = e => {
                var t, {
                    characterCountEl: r,
                    messageEl: s
                } = v(e);
                s.classList.add("usa-sr-only"), s.removeAttribute("aria-live"), s = e, e = v(s).characterCountEl, (t = s.getAttribute("maxlength")) && (s.removeAttribute("maxlength"), e.setAttribute("data-maxlength", t)), g(r)
            };
        e = a({
            input: {
                [c]() {
                    A(this)
                }
            }
        }, {
            init(e) {
                s(c, e).forEach(e => E(e))
            },
            MESSAGE_INVALID_CLASS: d,
            VALIDATION_MESSAGE: u,
            STATUS_MESSAGE_CLASS: p,
            STATUS_MESSAGE_SR_ONLY_CLASS: b,
            DEFAULT_STATUS_LABEL: m,
            createStatusMessages: g,
            getCountMessage: w,
            updateCountMessage: A
        });
        t.exports = e
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/debounce": 46,
        "../../uswds-core/src/js/utils/select": 53
    }],
    19: [function(e, t, I) {
        "use strict";
        var r = e("receptor/keymap");
        const s = e("../../uswds-core/src/js/utils/select-or-matches");
        var a = e("../../uswds-core/src/js/utils/behavior");
        const b = e("../../uswds-core/src/js/utils/sanitizer");
        var n = e("../../uswds-core/src/js/config")["prefix"],
            e = e("../../uswds-core/src/js/events")["CLICK"],
            n = n + "-combo-box";
        const f = n + "--pristine",
            h = n + "__select",
            m = n + "__input",
            v = n + "__clear-input",
            O = v + "__wrapper",
            B = n + "__input-button-separator",
            g = n + "__toggle-list",
            H = g + "__wrapper",
            w = n + "__list",
            y = n + "__list-option",
            A = y + "--focused",
            E = y + "--selected",
            x = n + "__status",
            j = "." + n,
            P = "." + h,
            u = "." + m,
            d = "." + v,
            p = "." + g,
            F = "." + w,
            i = "." + y,
            L = "." + A,
            R = "." + E,
            Y = "." + x,
            U = ".*{{query}}.*";
        const _ = function(e) {
                var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "",
                    t = (e.value = t, new CustomEvent("change", {
                        bubbles: !0,
                        cancelable: !0,
                        detail: {
                            value: t
                        }
                    }));
                e.dispatchEvent(t)
            },
            S = e => {
                var t, r, s, a, n, i, o, c, l, e = e.closest(j);
                if (e) return t = e.querySelector(P), r = e.querySelector(u), s = e.querySelector(F), a = e.querySelector(Y), n = e.querySelector(L), i = e.querySelector(R), o = e.querySelector(p), c = e.querySelector(d), l = e.classList.contains(f), {
                    comboBoxEl: e,
                    selectEl: t,
                    inputEl: r,
                    listEl: s,
                    statusEl: a,
                    focusedOptionEl: n,
                    selectedOptionEl: i,
                    toggleListBtnEl: o,
                    clearInputBtnEl: c,
                    isPristine: l,
                    disableFiltering: "true" === e.dataset.disableFiltering
                };
                throw new Error("Element is missing outer " + j)
            },
            C = e => {
                var {
                    inputEl: e,
                    toggleListBtnEl: t,
                    clearInputBtnEl: r
                } = S(e);
                r.hidden = !0, r.disabled = !0, t.disabled = !0, e.disabled = !0
            };
        const o = e => {
                e = e.closest(j);
                if (!e.dataset.enhanced) {
                    const u = e.querySelector("select");
                    if (!u) throw new Error(j + " is missing inner select");
                    var t = u.id,
                        s = document.querySelector(`label[for="${t}"]`),
                        a = t + "--list",
                        n = t + "-label",
                        i = t + "--assistiveHint";
                    const d = [];
                    var o = e.dataset["defaultValue"],
                        c = e.dataset["placeholder"];
                    let r;
                    if (c && d.push({
                            placeholder: c
                        }), o)
                        for (let e = 0, t = u.options.length; e < t; e += 1) {
                            var l = u.options[e];
                            if (l.value === o) {
                                r = l;
                                break
                            }
                        }
                    if (!s || !s.matches(`label[for="${t}"]`)) throw new Error(j + ` for ${t} is either missing a label or a "for" attribute`);
                    s.setAttribute("id", n), s.setAttribute("id", n), u.setAttribute("aria-hidden", "true"), u.setAttribute("tabindex", "-1"), u.classList.add("usa-sr-only", h), u.id = "", u.value = "", ["required", "aria-label", "aria-labelledby"].forEach(e => {
                        var t;
                        u.hasAttribute(e) && (t = u.getAttribute(e), d.push({
                            [e]: t
                        }), u.removeAttribute(e))
                    });
                    const p = document.createElement("input");
                    p.setAttribute("id", t), p.setAttribute("aria-owns", a), p.setAttribute("aria-controls", a), p.setAttribute("aria-autocomplete", "list"), p.setAttribute("aria-describedby", i), p.setAttribute("aria-expanded", "false"), p.setAttribute("autocapitalize", "off"), p.setAttribute("autocomplete", "off"), p.setAttribute("class", m), p.setAttribute("type", "text"), p.setAttribute("role", "combobox"), d.forEach(r => Object.keys(r).forEach(e => {
                        var t = b.escapeHTML `${r[e]}`;
                        p.setAttribute(e, t)
                    })), e.insertAdjacentElement("beforeend", p), e.insertAdjacentHTML("beforeend", b.escapeHTML `
    <span class="${O}" tabindex="-1">
        <button type="button" class="${v}" aria-label="Clear the select contents">&nbsp;</button>
      </span>
      <span class="${B}">&nbsp;</span>
      <span class="${H}" tabindex="-1">
        <button type="button" tabindex="-1" class="${g}" aria-label="Toggle the dropdown list">&nbsp;</button>
      </span>
      <ul
        tabindex="-1"
        id="${a}"
        class="${w}"
        role="listbox"
        aria-labelledby="${n}"
        hidden>
      </ul>
      <div class="${x} usa-sr-only" role="status"></div>
      <span id="${i}" class="usa-sr-only">
        When autocomplete results are available use up and down arrows to review and enter to select.
        Touch device users, explore by touch or with swipe gestures.
      </span>`), r && (c = S(e)["inputEl"], _(u, r.value), _(c, r.text), e.classList.add(f)), u.disabled && (C(e), u.disabled = !1), u.hasAttribute("aria-disabled") && (s = e, {
                        inputEl: s,
                        toggleListBtnEl: t,
                        clearInputBtnEl: a
                    } = S(s), a.hidden = !0, a.setAttribute("aria-disabled", !0), t.setAttribute("aria-disabled", !0), s.setAttribute("aria-disabled", !0), u.removeAttribute("aria-disabled")), e.dataset.enhanced = "true"
                }
            },
            D = function(e, t) {
                var {
                    skipFocus: r,
                    preventScroll: s
                } = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {}, {
                    inputEl: e,
                    listEl: a,
                    focusedOptionEl: n
                } = S(e);
                n && (n.classList.remove(A), n.setAttribute("tabIndex", "-1")), t ? (e.setAttribute("aria-activedescendant", t.id), t.setAttribute("tabIndex", "0"), t.classList.add(A), s || (n = t.offsetTop + t.offsetHeight, a.scrollTop + a.offsetHeight < n && (a.scrollTop = n - a.offsetHeight), t.offsetTop < a.scrollTop && (a.scrollTop = t.offsetTop)), r || t.focus({
                    preventScroll: s
                })) : (e.setAttribute("aria-activedescendant", ""), e.focus())
            },
            T = function(e) {
                let s = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "",
                    a = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
                const n = e => e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                e = `^(?:${e.replace(/{{(.*?)}}/g,(e,t)=>{var t=t.trim(),r=a[t];return"query"!==t&&r?(t=new RegExp(r,"i"),(r=s.match(t))?n(r[1]):""):n(s)})})$`;
                return new RegExp(e, "i")
            },
            c = e => {
                const {
                    comboBoxEl: t,
                    selectEl: r,
                    inputEl: s,
                    listEl: a,
                    statusEl: n,
                    isPristine: i,
                    disableFiltering: o
                } = S(e);
                let c, l;
                const u = a.id + "--option-";
                var d = (s.value || "").toLowerCase(),
                    e = t.dataset.filter || U,
                    p = T(e, d, t.dataset);
                const b = [];
                for (let e = 0, t = r.options.length; e < t; e += 1) {
                    var f = r.options[e],
                        h = u + b.length;
                    f.value && (o || i || !d || p.test(f.text)) && (r.value && f.value === r.value && (c = h), o && !l && p.test(f.text) && (l = h), b.push(f))
                }
                var e = b.length,
                    m = b.map((e, t) => {
                        var r = u + t,
                            s = [y];
                        let a = "-1",
                            n = "false";
                        r === c && (s.push(E, A), a = "0", n = "true"), c || 0 !== t || (s.push(A), a = "0");
                        var i = document.createElement("li");
                        return i.setAttribute("aria-setsize", b.length), i.setAttribute("aria-posinset", t + 1), i.setAttribute("aria-selected", n), i.setAttribute("id", r), i.setAttribute("class", s.join(" ")), i.setAttribute("tabindex", a), i.setAttribute("role", "option"), i.setAttribute("data-value", e.value), i.textContent = e.text, i
                    }),
                    v = document.createElement("li");
                v.setAttribute("class", y + "--no-results"), v.textContent = "No results found", a.hidden = !1, e ? (a.innerHTML = "", m.forEach(e => a.insertAdjacentElement("beforeend", e))) : (a.innerHTML = "", a.insertAdjacentElement("beforeend", v)), s.setAttribute("aria-expanded", "true"), n.textContent = e ? e + ` result${1<e?"s":""} available.` : "No results.";
                let g;
                i && c ? g = a.querySelector("#" + c) : o && l && (g = a.querySelector("#" + l)), g && D(a, g, {
                    skipFocus: !0
                })
            },
            l = e => {
                var {
                    inputEl: e,
                    listEl: t,
                    statusEl: r,
                    focusedOptionEl: s
                } = S(e);
                r.innerHTML = "", e.setAttribute("aria-expanded", "false"), e.setAttribute("aria-activedescendant", ""), s && s.classList.remove(A), t.scrollTop = 0, t.hidden = !0
            },
            $ = e => {
                var {
                    comboBoxEl: t,
                    selectEl: r,
                    inputEl: s
                } = S(e);
                _(r, e.dataset.value), _(s, e.textContent), t.classList.add(f), l(t), s.focus()
            },
            k = e => {
                var {
                    comboBoxEl: r,
                    selectEl: s,
                    inputEl: a
                } = S(e), n = s.value, i = (a.value || "").toLowerCase();
                if (n)
                    for (let e = 0, t = s.options.length; e < t; e += 1) {
                        var o = s.options[e];
                        if (o.value === n) return i !== o.text && _(a, o.text), void r.classList.add(f)
                    }
                i && _(a)
            };
        var M = e => {
                var {
                    comboBoxEl: t,
                    listEl: r
                } = S(e.target), r = (r.hidden && c(t), r.querySelector(L) || r.querySelector(i));
                r && D(t, r), e.preventDefault()
            },
            q = e => {
                var t = e.target,
                    r = t.nextSibling;
                r && D(t, r), e.preventDefault()
            },
            N = e => {
                var {
                    comboBoxEl: t,
                    listEl: r,
                    focusedOptionEl: s
                } = S(e.target), s = s && s.previousSibling, r = !r.hidden;
                D(t, s), r && e.preventDefault(), s || l(t)
            };
        a = a({
            [e]: {
                [u]() {
                    var e, t;
                    this.disabled || (e = this, {
                        comboBoxEl: e,
                        listEl: t
                    } = S(e), t.hidden && c(e))
                },
                [p]() {
                    var e, t, r;
                    this.disabled || (e = this, {
                        comboBoxEl: e,
                        listEl: t,
                        inputEl: r
                    } = S(e), (t.hidden ? c : l)(e), r.focus())
                },
                [i]() {
                    this.disabled || $(this)
                },
                [d]() {
                    var e, t, r, s;
                    this.disabled || (e = this, {
                        comboBoxEl: e,
                        listEl: s,
                        selectEl: t,
                        inputEl: r
                    } = S(e), s = !s.hidden, t.value && _(t), r.value && _(r), e.classList.remove(f), s && c(e), r.focus())
                }
            },
            focusout: {
                [j](e) {
                    this.contains(e.relatedTarget) || (k(this), l(this))
                }
            },
            keydown: {
                [j]: r({
                    Escape: e => {
                        var {
                            comboBoxEl: e,
                            inputEl: t
                        } = S(e.target);
                        l(e), k(e), t.focus()
                    }
                }),
                [u]: r({
                    Enter: e => {
                        var {
                            comboBoxEl: t,
                            listEl: r
                        } = S(e.target), r = !r.hidden;
                        (e => {
                            var {
                                comboBoxEl: r,
                                selectEl: s,
                                inputEl: a,
                                statusEl: e
                            } = S(e), n = (e.textContent = "", (a.value || "").toLowerCase());
                            if (n)
                                for (let e = 0, t = s.options.length; e < t; e += 1) {
                                    var i = s.options[e];
                                    if (i.text.toLowerCase() === n) return _(s, i.value), _(a, i.text), r.classList.add(f)
                                }
                            k(r)
                        })(t), r && l(t), e.preventDefault()
                    },
                    ArrowDown: M,
                    Down: M
                }),
                [i]: r({
                    ArrowUp: N,
                    Up: N,
                    ArrowDown: q,
                    Down: q,
                    Enter: e => {
                        $(e.target), e.preventDefault()
                    },
                    " ": e => {
                        $(e.target), e.preventDefault()
                    },
                    "Shift+Tab": () => {}
                })
            },
            input: {
                [u]() {
                    this.closest(j).classList.remove(f), c(this)
                }
            },
            mouseover: {
                [i]() {
                    var e;
                    (e = this).classList.contains(A) || D(e, e, {
                        preventScroll: !0
                    })
                }
            }
        }, {
            init(e) {
                s(j, e).forEach(e => {
                    o(e)
                })
            },
            getComboBoxContext: S,
            enhanceComboBox: o,
            generateDynamicRegExp: T,
            disable: C,
            enable: e => {
                var {
                    inputEl: e,
                    toggleListBtnEl: t,
                    clearInputBtnEl: r
                } = S(e);
                r.hidden = !1, r.disabled = !1, t.disabled = !1, e.disabled = !1
            },
            displayList: c,
            hideList: l,
            COMBO_BOX_CLASS: n
        });
        t.exports = a
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/events": 36,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/sanitizer": 50,
        "../../uswds-core/src/js/utils/select-or-matches": 52,
        "receptor/keymap": 11
    }],
    20: [function(e, A, E) {
        "use strict";
        const t = e("receptor/keymap");
        var _ = e("../../uswds-core/src/js/utils/behavior");
        const S = e("../../uswds-core/src/js/utils/select"),
            P = e("../../uswds-core/src/js/utils/select-or-matches");
        var r = e("../../uswds-core/src/js/config")["prefix"],
            F = e("../../uswds-core/src/js/events")["CLICK"];
        const R = e("../../uswds-core/src/js/utils/active-element");
        var Y = e("../../uswds-core/src/js/utils/is-ios-device");
        const C = e("../../uswds-core/src/js/utils/sanitizer");
        e = r + "-date-picker";
        const U = e + "__wrapper",
            K = e + "--initialized",
            V = e + "--active",
            W = e + "__internal-input",
            z = e + "__external-input",
            Q = e + "__button",
            n = e + "__calendar",
            G = e + "__status",
            D = n + "__date",
            Z = D + "--focused",
            X = D + "--selected",
            J = D + "--previous-month",
            ee = D + "--current-month",
            te = D + "--next-month",
            re = D + "--range-date",
            se = D + "--today",
            ae = D + "--range-date-start",
            ne = D + "--range-date-end",
            ie = D + "--within-range",
            oe = n + "__previous-year",
            ce = n + "__previous-month",
            le = n + "__next-year",
            ue = n + "__next-month",
            de = n + "__month-selection",
            pe = n + "__year-selection",
            p = n + "__month",
            be = p + "--focused",
            fe = p + "--selected",
            x = n + "__year",
            he = x + "--focused",
            me = x + "--selected",
            ve = n + "__previous-year-chunk",
            ge = n + "__next-year-chunk",
            we = n + "__date-picker",
            ye = n + "__month-picker",
            Ae = n + "__year-picker",
            T = n + "__table",
            Ee = n + "__row",
            $ = n + "__cell",
            k = $ + "--center-items",
            xe = n + "__month-label",
            je = n + "__day-of-week",
            f = "." + e,
            Le = "." + Q,
            _e = "." + W,
            h = "." + z,
            m = "." + n,
            Se = "." + G;
        r = "." + D;
        const o = "." + Z;
        e = "." + ee;
        const Ce = "." + oe,
            De = "." + ce,
            Te = "." + le,
            $e = "." + ue;
        var ke = "." + pe,
            Me = "." + de,
            qe = "." + p;
        const v = "." + x,
            Ne = "." + ve,
            Ie = "." + ge,
            M = "." + we;
        var Oe = "." + ye;
        const Be = "." + Ae,
            c = "." + be,
            l = "." + he,
            He = "Please enter a valid date",
            Pe = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            Fe = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            j = 12,
            Re = "MM/DD/YYYY",
            Ye = "YYYY-MM-DD";

        function Ue() {
            for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
            return t.map(e => e + ":not([disabled])").join(", ")
        }
        var Ke = Ue(Ce, De, ke, Me, Te, $e, o),
            Ve = Ue(c),
            We = Ue(Ne, Ie, l);
        const ze = (e, t) => (t !== e.getMonth() && e.setDate(0), e),
            Qe = (e, t, r) => {
                var s = new Date(0);
                return s.setFullYear(e, t, r), s
            },
            Ge = () => {
                var e = new Date,
                    t = e.getDate(),
                    r = e.getMonth(),
                    e = e.getFullYear();
                return Qe(e, r, t)
            },
            Ze = e => {
                var t = new Date(0);
                return t.setFullYear(e.getFullYear(), e.getMonth(), 1), t
            },
            Xe = e => {
                var t = new Date(0);
                return t.setFullYear(e.getFullYear(), e.getMonth() + 1, 0), t
            },
            q = (e, t) => {
                e = new Date(e.getTime());
                return e.setDate(e.getDate() + t), e
            },
            Je = (e, t) => q(e, -t),
            et = (e, t) => q(e, 7 * t),
            tt = e => {
                var t = e.getDay();
                return Je(e, t)
            },
            N = (e, t) => {
                var e = new Date(e.getTime()),
                    r = (e.getMonth() + 12 + t) % 12;
                return e.setMonth(e.getMonth() + t), ze(e, r), e
            },
            rt = (e, t) => N(e, -t),
            st = (e, t) => N(e, 12 * t),
            at = (e, t) => st(e, -t),
            b = (e, t) => {
                e = new Date(e.getTime());
                return e.setMonth(t), ze(e, t), e
            },
            L = (e, t) => {
                var e = new Date(e.getTime()),
                    r = e.getMonth();
                return e.setFullYear(t), ze(e, r), e
            },
            nt = (e, t) => {
                let r = t < e ? t : e;
                return new Date(r.getTime())
            },
            it = (e, t) => {
                let r = e < t ? t : e;
                return new Date(r.getTime())
            },
            ot = (e, t) => e && t && e.getFullYear() === t.getFullYear(),
            I = (e, t) => ot(e, t) && e.getMonth() === t.getMonth(),
            O = (e, t) => I(e, t) && e.getDate() === t.getDate(),
            u = (e, t, r) => {
                let s = e;
                return e < t ? s = t : r && r < e && (s = r), new Date(s.getTime())
            },
            ct = (e, t, r) => t <= e && (!r || e <= r),
            lt = (e, t, r) => Xe(e) < t || r && Ze(e) > r,
            ut = (e, t, r) => Xe(b(e, 11)) < t || r && Ze(b(e, 0)) > r,
            g = function(s) {
                var a = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : Ye,
                    n = 2 < arguments.length && void 0 !== arguments[2] && arguments[2];
                let i, o, c, l, u;
                if (s) {
                    let e, t, r;
                    a === Re ? [e, t, r] = s.split("/") : [r, e, t] = s.split("-"), r && (u = parseInt(r, 10), Number.isNaN(u) || (l = u, n && (l = Math.max(0, l), r.length < 3) && (s = (a = Ge().getFullYear()) - a % 10 ** r.length, l = s + u))), e && (u = parseInt(e, 10), Number.isNaN(u) || (o = u, n && (o = Math.max(1, o), o = Math.min(12, o)))), o && t && null != l && (u = parseInt(t, 10), Number.isNaN(u) || (c = u, n && (a = Qe(l, o, 0).getDate(), c = Math.max(1, c), c = Math.min(a, c)))), o && c && null != l && (i = Qe(l, o - 1, c))
                }
                return i
            },
            B = function(e) {
                var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : Ye,
                    r = (e, t) => ("0000" + e).slice(-t),
                    s = e.getMonth() + 1,
                    a = e.getDate(),
                    e = e.getFullYear();
                return t === Re ? [r(s, 2), r(a, 2), r(e, 4)].join("/") : [r(e, 4), r(s, 2), r(a, 2)].join("-")
            },
            dt = (e, t) => {
                var r = [],
                    s = [];
                let a = 0;
                for (; a < e.length;) {
                    s = [];
                    const i = document.createElement("tr");
                    for (; a < e.length && s.length < t;) {
                        var n = document.createElement("td");
                        n.insertAdjacentElement("beforeend", e[a]), s.push(n), a += 1
                    }
                    s.forEach(e => {
                        i.insertAdjacentElement("beforeend", e)
                    }), r.push(i)
                }
                return r
            },
            pt = e => {
                const t = document.createElement("tbody");
                return e.forEach(e => {
                    t.insertAdjacentElement("beforeend", e)
                }), t
            },
            bt = function(e) {
                var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "",
                    t = (e.value = t, new CustomEvent("change", {
                        bubbles: !0,
                        cancelable: !0,
                        detail: {
                            value: t
                        }
                    }));
                e.dispatchEvent(t)
            },
            H = e => {
                e = e.closest(f);
                if (!e) throw new Error("Element is missing outer " + f);
                var t = e.querySelector(_e),
                    r = e.querySelector(h),
                    s = e.querySelector(m),
                    a = e.querySelector(Le),
                    n = e.querySelector(Se),
                    i = e.querySelector(v),
                    o = g(r.value, Re, !0),
                    c = g(t.value),
                    l = g(s.dataset.value),
                    u = g(e.dataset.minDate),
                    d = g(e.dataset.maxDate),
                    p = g(e.dataset.rangeDate),
                    b = g(e.dataset.defaultDate);
                if (u && d && d < u) throw new Error("Minimum date cannot be after maximum date");
                return {
                    calendarDate: l,
                    minDate: u,
                    toggleBtnEl: a,
                    selectedDate: c,
                    maxDate: d,
                    firstYearChunkEl: i,
                    datePickerEl: e,
                    inputDate: o,
                    internalInputEl: t,
                    externalInputEl: r,
                    calendarEl: s,
                    rangeDate: p,
                    defaultDate: b,
                    statusEl: n
                }
            },
            ft = e => {
                var {
                    externalInputEl: e,
                    toggleBtnEl: t
                } = H(e);
                t.disabled = !0, e.disabled = !0
            },
            ht = e => {
                var {
                    externalInputEl: e,
                    toggleBtnEl: t
                } = H(e);
                t.setAttribute("aria-disabled", !0), e.setAttribute("aria-disabled", !0)
            };
        const mt = e => {
                var t, r, s, a, {
                        externalInputEl: e,
                        minDate: n,
                        maxDate: i
                    } = H(e),
                    e = e.value;
                let o = !1;
                return o = e && (o = !0, [t, r, s] = (e = e.split("/")).map(e => {
                    let t;
                    e = parseInt(e, 10);
                    return t = Number.isNaN(e) ? t : e
                }), t) && r && null != s && (a = Qe(s, t - 1, r)).getMonth() === t - 1 && a.getDate() === r && a.getFullYear() === s && 4 === e[2].length && ct(a, n, i) ? !1 : o
            },
            vt = e => {
                var e = H(e)["externalInputEl"],
                    t = mt(e);
                t && !e.validationMessage && e.setCustomValidity(He), t || e.validationMessage !== He || e.setCustomValidity("")
            },
            gt = (e, t) => {
                var r, s, a = g(t);
                a && (a = B(a, Re), {
                    datePickerEl: e,
                    internalInputEl: r,
                    externalInputEl: s
                } = H(e), bt(r, t), bt(s, a), vt(e))
            },
            d = (e, t) => {
                const {
                    datePickerEl: r,
                    calendarEl: s,
                    statusEl: a,
                    selectedDate: d,
                    maxDate: p,
                    minDate: b,
                    rangeDate: f
                } = H(e), h = Ge();
                let n = t || h;
                e = s.hidden;
                const m = q(n, 0);
                var i = n.getMonth(),
                    t = n.getFullYear();
                const v = rt(n, 1),
                    g = N(n, 1);
                var o = B(n),
                    c = Ze(n),
                    l = I(n, b),
                    u = I(n, p),
                    w = d || n;
                const y = f && nt(w, f),
                    A = f && it(w, f),
                    E = f && q(y, 1),
                    x = f && Je(A, 1);
                for (var w = Pe[i], j = (n = tt(c), []); j.length < 28 || n.getMonth() === i || j.length % 7 != 0;) j.push((e => {
                    var t = [D],
                        r = e.getDate(),
                        s = e.getMonth(),
                        a = e.getFullYear(),
                        n = e.getDay(),
                        i = B(e);
                    let o = "-1";
                    var c = !ct(e, b, p),
                        l = O(e, d),
                        e = (I(e, v) && t.push(J), I(e, m) && t.push(ee), I(e, g) && t.push(te), l && t.push(X), O(e, h) && t.push(se), f && (O(e, f) && t.push(re), O(e, y) && t.push(ae), O(e, A) && t.push(ne), ct(e, E, x)) && t.push(ie), O(e, m) && (o = "0", t.push(Z)), Pe[s]),
                        n = Fe[n],
                        u = document.createElement("button");
                    return u.setAttribute("type", "button"), u.setAttribute("tabindex", o), u.setAttribute("class", t.join(" ")), u.setAttribute("data-day", r), u.setAttribute("data-month", s + 1), u.setAttribute("data-year", a), u.setAttribute("data-value", i), u.setAttribute("aria-label", C.escapeHTML `${r} ${e} ${a} ${n}`), u.setAttribute("aria-selected", l ? "true" : "false"), !0 == c && (u.disabled = !0), u.textContent = r, u
                })(n)), n = q(n, 1);
                var c = dt(j, 7),
                    L = s.cloneNode(),
                    o = (L.dataset.value = o, L.style.top = r.offsetHeight + "px", L.hidden = !1, L.innerHTML = C.escapeHTML `
    <div tabindex="-1" class="${we}">
      <div class="${Ee}">
        <div class="${$} ${k}">
          <button
            type="button"
            class="${oe}"
            aria-label="Navigate back one year"
            ${l?'disabled="disabled"':""}
          ></button>
        </div>
        <div class="${$} ${k}">
          <button
            type="button"
            class="${ce}"
            aria-label="Navigate back one month"
            ${l?'disabled="disabled"':""}
          ></button>
        </div>
        <div class="${$} ${xe}">
          <button
            type="button"
            class="${de}" aria-label="${w}. Click to select month"
          >${w}</button>
          <button
            type="button"
            class="${pe}" aria-label="${t}. Click to select year"
          >${t}</button>
        </div>
        <div class="${$} ${k}">
          <button
            type="button"
            class="${ue}"
            aria-label="Navigate forward one month"
            ${u?'disabled="disabled"':""}
          ></button>
        </div>
        <div class="${$} ${k}">
          <button
            type="button"
            class="${le}"
            aria-label="Navigate forward one year"
            ${u?'disabled="disabled"':""}
          ></button>
        </div>
      </div>
    </div>
    `, document.createElement("table")),
                    l = (o.setAttribute("class", T), o.setAttribute("role", "presentation"), document.createElement("thead"));
                o.insertAdjacentElement("beforeend", l);
                const _ = document.createElement("tr"),
                    S = (l.insertAdjacentElement("beforeend", _), {
                        Sunday: "S",
                        Monday: "M",
                        Tuesday: "T",
                        Wednesday: "W",
                        Thursday: "Th",
                        Friday: "Fr",
                        Saturday: "S"
                    });
                Object.keys(S).forEach(e => {
                    var t = document.createElement("th");
                    t.setAttribute("class", je), t.setAttribute("scope", "presentation"), t.setAttribute("aria-label", e), t.textContent = S[e], _.insertAdjacentElement("beforeend", t)
                });
                u = pt(c);
                o.insertAdjacentElement("beforeend", u);
                L.querySelector(M).insertAdjacentElement("beforeend", o), s.parentNode.replaceChild(L, s), r.classList.add(V);
                l = [];
                return O(d, m) && l.push("Selected date"), e ? (l.push("You can navigate by day using left and right arrows", "Weeks by using up and down arrows", "Months by using page up and page down keys", "Years by using shift plus page up and shift plus page down", "Home and end keys navigate to the beginning and end of a week"), a.textContent = "") : l.push(w + " " + t), a.textContent = l.join(". "), L
            },
            wt = e => {
                var {
                    datePickerEl: e,
                    calendarEl: t,
                    statusEl: r
                } = H(e);
                e.classList.remove(V), t.hidden = !0, r.textContent = ""
            },
            yt = e => {
                var {
                    calendarEl: e,
                    inputDate: t,
                    minDate: r,
                    maxDate: s
                } = H(e);
                !e.hidden && t && (t = u(t, r, s), d(e, t))
            },
            At = (e, t) => {
                const {
                    calendarEl: r,
                    statusEl: s,
                    calendarDate: o,
                    minDate: c,
                    maxDate: l
                } = H(e), u = o.getMonth(), d = null == t ? u : t;
                var e = Pe.map((e, t) => {
                        var r = b(o, t),
                            r = lt(r, c, l);
                        let s = "-1";
                        var a = [p],
                            n = t === u,
                            i = (t === d && (s = "0", a.push(be)), n && a.push(fe), document.createElement("button"));
                        return i.setAttribute("type", "button"), i.setAttribute("tabindex", s), i.setAttribute("class", a.join(" ")), i.setAttribute("data-value", t), i.setAttribute("data-label", e), i.setAttribute("aria-selected", n ? "true" : "false"), !0 === r && (i.disabled = !0), i.textContent = e, i
                    }),
                    t = document.createElement("div"),
                    a = (t.setAttribute("tabindex", "-1"), t.setAttribute("class", ye), document.createElement("table")),
                    e = (a.setAttribute("class", T), a.setAttribute("role", "presentation"), dt(e, 3)),
                    e = pt(e),
                    e = (a.insertAdjacentElement("beforeend", e), t.insertAdjacentElement("beforeend", a), r.cloneNode());
                return e.insertAdjacentElement("beforeend", t), r.parentNode.replaceChild(e, r), s.textContent = "Select a month.", e
            },
            w = (e, t) => {
                var {
                    calendarEl: e,
                    statusEl: r,
                    calendarDate: s,
                    minDate: a,
                    maxDate: n
                } = H(e), i = s.getFullYear(), o = null == t ? i : t, t = o, c = (t -= t % j, t = Math.max(0, t), ut(L(s, t - 1), a, n)), l = ut(L(s, t + j), a, n), u = [];
                let d = t;
                for (; u.length < j;) {
                    var p = ut(L(s, d), a, n);
                    let e = "-1";
                    var b = [x],
                        f = d === i,
                        h = (d === o && (e = "0", b.push(he)), f && b.push(me), document.createElement("button"));
                    h.setAttribute("type", "button"), h.setAttribute("tabindex", e), h.setAttribute("class", b.join(" ")), h.setAttribute("data-value", d), h.setAttribute("aria-selected", f ? "true" : "false"), !0 === p && (h.disabled = !0), h.textContent = d, u.push(h), d += 1
                }
                var m = e.cloneNode(),
                    v = document.createElement("div"),
                    g = (v.setAttribute("tabindex", "-1"), v.setAttribute("class", Ae), document.createElement("table")),
                    w = (g.setAttribute("role", "presentation"), g.setAttribute("class", T), document.createElement("tbody")),
                    y = document.createElement("tr"),
                    A = document.createElement("button"),
                    c = (A.setAttribute("type", "button"), A.setAttribute("class", ve), A.setAttribute("aria-label", `Navigate back ${j} years`), !0 === c && (A.disabled = !0), A.innerHTML = C.escapeHTML `&nbsp`, document.createElement("button")),
                    l = (c.setAttribute("type", "button"), c.setAttribute("class", ge), c.setAttribute("aria-label", `Navigate forward ${j} years`), !0 === l && (c.disabled = !0), c.innerHTML = C.escapeHTML `&nbsp`, document.createElement("table")),
                    E = (l.setAttribute("class", T), l.setAttribute("role", "presentation"), dt(u, 3)),
                    E = pt(E),
                    E = (l.insertAdjacentElement("beforeend", E), document.createElement("td")),
                    A = (E.insertAdjacentElement("beforeend", A), document.createElement("td")),
                    l = (A.setAttribute("colspan", "3"), A.insertAdjacentElement("beforeend", l), document.createElement("td"));
                return l.insertAdjacentElement("beforeend", c), y.insertAdjacentElement("beforeend", E), y.insertAdjacentElement("beforeend", A), y.insertAdjacentElement("beforeend", l), w.insertAdjacentElement("beforeend", y), g.insertAdjacentElement("beforeend", w), v.insertAdjacentElement("beforeend", g), m.insertAdjacentElement("beforeend", v), e.parentNode.replaceChild(m, e), r.textContent = C.escapeHTML `Showing years ${t} to ${t+j-1}. Select a year.`, m
            },
            Et = e => {
                var {
                    datePickerEl: t,
                    externalInputEl: r
                } = H(e.target);
                wt(t), r.focus(), e.preventDefault()
            };
        var s = i => e => {
                var {
                    calendarEl: t,
                    calendarDate: r,
                    minDate: s,
                    maxDate: a
                } = H(e.target), n = i(r), n = u(n, s, a);
                O(r, n) || d(t, n).querySelector(o).focus(), e.preventDefault()
            },
            xt = s(e => {
                return e = e, t = 1, et(e, -t);
                var t
            }),
            jt = s(e => et(e, 1)),
            Lt = s(e => Je(e, 1)),
            _t = s(e => q(e, 1)),
            St = s(e => tt(e)),
            Ct = s(e => {
                return t = (e = e).getDay(), q(e, 6 - t);
                var t
            }),
            Dt = s(e => N(e, 1)),
            Tt = s(e => rt(e, 1)),
            $t = s(e => st(e, 1)),
            s = s(e => at(e, 1));
        var a = o => e => {
                var t = e.target,
                    r = parseInt(t.dataset.value, 10),
                    {
                        calendarEl: t,
                        calendarDate: s,
                        minDate: a,
                        maxDate: n
                    } = H(t),
                    i = b(s, r),
                    r = o(r),
                    r = Math.max(0, Math.min(11, r)),
                    s = b(s, r),
                    r = u(s, a, n);
                I(i, r) || At(t, r.getMonth()).querySelector(c).focus(), e.preventDefault()
            },
            kt = a(e => e - 3),
            Mt = a(e => e + 3),
            qt = a(e => e - 1),
            Nt = a(e => e + 1),
            It = a(e => e - e % 3),
            Ot = a(e => e + 2 - e % 3),
            Bt = a(() => 11),
            a = a(() => 0);
        var i = o => e => {
                var t = e.target,
                    r = parseInt(t.dataset.value, 10),
                    {
                        calendarEl: t,
                        calendarDate: s,
                        minDate: a,
                        maxDate: n
                    } = H(t),
                    i = L(s, r),
                    r = o(r),
                    r = Math.max(0, r),
                    s = L(s, r),
                    r = u(s, a, n);
                ot(i, r) || w(t, r.getFullYear()).querySelector(l).focus(), e.preventDefault()
            },
            Ht = i(e => e - 3),
            Pt = i(e => e + 3),
            Ft = i(e => e - 1),
            Rt = i(e => e + 1),
            Yt = i(e => e - e % 3),
            Ut = i(e => e + 2 - e % 3),
            Kt = i(e => e - j),
            i = i(e => e + j);
        var y = n => {
                const a = e => {
                    var e = H(e)["calendarEl"],
                        e = S(n, e),
                        t = e.length - 1,
                        r = e[0],
                        s = e[t],
                        a = e.indexOf(R());
                    return {
                        focusableElements: e,
                        isNotFound: -1 === a,
                        firstTabStop: r,
                        isFirstTab: 0 === a,
                        lastTabStop: s,
                        isLastTab: a === t
                    }
                };
                return {
                    tabAhead(e) {
                        var {
                            firstTabStop: t,
                            isLastTab: r,
                            isNotFound: s
                        } = a(e.target);
                        (r || s) && (e.preventDefault(), t.focus())
                    },
                    tabBack(e) {
                        var {
                            lastTabStop: t,
                            isFirstTab: r,
                            isNotFound: s
                        } = a(e.target);
                        (r || s) && (e.preventDefault(), t.focus())
                    }
                }
            },
            Ke = y(Ke),
            Ve = y(Ve),
            y = y(We),
            We = {
                [F]: {
                    [Le]() {
                        var e, t, r, s, a, n;
                        (e = this).disabled || ({
                            calendarEl: t,
                            inputDate: n,
                            minDate: r,
                            maxDate: s,
                            defaultDate: a
                        } = H(e), t.hidden ? (n = u(n || a || Ge(), r, s), d(t, n).querySelector(o).focus()) : wt(e))
                    },
                    [r]() {
                        var e, t, r;
                        (e = this).disabled || ({
                            datePickerEl: t,
                            externalInputEl: r
                        } = H(e), gt(e, e.dataset.value), wt(t), r.focus())
                    },
                    [qe]() {
                        var e, t, r, s, a;
                        (e = this).disabled || ({
                            calendarEl: t,
                            calendarDate: a,
                            minDate: r,
                            maxDate: s
                        } = H(e), e = parseInt(e.dataset.value, 10), a = b(a, e), a = u(a, r, s), d(t, a).querySelector(o).focus())
                    },
                    [v]() {
                        var e, t, r, s, a;
                        (e = this).disabled || ({
                            calendarEl: t,
                            calendarDate: a,
                            minDate: r,
                            maxDate: s
                        } = H(e), e = parseInt(e.innerHTML, 10), a = L(a, e), a = u(a, r, s), d(t, a).querySelector(o).focus())
                    },
                    [De]() {
                        var t = this;
                        if (!t.disabled) {
                            var {
                                calendarEl: t,
                                calendarDate: r,
                                minDate: s,
                                maxDate: a
                            } = H(t), r = rt(r, 1), r = u(r, s, a), s = d(t, r);
                            let e = s.querySelector(De);
                            (e = e.disabled ? s.querySelector(M) : e).focus()
                        }
                    },
                    [$e]() {
                        var t = this;
                        if (!t.disabled) {
                            var {
                                calendarEl: t,
                                calendarDate: r,
                                minDate: s,
                                maxDate: a
                            } = H(t), r = N(r, 1), r = u(r, s, a), s = d(t, r);
                            let e = s.querySelector($e);
                            (e = e.disabled ? s.querySelector(M) : e).focus()
                        }
                    },
                    [Ce]() {
                        var t = this;
                        if (!t.disabled) {
                            var {
                                calendarEl: t,
                                calendarDate: r,
                                minDate: s,
                                maxDate: a
                            } = H(t), r = at(r, 1), r = u(r, s, a), s = d(t, r);
                            let e = s.querySelector(Ce);
                            (e = e.disabled ? s.querySelector(M) : e).focus()
                        }
                    },
                    [Te]() {
                        var t = this;
                        if (!t.disabled) {
                            var {
                                calendarEl: t,
                                calendarDate: r,
                                minDate: s,
                                maxDate: a
                            } = H(t), r = st(r, 1), r = u(r, s, a), s = d(t, r);
                            let e = s.querySelector(Te);
                            (e = e.disabled ? s.querySelector(M) : e).focus()
                        }
                    },
                    [Ne]() {
                        var t = this;
                        if (!t.disabled) {
                            var {
                                calendarEl: t,
                                calendarDate: r,
                                minDate: s,
                                maxDate: a
                            } = H(t), n = t.querySelector(l), n = parseInt(n.textContent, 10) - j, n = Math.max(0, n), r = L(r, n), n = u(r, s, a), r = w(t, n.getFullYear());
                            let e = r.querySelector(Ne);
                            (e = e.disabled ? r.querySelector(Be) : e).focus()
                        }
                    },
                    [Ie]() {
                        var t = this;
                        if (!t.disabled) {
                            var {
                                calendarEl: t,
                                calendarDate: r,
                                minDate: s,
                                maxDate: a
                            } = H(t), n = t.querySelector(l), n = parseInt(n.textContent, 10) + j, n = Math.max(0, n), r = L(r, n), n = u(r, s, a), r = w(t, n.getFullYear());
                            let e = r.querySelector(Ie);
                            (e = e.disabled ? r.querySelector(Be) : e).focus()
                        }
                    },
                    [Me]() {
                        At(this).querySelector(c).focus()
                    },
                    [ke]() {
                        w(this).querySelector(l).focus()
                    }
                },
                keyup: {
                    [m](e) {
                        var t = this.dataset.keydownKeyCode;
                        "" + e.keyCode !== t && e.preventDefault()
                    }
                },
                keydown: {
                    [h](e) {
                        13 === e.keyCode && vt(this)
                    },
                    [r]: t({
                        Up: xt,
                        ArrowUp: xt,
                        Down: jt,
                        ArrowDown: jt,
                        Left: Lt,
                        ArrowLeft: Lt,
                        Right: _t,
                        ArrowRight: _t,
                        Home: St,
                        End: Ct,
                        PageDown: Dt,
                        PageUp: Tt,
                        "Shift+PageDown": $t,
                        "Shift+PageUp": s,
                        Tab: Ke.tabAhead
                    }),
                    [M]: t({
                        Tab: Ke.tabAhead,
                        "Shift+Tab": Ke.tabBack
                    }),
                    [qe]: t({
                        Up: kt,
                        ArrowUp: kt,
                        Down: Mt,
                        ArrowDown: Mt,
                        Left: qt,
                        ArrowLeft: qt,
                        Right: Nt,
                        ArrowRight: Nt,
                        Home: It,
                        End: Ot,
                        PageDown: Bt,
                        PageUp: a
                    }),
                    [Oe]: t({
                        Tab: Ve.tabAhead,
                        "Shift+Tab": Ve.tabBack
                    }),
                    [v]: t({
                        Up: Ht,
                        ArrowUp: Ht,
                        Down: Pt,
                        ArrowDown: Pt,
                        Left: Ft,
                        ArrowLeft: Ft,
                        Right: Rt,
                        ArrowRight: Rt,
                        Home: Yt,
                        End: Ut,
                        PageDown: i,
                        PageUp: Kt
                    }),
                    [Be]: t({
                        Tab: y.tabAhead,
                        "Shift+Tab": y.tabBack
                    }),
                    [m](e) {
                        this.dataset.keydownKeyCode = e.keyCode
                    },
                    [f](e) {
                        t({
                            Escape: Et
                        })(e)
                    }
                },
                focusout: {
                    [h]() {
                        vt(this)
                    },
                    [f](e) {
                        this.contains(e.relatedTarget) || wt(this)
                    }
                },
                input: {
                    [h]() {
                        {
                            var t = this,
                                {
                                    internalInputEl: r,
                                    inputDate: s
                                } = H(t);
                            let e = "";
                            s && !mt(t) && (e = B(s)), r.value !== e && bt(r, e)
                        }
                        yt(this)
                    }
                }
            },
            F = (Y() || (We.mouseover = {
                [e]() {
                    var e, t, r;
                    (e = this).disabled || (r = (t = e.closest(m)).dataset.value, (e = e.dataset.value) !== r && (r = g(e), d(t, r).querySelector(o).focus()))
                },
                [qe]() {
                    var e, t;
                    (e = this).disabled || e.classList.contains(be) || (t = parseInt(e.dataset.value, 10), At(e, t).querySelector(c).focus())
                },
                [v]() {
                    var e, t;
                    (e = this).disabled || e.classList.contains(he) || (t = parseInt(e.dataset.value, 10), w(e, t).querySelector(l).focus())
                }
            }), _(We, {
                init(e) {
                    P(f, e).forEach(e => {
                        var t = (e = e.closest(f)).dataset.defaultValue,
                            r = e.querySelector("input");
                        if (!r) throw new Error(f + " is missing inner input");
                        r.value && (r.value = "");
                        var s = g(e.dataset.minDate || r.getAttribute("min"));
                        e.dataset.minDate = s ? B(s) : "0000-01-01", (s = g(e.dataset.maxDate || r.getAttribute("max"))) && (e.dataset.maxDate = B(s));
                        (s = document.createElement("div")).classList.add(U);
                        var a = r.cloneNode();
                        a.classList.add(z), a.type = "text", s.appendChild(a), s.insertAdjacentHTML("beforeend", C.escapeHTML `
    <button type="button" class="${Q}" aria-haspopup="true" aria-label="Toggle calendar"></button>
    <div class="${n}" role="dialog" aria-modal="true" hidden></div>
    <div class="usa-sr-only ${G}" role="status" aria-live="polite"></div>`), r.setAttribute("aria-hidden", "true"), r.setAttribute("tabindex", "-1"), r.style.display = "none", r.classList.add(W), r.removeAttribute("id"), r.removeAttribute("name"), r.required = !1, e.appendChild(s), e.classList.add(K), t && gt(e, t), r.disabled && (ft(e), r.disabled = !1), r.hasAttribute("aria-disabled") && (ht(e), r.removeAttribute("aria-disabled"))
                    })
                },
                getDatePickerContext: H,
                disable: ft,
                ariaDisable: ht,
                enable: e => {
                    var {
                        externalInputEl: e,
                        toggleBtnEl: t
                    } = H(e);
                    t.disabled = !1, e.disabled = !1
                },
                isDateInputInvalid: mt,
                setCalendarValue: gt,
                validateDateInput: vt,
                renderCalendar: d,
                updateCalendarIfVisible: yt
            }));
        A.exports = F
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/events": 36,
        "../../uswds-core/src/js/utils/active-element": 44,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/is-ios-device": 49,
        "../../uswds-core/src/js/utils/sanitizer": 50,
        "../../uswds-core/src/js/utils/select": 53,
        "../../uswds-core/src/js/utils/select-or-matches": 52,
        "receptor/keymap": 11
    }],
    21: [function(e, t, r) {
        "use strict";
        var s = e("../../uswds-core/src/js/utils/behavior");
        const a = e("../../uswds-core/src/js/utils/select"),
            n = e("../../uswds-core/src/js/utils/select-or-matches");
        var i = e("../../uswds-core/src/js/config")["prefix"];
        const {
            getDatePickerContext: o,
            isDateInputInvalid: c,
            updateCalendarIfVisible: l
        } = e("../../usa-date-picker/src/index");
        e = i + "-date-range-picker";
        const u = e + "__range-start",
            d = e + "__range-end",
            p = "." + (i + "-date-picker"),
            b = "." + e,
            f = "." + u,
            h = "." + d,
            m = e => {
                var t, r, e = e.closest(b);
                if (e) return t = e.querySelector(f), r = e.querySelector(h), {
                    dateRangePickerEl: e,
                    rangeStartEl: t,
                    rangeEndEl: r
                };
                throw new Error("Element is missing outer " + b)
            },
            v = e => {
                var {
                    dateRangePickerEl: e,
                    rangeStartEl: t,
                    rangeEndEl: r
                } = m(e), t = o(t)["internalInputEl"], s = t.value;
                s && !c(t) ? (r.dataset.minDate = s, r.dataset.rangeDate = s, r.dataset.defaultDate = s) : (r.dataset.minDate = e.dataset.minDate || "", r.dataset.rangeDate = "", r.dataset.defaultDate = ""), l(r)
            },
            g = e => {
                var {
                    dateRangePickerEl: e,
                    rangeStartEl: t,
                    rangeEndEl: r
                } = m(e), r = o(r)["internalInputEl"], s = r.value;
                s && !c(r) ? (t.dataset.maxDate = s, t.dataset.rangeDate = s, t.dataset.defaultDate = s) : (t.dataset.maxDate = e.dataset.maxDate || "", t.dataset.rangeDate = "", t.dataset.defaultDate = ""), l(t)
            };
        i = s({
            "input change": {
                [f]() {
                    v(this)
                },
                [h]() {
                    g(this)
                }
            }
        }, {
            init(e) {
                n(b, e).forEach(e => {
                    var e = (e = e).closest(b),
                        [t, r] = a(p, e);
                    if (!t) throw new Error(`${b} is missing inner two '${p}' elements`);
                    if (!r) throw new Error(`${b} is missing second '${p}' element`);
                    t.classList.add(u), r.classList.add(d), e.dataset.minDate || (e.dataset.minDate = "0000-01-01");
                    var s = e.dataset["minDate"];
                    (s = (t.dataset.minDate = s, r.dataset.minDate = s, e.dataset)["maxDate"]) && (t.dataset.maxDate = s, r.dataset.maxDate = s), v(e), g(e)
                })
            }
        });
        t.exports = i
    }, {
        "../../usa-date-picker/src/index": 20,
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/select": 53,
        "../../uswds-core/src/js/utils/select-or-matches": 52
    }],
    22: [function(e, t, I) {
        "use strict";
        const r = e("../../uswds-core/src/js/utils/select-or-matches");
        var s = e("../../uswds-core/src/js/utils/behavior");
        const g = e("../../uswds-core/src/js/utils/sanitizer");
        e = e("../../uswds-core/src/js/config").prefix;
        const w = e + "-file-input",
            c = "." + w,
            l = e + "-file-input__input",
            u = e + "-file-input__target",
            a = "." + l,
            d = e + "-file-input__box",
            p = e + "-file-input__instructions",
            y = e + "-file-input__preview",
            o = e + "-file-input__preview-heading",
            b = e + "-file-input--disabled",
            f = e + "-file-input__choose",
            A = e + "-file-input__accepted-files-message",
            h = e + "-file-input__drag-text",
            n = e + "-file-input--drag",
            E = "is-loading",
            x = "has-invalid-file",
            j = e + "-file-input__preview-image",
            L = j + "--generic",
            _ = j + "--pdf",
            S = j + "--word",
            C = j + "--video",
            D = j + "--excel",
            T = e + "-sr-only",
            $ = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        let k = Boolean(!0),
            M = "",
            m = "";
        const v = e => {
            var t, e = e.closest(c);
            if (e) return t = e.querySelector(a), {
                dropZoneEl: e,
                inputEl: t
            };
            throw new Error("Element is missing outer " + c)
        };
        const i = e => {
                var t = e.charCodeAt(0);
                return 32 === t ? "-" : 65 <= t && t <= 90 ? "img_" + e.toLowerCase() : "__" + t.toString(16).slice(-4)
            },
            O = e => e.replace(/[^a-z0-9]/g, i),
            B = e => e + "-" + Math.floor(Date.now().toString() / 1e3),
            q = e => {
                return e.hasAttribute("multiple") ? "files" : "file"
            },
            H = e => {
                var t, r, s, a = e.hasAttribute("aria-disabled") || e.hasAttribute("disabled"),
                    n = (t = e, r = document.createElement("div"), i = document.createElement("div"), n = document.createElement("div"), t.classList.remove(w), t.classList.add(l), r.classList.add(w), n.classList.add(d), i.classList.add(u), i.prepend(n), t.parentNode.insertBefore(i, t), t.parentNode.insertBefore(r, i), i.appendChild(t), r.appendChild(i), i),
                    i = (r = (t = e).closest(c), i = q(t), s = document.createElement("div"), i = `Drag ${i} here or`, o = "choose from folder", M = i + " " + o, s.classList.add(p), s.setAttribute("aria-hidden", "true"), t.setAttribute("aria-label", M), s.innerHTML = g.escapeHTML `<span class="${h}">${i}</span> <span class="${f}">${o}</span>`, t.parentNode.insertBefore(s, t), (/rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) && (r.querySelector("." + h).outerHTML = ""), s),
                    o = v(e)["dropZoneEl"];
                return a ? o.classList.add(b) : (t = e, r = document.createElement("div"), s = q(t), a = t.closest(c), t = t.closest("." + u), m = `No ${s} selected.`, r.classList.add(T), r.setAttribute("aria-live", "polite"), r.textContent = m, a.insertBefore(r, t)), {
                    instructions: i,
                    dropTarget: n
                }
            },
            N = (e, t) => {
                var r = e.querySelectorAll("." + y),
                    s = e.querySelector("." + o),
                    a = e.querySelector("." + A);
                s && (s.outerHTML = ""), a && (a.outerHTML = "", e.classList.remove(x)), null !== r && (t && t.removeAttribute("hidden"), Array.prototype.forEach.call(r, e => {
                    e.parentNode.removeChild(e)
                }))
            },
            P = (e, t, r) => {
                const s = e;
                let a = m;
                1 === t.length ? a = "You have selected the file: " + r : 1 < t.length && (a = `You have selected ${t.length} files: ` + r.join(", ")), setTimeout(() => {
                    s.textContent = a
                }, 1e3)
            },
            F = (e, t) => {
                var r = document.createElement("div"),
                    s = e.closest("." + u),
                    a = s.querySelector("." + p);
                let n = "Change file",
                    i = "";
                1 === t.length ? i = g.escapeHTML `Selected file <span class="usa-file-input__choose">${n}</span>` : 1 < t.length && (n = "Change files", i = g.escapeHTML `${t.length} files selected <span class="usa-file-input__choose">${n}</span>`), a.setAttribute("hidden", "true"), r.classList.add(o), r.innerHTML = i, s.insertBefore(r, a), e.setAttribute("aria-label", n)
            },
            R = (e, t, r, s) => {
                var a = e,
                    n = t,
                    i = r,
                    o = s,
                    c = n.getAttribute("accept");
                if (o.classList.remove(x), c) {
                    var l = c.split(","),
                        c = document.createElement("div");
                    let t = !0;
                    var u = a.target.files || a.dataTransfer.files;
                    for (let e = 0; e < u.length; e += 1) {
                        var d = u[e];
                        if (!t) break;
                        for (let e = 0; e < l.length; e += 1) {
                            var p = l[e];
                            if (t = 0 < d.name.indexOf(p) || ((e, t) => {
                                    let r = !1;
                                    e = e.indexOf(t);
                                    return r = 0 <= e ? !0 : r
                                })(d.type, p.replace(/\*/g, ""))) {
                                k = !0;
                                break
                            }
                        }
                    }
                    t || (N(o, i), n.value = "", o.insertBefore(c, n), c.textContent = n.dataset.errormessage || "This is not a valid file type.", c.classList.add(A), o.classList.add(x), k = !1, a.preventDefault(), a.stopPropagation())
                }
                if (!0 === k) {
                    var i = t,
                        b = r,
                        n = s,
                        f = (c = e).target.files,
                        c = n.closest("." + w).querySelector("." + T),
                        h = [];
                    N(n, b);
                    for (let e = 0; e < f.length; e += 1) {
                        const m = new FileReader,
                            v = f[e].name;
                        let t;
                        h.push(v), m.onloadstart = function() {
                            t = B(O(v)), b.insertAdjacentHTML("afterend", g.escapeHTML `<div class="${y}" aria-hidden="true">
          <img id="${t}" src="${$}" alt="" class="${j} ${E}"/>${v}
        <div>`)
                        }, m.onloadend = function() {
                            var e = document.getElementById(t);
                            0 < v.indexOf(".pdf") ? e.setAttribute("onerror", `this.onerror=null;this.src="${$}"; this.classList.add("${_}")`) : 0 < v.indexOf(".doc") || 0 < v.indexOf(".pages") ? e.setAttribute("onerror", `this.onerror=null;this.src="${$}"; this.classList.add("${S}")`) : 0 < v.indexOf(".xls") || 0 < v.indexOf(".numbers") ? e.setAttribute("onerror", `this.onerror=null;this.src="${$}"; this.classList.add("${D}")`) : 0 < v.indexOf(".mov") || 0 < v.indexOf(".mp4") ? e.setAttribute("onerror", `this.onerror=null;this.src="${$}"; this.classList.add("${C}")`) : e.setAttribute("onerror", `this.onerror=null;this.src="${$}"; this.classList.add("${L}")`), e.classList.remove(E), e.src = m.result
                        }, f[e] && m.readAsDataURL(f[e])
                    }
                    0 === f.length ? i.setAttribute("aria-label", M) : F(i, f), P(c, f, h)
                }
            };
        e = s({}, {
            init(e) {
                r(c, e).forEach(t => {
                    const {
                        instructions: r,
                        dropTarget: s
                    } = H(t);
                    s.addEventListener("dragover", function() {
                        this.classList.add(n)
                    }, !1), s.addEventListener("dragleave", function() {
                        this.classList.remove(n)
                    }, !1), s.addEventListener("drop", function() {
                        this.classList.remove(n)
                    }, !1), t.addEventListener("change", e => R(e, t, r, s), !1)
                })
            },
            teardown(e) {
                r(a, e).forEach(e => {
                    var t = e.parentElement.parentElement;
                    t.parentElement.replaceChild(e, t), e.className = w
                })
            },
            getFileInputContext: v,
            disable: e => {
                var {
                    dropZoneEl: e,
                    inputEl: t
                } = v(e);
                t.disabled = !0, e.classList.add(b)
            },
            ariaDisable: e => {
                e = v(e).dropZoneEl;
                e.classList.add(b)
            },
            enable: e => {
                var {
                    dropZoneEl: e,
                    inputEl: t
                } = v(e);
                t.disabled = !1, e.classList.remove(b), e.removeAttribute("aria-disabled")
            }
        });
        t.exports = e
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/sanitizer": 50,
        "../../uswds-core/src/js/utils/select-or-matches": 52
    }],
    23: [function(e, t, r) {
        "use strict";
        var s = e("../../uswds-core/src/js/utils/behavior"),
            a = e("../../uswds-core/src/js/events")["CLICK"];
        const n = e("../../uswds-core/src/js/config")["prefix"],
            i = `.${n}-footer--big`,
            o = i + " nav" + ` .${n}-footer__primary-link`;

        function c(s) {
            var e = document.querySelector(i);
            e && e.querySelectorAll(o).forEach(e => {
                var t = e.getAttribute("class"),
                    r = e.getAttribute("data-tag") || e.tagName,
                    r = document.createElement(s ? "button" : r);
                r.setAttribute("class", t), r.classList.toggle(n + "-footer__primary-link--button", s), r.textContent = e.textContent, s && (r.setAttribute("data-tag", e.tagName), t = n + "-footer-menu-list-" + Math.floor(1e5 * Math.random()), r.setAttribute("aria-controls", t), r.setAttribute("aria-expanded", "false"), e.nextElementSibling.setAttribute("id", t), r.setAttribute("type", "button")), e.after(r), e.remove()
            })
        }
        const l = e => {
            c(e.matches)
        };
        t.exports = s({
            [a]: {
                [o]: function() {
                    var e;
                    window.innerWidth < 480 && (e = "true" === this.getAttribute("aria-expanded"), this.closest(i).querySelectorAll(o).forEach(e => {
                        e.setAttribute("aria-expanded", !1)
                    }), this.setAttribute("aria-expanded", !e))
                }
            }
        }, {
            HIDE_MAX_WIDTH: 480,
            init() {
                c(window.innerWidth < 480), this.mediaQueryList = window.matchMedia("(max-width: 479.9px)"), this.mediaQueryList.addListener(l)
            },
            teardown() {
                this.mediaQueryList.removeListener(l)
            }
        })
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/events": 36,
        "../../uswds-core/src/js/utils/behavior": 45
    }],
    24: [function(e, t, N) {
        "use strict";
        var r = e("receptor/keymap"),
            s = e("../../uswds-core/src/js/utils/behavior");
        const a = e("../../uswds-core/src/js/utils/select"),
            n = e("../../uswds-core/src/js/utils/toggle"),
            i = e("../../uswds-core/src/js/utils/focus-trap"),
            o = e("../../usa-accordion/src/index");
        var c = e("../../uswds-core/src/js/utils/scrollbar-width"),
            l = e("../../uswds-core/src/js/events")["CLICK"],
            e = e("../../uswds-core/src/js/config")["prefix"];
        const u = `.${e}-header`,
            d = `.${e}-nav`;
        var p = `.${e}-nav-container`;
        const b = `.${e}-nav__primary`,
            f = `.${e}-nav__primary-item`,
            h = `button.${e}-nav__link`;
        var m = d + " a";
        const v = "data-nav-hidden",
            g = `.${e}-menu-btn`,
            w = `.${e}-nav__close`;
        var y = w + `, .${e}-overlay`;
        const A = [d, `.${e}-overlay`].join(", "),
            E = `body *:not(${u}, ${p}, ${d}, ${d} *):not([aria-hidden])`,
            x = (v, "usa-js-mobile-nav--active");
        let j, L, _;
        const S = () => document.body.classList.contains(x);
        e = c();
        const C = window.getComputedStyle(document.body).getPropertyValue("padding-right"),
            D = parseInt(C.replace(/px/, ""), 10) + parseInt(e.replace(/px/, ""), 10) + "px",
            T = () => {
                const t = document.querySelector(u).parentNode;
                (_ = document.querySelectorAll(E)).forEach(e => {
                    e !== t && (e.setAttribute("aria-hidden", !0), e.setAttribute(v, ""))
                })
            },
            $ = () => {
                (_ = document.querySelectorAll("[data-nav-hidden]")) && _.forEach(e => {
                    e.removeAttribute("aria-hidden"), e.removeAttribute(v)
                })
            };
        p = e => {
            var t = document["body"];
            const r = "boolean" == typeof e ? e : !S();
            t.classList.toggle(x, r), a(A).forEach(e => e.classList.toggle("is-visible", r)), j.focusTrap.update(r);
            var e = t.querySelector(w),
                s = document.querySelector(g);
            return t.style.paddingRight = t.style.paddingRight === D ? C : D, (r ? T : $)(), r && e ? e.focus() : !r && s && "none" !== getComputedStyle(s).display && s.focus(), r
        };
        const k = () => {
                var e = document.body.querySelector(w);
                S() && e && 0 === e.getBoundingClientRect().width && j.toggleNav.call(e, !1)
            },
            M = () => j.toggleNav.call(j, !1),
            q = () => {
                L && (n(L, !1), L = null)
            };
        j = s({
            [l]: {
                [h]() {
                    return L !== this && q(), L || (L = this, n(L, !0)), !1
                },
                body: q,
                [g]: p,
                [y]: p,
                [m]() {
                    var e = this.closest(o.ACCORDION);
                    e && o.getButtons(e).forEach(e => o.hide(e)), S() && j.toggleNav.call(j, !1)
                }
            },
            keydown: {
                [b]: r({
                    Escape: e => {
                        var t;
                        q(), t = (e = e).target.closest(f), e.target.matches(h) || (e = t.querySelector(h)) && e.focus()
                    }
                })
            },
            focusout: {
                [b](e) {
                    e.target.closest(b).contains(e.relatedTarget) || q()
                }
            }
        }, {
            init(e) {
                e = e.matches(d) ? e : e.querySelector(d);
                e && (j.focusTrap = i(e, {
                    Escape: M
                })), k(), window.addEventListener("resize", k, !1)
            },
            teardown() {
                window.removeEventListener("resize", k, !1), L = !1
            },
            focusTrap: null,
            toggleNav: p
        }), t.exports = j
    }, {
        "../../usa-accordion/src/index": 15,
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/events": 36,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/focus-trap": 47,
        "../../uswds-core/src/js/utils/scrollbar-width": 51,
        "../../uswds-core/src/js/utils/select": 53,
        "../../uswds-core/src/js/utils/toggle": 56,
        "receptor/keymap": 11
    }],
    25: [function(e, t, r) {
        "use strict";
        const s = e("receptor/once");
        var a = e("receptor/keymap");
        const n = e("../../uswds-core/src/js/utils/select-or-matches");
        var i = e("../../uswds-core/src/js/utils/behavior"),
            o = e("../../uswds-core/src/js/config")["prefix"],
            c = e("../../uswds-core/src/js/events")["CLICK"];
        const l = e("../../uswds-core/src/js/utils/sanitizer"),
            u = o + "-current",
            d = 0,
            p = o + "-in-page-nav",
            b = o + "-anchor",
            f = p + "__nav",
            h = p + "__list",
            m = p + "__item",
            v = p + "__link",
            g = p + "__heading",
            w = m + "--sub-item",
            y = "main",
            A = e => {
                const t = document.querySelectorAll("." + v);
                e.map(e => !0 === e.isIntersecting && 1 <= e.intersectionRatio && (t.forEach(e => e.classList.remove(u)), document.querySelector(`a[href="#${e.target.id}"]`).classList.add(u), !0))
            },
            E = e => {
                var t = document.querySelector("." + p).dataset.scrollOffset || d;
                window.scroll({
                    behavior: "smooth",
                    top: e.offsetTop - t,
                    block: "start"
                }), window.location.hash.slice(1) !== e.id && window.history.pushState(null, "", "#" + e.id)
            },
            x = e => {
                var t = l.escapeHTML `${e.dataset.titleText||"On this page"}`,
                    r = l.escapeHTML `${e.dataset.titleHeadingLevel||"h4"}`,
                    s = {
                        root: null,
                        rootMargin: l.escapeHTML `${e.dataset.rootMargin||"0px 0px 0px 0px"}`,
                        threshold: [l.escapeHTML `${e.dataset.threshold||"1"}`]
                    },
                    a = document.querySelectorAll(`${y} h2, ${y} h3`),
                    n = document.createElement("nav"),
                    r = (n.setAttribute("aria-label", t), n.classList.add(f), document.createElement(r));
                r.classList.add(g), r.setAttribute("tabindex", "0"), r.textContent = t, n.appendChild(r);
                const i = document.createElement("ul");
                i.classList.add(h), n.appendChild(i), a.forEach(e => {
                    var t = document.createElement("li"),
                        r = document.createElement("a"),
                        s = document.createElement("a"),
                        a = e.textContent,
                        n = e.tagName.toLowerCase(),
                        n = (t.classList.add(m), "h3" === n && t.classList.add(w), (e => {
                            var t = e.textContent.toLowerCase().replace(/[^a-z\d]/g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
                            let r, s = 0;
                            for (; r = t, 1 < (s += 1) && (r += "-" + s), document.getElementById(r););
                            return r
                        })(e));
                    r.setAttribute("href", "#" + n), r.setAttribute("class", v), r.textContent = a, s.setAttribute("id", n), s.setAttribute("class", b), e.insertAdjacentElement("afterbegin", s), i.appendChild(t), t.appendChild(r)
                }), e.appendChild(n);
                t = document.querySelectorAll("." + b);
                const o = new window.IntersectionObserver(A, s);
                t.forEach(e => {
                    o.observe(e)
                })
            };
        e = i({
            [c]: {
                ["." + v](e) {
                    e.preventDefault(), this.disabled || (e = this, e = document.getElementById(e.hash.slice(1)), E(e))
                }
            },
            keydown: {
                ["." + v]: a({
                    Enter: e => {
                        e = (e => {
                            let t;
                            return t = (e && 1 === e.nodeType ? e.getAttribute("href") : e.target.hash).replace("#", "")
                        })(e), e = document.getElementById(e);
                        const t = e.parentElement;
                        t && (t.setAttribute("tabindex", 0), t.focus(), t.addEventListener("blur", s(() => {
                            t.setAttribute("tabindex", -1)
                        }))), E(e)
                    }
                })
            }
        }, {
            init(e) {
                n("." + p, e).forEach(e => {
                    x(e), (e = window.location.hash.slice(1)) && (e = document.getElementById(e)) && E(e)
                })
            }
        });
        t.exports = e
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/events": 36,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/sanitizer": 50,
        "../../uswds-core/src/js/utils/select-or-matches": 52,
        "receptor/keymap": 11,
        "receptor/once": 12
    }],
    26: [function(e, t, r) {
        "use strict";
        const s = e("../../uswds-core/src/js/utils/select-or-matches");
        var a = e("../../uswds-core/src/js/utils/behavior"),
            e = e("../../uswds-core/src/js/config")["prefix"];
        const n = "." + (e + "-masked"),
            i = e + "-input-mask",
            o = i + "--content",
            c = "placeholder",
            p = "_#dDmMyY9",
            b = "A",
            f = (e, t) => e ? t.replace(/\W/g, "") : t.replace(/\D/g, ""),
            h = e => !Number.isNaN(parseInt(e, 10)),
            m = e => !!e && e.match(/[A-Z]/i),
            l = e => {
                var t = e,
                    r = t.getAttribute("id"),
                    s = (t.value = (e => {
                        var t = e.dataset.charset,
                            r = t || e.dataset.placeholder,
                            e = e["value"],
                            s = r.length;
                        let a = "",
                            n, i;
                        var o = f(t, e);
                        for (n = 0, i = 0; n < s; n += 1) {
                            var c = h(o[i]),
                                l = m(o[i]),
                                u = 0 <= p.indexOf(r[n]),
                                d = 0 <= b.indexOf(r[n]);
                            if (u && c || t && d && l) a += o[i], i += 1;
                            else {
                                if (!t && !c && u || t && (d && !l || u && !c)) return a;
                                a += r[n]
                            }
                            if (void 0 === o[i]) break
                        }
                        return a
                    })(t), s = (t = e).value, t = "" + e.dataset.placeholder.substr(s.length), (e = document.createElement("i")).textContent = s, [e, t]),
                    e = document.getElementById(r + "Mask");
                e.textContent = "", e.replaceChildren(s[0], s[1])
            };
        e = a({
            keyup: {
                [n]() {
                    l(this)
                }
            }
        }, {
            init(e) {
                s(n, e).forEach(e => {
                    var t, r, s;
                    (s = (e = e).getAttribute(c)) && (e.setAttribute("maxlength", s.length), e.setAttribute("data-placeholder", s), e.removeAttribute(c), (t = document.createElement("span")).classList.add(i), t.setAttribute("data-mask", s), (r = document.createElement("span")).classList.add(o), r.setAttribute("aria-hidden", "true"), r.id = e.id + "Mask", r.textContent = s, t.appendChild(r), e.closest("form").insertBefore(t, e), t.appendChild(e))
                })
            }
        });
        t.exports = e
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/select-or-matches": 52
    }],
    27: [function(e, t, r) {
        "use strict";
        var s = e("receptor/keymap"),
            a = e("../../uswds-core/src/js/utils/behavior");
        const n = e("../../uswds-core/src/js/utils/toggle"),
            i = e("../../uswds-core/src/js/utils/focus-trap"),
            o = e("../../usa-accordion/src/index");
        var c = e("../../uswds-core/src/js/events")["CLICK"],
            e = e("../../uswds-core/src/js/config")["prefix"];
        const l = `.${e}-language__submenu`,
            u = `.${e}-language__primary`,
            d = `.${e}-language__primary-item`,
            p = `button.${e}-language__link`;
        let b, f;
        const h = () => b.toggleLanguage.call(b, !1),
            m = () => {
                f && (n(f, !1), f = null)
            };
        b = a({
            [c]: {
                [p]() {
                    return f !== this && m(), f === this ? m() : f || (f = this, n(f, !0)), !1
                },
                body: m,
                [`.${e}-language` + " a"]() {
                    var e = this.closest(o.ACCORDION);
                    e && o.getButtons(e).forEach(e => o.hide(e))
                }
            },
            keydown: {
                [u]: s({
                    Escape: e => {
                        var t;
                        m(), t = (e = e).target.closest(d), e.target.matches(p) || t.querySelector(p).focus()
                    }
                })
            },
            focusout: {
                [u](e) {
                    e.target.closest(u).contains(e.relatedTarget) || m()
                }
            }
        }, {
            init(e) {
                e = e.matches(l) ? e : e.querySelector(l);
                e && (b.focusTrap = i(e, {
                    Escape: h
                }))
            },
            teardown() {
                f = !1
            },
            focusTrap: null
        }), t.exports = b
    }, {
        "../../usa-accordion/src/index": 15,
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/events": 36,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/focus-trap": 47,
        "../../uswds-core/src/js/utils/toggle": 56,
        "receptor/keymap": 11
    }],
    28: [function(e, t, r) {
        "use strict";
        const s = e("../../uswds-core/src/js/utils/select-or-matches"),
            u = e("../../uswds-core/src/js/utils/focus-trap");
        var a = e("../../uswds-core/src/js/utils/scrollbar-width"),
            e = e("../../uswds-core/src/js/config")["prefix"];
        const d = e + "-modal",
            p = d + "-overlay",
            b = d + "-wrapper",
            f = "data-open-modal",
            h = "data-close-modal",
            m = "data-force-action",
            v = "data-modal-hidden",
            n = "." + d,
            g = `.${b} *[data-focus]`,
            w = b + ` *[${h}]`,
            y = (f, w + `, .${p}:not([${m}])`),
            A = `body > *:not(.${b}):not([aria-hidden])`,
            E = (v, "usa-js-modal--active"),
            x = "is-hidden";
        let j;
        e = a();
        const L = window.getComputedStyle(document.body).getPropertyValue("padding-right"),
            _ = parseInt(L.replace(/px/, ""), 10) + parseInt(e.replace(/px/, ""), 10) + "px",
            S = () => {
                j.toggleModal.call(j, !1)
            };

        function C(e) {
            let t, r = e.target;
            var s, a, n, i, o = document["body"],
                c = !document.body.classList.contains(E),
                l = r ? r.getAttribute("aria-controls") : document.querySelector(".usa-modal-wrapper.is-visible"),
                l = c ? document.getElementById(l) : document.querySelector(".usa-modal-wrapper.is-visible");
            return !(!l || (s = l.querySelector(g) ? l.querySelector(g) : l.querySelector(".usa-modal"), a = document.getElementById(l.getAttribute("data-opener")), n = o.querySelector("*[data-open-modal][aria-controls]"), i = l.getAttribute(m), (r = "keydown" === e.type && null !== l ? l.querySelector(w) : r) && (r.hasAttribute(f) && (null === this.getAttribute("id") ? (t = "modal-" + (Math.floor(9e5 * Math.random()) + 1e5), this.setAttribute("id", t)) : t = this.getAttribute("id"), l.setAttribute("data-opener", t)), r.closest("." + d)) && !r.hasAttribute(h) && !r.closest(`[${h}]`))) && (o.classList.toggle(E, c), l.classList.toggle("is-visible", c), l.classList.toggle(x, !c), i && o.classList.toggle("usa-js-no-click", c), o.style.paddingRight = o.style.paddingRight === _ ? L : _, c && s ? (j.focusTrap = i ? u(l) : u(l, {
                Escape: S
            }), j.focusTrap.update(c), s.focus(), document.querySelectorAll(A).forEach(e => {
                e.setAttribute("aria-hidden", "true"), e.setAttribute(v, "")
            })) : !c && n && a && (document.querySelectorAll("[data-modal-hidden]").forEach(e => {
                e.removeAttribute("aria-hidden"), e.removeAttribute(v)
            }), a.focus(), j.focusTrap.update(c)), c)
        }
        j = {
            init(e) {
                s(n, e).forEach(e => {
                    var t = e.id; {
                        var r = e,
                            s = document.createElement("div"),
                            a = document.createElement("div");
                        const u = e.getAttribute("id");
                        var n = e.getAttribute("aria-labelledby"),
                            i = e.getAttribute("aria-describedby"),
                            o = !!e.hasAttribute(m) && e.hasAttribute(m),
                            c = document.createElement("div");
                        c.setAttribute("data-placeholder-for", u), c.style.display = "none", c.setAttribute("aria-hidden", "true");
                        for (let e = 0; e < r.attributes.length; e += 1) {
                            var l = r.attributes[e];
                            c.setAttribute("data-original-" + l.name, l.value)
                        }
                        r.after(c), r.parentNode.insertBefore(s, r), s.appendChild(r), r.parentNode.insertBefore(a, r), a.appendChild(r), s.classList.add(x), s.classList.add(b), a.classList.add(p), s.setAttribute("role", "dialog"), s.setAttribute("id", u), n && s.setAttribute("aria-labelledby", n), i && s.setAttribute("aria-describedby", i), o && s.setAttribute(m, "true"), e.removeAttribute("id"), e.removeAttribute("aria-labelledby"), e.removeAttribute("aria-describedby"), e.setAttribute("tabindex", "-1"), s.querySelectorAll(y).forEach(e => {
                            e.setAttribute("aria-controls", u)
                        }), document.body.appendChild(s)
                    }
                    document.querySelectorAll(`[aria-controls="${t}"]`).forEach(e => {
                        "A" === e.nodeName && (e.setAttribute("role", "button"), e.addEventListener("click", e => e.preventDefault())), e.addEventListener("click", C)
                    })
                })
            },
            teardown(e) {
                s(n, e).forEach(e => {
                    var t = e,
                        r = t,
                        s = (t = r.parentElement.parentElement).getAttribute("id"),
                        a = document.querySelector(`[data-placeholder-for="${s}"]`);
                    if (a) {
                        for (let e = 0; e < a.attributes.length; e += 1) {
                            var n = a.attributes[e];
                            n.name.startsWith("data-original-") && r.setAttribute(n.name.substr(14), n.value)
                        }
                        a.after(r), a.parentElement.removeChild(a)
                    }
                    t.parentElement.removeChild(t);
                    s = e.id;
                    document.querySelectorAll(`[aria-controls="${s}"]`).forEach(e => e.removeEventListener("click", C))
                })
            },
            focusTrap: null,
            toggleModal: C,
            on(e) {
                this.init(e)
            },
            off(e) {
                this.teardown(e)
            }
        }, t.exports = j
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/utils/focus-trap": 47,
        "../../uswds-core/src/js/utils/scrollbar-width": 51,
        "../../uswds-core/src/js/utils/select-or-matches": 52
    }],
    29: [function(e, t, r) {
        "use strict";
        const a = e("receptor/ignore");
        var s = e("../../uswds-core/src/js/utils/behavior");
        const n = e("../../uswds-core/src/js/utils/select"),
            i = e("../../uswds-core/src/js/events")["CLICK"],
            o = ".js-search-button",
            c = ".js-search-form",
            l = "[type=search]",
            u = "header";
        let d;
        const p = e => {
                e = e.closest(u);
                return (e || document).querySelector(c)
            },
            b = (e, t) => {
                var r = p(e);
                if (!r) throw new Error(`No ${c} found for search toggle in ${u}!`);
                if (e.hidden = t, r.hidden = !t, t) {
                    e = r.querySelector(l);
                    e && e.focus();
                    const s = a(r, () => {
                        d && ! function() {
                            b(this, !1), d = void 0
                        }.call(d), document.body.removeEventListener(i, s)
                    });
                    setTimeout(() => {
                        document.body.addEventListener(i, s)
                    }, 0)
                }
            };
        e = s({
            [i]: {
                ".js-search-button": function() {
                    b(this, !0), d = this
                }
            }
        }, {
            init(e) {
                n(o, e).forEach(e => {
                    b(e, !1)
                })
            },
            teardown() {
                d = void 0
            }
        });
        t.exports = e
    }, {
        "../../uswds-core/src/js/events": 36,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/select": 53,
        "receptor/ignore": 9
    }],
    30: [function(e, t, r) {
        "use strict";
        const s = e("receptor/once");
        var a = e("../../uswds-core/src/js/utils/behavior"),
            n = e("../../uswds-core/src/js/events")["CLICK"],
            e = e("../../uswds-core/src/js/config")["prefix"];
        t.exports = a({
            [n]: {
                [`.${e}-skipnav[href^="#"], .${e}-footer__return-to-top [href^="#"]`]: function() {
                    var e = encodeURI(this.getAttribute("href"));
                    const t = document.getElementById("#" === e ? "main-content" : e.slice(1));
                    t && (t.style.outline = "0", t.setAttribute("tabindex", 0), t.focus(), t.addEventListener("blur", s(() => {
                        t.setAttribute("tabindex", -1)
                    })))
                }
            }
        })
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/events": 36,
        "../../uswds-core/src/js/utils/behavior": 45,
        "receptor/once": 12
    }],
    31: [function(e, t, r) {
        "use strict";
        const o = e("../../uswds-core/src/js/utils/select");
        var s = e("../../uswds-core/src/js/utils/behavior"),
            a = e("../../uswds-core/src/js/events")["CLICK"];
        const n = e("../../uswds-core/src/js/config")["prefix"],
            i = e("../../uswds-core/src/js/utils/sanitizer"),
            c = `.${n}-table`,
            l = "aria-sort",
            u = "ascending",
            d = "descending",
            p = n + "-table__header__button",
            b = "." + p,
            f = "th[data-sortable]",
            h = `.${n}-table__announcement-region[aria-live="polite"]`,
            m = (e, t) => e.children[t].getAttribute("data-sort-value") || e.children[t].innerText || e.children[t].textContent,
            v = (s, a) => (e, t) => {
                var r = m(a ? e : t, s),
                    t = m(a ? t : e, s);
                return r && t && !Number.isNaN(Number(r)) && !Number.isNaN(Number(t)) ? r - t : r.toString().localeCompare(t, navigator.language, {
                    numeric: !0,
                    ignorePunctuation: !0
                })
            },
            g = e => {
                var t = e.innerText,
                    r = e.getAttribute(l) === u,
                    s = t + ", sortable column, currently " + (e.getAttribute(l) === u || e.getAttribute(l) === d || !1 ? r ? "sorted " + u : "sorted " + d : "unsorted"),
                    t = `Click to sort by ${t} in ${r?d:u} order.`;
                e.setAttribute("aria-label", s), e.querySelector(b).setAttribute("title", t)
            },
            w = (t, e) => {
                var r, s = t.closest(c);
                let a = e;
                if ("boolean" != typeof a && (a = t.getAttribute(l) === u), !s) throw new Error(f + " is missing outer " + c);
                if (a = ((e, t) => {
                        e.setAttribute(l, !0 === t ? d : u), g(e);
                        const r = e.closest(c).querySelector("tbody");
                        var s = [].slice.call(r.querySelectorAll("tr"));
                        const a = [].slice.call(e.parentNode.children).indexOf(e);
                        return s.sort(v(a, !t)).forEach(e => {
                            [].slice.call(e.children).forEach(e => e.removeAttribute("data-sort-active")), e.children[a].setAttribute("data-sort-active", !0), r.appendChild(e)
                        }), !0
                    })(t, e)) {
                    r = s, o(f, r).filter(e => e.closest(c) === r).forEach(e => {
                        e !== t && ((e = e).removeAttribute(l), g(e))
                    });
                    var e = s,
                        s = t,
                        n = e.querySelector("caption").innerText,
                        i = s.getAttribute(l) === u,
                        s = s.innerText;
                    if (!(e = e.nextElementSibling) || !e.matches(h)) throw new Error("Table containing a sortable column header is not followed by an aria-live region.");
                    n = `The table named "${n}" is now sorted by ${s} in ${i?u:d} order.`, e.innerText = n
                }
            };
        e = s({
            [a]: {
                [b](e) {
                    e.preventDefault(), w(e.target.closest(f), e.target.closest(f).getAttribute(l) === u)
                }
            }
        }, {
            init(e) {
                var t, e = o(f, e),
                    e = (e.forEach(e => {
                        return e = e, (t = document.createElement("button")).setAttribute("tabindex", "0"), t.classList.add(p), t.innerHTML = i.escapeHTML `
  <svg class="${n}-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g class="descending" fill="transparent">
      <path d="M17 17L15.59 15.59L12.9999 18.17V2H10.9999V18.17L8.41 15.58L7 17L11.9999 22L17 17Z" />
    </g>
    <g class="ascending" fill="transparent">
      <path transform="rotate(180, 12, 12)" d="M17 17L15.59 15.59L12.9999 18.17V2H10.9999V18.17L8.41 15.58L7 17L11.9999 22L17 17Z" />
    </g>
    <g class="unsorted" fill="transparent">
      <polygon points="15.17 15 13 17.17 13 6.83 15.17 9 16.58 7.59 12 3 7.41 7.59 8.83 9 11 6.83 11 17.17 8.83 15 7.42 16.41 12 21 16.59 16.41 15.17 15"/>
    </g>
  </svg>
  `, e.appendChild(t), void g(e);
                        var t
                    }), e.filter(e => e.getAttribute(l) === u || e.getAttribute(l) === d)[0]);
                void 0 !== e && ((t = e.getAttribute(l)) === u ? w(e, !0) : t === d && w(e, !1))
            },
            TABLE: c,
            SORTABLE_HEADER: f,
            SORT_BUTTON: b
        });
        t.exports = e
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/events": 36,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/sanitizer": 50,
        "../../uswds-core/src/js/utils/select": 53
    }],
    32: [function(e, t, r) {
        "use strict";
        var s = e("../../uswds-core/src/js/utils/behavior");
        const a = e("../../uswds-core/src/js/utils/select-or-matches");
        var n = e("../../uswds-core/src/js/config")["prefix"];
        const {
            COMBO_BOX_CLASS: f,
            enhanceComboBox: i
        } = e("../../usa-combo-box/src/index"), h = "." + (n + "-time-picker"), m = {
            filter: "0?{{ hourQueryFilter }}:{{minuteQueryFilter}}.*{{ apQueryFilter }}m?",
            apQueryFilter: "([ap])",
            hourQueryFilter: "([1-9][0-2]?)",
            minuteQueryFilter: "[\\d]+:([0-9]{0,2})"
        }, v = e => {
            let t;
            var r;
            return t = e && ([e, r] = e.split(":").map(e => {
                let t;
                e = parseInt(e, 10);
                return t = Number.isNaN(e) ? t : e
            }), null != e) && null != r ? 60 * e + r : t
        }, o = t => {
            const r = t.closest(h),
                s = r.querySelector("input");
            if (!s) throw new Error(h + " is missing inner input");
            const a = document.createElement("select");
            ["id", "name", "required", "aria-label", "aria-labelledby", "disabled", "aria-disabled"].forEach(e => {
                var t;
                s.hasAttribute(e) && (t = s.getAttribute(e), a.setAttribute(e, t), s.removeAttribute(e))
            });
            var n = (e, t) => ("0000" + e).slice(-t),
                t = Math.max(0, v(r.dataset.minTime) || 0),
                i = Math.min(1439, v(r.dataset.maxTime) || 1439),
                o = Math.floor(Math.max(1, r.dataset.step || 30));
            let c;
            for (let e = t; e <= i; e += o) {
                u = e, l = void 0, l = u % 60, u = Math.floor(u / 60);
                var {
                    minute: l,
                    hour24: u,
                    hour12: d,
                    ampm: p
                } = {
                    minute: l,
                    hour24: u,
                    hour12: u % 12 || 12,
                    ampm: u < 12 ? "am" : "pm"
                }, b = document.createElement("option");
                b.value = n(u, 2) + ":" + n(l, 2), b.text = d + ":" + n(l, 2) + p, b.text === s.value && (c = b.value), a.appendChild(b)
            }
            r.classList.add(f), Object.keys(m).forEach(e => {
                r.dataset[e] = m[e]
            }), r.dataset.disableFiltering = "true", r.dataset.defaultValue = c, r.appendChild(a), s.remove()
        };
        e = s({}, {
            init(e) {
                a(h, e).forEach(e => {
                    o(e), i(e)
                })
            },
            FILTER_DATASET: m
        });
        t.exports = e
    }, {
        "../../usa-combo-box/src/index": 19,
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/select-or-matches": 52
    }],
    33: [function(e, t, r) {
        "use strict";
        const s = e("../../uswds-core/src/js/utils/select-or-matches");
        var a = e("../../uswds-core/src/js/utils/behavior"),
            n = e("../../uswds-core/src/js/config")["prefix"];
        const b = e("../../uswds-core/src/js/utils/is-in-viewport"),
            i = `.${n}-tooltip`;
        e = `.${n}-tooltip__trigger`;
        const o = n + "-tooltip__trigger",
            c = n + "-tooltip",
            f = n + "-tooltip__body",
            h = "is-visible",
            m = n + "-tooltip__body--wrap",
            l = e => {
                var t = e.parentNode,
                    r = t.querySelector("." + f);
                return {
                    trigger: e,
                    wrapper: t,
                    body: r
                }
            },
            u = (t, s, e) => {
                t.setAttribute("aria-hidden", "false"), t.classList.add("is-set");
                const a = e => {
                        t.classList.remove(f + "--top"), t.classList.remove(f + "--bottom"), t.classList.remove(f + "--right"), t.classList.remove(f + "--left"), t.classList.add(f + "--" + e)
                    },
                    n = e => {
                        e.style.top = null, e.style.bottom = null, e.style.right = null, e.style.left = null, e.style.margin = null
                    },
                    i = (e, t) => parseInt(window.getComputedStyle(e).getPropertyValue(t), 10),
                    o = (e, t, r) => {
                        return 0 < i(r, "margin-" + e) ? t - i(r, "margin-" + e) : t
                    },
                    c = e => {
                        n(e);
                        var t = o("top", e.offsetHeight, s),
                            r = o("left", e.offsetWidth, s);
                        a("top"), e.style.left = "50%", e.style.top = "-5px", e.style.margin = `-${t}px 0 0 -${r/2}px`
                    },
                    l = e => {
                        n(e);
                        var t = o("left", e.offsetWidth, s);
                        a("bottom"), e.style.left = "50%", e.style.margin = `5px 0 0 -${t/2}px`
                    },
                    u = e => {
                        n(e);
                        var t = o("top", e.offsetHeight, s);
                        a("right"), e.style.top = "50%", e.style.left = s.offsetLeft + s.offsetWidth + 5 + "px", e.style.margin = `-${t/2}px 0 0 0`
                    },
                    d = e => {
                        n(e);
                        var t = o("top", e.offsetHeight, s),
                            r = o("left", s.offsetLeft > e.offsetWidth ? s.offsetLeft - e.offsetWidth : e.offsetWidth, s);
                        a("left"), e.style.top = "50%", e.style.left = "-5px", e.style.margin = `-${t/2}px 0 0 ${s.offsetLeft>e.offsetWidth?r:-r}px`
                    };

                function p(r, e) {
                    e = 1 < arguments.length && void 0 !== e ? e : 1;
                    const s = [c, l, u, d];
                    let a = !1;
                    ! function e(t) {
                        t < s.length && ((0, s[t])(r), b(r) ? a = !0 : e(t += 1))
                    }(0), a || (r.classList.add(m), e <= 2 && p(r, e += 1))
                }
                switch (e) {
                    case "top":
                        c(t), b(t) || p(t);
                        break;
                    case "bottom":
                        l(t), b(t) || p(t);
                        break;
                    case "right":
                        u(t), b(t) || p(t);
                        break;
                    case "left":
                        d(t), b(t) || p(t)
                }
                setTimeout(() => {
                    t.classList.add(h)
                }, 20)
            },
            d = e => {
                e.classList.remove(h), e.classList.remove("is-set"), e.classList.remove(m), e.setAttribute("aria-hidden", "true")
            },
            p = e => {
                var t = "tooltip-" + (Math.floor(9e5 * Math.random()) + 1e5),
                    r = e.getAttribute("title");
                const s = document.createElement("span");
                var a = document.createElement("span"),
                    n = e.getAttribute("data-classes");
                let i = e.getAttribute("data-position");
                return i || (i = "top", e.setAttribute("data-position", i)), e.setAttribute("aria-describedby", t), e.setAttribute("tabindex", "0"), e.removeAttribute("title"), e.classList.remove(c), e.classList.add(o), e.parentNode.insertBefore(s, e), s.appendChild(e), s.classList.add(c), s.appendChild(a), n && n.split(" ").forEach(e => s.classList.add(e)), a.classList.add(f), a.setAttribute("id", t), a.setAttribute("role", "tooltip"), a.setAttribute("aria-hidden", "true"), a.textContent = r, {
                    tooltipBody: a,
                    position: i,
                    tooltipContent: r,
                    wrapper: s
                }
            };
        n = a({
            "mouseover focusin": {
                [i](e) {
                    e = e.target;
                    "BUTTON" === e.nodeName && e.hasAttribute("title") && p(e)
                },
                [e](e) {
                    var {
                        trigger: e,
                        body: t
                    } = l(e.target);
                    u(t, e, e.dataset.position)
                }
            },
            "mouseout focusout": {
                [e](e) {
                    e = l(e.target).body;
                    d(e)
                }
            }
        }, {
            init(e) {
                s(i, e).forEach(e => {
                    p(e)
                })
            },
            setup: p,
            getTooltipElements: l,
            show: u,
            hide: d
        });
        t.exports = n
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/is-in-viewport": 48,
        "../../uswds-core/src/js/utils/select-or-matches": 52
    }],
    34: [function(e, t, r) {
        "use strict";
        var s = e("../../uswds-core/src/js/utils/behavior");
        const a = e("../../uswds-core/src/js/utils/validate-input");
        var n = e("../../uswds-core/src/js/config")["prefix"];
        const i = e("../../uswds-core/src/js/utils/select-or-matches"),
            o = "input[data-validation-element]",
            c = `.${n}-checklist__item`,
            l = e => {
                var t, s, r, a;
                a = (t = e).parentNode, r = t.getAttribute("id") + "-sr-summary", t.setAttribute("aria-describedby", r), (t = document.createElement("span")).setAttribute("data-validation-status", ""), t.classList.add("usa-sr-only"), t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", !0), t.setAttribute("id", r), a.append(t), r = (s = e).parentNode.querySelectorAll(c), a = s.getAttribute("data-validation-element"), s.setAttribute("aria-controls", a), r.forEach(e => {
                    let t = "status incomplete";
                    s.hasAttribute("data-validation-incomplete") && (t = s.getAttribute("data-validation-incomplete"));
                    var r = `${e.textContent} ${t} `;
                    e.setAttribute("tabindex", "0"), e.setAttribute("aria-label", r)
                })
            };
        e = s({
            "input change": {
                "input[data-validation-element]" (e) {
                    e = e.target, a(e)
                }
            }
        }, {
            init(e) {
                i(o, e).forEach(e => l(e))
            }
        });
        t.exports = e
    }, {
        "../../uswds-core/src/js/config": 35,
        "../../uswds-core/src/js/utils/behavior": 45,
        "../../uswds-core/src/js/utils/select-or-matches": 52,
        "../../uswds-core/src/js/utils/validate-input": 57
    }],
    35: [function(e, t, r) {
        "use strict";
        t.exports = {
            prefix: "usa"
        }
    }, {}],
    36: [function(e, t, r) {
        "use strict";
        t.exports = {
            CLICK: "click"
        }
    }, {}],
    37: [function(e, t, r) {
        "use strict";
        var s = e("../../../usa-accordion/src/index"),
            a = e("../../../usa-banner/src/index"),
            n = e("../../../usa-button/src/index"),
            i = e("../../../usa-character-count/src/index"),
            o = e("../../../usa-combo-box/src/index"),
            c = e("../../../usa-date-picker/src/index"),
            l = e("../../../usa-date-range-picker/src/index"),
            u = e("../../../usa-file-input/src/index"),
            d = e("../../../usa-footer/src/index"),
            p = e("../../../usa-in-page-navigation/src/index"),
            b = e("../../../usa-input-mask/src/index"),
            f = e("../../../usa-language-selector/src/index"),
            h = e("../../../usa-modal/src/index"),
            m = e("../../../usa-header/src/index"),
            v = e("../../../_usa-password/src/index"),
            g = e("../../../usa-search/src/index"),
            w = e("../../../usa-skipnav/src/index"),
            y = e("../../../usa-table/src/index"),
            A = e("../../../usa-time-picker/src/index"),
            E = e("../../../usa-tooltip/src/index"),
            e = e("../../../usa-validation/src/index");
        t.exports = {
            accordion: s,
            banner: a,
            button: n,
            characterCount: i,
            comboBox: o,
            datePicker: c,
            dateRangePicker: l,
            fileInput: u,
            footer: d,
            inPageNavigation: p,
            inputMask: b,
            languageSelector: f,
            modal: h,
            navigation: m,
            password: v,
            search: g,
            skipnav: w,
            table: y,
            timePicker: A,
            tooltip: E,
            validator: e
        }
    }, {
        "../../../_usa-password/src/index": 14,
        "../../../usa-accordion/src/index": 15,
        "../../../usa-banner/src/index": 16,
        "../../../usa-button/src/index": 17,
        "../../../usa-character-count/src/index": 18,
        "../../../usa-combo-box/src/index": 19,
        "../../../usa-date-picker/src/index": 20,
        "../../../usa-date-range-picker/src/index": 21,
        "../../../usa-file-input/src/index": 22,
        "../../../usa-footer/src/index": 23,
        "../../../usa-header/src/index": 24,
        "../../../usa-in-page-navigation/src/index": 25,
        "../../../usa-input-mask/src/index": 26,
        "../../../usa-language-selector/src/index": 27,
        "../../../usa-modal/src/index": 28,
        "../../../usa-search/src/index": 29,
        "../../../usa-skipnav/src/index": 30,
        "../../../usa-table/src/index": 31,
        "../../../usa-time-picker/src/index": 32,
        "../../../usa-tooltip/src/index": 33,
        "../../../usa-validation/src/index": 34
    }],
    38: [function(e, t, r) {
        "use strict";
        "function" != typeof window.CustomEvent && (window.CustomEvent = function(e, t) {
            var t = t || {
                    bubbles: !1,
                    cancelable: !1,
                    detail: null
                },
                r = document.createEvent("CustomEvent");
            return r.initCustomEvent(e, t.bubbles, t.cancelable, t.detail), r
        })
    }, {}],
    39: [function(e, t, r) {
        "use strict";
        var s = window.HTMLElement.prototype;
        const a = "hidden";
        a in s || Object.defineProperty(s, a, {
            get() {
                return this.hasAttribute(a)
            },
            set(e) {
                e ? this.setAttribute(a, "") : this.removeAttribute(a)
            }
        })
    }, {}],
    40: [function(e, t, r) {
        "use strict";
        e("classlist-polyfill"), e("./element-hidden"), e("./number-is-nan"), e("./custom-event"), e("./svg4everybody")
    }, {
        "./custom-event": 38,
        "./element-hidden": 39,
        "./number-is-nan": 41,
        "./svg4everybody": 42,
        "classlist-polyfill": 1
    }],
    41: [function(e, t, r) {
        "use strict";
        Number.isNaN = Number.isNaN || function(e) {
            return "number" == typeof e && e != e
        }
    }, {}],
    42: [function(e, t, r) {
        "use strict";

        function f(e, t, r, s) {
            if (r) {
                var a = document.createDocumentFragment(),
                    n = !t.hasAttribute("viewBox") && r.getAttribute("viewBox");
                n && t.setAttribute("viewBox", n);
                for (var i = document.importNode ? document.importNode(r, !0) : r.cloneNode(!0), o = document.createElementNS(t.namespaceURI || "http://www.w3.org/2000/svg", "g"); i.childNodes.length;) o.appendChild(i.firstChild);
                if (s)
                    for (var c = 0; s.attributes.length > c; c++) {
                        var l = s.attributes[c];
                        "xlink:href" !== l.name && "href" !== l.name && o.setAttribute(l.name, l.value)
                    }
                a.appendChild(o), e.appendChild(a)
            }
        }
        t.exports = function(e) {
            var c, l = Object(e),
                e = window.top !== window.self,
                u = (c = "polyfill" in l ? l.polyfill : /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/.test(navigator.userAgent) || (navigator.userAgent.match(/\bEdge\/12\.(\d+)\b/) || [])[1] < 10547 || (navigator.userAgent.match(/\bAppleWebKit\/(\d+)\b/) || [])[1] < 537 || /\bEdge\/.(\d+)\b/.test(navigator.userAgent) && e, {}),
                d = window.requestAnimationFrame || setTimeout,
                p = document.getElementsByTagName("use"),
                b = 0;
            c && function e() {
                if (!(b && p.length - b <= 0))
                    for (var t = b = 0; t < p.length;) {
                        var r, s, a = p[t],
                            n = a.parentNode,
                            i = function(e) {
                                for (var t = e;
                                    "svg" !== t.nodeName.toLowerCase() && (t = t.parentNode););
                                return t
                            }(n),
                            o = a.getAttribute("xlink:href") || a.getAttribute("href");
                        !o && l.attributeName && (o = a.getAttribute(l.attributeName)), i && o ? c && (!l.validate || l.validate(o, i, a) ? (n.removeChild(a), r = (o = o.split("#")).shift(), o = o.join("#"), r.length ? ((s = u[r]) || ((s = u[r] = new XMLHttpRequest).open("GET", r), s.send(), s._embeds = []), s._embeds.push({
                            parent: n,
                            svg: i,
                            id: o
                        }), function(s, a) {
                            s.onreadystatechange = function() {
                                var r;
                                4 === s.readyState && ((r = s._cachedDocument) || ((r = s._cachedDocument = document.implementation.createHTMLDocument("")).body.innerHTML = s.responseText, r.domain !== document.domain && (r.domain = document.domain), s._cachedTarget = {}), s._embeds.splice(0).map(function(e) {
                                    var t = (t = s._cachedTarget[e.id]) || (s._cachedTarget[e.id] = r.getElementById(e.id));
                                    f(e.parent, e.svg, t, a)
                                }))
                            }, s.onreadystatechange()
                        }(s, a)) : f(n, i, document.getElementById(o), a)) : (++t, ++b)) : ++t
                    }
                d(e, 67)
            }()
        }
    }, {}],
    43: [function(e, t, r) {
        "use strict";
        window.uswdsPresent = !0, e("./polyfills");
        var s = e("./config");
        const a = e("./index"),
            n = e("./polyfills/svg4everybody");
        s.components = a;
        e = () => {
            const t = document.body;
            Object.keys(a).forEach(e => {
                a[e].on(t)
            }), n()
        };
        "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", e, {
            once: !0
        }) : e(), r.default = s, r.initComponents = e
    }, {
        "./config": 35,
        "./index": 37,
        "./polyfills": 40,
        "./polyfills/svg4everybody": 42
    }],
    44: [function(e, t, r) {
        "use strict";
        t.exports = function() {
            return (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : document).activeElement
        }
    }, {}],
    45: [function(e, t, r) {
        "use strict";

        function s() {
            for (var e = arguments.length, r = new Array(e), t = 0; t < e; t++) r[t] = arguments[t];
            return function() {
                let t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : document.body;
                r.forEach(e => {
                    "function" == typeof this[e] && this[e].call(this, t)
                })
            }
        }
        const a = e("object-assign"),
            n = e("receptor/behavior");
        t.exports = (e, t) => n(e, a({
            on: s("init", "add"),
            off: s("teardown", "remove")
        }, t))
    }, {
        "object-assign": 4,
        "receptor/behavior": 5
    }],
    46: [function(e, t, r) {
        "use strict";
        t.exports = function(s) {
            var a = this;
            let n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 500,
                i = null;
            return function() {
                for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
                window.clearTimeout(i), i = window.setTimeout(() => {
                    s.apply(a, t)
                }, n)
            }
        }
    }, {}],
    47: [function(e, t, r) {
        "use strict";
        const a = e("object-assign"),
            n = e("receptor")["keymap"],
            i = e("./behavior"),
            o = e("./select"),
            c = e("./active-element"),
            l = e => {
                const t = o('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]', e),
                    r = t[0],
                    s = t[t.length - 1];
                return {
                    firstTabStop: r,
                    lastTabStop: s,
                    tabAhead: function(e) {
                        c() === s && (e.preventDefault(), r.focus())
                    },
                    tabBack: function(e) {
                        c() === r ? (e.preventDefault(), s.focus()) : t.includes(c()) || (e.preventDefault(), r.focus())
                    }
                }
            };
        t.exports = function(e) {
            var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
            const r = l(e);
            var {
                Esc: e,
                Escape: s
            } = t, e = (s && !e && (t.Esc = s), n(a({
                Tab: r.tabAhead,
                "Shift+Tab": r.tabBack
            }, t)));
            return i({
                keydown: e
            }, {
                init() {
                    r.firstTabStop && r.firstTabStop.focus()
                },
                update(e) {
                    e ? this.on() : this.off()
                }
            })
        }
    }, {
        "./active-element": 44,
        "./behavior": 45,
        "./select": 53,
        "object-assign": 4,
        receptor: 10
    }],
    48: [function(e, t, r) {
        "use strict";
        t.exports = function(e) {
            var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : window,
                r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : document.documentElement,
                e = e.getBoundingClientRect();
            return 0 <= e.top && 0 <= e.left && e.bottom <= (t.innerHeight || r.clientHeight) && e.right <= (t.innerWidth || r.clientWidth)
        }
    }, {}],
    49: [function(e, t, r) {
        "use strict";
        t.exports = function() {
            return "undefined" != typeof navigator && (navigator.userAgent.match(/(iPod|iPhone|iPad)/g) || "MacIntel" === navigator.platform && 1 < navigator.maxTouchPoints) && !window.MSStream
        }
    }, {}],
    50: [function(e, t, r) {
        "use strict";
        t.exports = function() {
            "use strict";
            var n = {
                _entity: /[&<>"'/]/g,
                _entities: {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&apos;",
                    "/": "&#x2F;"
                },
                getEntity: function(e) {
                    return n._entities[e]
                },
                escapeHTML: function(e) {
                    var t = "";
                    for (var r = 0; r < e.length; r++) {
                        t += e[r];
                        if (r + 1 < arguments.length) {
                            var s = arguments[r + 1] || "";
                            t += String(s).replace(n._entity, n.getEntity)
                        }
                    }
                    return t
                },
                createSafeHTML: function(e) {
                    var t = arguments.length;
                    var r = new Array(t > 1 ? t - 1 : 0);
                    for (var s = 1; s < t; s++) r[s - 1] = arguments[s];
                    var a = n.escapeHTML.apply(n, [e].concat(r));
                    return {
                        __html: a,
                        toString: function() {
                            return "[object WrappedHTMLObject]"
                        },
                        info: "This is a wrapped HTML object. See https://developer.mozilla.or" + "g/en-US/Firefox_OS/Security/Security_Automation for more."
                    }
                },
                unwrapSafeHTML: function() {
                    var e = arguments.length;
                    var t = new Array(e);
                    for (var r = 0; r < e; r++) t[r] = arguments[r];
                    var s = t.map(function(e) {
                        return e.__html
                    });
                    return s.join("")
                }
            };
            return n
        }()
    }, {}],
    51: [function(e, t, r) {
        "use strict";
        t.exports = function() {
            var e = document.createElement("div"),
                t = (e.style.visibility = "hidden", e.style.overflow = "scroll", e.style.msOverflowStyle = "scrollbar", document.body.appendChild(e), document.createElement("div")),
                t = (e.appendChild(t), e.offsetWidth - t.offsetWidth + "px");
            return e.parentNode.removeChild(e), t
        }
    }, {}],
    52: [function(e, t, r) {
        "use strict";
        const a = e("./select");
        t.exports = (e, t) => {
            var r, s = a(e, t);
            return "string" == typeof e && (r = t) && "object" == typeof r && 1 === r.nodeType && t.matches(e) && s.push(t), s
        }
    }, {
        "./select": 53
    }],
    53: [function(e, t, r) {
        "use strict";
        t.exports = (e, t) => {
            var r;
            return "string" != typeof e ? [] : (r = (t = t && (r = t) && "object" == typeof r && 1 === r.nodeType ? t : window.document).querySelectorAll(e), Array.prototype.slice.call(r))
        }
    }, {}],
    54: [function(e, t, r) {
        "use strict";
        t.exports = (e, t) => {
            e.setAttribute("autocapitalize", "off"), e.setAttribute("autocorrect", "off"), e.setAttribute("type", t ? "password" : "text")
        }
    }, {}],
    55: [function(e, t, r) {
        "use strict";
        const a = e("resolve-id-refs"),
            n = e("./toggle-field-mask"),
            i = "aria-pressed",
            o = "data-show-text";
        t.exports = e => {
            const t = e.hasAttribute(i) && "true" !== e.getAttribute(i);
            a(e.getAttribute("aria-controls")).forEach(e => n(e, t)), e.hasAttribute(o) || e.setAttribute(o, e.textContent);
            var r = e.getAttribute(o),
                s = e.getAttribute("data-hide-text") || r.replace(/\bShow\b/i, e => `${"S"===e[0]?"H":"h"}ide`);
            return e.textContent = t ? r : s, e.setAttribute(i, t), t
        }
    }, {
        "./toggle-field-mask": 54,
        "resolve-id-refs": 13
    }],
    56: [function(e, t, r) {
        "use strict";
        const s = "aria-expanded";
        t.exports = (e, t) => {
            let r = t;
            "boolean" != typeof r && (r = "false" === e.getAttribute(s)), e.setAttribute(s, r);
            t = e.getAttribute("aria-controls"), e = document.getElementById(t);
            if (e) return r ? e.removeAttribute("hidden") : e.setAttribute("hidden", ""), r;
            throw new Error(`No toggle target found with id: "${t}"`)
        }
    }, {}],
    57: [function(e, t, r) {
        "use strict";
        const c = e("./debounce");
        e = e("../config").prefix;
        const l = e + "-checklist__item--checked";
        t.exports = function(n) {
            var e = n.dataset.validationElement;
            const i = "#" === e.charAt(0) ? document.querySelector(e) : document.getElementById(e);
            if (!i) throw new Error(`No validation element found with id: "${e}"`);
            let o = "";
            Object.entries(n.dataset).forEach(t => {
                var [t, r] = t;
                if (t.startsWith("validate")) {
                    var t = t.substr("validate".length).toLowerCase(),
                        r = new RegExp(r),
                        s = `[data-validator="${t}"]`,
                        s = i.querySelector(s);
                    const a = n.parentNode.querySelector("[data-validation-status]");
                    r = r.test(n.value);
                    if (s.classList.toggle(l, r), !s) throw new Error(`No validator checkbox found for: "${t}"`);
                    r = n.dataset.validationComplete || "status complete", t = n.dataset.validationIncomplete || "status incomplete";
                    let e = s.textContent + " ";
                    s.classList.contains(l) ? e += r : e += t, s.setAttribute("aria-label", e), o += e + ". ", c(() => {
                        a.textContent = o
                    }, 1e3)()
                }
            })
        }
    }, {
        "../config": 35,
        "./debounce": 46
    }]
}, {}, [43]);

;