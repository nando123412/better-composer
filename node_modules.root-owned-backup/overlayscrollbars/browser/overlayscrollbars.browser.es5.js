/*!
 * OverlayScrollbars
 * Version: 2.17.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */
var OverlayScrollbarsGlobal = function(r) {
  "use strict";
  var e = function createCache(r, e) {
    var a = r.i, n = r.v, t = r.o;
    var i = a;
    var v;
    var o = function cacheUpdateContextual(r, e) {
      var a = i;
      var o = r;
      var u = e || (n ? !n(a, o) : a !== o);
      if (u || t) {
        i = o;
        v = a;
      }
      return [ i, u, v ];
    };
    var u = function cacheUpdateIsolated(r) {
      return o(e(i, v), r);
    };
    var c = function getCurrentCache(r) {
      return [ i, !!r, v ];
    };
    return [ e ? u : o, c ];
  };
  var a = typeof window !== "undefined" && typeof HTMLElement !== "undefined" && !!window.document;
  var n = a ? window : {};
  var t = Math.max;
  var i = Math.min;
  var v = Math.round;
  var o = Math.abs;
  var u = Math.sign;
  var c = n.cancelAnimationFrame;
  var f = n.requestAnimationFrame;
  var l = n.setTimeout;
  var s = n.clearTimeout;
  var d = function getApi(r) {
    return typeof n[r] !== "undefined" ? n[r] : void 0;
  };
  var p = d("MutationObserver");
  var _ = d("IntersectionObserver");
  var g = d("ResizeObserver");
  var h = d("ScrollTimeline");
  var b = function isUndefined(r) {
    return r === void 0;
  };
  var m = function isNull(r) {
    return r === null;
  };
  var y = function type(r) {
    return b(r) || m(r) ? "" + r : Object.prototype.toString.call(r).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
  };
  var S = function isNumber(r) {
    return typeof r === "number";
  };
  var w = function isString(r) {
    return typeof r === "string";
  };
  var O = function isBoolean(r) {
    return typeof r === "boolean";
  };
  var C = function isFunction(r) {
    return typeof r === "function";
  };
  var x = function isArray(r) {
    return Array.isArray(r);
  };
  var E = function isObject(r) {
    return typeof r === "object" && !x(r) && !m(r);
  };
  var A = function isArrayLike(r) {
    var e = !!r && r.length;
    var a = S(e) && e > -1 && e % 1 == 0;
    return x(r) || !C(r) && a ? e > 0 && E(r) ? e - 1 in r : true : false;
  };
  var T = function isPlainObject(r) {
    return !!r && r.constructor === Object;
  };
  var D = function isHTMLElement(r) {
    return r instanceof HTMLElement;
  };
  var H = function isElement(r) {
    return r instanceof Element;
  };
  var P = function animationCurrentTime() {
    return performance.now();
  };
  var z = function animateNumber(r, e, a, n, i) {
    var v = 0;
    var o = P();
    var u = t(0, a);
    var l = function frame(a) {
      var c = P();
      var s = c - o;
      var d = s >= u;
      var p = a ? 1 : 1 - (t(0, o + u - c) / u || 0);
      var _ = (e - r) * (C(i) ? i(p, p * u, 0, 1, u) : p) + r;
      var g = d || p === 1;
      n(_, p, g);
      v = g ? 0 : f((function() {
        return l();
      }));
    };
    l();
    return function(r) {
      c(v);
      if (r) {
        l(r);
      }
    };
  };
  function each(r, e) {
    if (A(r)) {
      for (var a = 0; a < r.length; a++) {
        if (e(r[a], a, r) === false) {
          break;
        }
      }
    } else if (r) {
      each(Object.keys(r), (function(a) {
        return e(r[a], a, r);
      }));
    }
    return r;
  }
  var M = function inArray(r, e) {
    return r.indexOf(e) >= 0;
  };
  var k = function concat(r, e) {
    return r.concat(e);
  };
  var I = function push(r, e, a) {
    if (!w(e) && A(e)) {
      Array.prototype.push.apply(r, e);
    } else {
      r.push(e);
    }
    return r;
  };
  var L = function from(r) {
    return Array.from(r || []);
  };
  var V = function createOrKeepArray(r) {
    if (x(r)) {
      return r;
    }
    return !w(r) && A(r) ? L(r) : [ r ];
  };
  var R = function isEmptyArray(r) {
    return !!r && !r.length;
  };
  var F = function deduplicateArray(r) {
    return L(new Set(r));
  };
  var N = function runEachAndClear(r, e, a) {
    var n = function runFn(r) {
      return r ? r.apply(void 0, e || []) : true;
    };
    each(r, n);
    if (!a) {
      r.length = 0;
    }
  };
  var j = "paddingTop";
  var q = "paddingRight";
  var U = "paddingLeft";
  var B = "paddingBottom";
  var Y = "marginLeft";
  var W = "marginRight";
  var X = "marginBottom";
  var Z = "overflowX";
  var G = "overflowY";
  var Q = "width";
  var $ = "height";
  var J = "visible";
  var K = "hidden";
  var rr = "scroll";
  var er = function capitalizeFirstLetter(r) {
    var e = String(r || "");
    return e ? e[0].toUpperCase() + e.slice(1) : "";
  };
  var ar = function equal(r, e, a, n) {
    if (r && e) {
      var t = true;
      each(a, (function(a) {
        var n = r[a];
        var i = e[a];
        if (n !== i) {
          t = false;
        }
      }));
      return t;
    }
    return false;
  };
  var nr = function equalWH(r, e) {
    return ar(r, e, [ "w", "h" ]);
  };
  var tr = function equalXY(r, e) {
    return ar(r, e, [ "x", "y" ]);
  };
  var ir = function equalTRBL(r, e) {
    return ar(r, e, [ "t", "r", "b", "l" ]);
  };
  var vr = function bind(r) {
    for (var e = arguments.length, a = new Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++) {
      a[n - 1] = arguments[n];
    }
    return r.bind.apply(r, [ 0 ].concat(a));
  };
  var or = function selfClearTimeout(r) {
    var e;
    var a = r ? l : f;
    var n = r ? s : c;
    return [ function(t) {
      n(e);
      e = a((function() {
        return t();
      }), C(r) ? r() : r);
    }, function() {
      return n(e);
    } ];
  };
  var ur = function getDebouncer(r) {
    var e = C(r) ? r() : r;
    if (S(e)) {
      var a = e ? l : f;
      var n = e ? s : c;
      return function(r) {
        var t = a((function() {
          return r();
        }), e);
        return function() {
          n(t);
        };
      };
    }
    return e && e.u;
  };
  var cr = function debounce(r, e) {
    var a = e || {}, n = a.p, t = a._, i = a.m, v = a.S;
    var o;
    var u;
    var c;
    var f;
    var l = function invokeFunctionToDebounce(e) {
      if (u) {
        u();
      }
      if (o) {
        o();
      }
      f = u = o = c = void 0;
      r.apply(this, e);
    };
    var s = function mergeParms(r) {
      return v && c ? v(c, r) : r;
    };
    var d = function flush() {
      if (u && c) {
        l(s(c) || c);
      }
    };
    var p = function debouncedFn() {
      var r = L(arguments);
      var e = ur(n);
      if (e) {
        var a = typeof i === "function" ? i() : i;
        var v = ur(t);
        var p = s(r);
        var _ = p || r;
        var g = l.bind(0, _);
        if (u) {
          u();
        }
        if (a && !f) {
          g();
          f = true;
          u = e((function() {
            return f = void 0;
          }));
        } else {
          u = e(g);
          if (v && !o) {
            o = v(d);
          }
        }
        c = _;
      } else {
        l(r);
      }
    };
    p.O = d;
    return p;
  };
  var fr = function hasOwnProperty(r, e) {
    return Object.prototype.hasOwnProperty.call(r, e);
  };
  var lr = function keys(r) {
    return r ? Object.keys(r) : [];
  };
  var sr = function assignDeep(r, e, a, n, t, i, v) {
    var o = [ e, a, n, t, i, v ];
    if ((typeof r !== "object" || m(r)) && !C(r)) {
      r = {};
    }
    each(o, (function(e) {
      each(e, (function(a, n) {
        var t = e[n];
        if (r === t) {
          return true;
        }
        var i = x(t);
        if (t && T(t)) {
          var v = r[n];
          var o = v;
          if (i && !x(v)) {
            o = [];
          } else if (!i && !T(v)) {
            o = {};
          }
          r[n] = sr(o, t);
        } else {
          r[n] = i ? t.slice() : t;
        }
      }));
    }));
    return r;
  };
  var dr = function removeUndefinedProperties(r, e) {
    return each(sr({}, r), (function(r, e, a) {
      if (r === void 0) {
        delete a[e];
      } else if (r && T(r)) {
        a[e] = dr(r);
      }
    }));
  };
  var pr = function isEmptyObject(r) {
    return !lr(r).length;
  };
  var _r = function noop() {};
  var gr = function capNumber(r, e, a) {
    return t(r, i(e, a));
  };
  var hr = function getDomTokensArray(r) {
    return F((x(r) ? r : (r || "").split(" ")).filter((function(r) {
      return r;
    })));
  };
  var br = function getAttr(r, e) {
    return r && r.getAttribute(e);
  };
  var mr = function hasAttr(r, e) {
    return r && r.hasAttribute(e);
  };
  var yr = function setAttrs(r, e, a) {
    each(hr(e), (function(e) {
      if (r) {
        r.setAttribute(e, String(a || ""));
      }
    }));
  };
  var Sr = function removeAttrs(r, e) {
    each(hr(e), (function(e) {
      return r && r.removeAttribute(e);
    }));
  };
  var wr = function domTokenListAttr(r, e) {
    var a = hr(br(r, e));
    var n = vr(yr, r, e);
    var t = function domTokenListOperation(r, e) {
      var n = new Set(a);
      each(hr(r), (function(r) {
        n[e](r);
      }));
      return L(n).join(" ");
    };
    return {
      C: function _remove(r) {
        return n(t(r, "delete"));
      },
      A: function _add(r) {
        return n(t(r, "add"));
      },
      T: function _has(r) {
        var e = hr(r);
        return e.reduce((function(r, e) {
          return r && a.includes(e);
        }), e.length > 0);
      }
    };
  };
  var Or = function removeAttrClass(r, e, a) {
    wr(r, e).C(a);
    return vr(Cr, r, e, a);
  };
  var Cr = function addAttrClass(r, e, a) {
    wr(r, e).A(a);
    return vr(Or, r, e, a);
  };
  var xr = function addRemoveAttrClass(r, e, a, n) {
    return (n ? Cr : Or)(r, e, a);
  };
  var Er = function hasAttrClass(r, e, a) {
    return wr(r, e).T(a);
  };
  var Ar = function createDomTokenListClass(r) {
    return wr(r, "class");
  };
  var Tr = function removeClass(r, e) {
    Ar(r).C(e);
  };
  var Dr = function addClass(r, e) {
    Ar(r).A(e);
    return vr(Tr, r, e);
  };
  var Hr = function find(r, e) {
    var a = e ? H(e) && e : document;
    return a ? L(a.querySelectorAll(r)) : [];
  };
  var Pr = function findFirst(r, e) {
    var a = e ? H(e) && e : document;
    return a && a.querySelector(r);
  };
  var zr = function is(r, e) {
    return H(r) && r.matches(e);
  };
  var Mr = function isBodyElement(r) {
    return zr(r, "body");
  };
  var kr = function contents(r) {
    return r ? L(r.childNodes) : [];
  };
  var Ir = function parent(r) {
    return r && r.parentElement;
  };
  var Lr = function closest(r, e) {
    return H(r) && r.closest(e);
  };
  var Vr = function getFocusedElement(r) {
    return document.activeElement;
  };
  var Rr = function liesBetween(r, e, a) {
    var n = Lr(r, e);
    var t = r && Pr(a, n);
    var i = Lr(t, e) === n;
    return n && t ? n === r || t === r || i && Lr(Lr(r, a), e) !== n : false;
  };
  var Fr = function removeElements(r) {
    each(V(r), (function(r) {
      var e = Ir(r);
      if (r && e) {
        e.removeChild(r);
      }
    }));
  };
  var Nr = function appendChildren(r, e) {
    return vr(Fr, r && e && each(V(e), (function(e) {
      if (e) {
        r.appendChild(e);
      }
    })));
  };
  var jr;
  var qr = function getTrustedTypePolicy() {
    return jr;
  };
  var Ur = function setTrustedTypePolicy(r) {
    jr = r;
  };
  var Br = function createDiv(r) {
    var e = document.createElement("div");
    yr(e, "class", r);
    return e;
  };
  var Yr = function createDOM(r) {
    var e = Br();
    var a = qr();
    var n = r.trim();
    e.innerHTML = a ? a.createHTML(n) : n;
    return each(kr(e), (function(r) {
      return Fr(r);
    }));
  };
  var Wr = function getCSSVal(r, e) {
    return r.getPropertyValue(e) || r[e] || "";
  };
  var Xr = function validFiniteNumber(r) {
    var e = r || 0;
    return isFinite(e) ? e : 0;
  };
  var Zr = function parseToZeroOrNumber(r) {
    return Xr(parseFloat(r || ""));
  };
  var Gr = function roundCssNumber(r) {
    return Math.round(r * 1e4) / 1e4;
  };
  var Qr = function numberToCssPx(r) {
    return Gr(Xr(r)) + "px";
  };
  function setStyles(r, e) {
    r && e && each(e, (function(e, a) {
      try {
        var n = r.style;
        var t = m(e) || O(e) ? "" : S(e) ? Qr(e) : e;
        if (a.indexOf("--") === 0) {
          n.setProperty(a, t);
        } else {
          n[a] = t;
        }
      } catch (i) {}
    }));
  }
  function getStyles(r, e, a) {
    var t = w(e);
    var i = t ? "" : {};
    if (r) {
      var v = n.getComputedStyle(r, a) || r.style;
      i = t ? Wr(v, e) : L(e).reduce((function(r, e) {
        r[e] = Wr(v, e);
        return r;
      }), i);
    }
    return i;
  }
  var $r = function topRightBottomLeft(r, e, a) {
    var n = e ? e + "-" : "";
    var t = a ? "-" + a : "";
    var i = n + "top" + t;
    var v = n + "right" + t;
    var o = n + "bottom" + t;
    var u = n + "left" + t;
    var c = getStyles(r, [ i, v, o, u ]);
    return {
      t: Zr(c[i]),
      r: Zr(c[v]),
      b: Zr(c[o]),
      l: Zr(c[u])
    };
  };
  var Jr = function getTrasformTranslateValue(r, e) {
    return "translate" + (E(r) ? "(" + r.x + "," + r.y + ")" : (e ? "X" : "Y") + "(" + r + ")");
  };
  var Kr = function elementHasDimensions(r) {
    return !!(r.offsetWidth || r.offsetHeight || r.getClientRects().length);
  };
  var re = {
    w: 0,
    h: 0
  };
  var ee = function getElmWidthHeightProperty(r, e) {
    return e ? {
      w: e[r + "Width"],
      h: e[r + "Height"]
    } : re;
  };
  var ae = function getWindowSize(r) {
    return ee("inner", r || n);
  };
  var ne = vr(ee, "offset");
  var te = vr(ee, "client");
  var ie = vr(ee, "scroll");
  var ve = function getFractionalSize(r) {
    var e = parseFloat(getStyles(r, Q)) || 0;
    var a = parseFloat(getStyles(r, $)) || 0;
    return {
      w: e - v(e),
      h: a - v(a)
    };
  };
  var oe = function getBoundingClientRect(r) {
    return r.getBoundingClientRect();
  };
  var ue = function hasDimensions(r) {
    return !!r && Kr(r);
  };
  var ce = function domRectHasDimensions(r) {
    return !!(r && (r[$] || r[Q]));
  };
  var fe = function domRectAppeared(r, e) {
    var a = ce(r);
    var n = ce(e);
    return !n && a;
  };
  var le = function removeEventListener(r, e, a, n) {
    each(hr(e), (function(e) {
      if (r) {
        r.removeEventListener(e, a, n);
      }
    }));
  };
  var se = function addEventListener(r, e, a, n) {
    var t;
    var i = (t = n && n.D) != null ? t : true;
    var v = n && n.H || false;
    var o = n && n.P || false;
    var u = {
      passive: i,
      capture: v
    };
    return vr(N, hr(e).map((function(e) {
      var n = o ? function(t) {
        le(r, e, n, v);
        if (a) {
          a(t);
        }
      } : a;
      if (r) {
        r.addEventListener(e, n, u);
      }
      return vr(le, r, e, n, v);
    })));
  };
  var de = function stopPropagation(r) {
    return r.stopPropagation();
  };
  var pe = function preventDefault(r) {
    return r.preventDefault();
  };
  var _e = function stopAndPrevent(r) {
    return de(r) || pe(r);
  };
  var ge = function swallowFocusEvents(r) {
    return vr(N, V(r).map((function(r) {
      return se(r, "focusin focusout focus blur", (function(r) {
        return _e(r);
      }), {
        H: true,
        D: false
      });
    })));
  };
  var he = function scrollElementTo(r, e) {
    var a = S(e) ? {
      x: e,
      y: e
    } : e || {}, n = a.x, t = a.y;
    S(n) && (r.scrollLeft = n);
    S(t) && (r.scrollTop = t);
  };
  var be = function getElementScroll(r) {
    return {
      x: r.scrollLeft,
      y: r.scrollTop
    };
  };
  var me = function getZeroScrollCoordinates() {
    return {
      M: {
        x: 0,
        y: 0
      },
      k: {
        x: 0,
        y: 0
      }
    };
  };
  var ye = function sanitizeScrollCoordinates(r, e) {
    var a = r.M, n = r.k;
    var t = e.w, i = e.h;
    var v = function sanitizeAxis(r, e, a) {
      var n = u(r) * a;
      var t = u(e) * a;
      if (n === t) {
        var i = o(r);
        var v = o(e);
        t = i > v ? 0 : t;
        n = i < v ? 0 : n;
      }
      n = n === t ? 0 : n;
      return [ n + 0, t + 0 ];
    };
    var c = v(a.x, n.x, t), f = c[0], l = c[1];
    var s = v(a.y, n.y, i), d = s[0], p = s[1];
    return {
      M: {
        x: f,
        y: d
      },
      k: {
        x: l,
        y: p
      }
    };
  };
  var Se = function isDefaultDirectionScrollCoordinates(r) {
    var e = r.M, a = r.k;
    var n = function getAxis(r, e) {
      return r === 0 && r <= e;
    };
    return {
      x: n(e.x, a.x),
      y: n(e.y, a.y)
    };
  };
  var we = function getScrollCoordinatesPercent(r, e) {
    var a = r.M, n = r.k;
    var t = function getAxis(r, e, a) {
      return gr(0, 1, (r - a) / (r - e) || 0);
    };
    return {
      x: t(a.x, n.x, e.x),
      y: t(a.y, n.y, e.y)
    };
  };
  var Oe = function focusElement(r) {
    if (r && r.focus) {
      r.focus({
        preventScroll: true,
        focusVisible: false
      });
    }
  };
  var Ce = function manageListener(r, e) {
    each(V(e), r);
  };
  var xe = function createEventListenerHub(r) {
    var e = new Map;
    var a = function removeEvent(r, a) {
      if (r) {
        var n = e.get(r);
        Ce((function(r) {
          if (n) {
            n[r ? "delete" : "clear"](r);
          }
        }), a);
      } else {
        e.forEach((function(r) {
          r.clear();
        }));
        e.clear();
      }
    };
    var n = function addEvent(r, t) {
      if (w(r)) {
        var i = e.get(r) || new Set;
        e.set(r, i);
        Ce((function(r) {
          if (C(r)) {
            i.add(r);
          }
        }), t);
        return vr(a, r, t);
      }
      if (O(t) && t) {
        a();
      }
      var v = lr(r);
      var o = [];
      each(v, (function(e) {
        var a = r[e];
        if (a) {
          I(o, n(e, a));
        }
      }));
      return vr(N, o);
    };
    var t = function triggerEvent(r, a) {
      each(L(e.get(r)), (function(r) {
        if (a && !R(a)) {
          r.apply(0, a);
        } else {
          r();
        }
      }));
    };
    n(r || {});
    return [ n, a, t ];
  };
  var Ee = {};
  var Ae = {};
  var Te = function addPlugins(r) {
    each(r, (function(r) {
      return each(r, (function(e, a) {
        Ee[a] = r[a];
      }));
    }));
  };
  var De = function registerPluginModuleInstances(r, e, a) {
    return lr(r).map((function(n) {
      var t = r[n], i = t.static, v = t.instance;
      var o = a || [], u = o[0], c = o[1], f = o[2];
      var l = a ? v : i;
      if (l) {
        var s = a ? l(u, c, e) : l(e);
        return (f || Ae)[n] = s;
      }
    }));
  };
  var He = function getInstancePluginModuleInstance(r, e) {
    return r[e];
  };
  var Pe = function getStaticPluginModuleInstance(r) {
    return He(Ae, r);
  };
  function getDefaultExportFromCjs(r) {
    return r && r.I && Object.prototype.hasOwnProperty.call(r, "default") ? r["default"] : r;
  }
  var ze = {
    exports: {}
  };
  (function(r) {
    function _extends() {
      return r.exports = _extends = Object.assign ? Object.assign.bind() : function(r) {
        for (var e = 1; e < arguments.length; e++) {
          var a = arguments[e];
          for (var n in a) {
            ({}).hasOwnProperty.call(a, n) && (r[n] = a[n]);
          }
        }
        return r;
      }, r.exports.I = true, r.exports["default"] = r.exports, _extends.apply(null, arguments);
    }
    r.exports = _extends, r.exports.I = true, r.exports["default"] = r.exports;
  })(ze);
  var Me = ze.exports;
  var ke = /*@__PURE__*/ getDefaultExportFromCjs(Me);
  var Ie = {
    boolean: "__TPL_boolean_TYPE__",
    number: "__TPL_number_TYPE__",
    string: "__TPL_string_TYPE__",
    array: "__TPL_array_TYPE__",
    object: "__TPL_object_TYPE__",
    function: "__TPL_function_TYPE__",
    null: "__TPL_null_TYPE__"
  };
  var Le = function validateRecursive(r, e, a, n) {
    var t = {};
    var i = ke({}, e);
    var v = lr(r).filter((function(r) {
      return fr(e, r);
    }));
    each(v, (function(v) {
      var o = e[v];
      var u = r[v];
      var c = T(u);
      var f = n ? n + "." : "";
      if (c && T(o)) {
        var l = Le(u, o, a, f + v), s = l[0], d = l[1];
        t[v] = s;
        i[v] = d;
        each([ i, t ], (function(r) {
          if (pr(r[v])) {
            delete r[v];
          }
        }));
      } else if (!c) {
        var p = false;
        var _ = [];
        var g = [];
        var h = y(o);
        var m = V(u);
        each(m, (function(r) {
          var e;
          each(Ie, (function(a, n) {
            if (a === r) {
              e = n;
            }
          }));
          var a = b(e);
          if (a && w(o)) {
            var n = r.split(" ");
            p = !!n.find((function(r) {
              return r === o;
            }));
            I(_, n);
          } else {
            p = Ie[h] === r;
          }
          I(g, a ? Ie.string : e);
          return !p;
        }));
        if (p) {
          t[v] = o;
        } else if (a) {
          console.warn('The option "' + f + v + "\" wasn't set, because it doesn't accept the type [ " + h.toUpperCase() + ' ] with the value of "' + o + '".\r\n' + "Accepted types are: [ " + g.join(", ").toUpperCase() + " ].\r\n" + (_.length > 0 ? "\r\nValid strings are: [ " + _.join(", ") + " ]." : ""));
        }
        delete i[v];
      }
    }));
    return [ t, i ];
  };
  var Ve = function validateOptions(r, e, a) {
    return Le(r, e, a);
  };
  var Re = "__osOptionsValidationPlugin";
  /* @__PURE__ */  (function(r) {
    return r = {}, r[Re] = {
      static: function _static() {
        var r = Ie.number;
        var e = Ie.boolean;
        var a = [ Ie.array, Ie.null ];
        var n = "hidden scroll visible visible-hidden";
        var t = "visible hidden auto";
        var i = "never scroll leavemove";
        var v = [ e, Ie.string, Ie.function ];
        var o = {
          paddingAbsolute: e,
          showNativeOverlaidScrollbars: e,
          update: {
            elementEvents: a,
            attributes: a,
            debounce: [ Ie.number, Ie.array, Ie.object, Ie.null ],
            ignoreMutation: [ Ie.function, Ie.null ],
            flowDirectionStyles: [ Ie.function, Ie.null ]
          },
          overflow: {
            x: n,
            y: n
          },
          scrollbars: {
            theme: [ Ie.string, Ie.null ],
            visibility: t,
            autoHide: i,
            autoHideDelay: r,
            autoHideSuspend: e,
            dragScroll: e,
            clickScroll: v,
            pointers: [ Ie.array, Ie.null ]
          }
        };
        return function(r, e) {
          var a = Ve(o, r, e), n = a[0], t = a[1];
          return ke({}, t, n);
        };
      }
    }, r;
  })();
  var Fe = "data-overlayscrollbars";
  var Ne = "os-environment";
  var je = Ne + "-scrollbar-hidden";
  var qe = Fe + "-initialize";
  var Ue = "noClipping";
  var Be = Fe + "-body";
  var Ye = Fe;
  var We = "host";
  var Xe = Fe + "-viewport";
  var Ze = Z;
  var Ge = G;
  var Qe = "arrange";
  var $e = "measuring";
  var Je = "scrolling";
  var Ke = "scrollbarHidden";
  var ra = "noContent";
  var ea = "noScrollbars";
  var aa = "contentOverflow";
  var na = Fe + "-padding";
  var ta = Fe + "-content";
  var ia = "os-size-observer";
  var va = ia + "-appear";
  var oa = ia + "-listener";
  var ua = oa + "-scroll";
  var ca = oa + "-item";
  var fa = ca + "-final";
  var la = "os-trinsic-observer";
  var sa = "os-theme-none";
  var da = "os-scrollbar";
  var pa = da + "-rtl";
  var _a = da + "-horizontal";
  var ga = da + "-vertical";
  var ha = da + "-track";
  var ba = da + "-handle";
  var ma = da + "-visible";
  var ya = da + "-cornerless";
  var Sa = da + "-interaction";
  var wa = da + "-unusable";
  var Oa = da + "-auto-hide";
  var Ca = Oa + "-hidden";
  var xa = da + "-wheel";
  var Ea = ha + "-interactive";
  var Aa = ba + "-interactive";
  var Ta = "__osSizeObserverPlugin";
  var Da = /* @__PURE__ */ function(r) {
    return r = {}, r[Ta] = {
      static: function _static() {
        return function(r, e, a) {
          var n;
          var t = 3333333;
          var i = "scroll";
          var v = Yr('<div class="' + ca + '" dir="ltr"><div class="' + ca + '"><div class="' + fa + '"></div></div><div class="' + ca + '"><div class="' + fa + '" style="width: 200%; height: 200%"></div></div></div>');
          var o = v[0];
          var u = o.lastChild;
          var l = o.firstChild;
          var s = l == null ? void 0 : l.firstChild;
          var d = ne(o);
          var p = d;
          var _ = false;
          var g;
          var h = function reset() {
            he(l, t);
            he(u, t);
          };
          var b = function onResized(r) {
            g = 0;
            if (_) {
              d = p;
              e(r === true);
            }
          };
          var m = function onScroll(r) {
            p = ne(o);
            _ = !r || !nr(p, d);
            if (r) {
              de(r);
              if (_ && !g) {
                c(g);
                g = f(b);
              }
            } else {
              b(r === false);
            }
            h();
          };
          var y = [ Nr(r, v), se(l, i, m), se(u, i, m) ];
          Dr(r, ua);
          setStyles(s, (n = {}, n[Q] = t, n[$] = t, n));
          f(h);
          return [ a ? vr(m, false) : h, y ];
        };
      }
    }, r;
  }();
  var Ha = function getShowNativeOverlaidScrollbars(r, e) {
    var a = e.L;
    var n = r("showNativeOverlaidScrollbars"), t = n[0], i = n[1];
    return [ t && a.x && a.y, i ];
  };
  var Pa = function overflowIsVisible(r) {
    return r.indexOf(J) === 0;
  };
  var za = function overflowBehaviorToOverflowStyle(r) {
    return r.replace(J + "-", "");
  };
  var Ma = function overflowCssValueToOverflowStyle(r, e) {
    if (r === "auto") {
      return e ? rr : K;
    }
    var a = r || K;
    return [ K, rr, J ].includes(a) ? a : K;
  };
  var ka = function getElementOverflowStyle(r, e) {
    var a = getStyles(r, [ Z, G ]), n = a.overflowX, t = a.overflowY;
    return {
      x: Ma(n, e.x),
      y: Ma(t, e.y)
    };
  };
  var Ia = function createViewportOverflowStyleClassName(r, e) {
    var a = e ? Ze : Ge;
    return "" + a + er(r);
  };
  var La = "__osScrollbarsHidingPlugin";
  var Va = /* @__PURE__ */ function(r) {
    return r = {}, r[La] = {
      static: function _static() {
        return {
          V: function _viewportArrangement(r, e, a, n, t) {
            var i = r.R, v = r.F;
            var o = n.N, u = n.L, c = n.j;
            var f = !i && !o && (u.x || u.y);
            var l = Ha(t, n), s = l[0];
            var d = function _getViewportOverflowHideOffset(r) {
              var e = o || s ? 0 : 42;
              var a = function getHideOffsetPerAxis(r, a, n) {
                var t = r ? e : n;
                var i = a && !o ? t : 0;
                var v = r && !!e;
                return [ i, v ];
              };
              var n = a(u.x, r.x === rr, c.x), t = n[0], i = n[1];
              var v = a(u.y, r.y === rr, c.y), f = v[0], l = v[1];
              return {
                q: {
                  x: t,
                  y: f
                },
                U: {
                  x: i,
                  y: l
                }
              };
            };
            var p = function _hideNativeScrollbars(r) {
              if (!i) {
                var n;
                var t = a.B;
                var v = sr({}, (n = {}, n[W] = 0, n[X] = 0, n[Y] = 0, n));
                var o = d(r), u = o.q, c = o.U;
                var l = c.x, s = c.y;
                var p = u.x, _ = u.y;
                var g = e.Y;
                var h = t ? Y : W;
                var b = t ? U : q;
                var m = g[h];
                var y = g[X];
                var S = g[b];
                var w = g[B];
                v[Q] = "calc(100% + " + (_ + m * -1) + "px)";
                v[h] = -_ + m;
                v[X] = -p + y;
                if (f) {
                  v[b] = S + (s ? _ : 0);
                  v[B] = w + (l ? p : 0);
                }
                return v;
              }
            };
            var _ = function _arrangeViewport(r, n, t) {
              if (f) {
                var i = e.Y;
                var o = d(r), u = o.q, c = o.U;
                var l = c.x, s = c.y;
                var p = u.x, _ = u.y;
                var g = a.B;
                var h = g ? q : U;
                var b = i[h];
                var m = i.paddingTop;
                var y = n.w + t.w;
                var S = n.h + t.h;
                var w = {
                  w: _ && s ? _ + y - b + "px" : "",
                  h: p && l ? p + S - m + "px" : ""
                };
                setStyles(v, {
                  "--os-vaw": w.w,
                  "--os-vah": w.h
                });
              }
              return f;
            };
            var g = function _undoViewportArrange() {
              if (f) {
                var r = e.W, a = e.Y;
                var n = ka(v, r);
                var t = d(n), i = t.U;
                var o = i.x, u = i.y;
                var c = {};
                var l = function assignProps(r) {
                  return each(r, (function(r) {
                    c[r] = a[r];
                  }));
                };
                if (o) {
                  l([ X, j, B ]);
                }
                if (u) {
                  l([ Y, W, U, q ]);
                }
                var s = getStyles(v, lr(c));
                var _ = Or(v, Xe, Qe);
                setStyles(v, c);
                return function() {
                  setStyles(v, sr({}, s, p(n)));
                  _();
                };
              }
              return _r;
            };
            return {
              X: _,
              Z: g,
              G: p
            };
          }
        };
      }
    }, r;
  }();
  var Ra = "__osClickScrollPlugin";
  var Fa = /* @__PURE__ */ function(r) {
    return r = {}, r[Ra] = {
      static: function _static() {
        return function(r, e, a, n, t, i, v, o) {
          var u = false;
          var c = _r;
          var f = {
            clickScrollDistance: t,
            clickScrollDuration: 200,
            clickPressDelay: 150,
            pressDistanceDuration: 90
          };
          var l = function easeOutQuad(r) {
            return 1 - (1 - r) * (1 - r);
          };
          var s = function easeInOutQuad(r) {
            return r < .5 ? 2 * r * r : 1 - Math.pow(-2 * r + 2, 2) / 2;
          };
          var d = sr({}, f, C(i) ? i(v) : f), p = d.clickScrollDistance, _ = d.clickScrollDuration, g = d.clickPressDelay, h = d.pressDistanceDuration;
          var b = p === 0;
          var m = h * 2.3;
          var y = h * 2.5;
          var S = p ? t / p : 0;
          var w = or(Math.max(22, g)), O = w[0], x = w[1];
          var E = a();
          var A = Math.sign(n);
          var T = z(0, b ? n : p * A, _, (function(t, i, v) {
            if (b) {
              e(t);
            } else {
              r(t);
            }
            if (v) {
              o(u);
              O((function() {
                if (u || b || !h) {
                  return;
                }
                var r = a();
                var t = r - E;
                var i = t * S;
                var v = n - t;
                var o = i ? v / i : 0;
                var f = o <= 2.2;
                var d = Math.max(1, o || 0);
                var p = (!o || o > .5) && Math.sign(v) === A;
                if (p) {
                  c = z(t, f ? n : n - i, f ? m * d : h * d, (function(r, a, t) {
                    e(r);
                    if (t && !f) {
                      c = z(r, n, y, e, l);
                    }
                  }), f && s);
                }
              }));
            }
          }), s);
          return function(r) {
            u = true;
            if (r) {
              T();
            }
            x();
            c();
          };
        };
      }
    }, r;
  }();
  var Na = function opsStringify(r) {
    return JSON.stringify(r, (function(r, e) {
      if (C(e)) {
        throw 0;
      }
      return e;
    }));
  };
  var ja = function getPropByPath(r, e) {
    return r ? ("" + e).split(".").reduce((function(r, e) {
      return r && fr(r, e) ? r[e] : void 0;
    }), r) : void 0;
  };
  var qa = [ 0, 33 ];
  var Ua = [ 33, 99 ];
  var Ba = [ 222, 666, true ];
  var Ya = {
    paddingAbsolute: false,
    showNativeOverlaidScrollbars: false,
    update: {
      elementEvents: [ [ "img", "load" ] ],
      debounce: {
        mutation: qa,
        resize: null,
        event: Ua,
        env: Ba
      },
      attributes: null,
      ignoreMutation: null,
      flowDirectionStyles: null
    },
    overflow: {
      x: "scroll",
      y: "scroll"
    },
    scrollbars: {
      theme: "os-theme-dark",
      visibility: "auto",
      autoHide: "never",
      autoHideDelay: 1300,
      autoHideSuspend: false,
      dragScroll: true,
      clickScroll: false,
      pointers: [ "mouse", "touch", "pen" ]
    }
  };
  var Wa = function getOptionsDiff(r, e) {
    var a = {};
    var n = k(lr(e), lr(r));
    each(n, (function(n) {
      var t = r[n];
      var i = e[n];
      if (E(t) && E(i)) {
        sr(a[n] = {}, Wa(t, i));
        if (pr(a[n])) {
          delete a[n];
        }
      } else if (fr(e, n) && i !== t) {
        var v = true;
        if (x(t) || x(i)) {
          try {
            if (Na(t) === Na(i)) {
              v = false;
            }
          } catch (o) {}
        }
        if (v) {
          a[n] = i;
        }
      }
    }));
    return a;
  };
  var Xa = function createOptionCheck(r, e, a) {
    return function(n) {
      return [ ja(r, n), a || ja(e, n) !== void 0 ];
    };
  };
  var Za;
  var Ga = function getNonce() {
    return Za;
  };
  var Qa = function setNonce(r) {
    Za = r;
  };
  var $a;
  var Ja = function createEnvironment() {
    var r = function getNativeScrollbarSize(r, e, a) {
      Nr(document.body, r);
      Nr(document.body, r);
      var n = te(r);
      var t = ne(r);
      var i = ve(e);
      if (a) {
        Fr(r);
      }
      return {
        x: t.h - n.h + i.h,
        y: t.w - n.w + i.w
      };
    };
    var a = function getNativeScrollbarsHiding(r) {
      var e = false;
      var a = Dr(r, je);
      try {
        e = getStyles(r, "scrollbar-width") === "none" || getStyles(r, "display", "::-webkit-scrollbar") === "none";
      } catch (n) {}
      a();
      return e;
    };
    var t = function getFocusableScrollers(r) {
      var e = function getActiveElement() {
        return r.ownerDocument.activeElement;
      };
      var a = e();
      var n = ge([ r, a ]);
      setStyles(r, {
        visibility: "visible"
      });
      Oe(r);
      var t = e() === r;
      setStyles(r, {
        visibility: ""
      });
      r.blur();
      if (D(a)) {
        a.focus();
      }
      n();
      return t;
    };
    var i = "." + Ne + "{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}." + Ne + " div{width:200%;height:200%;margin:10px 0}." + je + "{scrollbar-width:none!important}@supports not (scrollbar-width:none){." + je + "::-webkit-scrollbar,." + je + "::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}}";
    var v = Yr('<div class="' + Ne + '"><div></div><style>' + i + "</style></div>");
    var o = v[0];
    var u = o.firstChild;
    var c = o.lastChild;
    var f = Ga();
    if (f) {
      c.nonce = f;
    }
    var l = xe(), s = l[0], d = l[2];
    var p = e({
      i: r(o, u),
      v: tr
    }, vr(r, o, u, true)), _ = p[0], g = p[1];
    var b = g(), m = b[0];
    var y = a(o);
    var S = t(o);
    var w = {
      x: m.x === 0,
      y: m.y === 0
    };
    var O = {
      elements: {
        host: null,
        padding: !y,
        viewport: function viewport(r) {
          return y && Mr(r) && r;
        },
        content: false
      },
      scrollbars: {
        slot: true
      },
      cancel: {
        nativeScrollbarsOverlaid: false,
        body: null
      }
    };
    var x = sr({}, Ya);
    var E = vr(sr, {}, x);
    var A = vr(sr, {}, O);
    var T = {
      j: m,
      L: w,
      N: y,
      $: S,
      J: !!h,
      K: vr(s, "r"),
      rr: A,
      er: function _setDefaultInitialization(r) {
        return sr(O, r) && A();
      },
      ar: E,
      nr: function _setDefaultOptions(r) {
        return sr(x, r) && E();
      },
      tr: sr({}, O),
      ir: sr({}, x)
    };
    Sr(o, "style");
    Fr(o);
    se(n, "resize", (function() {
      d("r", []);
    }));
    if (C(n.matchMedia) && !y && (!w.x || !w.y)) {
      var H = function addZoomListener(r) {
        var e = n.matchMedia("(resolution: " + n.devicePixelRatio + "dppx)");
        se(e, "change", (function() {
          r();
          H(r);
        }), {
          P: true
        });
      };
      H((function() {
        var r = _(), e = r[0], a = r[1];
        sr(T.j, e);
        d("r", [ a ]);
      }));
    }
    return T;
  };
  var Ka = function getEnvironment() {
    if (!$a) {
      $a = Ja();
    }
    return $a;
  };
  var rn = function createEventContentChange(r, e, a) {
    var n = false;
    var t = a ? new WeakMap : false;
    var i = function destroy() {
      n = true;
    };
    var v = function updateElements(i) {
      if (t && a) {
        var v = a.map((function(e) {
          var a = e || [], n = a[0], t = a[1];
          var v = t && n ? (i || Hr)(n, r) : [];
          return [ v, t ];
        }));
        each(v, (function(a) {
          return each(a[0], (function(i) {
            var v = a[1];
            var o = t.get(i) || [];
            var u = r.contains(i);
            if (u && v) {
              var c = se(i, v, (function(r) {
                if (n) {
                  c();
                  t.delete(i);
                } else {
                  e(r);
                }
              }));
              t.set(i, I(o, c));
            } else {
              N(o);
              t.delete(i);
            }
          }));
        }));
      }
    };
    v();
    return [ i, v ];
  };
  var en = function createDOMObserver(r, e, a, n) {
    var t = false;
    var i = n || {}, v = i.vr, o = i.ur, u = i.cr, c = i.lr, f = i.sr, l = i.dr;
    var s = rn(r, (function() {
      return t && a(true);
    }), u), d = s[0], _ = s[1];
    var g = v || [];
    var h = o || [];
    var b = k(g, h);
    var m = function observerCallback(t, i) {
      if (!R(i)) {
        var v = f || _r;
        var o = l || _r;
        var u = [];
        var s = [];
        var d = false;
        var p = false;
        each(i, (function(a) {
          var t = a.attributeName, i = a.target, f = a.type, l = a.oldValue, _ = a.addedNodes, g = a.removedNodes;
          var b = f === "attributes";
          var m = f === "childList";
          var y = r === i;
          var S = b && t;
          var O = S && br(i, t || "");
          var C = w(O) ? O : null;
          var x = S && l !== C;
          var E = M(h, t) && x;
          if (e && (m || !y)) {
            var A = b && x;
            var T = A && c && zr(i, c);
            var D = T ? !v(i, t, l, C) : !b || A;
            var H = D && !o(a, !!T, r, n);
            each(_, (function(r) {
              return I(u, r);
            }));
            each(g, (function(r) {
              return I(u, r);
            }));
            p = p || H;
          }
          if (!e && y && x && !v(i, t, l, C)) {
            I(s, t);
            d = d || E;
          }
        }));
        _((function(r) {
          return F(u).reduce((function(e, a) {
            I(e, Hr(r, a));
            return zr(a, r) ? I(e, a) : e;
          }), []);
        }));
        if (e) {
          if (!t && p) {
            a(false);
          }
          return [ false ];
        }
        if (!R(s) || d) {
          var g = [ F(s), d ];
          if (!t) {
            a.apply(0, g);
          }
          return g;
        }
      }
    };
    var y = new p(vr(m, false));
    return [ function() {
      y.observe(r, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: b,
        subtree: e,
        childList: e,
        characterData: e
      });
      t = true;
      return function() {
        if (t) {
          d();
          y.disconnect();
          t = false;
        }
      };
    }, function() {
      if (t) {
        return m(true, y.takeRecords());
      }
    } ];
  };
  var an = null;
  var nn = function createSizeObserver(r, a, n) {
    var t = n || {}, i = t.pr;
    var v = Pe(Ta);
    var o = e({
      i: false,
      o: true
    }), u = o[0];
    return function() {
      var e = [];
      var n = Yr('<div class="' + ia + '"><div class="' + oa + '"></div></div>');
      var t = n[0];
      var o = t.firstChild;
      var c = function onSizeChangedCallbackProxy(r) {
        var e = x(r) && !R(r);
        var n = false;
        var t = false;
        if (e) {
          var i = r[0];
          var v = u(i.contentRect), o = v[0], c = v[2];
          var f = ce(o);
          t = fe(o, c);
          n = !t && !f;
        } else {
          t = r === true;
        }
        if (!n) {
          a({
            _r: true,
            pr: t
          });
        }
      };
      if (g) {
        if (!O(an)) {
          var f = new g(_r);
          f.observe(r, {
            get box() {
              an = true;
            }
          });
          an = an || false;
          f.disconnect();
        }
        var l = cr(c, {
          p: 0,
          _: 0
        });
        var s = function resizeObserverCallback(r) {
          return l(r);
        };
        var d = new g(s);
        d.observe(an ? r : o);
        I(e, [ function() {
          d.disconnect();
        }, !an && Nr(r, t) ]);
        if (an) {
          var p = new g(s);
          p.observe(r, {
            box: "border-box"
          });
          I(e, (function() {
            return p.disconnect();
          }));
        }
      } else if (v) {
        var _ = v(o, c, i), h = _[0], b = _[1];
        I(e, k([ Dr(t, va), se(t, "animationstart", h), Nr(r, t) ], b));
      } else {
        return _r;
      }
      return vr(N, e);
    };
  };
  var tn = function createTrinsicObserver(r, a) {
    var n;
    var t = function isHeightIntrinsic(r) {
      return r.h === 0 || r.isIntersecting || r.intersectionRatio > 0;
    };
    var i = Br(la);
    var v = e({
      i: false
    }), o = v[0];
    var u = function triggerOnTrinsicChangedCallback(r, e) {
      if (r) {
        var n = o(t(r));
        var i = n[1];
        return i && !e && a(n) && [ n ];
      }
    };
    var c = function intersectionObserverCallback(r, e) {
      return u(e.pop(), r);
    };
    return [ function() {
      var e = [];
      if (_) {
        n = new _(vr(c, false), {
          root: r
        });
        n.observe(i);
        I(e, (function() {
          n.disconnect();
        }));
      } else {
        var a = function onSizeChanged() {
          var r = ne(i);
          u(r);
        };
        I(e, nn(i, a)());
        a();
      }
      return vr(N, I(e, Nr(r, i)));
    }, function() {
      return n && c(true, n.takeRecords());
    } ];
  };
  var vn = function createObserversSetup(r, a, n, t) {
    var i;
    var v;
    var o;
    var u;
    var c;
    var f;
    var l;
    var s;
    var d = "[" + Ye + "]";
    var p = "[" + Xe + "]";
    var _ = [ "id", "class", "style", "open", "wrap", "cols", "rows" ];
    var h = r.gr, b = r.hr, m = r.F, y = r.br, w = r.mr, O = r.R, E = r.yr, A = r.Sr, D = r.wr, H = r.Or;
    var P = function getDirectionIsRTL(r) {
      return getStyles(r, "direction") === "rtl";
    };
    var z = function createDebouncedObservesUpdate() {
      var r;
      var e;
      var a;
      var n = cr(t, {
        p: function _debounceTiming() {
          return r;
        },
        _: function _maxDebounceTiming() {
          return e;
        },
        m: function _leading() {
          return a;
        },
        S: function _mergeParams(r, e) {
          var a = r[0];
          var n = e[0];
          return [ k(lr(a), lr(n)).reduce((function(r, e) {
            r[e] = a[e] || n[e];
            return r;
          }), {}) ];
        }
      });
      var i = function fn(t, i) {
        if (x(i)) {
          var v = i[0], o = i[1], u = i[2];
          r = v;
          e = o;
          a = u;
        } else if (S(i)) {
          r = i;
          e = false;
          a = false;
        } else {
          r = false;
          e = false;
          a = false;
        }
        n(t);
      };
      i.O = n.O;
      return i;
    };
    var M = {
      Cr: false,
      B: P(h)
    };
    var I = Ka();
    var L = Pe(La);
    var V = e({
      v: nr,
      i: {
        w: 0,
        h: 0
      }
    }, (function() {
      var e = L && L.V(r, a, M, I, n).Z;
      var t = E && O;
      var i = !t && Er(b, Ye, Ue);
      var v = !O && A(Qe);
      var o = v && be(y);
      var u = o && H();
      var c = D($e, i);
      var f = v && e && e();
      var l = ie(m);
      var s = ve(m);
      if (f) {
        f();
      }
      he(y, o);
      if (u) {
        u();
      }
      if (i) {
        c();
      }
      return {
        w: l.w + s.w,
        h: l.h + s.h
      };
    })), R = V[0];
    var F = z();
    var N = function setDirection(r) {
      var e = P(h);
      sr(r, {
        Er: s !== e
      });
      sr(M, {
        B: e
      });
      s = e;
    };
    var j = function onTrinsicChanged(r, e) {
      var a = r[0], n = r[1];
      var i = {
        Ar: n
      };
      sr(M, {
        Cr: a
      });
      if (!e) {
        t(i);
      }
      return i;
    };
    var q = function onSizeChanged(r) {
      var e = r._r, a = r.pr;
      var n = a ? t : F;
      var i = {
        _r: e || a,
        pr: a
      };
      N(i);
      n(i, v);
    };
    var U = function onContentMutation(r, e) {
      var a = R(), n = a[1];
      var t = {
        Tr: n
      };
      N(t);
      if (n && !e) {
        F(t, r ? o : i);
      }
      return t;
    };
    var B = function onHostMutation(r, e, a) {
      var n = {
        Dr: e
      };
      N(n);
      if (e && !a) {
        F(n, i);
      }
      return n;
    };
    var Y = w ? tn(b, j) : [], W = Y[0], X = Y[1];
    var Z = !O && nn(b, q, {
      pr: true
    });
    var G = en(b, false, B, {
      ur: _,
      vr: _
    }), Q = G[0], $ = G[1];
    var J = O && g && new g((function(r) {
      var e = r[r.length - 1].contentRect;
      q({
        _r: true,
        pr: fe(e, l)
      });
      l = e;
    }));
    return [ function() {
      if (J) {
        J.observe(b);
      }
      var r = Z && Z();
      var e = W && W();
      var a = Q();
      var n = I.K((function(r) {
        var e = R(), a = e[1];
        F({
          Hr: r,
          Tr: a,
          _r: E
        }, u);
      }));
      return function() {
        if (J) {
          J.disconnect();
        }
        if (r) {
          r();
        }
        if (e) {
          e();
        }
        if (f) {
          f();
        }
        a();
        n();
      };
    }, function(r) {
      var e = r.Pr, a = r.zr, n = r.Mr;
      var t = {};
      var l = e("update.ignoreMutation"), s = l[0];
      var g = e("update.attributes"), h = g[0], b = g[1];
      var y = e("update.elementEvents"), E = y[0], A = y[1];
      var D = e("update.debounce"), H = D[0], P = D[1];
      var z = A || b;
      var M = a || n;
      var I = function ignoreMutationFromOptions(r) {
        return C(s) && !!s(r);
      };
      if (z) {
        if (c) {
          c();
        }
        if (f) {
          f();
        }
        var L = en(w || m, true, U, {
          vr: k(_, h || []),
          cr: E,
          lr: d,
          dr: function _ignoreContentChange(r, e) {
            var a = r.target, n = r.attributeName;
            var t = !e && n && !O ? Rr(a, d, p) : false;
            return t || !!Lr(a, "." + da) || I(r);
          }
        }), V = L[0], R = L[1];
        f = V();
        c = R;
      }
      if (P) {
        F.O();
        if (x(H) || S(H)) {
          i = H;
          v = false;
          o = Ua;
          u = Ba;
        } else if (T(H)) {
          i = H.mutation;
          v = H.resize;
          o = H.event;
          u = H.env;
        } else {
          i = false;
          v = false;
          o = false;
          u = false;
        }
      }
      if (M) {
        var q = $();
        var Y = X && X();
        var W = c && c();
        if (q) {
          sr(t, B(q[0], q[1], M));
        }
        if (Y) {
          sr(t, j(Y[0], M));
        }
        if (W) {
          sr(t, U(W[0], M));
        }
      }
      N(t);
      return t;
    }, M ];
  };
  var on = function resolveInitialization(r, e) {
    return C(e) ? e.apply(0, r) : e;
  };
  var un = function staticInitializationElement(r, e, a, n) {
    var t = b(n) ? a : n;
    var i = on(r, t);
    return i || e.apply(0, r);
  };
  var cn = function dynamicInitializationElement(r, e, a, n) {
    var t = b(n) ? a : n;
    var i = on(r, t);
    return !!i && (D(i) ? i : e.apply(0, r));
  };
  var ln = function cancelInitialization(r, e) {
    var a = e || {}, n = a.nativeScrollbarsOverlaid, t = a.body;
    var i = Ka(), v = i.L, o = i.N, u = i.rr;
    var c = u().cancel, f = c.nativeScrollbarsOverlaid, l = c.body;
    var s = n != null ? n : f;
    var d = b(t) ? l : t;
    var p = (v.x || v.y) && s;
    var _ = r && (m(d) ? !o : d);
    return !!p || !!_;
  };
  var sn = function createScrollbarsSetupElements(r, e, a, n) {
    var t = "--os-viewport-percent";
    var i = "--os-scroll-percent";
    var v = "--os-scroll-direction";
    var o = Ka(), u = o.rr;
    var c = u(), f = c.scrollbars;
    var l = f.slot;
    var s = e.gr, d = e.hr, p = e.F, _ = e.kr, g = e.br, b = e.yr, m = e.R;
    var y = _ ? {} : r, S = y.scrollbars;
    var w = S || {}, C = w.slot;
    var x = [];
    var E = [];
    var A = [];
    var T = cn([ s, d, p ], (function() {
      return m && b ? s : d;
    }), l, C);
    var D = function initScrollTimeline(r) {
      if (h) {
        var e = null;
        var n = [];
        var t = new h({
          source: g,
          axis: r
        });
        var i = function cancelAnimation() {
          if (e) {
            e.cancel();
          }
          e = null;
        };
        var v = function _setScrollPercentAnimation(v) {
          var o = a.Ir;
          var u = Se(o)[r];
          var c = r === "x";
          var f = [ Jr(0, c), Jr("calc(-100% + 100cq" + (c ? "w" : "h") + ")", c) ];
          var l = u ? f : f.reverse();
          if (n[0] === l[0] && n[1] === l[1]) {
            return i;
          }
          n = l;
          i();
          e = v.Lr.animate({
            transform: l
          }, {
            timeline: t,
            fill: "both"
          });
          return i;
        };
        return {
          Vr: v
        };
      }
    };
    var H = {
      x: D("x"),
      y: D("y")
    };
    var P = function getViewportPercent() {
      var r = a.Rr, e = a.Fr;
      var n = function getAxisValue(r, e) {
        return gr(0, 1, r / (r + e) || 0);
      };
      return {
        x: n(e.x, r.x),
        y: n(e.y, r.y)
      };
    };
    var z = function scrollbarStructureAddRemoveClass(r, e, a) {
      var n = a ? Dr : Tr;
      each(r, (function(r) {
        n(r.Nr, e);
      }));
    };
    var M = function scrollbarStyle(r, e) {
      each(r, (function(r) {
        var a = e(r), n = a[0], t = a[1];
        setStyles(n, t);
      }));
    };
    var k = function scrollbarsAddRemoveClass(r, e, a) {
      var n = O(a);
      var t = n ? a : true;
      var i = n ? !a : true;
      if (t) {
        z(E, r, e);
      }
      if (i) {
        z(A, r, e);
      }
    };
    var L = function refreshScrollbarsHandleLength() {
      var r = P();
      var e = function createScrollbarStyleFn(r) {
        return function(e) {
          var a;
          return [ e.Nr, (a = {}, a[t] = Gr(r) + "", a) ];
        };
      };
      M(E, e(r.x));
      M(A, e(r.y));
    };
    var V = function refreshScrollbarsHandleOffset() {
      if (!h) {
        var r = a.Ir;
        var e = we(r, be(g));
        var n = function createScrollbarStyleFn(r) {
          return function(e) {
            var a;
            return [ e.Nr, (a = {}, a[i] = Gr(r) + "", a) ];
          };
        };
        M(E, n(e.x));
        M(A, n(e.y));
      }
    };
    var R = function refreshScrollbarsScrollCoordinates() {
      var r = a.Ir;
      var e = Se(r);
      var n = function createScrollbarStyleFn(r) {
        return function(e) {
          var a;
          return [ e.Nr, (a = {}, a[v] = r ? "0" : "1", a) ];
        };
      };
      M(E, n(e.x));
      M(A, n(e.y));
      if (h) {
        E.forEach(H.x.Vr);
        A.forEach(H.y.Vr);
      }
    };
    var F = function refreshScrollbarsScrollbarOffset() {
      if (m && !b) {
        var r = a.Rr, e = a.Ir;
        var n = Se(e);
        var t = we(e, be(g));
        var i = function styleScrollbarPosition(e) {
          var a = e.Nr;
          var i = Ir(a) === p && a;
          var v = function getTranslateValue(r, e, a) {
            var n = e * r;
            return Qr(a ? n : -n);
          };
          return [ i, i && {
            transform: Jr({
              x: v(t.x, r.x, n.x),
              y: v(t.y, r.y, n.y)
            })
          } ];
        };
        M(E, i);
        M(A, i);
      }
    };
    var j = function generateScrollbarDOM(r) {
      var e = r ? "x" : "y";
      var a = r ? _a : ga;
      var t = Br(da + " " + a);
      var i = Br(ha);
      var v = Br(ba);
      var o = {
        Nr: t,
        jr: i,
        Lr: v
      };
      var u = H[e];
      I(r ? E : A, o);
      I(x, [ Nr(t, i), Nr(i, v), vr(Fr, t), u && u.Vr(o), n(o, k, r) ]);
      return o;
    };
    var q = vr(j, true);
    var U = vr(j, false);
    var B = function appendElements() {
      Nr(T, E[0].Nr);
      Nr(T, A[0].Nr);
      return vr(N, x);
    };
    q();
    U();
    return [ {
      qr: L,
      Ur: V,
      Br: R,
      Yr: F,
      Wr: k,
      Xr: {
        Zr: E,
        Gr: q,
        Qr: vr(M, E)
      },
      $r: {
        Zr: A,
        Gr: U,
        Qr: vr(M, A)
      }
    }, B ];
  };
  var dn = function createScrollbarsSetupEvents(r, e, a, n, t) {
    return function(i, u, c) {
      var f = e.hr, s = e.F, d = e.R, p = e.br, _ = e.Jr, g = e.Or;
      var h = i.Nr, b = i.jr, m = i.Lr;
      var y = or(333), S = y[0], w = y[1];
      var O = or(444), x = O[0], E = O[1];
      var A = function scrollOffsetElementScrollBy(r) {
        if (C(p.scrollBy)) {
          p.scrollBy({
            behavior: "smooth",
            left: r.x,
            top: r.y
          });
        }
      };
      var T = function createInteractiveScrollEvents() {
        var e = "pointerup pointercancel lostpointercapture";
        var t = "client" + (c ? "X" : "Y");
        var i = c ? Q : $;
        var u = c ? "left" : "top";
        var f = c ? "w" : "h";
        var l = c ? "x" : "y";
        var s = [];
        return se(b, "pointerdown", n((function(n) {
          var d = Lr(n.target, "." + ba) === m;
          var h = d ? m : b;
          var y = r.scrollbars;
          var S = y[d ? "dragScroll" : "clickScroll"];
          var w = n.button, O = n.isPrimary, C = n.pointerType;
          var T = y.pointers;
          var D = w === 0 && O && S && (T || []).includes(C);
          if (D) {
            N(s);
            E();
            var H = !d && (n.shiftKey || S === "instant");
            var P = vr(oe, m);
            var z = vr(oe, b);
            var M = function getHandleOffset(r, e) {
              return (r || P())[u] - (e || z())[u];
            };
            var k = v(oe(p)[i]) / ne(p)[f] || 1;
            var L = be(p)[l];
            var V = function scrollRelative(r) {
              var e;
              he(p, (e = {}, e[l] = L + r, e));
            };
            var R = function moveHandleRelative(r) {
              var e = a.Rr;
              var n = ne(b)[f] - ne(m)[f];
              var t = 1 / k * r / n;
              V(t * e[l]);
            };
            var F = n[t];
            var j = P();
            var q = z();
            var U = j[i];
            var B = M(j, q) + U / 2;
            var Y = F - q[u];
            var W = Y - B;
            var X = d ? 0 : W;
            var Z = function releasePointerCapture(r) {
              N($);
              h.releasePointerCapture(r.pointerId);
            };
            var G = d || H;
            var Q = g();
            var $ = [ se(_, e, Z), se(_, "selectstart", (function(r) {
              return pe(r);
            }), {
              D: false
            }), se(b, e, Z), G && se(b, "pointermove", (function(r) {
              return R(X + r[t] - F);
            })), G && function() {
              var r = be(p);
              Q();
              var e = be(p);
              var a = {
                x: e.x - r.x,
                y: e.y - r.y
              };
              if (o(a.x) > 3 || o(a.y) > 3) {
                g();
                he(p, r);
                A(a);
                x(Q);
              }
            } ];
            h.setPointerCapture(n.pointerId);
            if (H) {
              R(W);
            } else if (!d) {
              var J = Pe(Ra);
              if (J) {
                var K = a.Fr;
                var rr = J(V, R, vr(M), W, K[l], S, !!c, (function(r) {
                  if (r) {
                    Q();
                  } else {
                    I($, Q);
                  }
                }));
                I($, rr);
                I(s, vr(rr, true));
              }
            }
          }
        })));
      };
      var D = true;
      return vr(N, [ se(m, "pointermove pointerleave", n(t)), se(h, "pointerenter", n((function() {
        u(Sa, true);
      }))), se(h, "pointerleave pointercancel", n((function() {
        u(Sa, false);
      }))), se(h, "wheel", n((function(r) {
        var e = r.deltaX, a = r.deltaY, n = r.deltaMode;
        if (D && n === 0 && Ir(h) === f) {
          A({
            x: e,
            y: a
          });
        }
        D = false;
        u(xa, true);
        S((function() {
          D = true;
          u(xa);
        }));
        pe(r);
      })), {
        D: false,
        H: true
      }), !d && se(h, "mousedown", n((function() {
        var r = Vr();
        if (mr(r, Xe) || mr(r, Ye) || r === document.body) {
          l(vr(Oe, s), 25);
        }
      }))), se(h, "pointerdown", (function() {
        var r = se(_, "click", (function(r) {
          e();
          _e(r);
        }), {
          P: true,
          H: true,
          D: false
        });
        var e = se(_, "pointerup pointercancel", (function() {
          e();
          setTimeout(r, 150);
        }), {
          H: true,
          D: true
        });
      }), {
        H: true,
        D: true
      }), T(), w, E ]);
    };
  };
  var pn = function createScrollbarsSetup(r, e, a, n, t, i, v) {
    var o;
    var u;
    var c;
    var f;
    var l;
    var s = _r;
    var d = 0;
    var p = [ "mouse", "pen" ];
    var _ = function skipEventIfSleeping(r) {
      return function(e) {
        if (!a.Kr) {
          r(e);
        }
      };
    };
    var g = function isHoverablePointerType(r) {
      return p.includes(r.pointerType);
    };
    var h = or(), b = h[0], m = h[1];
    var y = or(100), S = y[0], w = y[1];
    var O = or(50), C = O[0], x = O[1];
    var E = or((function() {
      return d;
    })), A = E[0], T = E[1];
    var D = sn(r, i, t, dn(e, i, t, _, (function(r) {
      return g(r) && U();
    }))), H = D[0], P = D[1];
    var z = i.hr, M = i.re, k = i.yr;
    var L = H.Wr, V = H.qr, R = H.Ur, F = H.Br, j = H.Yr;
    var q = function manageScrollbarsAutoHide(r, e) {
      T();
      var n = function hide(r) {
        if (a.Kr) {
          return;
        }
        L(Ca, r);
      };
      if (r) {
        n();
      } else {
        var t = c ? !o : true;
        if (d > 0 && !e) {
          A(vr(n, t));
        } else {
          n(t);
        }
      }
    };
    var U = function manageScrollbarsAutoHideInstantInteraction() {
      if (c ? !o : !f) {
        q(true);
        S((function() {
          q(false);
        }));
      }
    };
    var B = function onHostMouseEnter(r) {
      if (g(r)) {
        o = true;
        if (!a.Kr && c) {
          q(true);
        }
      }
    };
    var Y = function onHostMouseLeave(r) {
      if (g(r)) {
        o = false;
        if (!a.Kr && c) {
          q(false);
        }
      }
    };
    var W = function manageAutoHideSuspension(r) {
      L(Oa, r, true);
      L(Oa, r, false);
    };
    var X = [ T, w, x, m, function() {
      return s();
    }, se(z, "pointerover", B, {
      P: true
    }), se(z, "pointerenter", B), se(z, "pointerleave", Y), se(z, "pointermove", _((function(r) {
      if (g(r) && u) {
        U();
      }
    }))), se(M, "scroll", _((function(r) {
      b((function() {
        R();
        U();
      }));
      v(r);
      j();
    }))) ];
    var Z = Pe(La);
    return [ function() {
      return vr(N, I(X, P()));
    }, function(r) {
      var e = r.Pr, a = r.Mr, i = r.ee, v = r.ae;
      var o = v || {}, p = o.ne, g = o.te, h = o.ie, b = o.ve;
      var m = i || {}, y = m.Er, S = m.pr;
      var w = n.B;
      var O = Ka(), x = O.L, E = O.N;
      var A = t.oe, T = t.W;
      var D = e("showNativeOverlaidScrollbars"), H = D[0], P = D[1];
      var z = e("scrollbars.theme"), I = z[0], N = z[1];
      var U = e("scrollbars.visibility"), B = U[0], Y = U[1];
      var X = e("scrollbars.autoHide"), G = X[0], Q = X[1];
      var $ = e("scrollbars.autoHideSuspend"), K = $[0], er = $[1];
      var ar = e("scrollbars.autoHideDelay"), nr = ar[0];
      var tr = e("scrollbars.dragScroll"), ir = tr[0], or = tr[1];
      var ur = e("scrollbars.clickScroll"), cr = ur[0], fr = ur[1];
      var lr = e("overflow"), sr = lr[0], dr = lr[1];
      var pr = S && !a;
      var _r = p || g || b || y || a;
      var gr = h || Y || dr;
      var hr = H && x.x && x.y;
      var br = !E && !Z;
      var mr = hr || br;
      var yr = function setScrollbarVisibility(r, e, a) {
        var n = r.includes(rr) && (B === J || B === "auto" && e === rr);
        L(ma, n, a);
        return n;
      };
      d = nr;
      if (P || br) {
        L(sa, mr);
      }
      if (N) {
        L(l);
        L(I, true);
        l = I;
      }
      if (er || pr) {
        W(!K);
        if (pr && K) {
          if (T.x || T.y) {
            s();
            C((function() {
              s = se(M, rr, _(vr(W, true)), {
                P: true
              });
            }));
          } else {
            W(true);
          }
        }
      }
      if (Q) {
        u = G === "move";
        c = G === "leave";
        f = G === "never";
        q(f, true);
      }
      if (or) {
        L(Aa, ir);
      }
      if (fr) {
        L(Ea, !!cr);
      }
      if (gr) {
        var Sr = yr(sr.x, A.x, true);
        var wr = yr(sr.y, A.y, false);
        var Or = Sr && wr;
        L(ya, !Or);
      }
      if (_r) {
        R();
        V();
        j();
        if (b) {
          F();
        }
        L(wa, !T.x, true);
        L(wa, !T.y, false);
        L(pa, w && !k);
      }
    }, {}, H ];
  };
  var _n = function createStructureSetupElements(r) {
    var e = Ka();
    var a = e.rr, t = e.$, i = e.N;
    var v = a(), o = v.elements;
    var u = o.padding, c = o.viewport, f = o.content;
    var l = D(r);
    var s = l ? {} : r;
    var d = s.elements;
    var p = d || {}, _ = p.padding, g = p.viewport, h = p.content;
    var b = l ? r : s.target;
    var m = Mr(b);
    var y = b.ownerDocument;
    var S = y.documentElement;
    var w = function getDocumentWindow() {
      return y.defaultView || n;
    };
    var O = vr(un, [ b ]);
    var C = vr(cn, [ b ]);
    var x = vr(Br, "");
    var E = vr(O, x, c);
    var A = vr(C, x, f);
    var T = function elementHasOverflow(r) {
      var e = ne(r);
      var a = ie(r);
      var n = getStyles(r, Z);
      var t = getStyles(r, G);
      return a.w - e.w > 0 && !Pa(n) || a.h - e.h > 0 && !Pa(t);
    };
    var H = E(g);
    var P = H === b;
    var z = P && m;
    var L = !P && A(h);
    var V = !P && H === L;
    var R = z ? S : H;
    var F = z ? R : b;
    var j = !P && C(x, u, _);
    var q = !V && L;
    var U = [ q, R, j, F ].map((function(r) {
      return D(r) && !Ir(r) && r;
    }));
    var B = function elementIsGenerated(r) {
      return r && M(U, r);
    };
    var Y = !B(R) && T(R) ? R : b;
    var W = z ? S : R;
    var X = z ? y : R;
    var Q = {
      gr: b,
      hr: F,
      F: R,
      ue: j,
      mr: q,
      br: W,
      re: X,
      ce: m ? S : Y,
      Jr: y,
      yr: m,
      kr: l,
      R: P,
      fe: w,
      Sr: function _viewportHasClass(r) {
        return Er(R, Xe, r);
      },
      wr: function _viewportAddRemoveClass(r, e) {
        return xr(R, Xe, r, e);
      },
      Or: function _removeScrollObscuringStyles() {
        return xr(W, Xe, Je, true);
      }
    };
    var $ = Q.gr, J = Q.hr, K = Q.ue, rr = Q.F, er = Q.mr;
    var ar = [ er, rr, K, J, $ ];
    var nr = [ function() {
      Sr(J, [ Ye, qe ]);
      Sr($, qe);
      if (m) {
        Sr(S, [ qe, Ye ]);
      }
    } ];
    var tr = kr(ar.find((function(r) {
      return r && !B(r);
    })));
    var ir = z ? $ : er || rr;
    var or = vr(N, nr);
    var ur = function appendElements() {
      var r = w();
      var e = Vr();
      var a = function unwrap(r) {
        Nr(Ir(r), kr(r));
        Fr(r);
      };
      var n = "tabindex";
      var v = br(rr, n);
      var o = ge(k(ar, [ e ]));
      yr(J, Ye, P ? "" : We);
      yr(K, na, "");
      yr(rr, Xe, "");
      yr(er, ta, "");
      if (!P) {
        if (v || !t) {
          yr(rr, n, v || "-1");
        }
        if (m) {
          yr(S, Be, "");
        }
      }
      Nr(ir, tr);
      Nr(J, K);
      Nr(K || J, !P && rr);
      Nr(rr, er);
      I(nr, [ o, function() {
        var r = Vr();
        var e = B(rr);
        var t = e && r === rr ? $ : r;
        var i = ge(k(ar, [ t ]));
        Sr(K, na);
        Sr(er, ta);
        Sr(rr, Xe);
        if (m) {
          Sr(S, Be);
        }
        if (v) {
          yr(rr, n, v);
        } else {
          Sr(rr, n);
        }
        if (B(er)) {
          a(er);
        }
        if (e) {
          a(rr);
        }
        if (B(K)) {
          a(K);
        }
        Oe(t);
        i();
      } ]);
      if (i && !P) {
        Cr(rr, Xe, Ke);
        I(nr, vr(Sr, rr, Xe));
      }
      Oe(!P && m && e === $ && r.top === r ? rr : e);
      o();
      tr = 0;
      return or;
    };
    return [ Q, ur, or ];
  };
  var gn = function createTrinsicUpdateSegment(r) {
    var e = r.mr;
    return function(r) {
      var a = r.ee, n = r.le, t = r.Mr;
      var i = a || {}, v = i.Ar;
      var o = n.Cr;
      var u = e && (v || t);
      if (u) {
        var c;
        setStyles(e, (c = {}, c[$] = o && "100%", c));
      }
    };
  };
  var hn = function createPaddingUpdateSegment(r, a) {
    var n = r.hr, t = r.ue, i = r.F, v = r.R;
    var o = e({
      v: ir,
      i: $r()
    }, vr($r, n, "padding", "")), u = o[0], c = o[1];
    return function(r) {
      var e = r.Pr, n = r.ee, o = r.le, f = r.Mr;
      var l = c(f), s = l[0], d = l[1];
      var p = Ka(), _ = p.N;
      var g = n || {}, h = g._r, b = g.Tr, m = g.Er;
      var y = o.B;
      var S = e("paddingAbsolute"), w = S[0], O = S[1];
      var C = f || b;
      if (h || d || C) {
        var x = u(f);
        s = x[0];
        d = x[1];
      }
      var E = !v && (O || m || d);
      if (E) {
        var A, T;
        var D = !w || !t && !_;
        var H = s.r + s.l;
        var P = s.t + s.b;
        var z = (A = {}, A[W] = D && !y ? -H : 0, A[X] = D ? -P : 0, A[Y] = D && y ? -H : 0, 
        A.top = D ? -s.t : 0, A.right = D ? y ? -s.r : "auto" : 0, A.left = D ? y ? "auto" : -s.l : 0, 
        A[Q] = D && "calc(100% + " + H + "px)", A);
        var M = (T = {}, T[j] = D ? s.t : 0, T[q] = D ? s.r : 0, T[B] = D ? s.b : 0, T[U] = D ? s.l : 0, 
        T);
        setStyles(t || i, z);
        setStyles(i, M);
        sr(a, {
          ue: s,
          se: !D,
          Y: t ? M : sr({}, z, M)
        });
      }
      return {
        de: E
      };
    };
  };
  var bn = function createOverflowUpdateSegment(r, a) {
    var i = Ka();
    var v = r.hr, u = r.ue, c = r.F, l = r.R, s = r.re, d = r.br, p = r.yr, _ = r.wr, g = r.fe;
    var h = i.N;
    var b = p && l;
    var m = vr(t, 0);
    var y = {
      display: function display() {
        return false;
      },
      direction: function direction(r) {
        return r !== "ltr";
      },
      flexDirection: function flexDirection(r) {
        return r.endsWith("-reverse");
      },
      writingMode: function writingMode(r) {
        return r !== "horizontal-tb";
      }
    };
    var S = lr(y);
    var O = {
      v: nr,
      i: {
        w: 0,
        h: 0
      }
    };
    var C = {
      v: tr,
      i: {}
    };
    var x = function setMeasuringMode(r) {
      _($e, !b && r);
    };
    var E = function getFlowDirectionStyles() {
      return getStyles(c, S);
    };
    var A = function getMeasuredScrollCoordinates(r, e) {
      var a = !lr(r).length;
      var n = e ? true : S.some((function(e) {
        var a = r[e];
        return w(a) && y[e](a);
      }));
      if (a || !n || !ue(c)) {
        return {
          M: {
            x: 0,
            y: 0
          },
          k: {
            x: 1,
            y: 1
          }
        };
      }
      x(true);
      var t = be(d);
      var i = se(s, rr, (function(r) {
        var e = be(d);
        if (r.isTrusted && e.x === t.x && e.y === t.y) {
          de(r);
        }
      }), {
        H: true,
        P: true
      });
      var v = _(ra, true);
      he(d, {
        x: 0,
        y: 0
      });
      var u = _(aa, true);
      var l = be(d);
      var p = ie(d);
      he(d, {
        x: p.w,
        y: p.h
      });
      var g = be(d);
      var h = {
        x: g.x - l.x,
        y: g.y - l.y
      };
      he(d, {
        x: -p.w,
        y: -p.h
      });
      var b = be(d);
      var m = {
        x: b.x - l.x,
        y: b.y - l.y
      };
      var O = {
        x: o(h.x) >= o(m.x) ? g.x : b.x,
        y: o(h.y) >= o(m.y) ? g.y : b.y
      };
      v();
      u();
      he(d, t);
      f((function() {
        return i();
      }));
      return {
        M: l,
        k: O
      };
    };
    var T = function getOverflowAmount(r, e) {
      var a = n.devicePixelRatio % 1 !== 0 ? 1 : 0;
      var t = {
        w: m(r.w - e.w),
        h: m(r.h - e.h)
      };
      return {
        w: t.w > a ? t.w : 0,
        h: t.h > a ? t.h : 0
      };
    };
    var D = function getViewportOverflowStyle(r, e) {
      var a = function getAxisOverflowStyle(r, e, a, n) {
        var t = r === J ? K : za(r);
        var i = Pa(r);
        var v = Pa(a);
        if (!e && !n) {
          return K;
        }
        if (i && v) {
          return J;
        }
        if (i) {
          var o = e ? J : K;
          return e && n ? t : o;
        }
        var u = v && n ? J : K;
        return e ? t : u;
      };
      return {
        x: a(e.x, r.x, e.y, r.y),
        y: a(e.y, r.y, e.x, r.x)
      };
    };
    var H = function setViewportOverflowStyle(r) {
      var e = function createAllOverflowStyleClassNames(r) {
        return [ J, K, rr ].map((function(e) {
          return Ia(Ma(e), r);
        }));
      };
      var a = e(true).concat(e()).join(" ");
      _(a);
      _(lr(r).map((function(e) {
        return Ia(r[e], e === "x");
      })).join(" "), true);
    };
    var P = e(O, vr(ve, c)), z = P[0], M = P[1];
    var I = e(O, vr(ie, c)), L = I[0], V = I[1];
    var R = e(O), N = R[0], j = R[1];
    var q = e(C), U = q[0];
    var B = e(O), Y = B[0], W = B[1];
    var X = e(C), Z = X[0];
    var G = e({
      v: function _equal(r, e) {
        return ar(r, e, F(k(lr(r), lr(e))));
      },
      i: {}
    }), Q = G[0];
    var $ = e({
      v: function _equal(r, e) {
        return tr(r.M, e.M) && tr(r.k, e.k);
      },
      i: me()
    }), er = $[0], ir = $[1];
    var or = Pe(La);
    return function(e, n) {
      var t = e.Pr, o = e.ee, f = e.le, s = e.Mr;
      var d = n.de;
      var p = o || {}, y = p._r, S = p.Dr, w = p.Tr, O = p.Er, C = p.pr, P = p.Hr;
      var k = or && or.V(r, a, f, i, t);
      var I = k || {}, R = I.X, F = I.Z, q = I.G;
      var B = Ha(t, i), X = B[0], G = B[1];
      var $ = t("overflow"), J = $[0], K = $[1];
      var rr = Pa(J.x);
      var ar = Pa(J.y);
      var nr = y || d || w || O || P || G;
      var tr = M(s);
      var vr = V(s);
      var ur = j(s);
      var cr = W(s);
      if (G && h) {
        _(Ke, !X);
      }
      if (nr) {
        if (Er(v, Ye, Ue)) {
          x(true);
        }
        var fr = l ? _(ea, true) : _r;
        var lr = F && F();
        var dr = tr = z(s), pr = dr[0];
        var gr = vr = L(s), hr = gr[0];
        var br = te(c);
        var mr = b && ae(g());
        var yr = {
          w: m(hr.w + pr.w),
          h: m(hr.h + pr.h)
        };
        var Sr = {
          w: m((mr ? mr.w : br.w + m(br.w - hr.w)) + pr.w),
          h: m((mr ? mr.h : br.h + m(br.h - hr.h)) + pr.h)
        };
        fr();
        if (lr) {
          lr();
        }
        cr = Y(Sr);
        ur = N(T(yr, Sr), s);
      }
      var wr = cr, Or = wr[0], Cr = wr[1];
      var Ar = ur, Tr = Ar[0], Dr = Ar[1];
      var Hr = vr, Pr = Hr[0], zr = Hr[1];
      var Mr = tr, kr = Mr[0], Ir = Mr[1];
      var Lr = U({
        x: Tr.w > 0,
        y: Tr.h > 0
      }), Vr = Lr[0];
      var Rr = rr && ar && (Vr.x || Vr.y) || rr && Vr.x && !Vr.y || ar && Vr.y && !Vr.x;
      var Fr = d || O || P || Ir || zr || Cr || Dr || K || G || nr || S && b;
      var Nr = t("update.flowDirectionStyles"), jr = Nr[0];
      var qr = Q(jr ? jr(c) || {} : E(), s), Ur = qr[0], Br = qr[1];
      var Yr = O || C || Br || s;
      var Wr = Yr ? er(A(Ur, !!jr), s) : ir(), Xr = Wr[0], Zr = Wr[1];
      var Gr = D(Vr, J);
      x(false);
      if (Fr) {
        H(Gr);
        Gr = ka(c, Vr);
        if (q && R) {
          R(Gr, Pr, kr);
          setStyles(c, q(Gr));
        }
      }
      var Qr = Z(Gr), $r = Qr[0], Jr = Qr[1];
      xr(v, Ye, Ue, Rr);
      xr(u, na, Ue, Rr);
      sr(a, {
        oe: $r,
        Fr: {
          x: Or.w,
          y: Or.h
        },
        Rr: {
          x: Tr.w,
          y: Tr.h
        },
        W: Vr,
        Ir: ye(Xr, Tr)
      });
      return {
        ie: Jr,
        ne: Cr,
        te: Dr,
        ve: Zr || Dr
      };
    };
  };
  var mn = function createStructureSetup(r) {
    var e;
    var a = _n(r), n = a[0], t = a[1], i = a[2];
    var v = {
      ue: {
        t: 0,
        r: 0,
        b: 0,
        l: 0
      },
      se: false,
      Y: (e = {}, e[W] = 0, e[X] = 0, e[Y] = 0, e[j] = 0, e[q] = 0, e[B] = 0, e[U] = 0, 
      e),
      Fr: {
        x: 0,
        y: 0
      },
      Rr: {
        x: 0,
        y: 0
      },
      oe: {
        x: K,
        y: K
      },
      W: {
        x: false,
        y: false
      },
      Ir: me()
    };
    var o = n.gr, u = n.br, c = n.R, f = n.Or;
    var l = Ka(), s = l.N, d = l.L;
    var p = !s && (d.x || d.y);
    var _ = [ gn(n), hn(n, v), bn(n, v) ];
    return [ t, function(r) {
      var e = {};
      var a = p;
      var n = a && be(u);
      var t = n && f();
      each(_, (function(a) {
        sr(e, a(r, e) || {});
      }));
      he(u, n);
      if (t) {
        t();
      }
      if (!c) {
        he(o, 0);
      }
      return e;
    }, v, n, i ];
  };
  var yn = function createSetups(r, e, a, n) {
    var t = false;
    var i = {
      Kr: false,
      pe: false
    };
    var v = Xa(e, {});
    var o = mn(r), u = o[0], c = o[1], f = o[2], l = o[3], s = o[4];
    var d = vn(l, f, v, (function(r) {
      w({}, r);
    })), p = d[0], _ = d[1], g = d[2];
    var h = pn(r, e, i, g, f, l, n), b = h[0], m = h[1], y = h[3];
    var S = function updateHintsAreTruthy(r) {
      return lr(r).some((function(e) {
        return !!r[e];
      }));
    };
    var w = function update(r, n) {
      var v = i.Kr, o = i.pe;
      if (o || v && t) {
        return false;
      }
      var u = r._e, f = r.Mr, l = r.zr;
      var s = u || {};
      var d = !!f || !t;
      var p = {
        Pr: Xa(e, s, d),
        _e: s,
        Mr: d
      };
      var h = n || _(sr({}, p, {
        zr: l
      }));
      var b = c(sr({}, p, {
        le: g,
        ee: h
      }));
      m(sr({}, p, {
        ee: h,
        ae: b
      }));
      var y = S(h);
      var w = S(b);
      var O = y || w || !pr(s) || d;
      t = true;
      if (O) {
        a(r, {
          ee: h,
          ae: b
        });
      }
      return O;
    };
    return [ function() {
      var r = l.ce, e = l.br, a = l.Or;
      var n = be(r);
      var t = [ p(), u(), b(), function() {
        i.pe = true;
      } ];
      var v = a();
      he(e, n);
      v();
      return vr(N, t);
    }, w, function(r) {
      var e = i.Kr;
      i.Kr = r;
      if (!r && e !== r) {
        w({
          Mr: true,
          zr: true
        });
      }
    }, function() {
      m({
        Pr: Xa(e, {}, false),
        _e: {},
        Mr: false
      });
    }, function() {
      return {
        ge: i,
        he: g,
        be: f
      };
    }, {
      me: l,
      ye: y
    }, s ];
  };
  var Sn = new WeakMap;
  var wn = function addInstance(r, e) {
    Sn.set(r, e);
  };
  var On = function removeInstance(r) {
    Sn.delete(r);
  };
  var Cn = function getInstance(r) {
    return Sn.get(r);
  };
  var xn = function OverlayScrollbars(r, e, a) {
    var n = Ka(), t = n.ar;
    var i = D(r);
    var v = i ? r : r.target;
    var o = Cn(v);
    if (e && !o) {
      var u = [];
      var c = {};
      var f = function validateOptions(r) {
        var e = dr(r);
        var a = Pe(Re);
        return a ? a(e, true) : e;
      };
      var l = sr({}, t(), f(e));
      var s = xe(), d = s[0], p = s[1], _ = s[2];
      var g = xe(a), h = g[0], b = g[1], m = g[2];
      var y = function triggerEvent(r, e) {
        m(r, e);
        _(r, e);
      };
      var S = yn(r, l, (function(r, e) {
        var a = r._e, n = r.Mr;
        var t = e.ee, i = e.ae;
        var v = t._r, o = t.Er, u = t.Ar, c = t.Tr, f = t.Dr, l = t.pr;
        var s = i.ne, d = i.te, p = i.ie, _ = i.ve;
        y("updated", [ z, {
          updateHints: {
            sizeChanged: !!v,
            directionChanged: !!o,
            heightIntrinsicChanged: !!u,
            overflowEdgeChanged: !!s,
            overflowAmountChanged: !!d,
            overflowStyleChanged: !!p,
            scrollCoordinatesChanged: !!_,
            contentMutation: !!c,
            hostMutation: !!f,
            appear: !!l
          },
          changedOptions: a || {},
          force: !!n
        } ]);
      }), (function(r) {
        return y("scroll", [ z, r ]);
      })), w = S[0], O = S[1], C = S[2], x = S[3], E = S[4], A = S[5], T = S[6];
      var H = function destroy(r) {
        var e = E(), a = e.ge;
        var n = a.pe;
        if (n) {
          return;
        }
        On(v);
        N(u);
        y("destroyed", [ z, r ]);
        p();
        b();
      };
      var P = function update(r) {
        return O({
          Mr: r,
          zr: true
        });
      };
      var z = {
        options: function options(r, e) {
          if (r) {
            var a = e ? t() : {};
            var n = Wa(l, sr(a, f(r)));
            if (!pr(n)) {
              sr(l, n);
              O({
                _e: n
              });
            }
          }
          return sr({}, l);
        },
        on: h,
        off: function off(r, e) {
          if (r && e) {
            b(r, e);
          }
        },
        state: function state() {
          var r = E(), e = r.ge, a = r.he, n = r.be;
          var t = e.pe, i = e.Kr;
          var v = a.B;
          var o = n.Fr, u = n.Rr, c = n.oe, f = n.W, l = n.ue, s = n.se, d = n.Ir;
          return sr({}, {
            overflowEdge: o,
            overflowAmount: u,
            overflowStyle: c,
            hasOverflow: f,
            scrollCoordinates: {
              start: d.M,
              end: d.k
            },
            padding: l,
            paddingAbsolute: s,
            directionRTL: v,
            sleeping: i,
            destroyed: t
          });
        },
        elements: function elements() {
          var r = A.me, e = r.gr, a = r.hr, n = r.ue, t = r.F, i = r.mr, v = r.br, o = r.re;
          var u = A.ye, c = u.Xr, f = u.$r;
          var l = function translateScrollbarStructure(r) {
            var e = r.Lr, a = r.jr, n = r.Nr;
            return {
              scrollbar: n,
              track: a,
              handle: e
            };
          };
          var s = function translateScrollbarsSetupElement(r) {
            var e = r.Zr, a = r.Gr;
            var n = l(e[0]);
            return sr({}, n, {
              clone: function clone() {
                var r = l(a());
                x();
                return r;
              }
            });
          };
          return sr({}, {
            target: e,
            host: a,
            padding: n || t,
            viewport: t,
            content: i || t,
            scrollOffsetElement: v,
            scrollEventElement: o,
            scrollbarHorizontal: s(c),
            scrollbarVertical: s(f)
          });
        },
        update: P,
        destroy: vr(H, false),
        sleep: C,
        plugin: function plugin(r) {
          return c[lr(r)[0]];
        }
      };
      I(u, [ T ]);
      wn(v, z);
      De(Ee, xn, [ z, d, c ]);
      if (ln(A.me.yr, !i && r.cancel)) {
        H(true);
        return z;
      }
      I(u, w());
      y("initialized", [ z ]);
      z.update();
      return z;
    }
    return o;
  };
  xn.plugin = function(r) {
    var e = x(r);
    var a = e ? r : [ r ];
    var n = a.map((function(r) {
      return De(r, xn)[0];
    }));
    Te(a);
    return e ? n : n[0];
  };
  xn.valid = function(r) {
    var e = r && r.elements;
    var a = C(e) && e();
    return T(a) && !!Cn(a.target);
  };
  xn.env = function() {
    var r = Ka(), e = r.j, a = r.L, n = r.N, t = r.J, i = r.$, v = r.tr, o = r.ir, u = r.rr, c = r.er, f = r.ar, l = r.nr;
    return sr({}, {
      scrollbarsSize: e,
      scrollbarsOverlaid: a,
      scrollbarsHiding: n,
      scrollTimeline: t,
      focusableScrollers: i,
      staticDefaultInitialization: v,
      staticDefaultOptions: o,
      getDefaultInitialization: u,
      setDefaultInitialization: c,
      getDefaultOptions: f,
      setDefaultOptions: l
    });
  };
  xn.nonce = Qa;
  xn.trustedTypePolicy = Ur;
  r.ClickScrollPlugin = Fa;
  r.OverlayScrollbars = xn;
  r.ScrollbarsHidingPlugin = Va;
  r.SizeObserverPlugin = Da;
  return r;
}({});
//# sourceMappingURL=overlayscrollbars.browser.es5.js.map
