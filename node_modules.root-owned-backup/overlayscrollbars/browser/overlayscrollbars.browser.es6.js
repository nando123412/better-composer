/*!
 * OverlayScrollbars
 * Version: 2.17.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */
var OverlayScrollbarsGlobal = function(t) {
  "use strict";
  const createCache = (t, n) => {
    const {o: o, i: s, u: e} = t;
    let c = o;
    let r;
    const cacheUpdateContextual = (t, n) => {
      const o = c;
      const i = t;
      const l = n || (s ? !s(o, i) : o !== i);
      if (l || e) {
        c = i;
        r = o;
      }
      return [ c, l, r ];
    };
    const cacheUpdateIsolated = t => cacheUpdateContextual(n(c, r), t);
    const getCurrentCache = t => [ c, !!t, r ];
    return [ n ? cacheUpdateIsolated : cacheUpdateContextual, getCurrentCache ];
  };
  const n = typeof window !== "undefined" && typeof HTMLElement !== "undefined" && !!window.document;
  const o = n ? window : {};
  const s = Math.max;
  const e = Math.min;
  const c = Math.round;
  const r = Math.abs;
  const i = Math.sign;
  const l = o.cancelAnimationFrame;
  const a = o.requestAnimationFrame;
  const u = o.setTimeout;
  const f = o.clearTimeout;
  const getApi = t => typeof o[t] !== "undefined" ? o[t] : void 0;
  const _ = getApi("MutationObserver");
  const d = getApi("IntersectionObserver");
  const p = getApi("ResizeObserver");
  const v = getApi("ScrollTimeline");
  const isUndefined = t => t === void 0;
  const isNull = t => t === null;
  const isNumber = t => typeof t === "number";
  const isString = t => typeof t === "string";
  const isBoolean = t => typeof t === "boolean";
  const isFunction = t => typeof t === "function";
  const isArray = t => Array.isArray(t);
  const isObject = t => typeof t === "object" && !isArray(t) && !isNull(t);
  const isArrayLike = t => {
    const n = !!t && t.length;
    const o = isNumber(n) && n > -1 && n % 1 == 0;
    return isArray(t) || !isFunction(t) && o ? n > 0 && isObject(t) ? n - 1 in t : true : false;
  };
  const isPlainObject = t => !!t && t.constructor === Object;
  const isHTMLElement = t => t instanceof HTMLElement;
  const isElement = t => t instanceof Element;
  const animationCurrentTime = () => performance.now();
  const animateNumber = (t, n, o, e, c) => {
    let r = 0;
    const i = animationCurrentTime();
    const u = s(0, o);
    const frame = o => {
      const l = animationCurrentTime();
      const f = l - i;
      const _ = f >= u;
      const d = o ? 1 : 1 - (s(0, i + u - l) / u || 0);
      const p = (n - t) * (isFunction(c) ? c(d, d * u, 0, 1, u) : d) + t;
      const v = _ || d === 1;
      e(p, d, v);
      r = v ? 0 : a((() => frame()));
    };
    frame();
    return t => {
      l(r);
      if (t) {
        frame(t);
      }
    };
  };
  function each(t, n) {
    if (isArrayLike(t)) {
      for (let o = 0; o < t.length; o++) {
        if (n(t[o], o, t) === false) {
          break;
        }
      }
    } else if (t) {
      each(Object.keys(t), (o => n(t[o], o, t)));
    }
    return t;
  }
  const inArray = (t, n) => t.indexOf(n) >= 0;
  const concat = (t, n) => t.concat(n);
  const push = (t, n, o) => {
    if (!isString(n) && isArrayLike(n)) {
      Array.prototype.push.apply(t, n);
    } else {
      t.push(n);
    }
    return t;
  };
  const from = t => Array.from(t || []);
  const createOrKeepArray = t => {
    if (isArray(t)) {
      return t;
    }
    return !isString(t) && isArrayLike(t) ? from(t) : [ t ];
  };
  const isEmptyArray = t => !!t && !t.length;
  const deduplicateArray = t => from(new Set(t));
  const runEachAndClear = (t, n, o) => {
    const runFn = t => t ? t.apply(void 0, n || []) : true;
    each(t, runFn);
    if (!o) {
      t.length = 0;
    }
  };
  const g = "paddingTop";
  const h = "paddingRight";
  const b = "paddingLeft";
  const y = "paddingBottom";
  const S = "marginLeft";
  const w = "marginRight";
  const m = "marginBottom";
  const O = "overflowX";
  const C = "overflowY";
  const $ = "width";
  const x = "height";
  const H = "visible";
  const E = "hidden";
  const D = "scroll";
  const capitalizeFirstLetter = t => {
    const n = String(t || "");
    return n ? n[0].toUpperCase() + n.slice(1) : "";
  };
  const equal = (t, n, o, s) => {
    if (t && n) {
      let s = true;
      each(o, (o => {
        const e = t[o];
        const c = n[o];
        if (e !== c) {
          s = false;
        }
      }));
      return s;
    }
    return false;
  };
  const equalWH = (t, n) => equal(t, n, [ "w", "h" ]);
  const equalXY = (t, n) => equal(t, n, [ "x", "y" ]);
  const equalTRBL = (t, n) => equal(t, n, [ "t", "r", "b", "l" ]);
  const bind = (t, ...n) => t.bind(0, ...n);
  const selfClearTimeout = t => {
    let n;
    const o = t ? u : a;
    const s = t ? f : l;
    return [ e => {
      s(n);
      n = o((() => e()), isFunction(t) ? t() : t);
    }, () => s(n) ];
  };
  const getDebouncer = t => {
    const n = isFunction(t) ? t() : t;
    if (isNumber(n)) {
      const t = n ? u : a;
      const o = n ? f : l;
      return s => {
        const e = t((() => s()), n);
        return () => {
          o(e);
        };
      };
    }
    return n && n._;
  };
  const debounce = (t, n) => {
    const {p: o, v: s, S: e, m: c} = n || {};
    let r;
    let i;
    let l;
    let a;
    const u = function invokeFunctionToDebounce(n) {
      if (i) {
        i();
      }
      if (r) {
        r();
      }
      a = i = r = l = void 0;
      t.apply(this, n);
    };
    const mergeParms = t => c && l ? c(l, t) : t;
    const flush = () => {
      if (i && l) {
        u(mergeParms(l) || l);
      }
    };
    const f = function debouncedFn() {
      const t = from(arguments);
      const n = getDebouncer(o);
      if (n) {
        const o = typeof e === "function" ? e() : e;
        const c = getDebouncer(s);
        const f = mergeParms(t);
        const _ = f || t;
        const d = u.bind(0, _);
        if (i) {
          i();
        }
        if (o && !a) {
          d();
          a = true;
          i = n((() => a = void 0));
        } else {
          i = n(d);
          if (c && !r) {
            r = c(flush);
          }
        }
        l = _;
      } else {
        u(t);
      }
    };
    f.O = flush;
    return f;
  };
  const hasOwnProperty = (t, n) => Object.prototype.hasOwnProperty.call(t, n);
  const keys = t => t ? Object.keys(t) : [];
  const assignDeep = (t, n, o, s, e, c, r) => {
    const i = [ n, o, s, e, c, r ];
    if ((typeof t !== "object" || isNull(t)) && !isFunction(t)) {
      t = {};
    }
    each(i, (n => {
      each(n, ((o, s) => {
        const e = n[s];
        if (t === e) {
          return true;
        }
        const c = isArray(e);
        if (e && isPlainObject(e)) {
          const n = t[s];
          let o = n;
          if (c && !isArray(n)) {
            o = [];
          } else if (!c && !isPlainObject(n)) {
            o = {};
          }
          t[s] = assignDeep(o, e);
        } else {
          t[s] = c ? e.slice() : e;
        }
      }));
    }));
    return t;
  };
  const removeUndefinedProperties = (t, n) => each(assignDeep({}, t), ((t, n, o) => {
    if (t === void 0) {
      delete o[n];
    } else if (t && isPlainObject(t)) {
      o[n] = removeUndefinedProperties(t);
    }
  }));
  const isEmptyObject = t => !keys(t).length;
  const noop = () => {};
  const capNumber = (t, n, o) => s(t, e(n, o));
  const getDomTokensArray = t => deduplicateArray((isArray(t) ? t : (t || "").split(" ")).filter((t => t)));
  const getAttr = (t, n) => t && t.getAttribute(n);
  const hasAttr = (t, n) => t && t.hasAttribute(n);
  const setAttrs = (t, n, o) => {
    each(getDomTokensArray(n), (n => {
      if (t) {
        t.setAttribute(n, String(o || ""));
      }
    }));
  };
  const removeAttrs = (t, n) => {
    each(getDomTokensArray(n), (n => t && t.removeAttribute(n)));
  };
  const domTokenListAttr = (t, n) => {
    const o = getDomTokensArray(getAttr(t, n));
    const s = bind(setAttrs, t, n);
    const domTokenListOperation = (t, n) => {
      const s = new Set(o);
      each(getDomTokensArray(t), (t => {
        s[n](t);
      }));
      return from(s).join(" ");
    };
    return {
      C: t => s(domTokenListOperation(t, "delete")),
      $: t => s(domTokenListOperation(t, "add")),
      H: t => {
        const n = getDomTokensArray(t);
        return n.reduce(((t, n) => t && o.includes(n)), n.length > 0);
      }
    };
  };
  const removeAttrClass = (t, n, o) => {
    domTokenListAttr(t, n).C(o);
    return bind(addAttrClass, t, n, o);
  };
  const addAttrClass = (t, n, o) => {
    domTokenListAttr(t, n).$(o);
    return bind(removeAttrClass, t, n, o);
  };
  const addRemoveAttrClass = (t, n, o, s) => (s ? addAttrClass : removeAttrClass)(t, n, o);
  const hasAttrClass = (t, n, o) => domTokenListAttr(t, n).H(o);
  const createDomTokenListClass = t => domTokenListAttr(t, "class");
  const removeClass = (t, n) => {
    createDomTokenListClass(t).C(n);
  };
  const addClass = (t, n) => {
    createDomTokenListClass(t).$(n);
    return bind(removeClass, t, n);
  };
  const find = (t, n) => {
    const o = n ? isElement(n) && n : document;
    return o ? from(o.querySelectorAll(t)) : [];
  };
  const findFirst = (t, n) => {
    const o = n ? isElement(n) && n : document;
    return o && o.querySelector(t);
  };
  const is = (t, n) => isElement(t) && t.matches(n);
  const isBodyElement = t => is(t, "body");
  const contents = t => t ? from(t.childNodes) : [];
  const parent = t => t && t.parentElement;
  const closest = (t, n) => isElement(t) && t.closest(n);
  const getFocusedElement = t => document.activeElement;
  const liesBetween = (t, n, o) => {
    const s = closest(t, n);
    const e = t && findFirst(o, s);
    const c = closest(e, n) === s;
    return s && e ? s === t || e === t || c && closest(closest(t, o), n) !== s : false;
  };
  const removeElements = t => {
    each(createOrKeepArray(t), (t => {
      const n = parent(t);
      if (t && n) {
        n.removeChild(t);
      }
    }));
  };
  const appendChildren = (t, n) => bind(removeElements, t && n && each(createOrKeepArray(n), (n => {
    if (n) {
      t.appendChild(n);
    }
  })));
  let z;
  const getTrustedTypePolicy = () => z;
  const setTrustedTypePolicy = t => {
    z = t;
  };
  const createDiv = t => {
    const n = document.createElement("div");
    setAttrs(n, "class", t);
    return n;
  };
  const createDOM = t => {
    const n = createDiv();
    const o = getTrustedTypePolicy();
    const s = t.trim();
    n.innerHTML = o ? o.createHTML(s) : s;
    return each(contents(n), (t => removeElements(t)));
  };
  const getCSSVal = (t, n) => t.getPropertyValue(n) || t[n] || "";
  const validFiniteNumber = t => {
    const n = t || 0;
    return isFinite(n) ? n : 0;
  };
  const parseToZeroOrNumber = t => validFiniteNumber(parseFloat(t || ""));
  const roundCssNumber = t => Math.round(t * 1e4) / 1e4;
  const numberToCssPx = t => `${roundCssNumber(validFiniteNumber(t))}px`;
  function setStyles(t, n) {
    t && n && each(n, ((n, o) => {
      try {
        const s = t.style;
        const e = isNull(n) || isBoolean(n) ? "" : isNumber(n) ? numberToCssPx(n) : n;
        if (o.indexOf("--") === 0) {
          s.setProperty(o, e);
        } else {
          s[o] = e;
        }
      } catch (s) {}
    }));
  }
  function getStyles(t, n, s) {
    const e = isString(n);
    let c = e ? "" : {};
    if (t) {
      const r = o.getComputedStyle(t, s) || t.style;
      c = e ? getCSSVal(r, n) : from(n).reduce(((t, n) => {
        t[n] = getCSSVal(r, n);
        return t;
      }), c);
    }
    return c;
  }
  const topRightBottomLeft = (t, n, o) => {
    const s = n ? `${n}-` : "";
    const e = o ? `-${o}` : "";
    const c = `${s}top${e}`;
    const r = `${s}right${e}`;
    const i = `${s}bottom${e}`;
    const l = `${s}left${e}`;
    const a = getStyles(t, [ c, r, i, l ]);
    return {
      t: parseToZeroOrNumber(a[c]),
      r: parseToZeroOrNumber(a[r]),
      b: parseToZeroOrNumber(a[i]),
      l: parseToZeroOrNumber(a[l])
    };
  };
  const getTrasformTranslateValue = (t, n) => `translate${isObject(t) ? `(${t.x},${t.y})` : `${n ? "X" : "Y"}(${t})`}`;
  const elementHasDimensions = t => !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
  const I = {
    w: 0,
    h: 0
  };
  const getElmWidthHeightProperty = (t, n) => n ? {
    w: n[`${t}Width`],
    h: n[`${t}Height`]
  } : I;
  const getWindowSize = t => getElmWidthHeightProperty("inner", t || o);
  const A = bind(getElmWidthHeightProperty, "offset");
  const T = bind(getElmWidthHeightProperty, "client");
  const k = bind(getElmWidthHeightProperty, "scroll");
  const getFractionalSize = t => {
    const n = parseFloat(getStyles(t, $)) || 0;
    const o = parseFloat(getStyles(t, x)) || 0;
    return {
      w: n - c(n),
      h: o - c(o)
    };
  };
  const getBoundingClientRect = t => t.getBoundingClientRect();
  const hasDimensions = t => !!t && elementHasDimensions(t);
  const domRectHasDimensions = t => !!(t && (t[x] || t[$]));
  const domRectAppeared = (t, n) => {
    const o = domRectHasDimensions(t);
    const s = domRectHasDimensions(n);
    return !s && o;
  };
  const removeEventListener = (t, n, o, s) => {
    each(getDomTokensArray(n), (n => {
      if (t) {
        t.removeEventListener(n, o, s);
      }
    }));
  };
  const addEventListener = (t, n, o, s) => {
    var e;
    const c = (e = s && s.D) != null ? e : true;
    const r = s && s.I || false;
    const i = s && s.A || false;
    const l = {
      passive: c,
      capture: r
    };
    return bind(runEachAndClear, getDomTokensArray(n).map((n => {
      const s = i ? e => {
        removeEventListener(t, n, s, r);
        if (o) {
          o(e);
        }
      } : o;
      if (t) {
        t.addEventListener(n, s, l);
      }
      return bind(removeEventListener, t, n, s, r);
    })));
  };
  const stopPropagation = t => t.stopPropagation();
  const preventDefault = t => t.preventDefault();
  const stopAndPrevent = t => stopPropagation(t) || preventDefault(t);
  const swallowFocusEvents = t => bind(runEachAndClear, createOrKeepArray(t).map((t => addEventListener(t, "focusin focusout focus blur", (t => stopAndPrevent(t)), {
    I: true,
    D: false
  }))));
  const scrollElementTo = (t, n) => {
    const {x: o, y: s} = isNumber(n) ? {
      x: n,
      y: n
    } : n || {};
    isNumber(o) && (t.scrollLeft = o);
    isNumber(s) && (t.scrollTop = s);
  };
  const getElementScroll = t => ({
    x: t.scrollLeft,
    y: t.scrollTop
  });
  const getZeroScrollCoordinates = () => ({
    T: {
      x: 0,
      y: 0
    },
    k: {
      x: 0,
      y: 0
    }
  });
  const sanitizeScrollCoordinates = (t, n) => {
    const {T: o, k: s} = t;
    const {w: e, h: c} = n;
    const sanitizeAxis = (t, n, o) => {
      let s = i(t) * o;
      let e = i(n) * o;
      if (s === e) {
        const o = r(t);
        const c = r(n);
        e = o > c ? 0 : e;
        s = o < c ? 0 : s;
      }
      s = s === e ? 0 : s;
      return [ s + 0, e + 0 ];
    };
    const [l, a] = sanitizeAxis(o.x, s.x, e);
    const [u, f] = sanitizeAxis(o.y, s.y, c);
    return {
      T: {
        x: l,
        y: u
      },
      k: {
        x: a,
        y: f
      }
    };
  };
  const isDefaultDirectionScrollCoordinates = ({T: t, k: n}) => {
    const getAxis = (t, n) => t === 0 && t <= n;
    return {
      x: getAxis(t.x, n.x),
      y: getAxis(t.y, n.y)
    };
  };
  const getScrollCoordinatesPercent = ({T: t, k: n}, o) => {
    const getAxis = (t, n, o) => capNumber(0, 1, (t - o) / (t - n) || 0);
    return {
      x: getAxis(t.x, n.x, o.x),
      y: getAxis(t.y, n.y, o.y)
    };
  };
  const focusElement = t => {
    if (t && t.focus) {
      t.focus({
        preventScroll: true,
        focusVisible: false
      });
    }
  };
  const manageListener = (t, n) => {
    each(createOrKeepArray(n), t);
  };
  const createEventListenerHub = t => {
    const n = new Map;
    const removeEvent = (t, o) => {
      if (t) {
        const s = n.get(t);
        manageListener((t => {
          if (s) {
            s[t ? "delete" : "clear"](t);
          }
        }), o);
      } else {
        n.forEach((t => {
          t.clear();
        }));
        n.clear();
      }
    };
    const addEvent = (t, o) => {
      if (isString(t)) {
        const s = n.get(t) || new Set;
        n.set(t, s);
        manageListener((t => {
          if (isFunction(t)) {
            s.add(t);
          }
        }), o);
        return bind(removeEvent, t, o);
      }
      if (isBoolean(o) && o) {
        removeEvent();
      }
      const s = keys(t);
      const e = [];
      each(s, (n => {
        const o = t[n];
        if (o) {
          push(e, addEvent(n, o));
        }
      }));
      return bind(runEachAndClear, e);
    };
    const triggerEvent = (t, o) => {
      each(from(n.get(t)), (t => {
        if (o && !isEmptyArray(o)) {
          t.apply(0, o);
        } else {
          t();
        }
      }));
    };
    addEvent(t || {});
    return [ addEvent, removeEvent, triggerEvent ];
  };
  const M = {};
  const R = {};
  const addPlugins = t => {
    each(t, (t => each(t, ((n, o) => {
      M[o] = t[o];
    }))));
  };
  const registerPluginModuleInstances = (t, n, o) => keys(t).map((s => {
    const {static: e, instance: c} = t[s];
    const [r, i, l] = o || [];
    const a = o ? c : e;
    if (a) {
      const t = o ? a(r, i, n) : a(n);
      return (l || R)[s] = t;
    }
  }));
  const getInstancePluginModuleInstance = (t, n) => t[n];
  const getStaticPluginModuleInstance = t => getInstancePluginModuleInstance(R, t);
  const V = "__osOptionsValidationPlugin";
  const L = `data-overlayscrollbars`;
  const P = "os-environment";
  const U = `${P}-scrollbar-hidden`;
  const N = `${L}-initialize`;
  const q = "noClipping";
  const j = `${L}-body`;
  const B = L;
  const F = "host";
  const X = `${L}-viewport`;
  const Y = O;
  const W = C;
  const G = "arrange";
  const J = "measuring";
  const K = "scrolling";
  const Q = "scrollbarHidden";
  const Z = "noContent";
  const tt = "noScrollbars";
  const nt = "contentOverflow";
  const ot = `${L}-padding`;
  const st = `${L}-content`;
  const et = "os-size-observer";
  const ct = `${et}-appear`;
  const rt = `${et}-listener`;
  const it = `${rt}-scroll`;
  const lt = `${rt}-item`;
  const at = `${lt}-final`;
  const ut = "os-trinsic-observer";
  const ft = "os-theme-none";
  const _t = "os-scrollbar";
  const dt = `${_t}-rtl`;
  const pt = `${_t}-horizontal`;
  const vt = `${_t}-vertical`;
  const gt = `${_t}-track`;
  const ht = `${_t}-handle`;
  const bt = `${_t}-visible`;
  const yt = `${_t}-cornerless`;
  const St = `${_t}-interaction`;
  const wt = `${_t}-unusable`;
  const mt = `${_t}-auto-hide`;
  const Ot = `${mt}-hidden`;
  const Ct = `${_t}-wheel`;
  const $t = `${gt}-interactive`;
  const xt = `${ht}-interactive`;
  const Ht = "__osSizeObserverPlugin";
  const Et = /* @__PURE__ */ (() => ({
    [Ht]: {
      static: () => (t, n, o) => {
        const s = 3333333;
        const e = "scroll";
        const c = createDOM(`<div class="${lt}" dir="ltr"><div class="${lt}"><div class="${at}"></div></div><div class="${lt}"><div class="${at}" style="width: 200%; height: 200%"></div></div></div>`);
        const r = c[0];
        const i = r.lastChild;
        const u = r.firstChild;
        const f = u == null ? void 0 : u.firstChild;
        let _ = A(r);
        let d = _;
        let p = false;
        let v;
        const reset = () => {
          scrollElementTo(u, s);
          scrollElementTo(i, s);
        };
        const onResized = t => {
          v = 0;
          if (p) {
            _ = d;
            n(t === true);
          }
        };
        const onScroll = t => {
          d = A(r);
          p = !t || !equalWH(d, _);
          if (t) {
            stopPropagation(t);
            if (p && !v) {
              l(v);
              v = a(onResized);
            }
          } else {
            onResized(t === false);
          }
          reset();
        };
        const g = [ appendChildren(t, c), addEventListener(u, e, onScroll), addEventListener(i, e, onScroll) ];
        addClass(t, it);
        setStyles(f, {
          [$]: s,
          [x]: s
        });
        a(reset);
        return [ o ? bind(onScroll, false) : reset, g ];
      }
    }
  }))();
  const getShowNativeOverlaidScrollbars = (t, n) => {
    const {M: o} = n;
    const [s, e] = t("showNativeOverlaidScrollbars");
    return [ s && o.x && o.y, e ];
  };
  const overflowIsVisible = t => t.indexOf(H) === 0;
  const overflowBehaviorToOverflowStyle = t => t.replace(`${H}-`, "");
  const overflowCssValueToOverflowStyle = (t, n) => {
    if (t === "auto") {
      return n ? D : E;
    }
    const o = t || E;
    return [ E, D, H ].includes(o) ? o : E;
  };
  const getElementOverflowStyle = (t, n) => {
    const {overflowX: o, overflowY: s} = getStyles(t, [ O, C ]);
    return {
      x: overflowCssValueToOverflowStyle(o, n.x),
      y: overflowCssValueToOverflowStyle(s, n.y)
    };
  };
  const createViewportOverflowStyleClassName = (t, n) => {
    const o = n ? Y : W;
    return `${o}${capitalizeFirstLetter(t)}`;
  };
  const Dt = "__osScrollbarsHidingPlugin";
  const zt = /* @__PURE__ */ (() => ({
    [Dt]: {
      static: () => ({
        R: (t, n, o, s, e) => {
          const {V: c, L: r} = t;
          const {P: i, M: l, U: a} = s;
          const u = !c && !i && (l.x || l.y);
          const [f] = getShowNativeOverlaidScrollbars(e, s);
          const _getViewportOverflowHideOffset = t => {
            const n = i || f ? 0 : 42;
            const getHideOffsetPerAxis = (t, o, s) => {
              const e = t ? n : s;
              const c = o && !i ? e : 0;
              const r = t && !!n;
              return [ c, r ];
            };
            const [o, s] = getHideOffsetPerAxis(l.x, t.x === D, a.x);
            const [e, c] = getHideOffsetPerAxis(l.y, t.y === D, a.y);
            return {
              N: {
                x: o,
                y: e
              },
              q: {
                x: s,
                y: c
              }
            };
          };
          const _hideNativeScrollbars = t => {
            if (!c) {
              const {j: s} = o;
              const e = assignDeep({}, {
                [w]: 0,
                [m]: 0,
                [S]: 0
              });
              const {N: c, q: r} = _getViewportOverflowHideOffset(t);
              const {x: i, y: l} = r;
              const {x: a, y: f} = c;
              const {B: _} = n;
              const d = s ? S : w;
              const p = s ? b : h;
              const v = _[d];
              const g = _[m];
              const O = _[p];
              const C = _[y];
              e[$] = `calc(100% + ${f + v * -1}px)`;
              e[d] = -f + v;
              e[m] = -a + g;
              if (u) {
                e[p] = O + (l ? f : 0);
                e[y] = C + (i ? a : 0);
              }
              return e;
            }
          };
          const _arrangeViewport = (t, s, e) => {
            if (u) {
              const {B: c} = n;
              const {N: i, q: l} = _getViewportOverflowHideOffset(t);
              const {x: a, y: u} = l;
              const {x: f, y: _} = i;
              const {j: d} = o;
              const p = d ? h : b;
              const v = c[p];
              const g = c.paddingTop;
              const y = s.w + e.w;
              const S = s.h + e.h;
              const w = {
                w: _ && u ? `${_ + y - v}px` : "",
                h: f && a ? `${f + S - g}px` : ""
              };
              setStyles(r, {
                "--os-vaw": w.w,
                "--os-vah": w.h
              });
            }
            return u;
          };
          const _undoViewportArrange = () => {
            if (u) {
              const {F: t, B: o} = n;
              const s = getElementOverflowStyle(r, t);
              const {q: e} = _getViewportOverflowHideOffset(s);
              const {x: c, y: i} = e;
              const l = {};
              const assignProps = t => each(t, (t => {
                l[t] = o[t];
              }));
              if (c) {
                assignProps([ m, g, y ]);
              }
              if (i) {
                assignProps([ S, w, b, h ]);
              }
              const a = getStyles(r, keys(l));
              const u = removeAttrClass(r, X, G);
              setStyles(r, l);
              return () => {
                setStyles(r, assignDeep({}, a, _hideNativeScrollbars(s)));
                u();
              };
            }
            return noop;
          };
          return {
            X: _arrangeViewport,
            Y: _undoViewportArrange,
            W: _hideNativeScrollbars
          };
        }
      })
    }
  }))();
  const It = "__osClickScrollPlugin";
  const At = /* @__PURE__ */ (() => ({
    [It]: {
      static: () => (t, n, o, s, e, c, r, i) => {
        let l = false;
        let a = noop;
        const u = {
          clickScrollDistance: e,
          clickScrollDuration: 200,
          clickPressDelay: 150,
          pressDistanceDuration: 90
        };
        const easeOutQuad = t => 1 - (1 - t) * (1 - t);
        const easeInOutQuad = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const {clickScrollDistance: f, clickScrollDuration: _, clickPressDelay: d, pressDistanceDuration: p} = assignDeep({}, u, isFunction(c) ? c(r) : u);
        const v = f === 0;
        const g = p * 2.3;
        const h = p * 2.5;
        const b = f ? e / f : 0;
        const [y, S] = selfClearTimeout(Math.max(22, d));
        const w = o();
        const m = Math.sign(s);
        const O = animateNumber(0, v ? s : f * m, _, ((e, c, r) => {
          if (v) {
            n(e);
          } else {
            t(e);
          }
          if (r) {
            i(l);
            y((() => {
              if (l || v || !p) {
                return;
              }
              const t = o();
              const e = t - w;
              const c = e * b;
              const r = s - e;
              const i = c ? r / c : 0;
              const u = i <= 2.2;
              const f = Math.max(1, i || 0);
              const _ = (!i || i > .5) && Math.sign(r) === m;
              if (_) {
                a = animateNumber(e, u ? s : s - c, u ? g * f : p * f, ((t, o, e) => {
                  n(t);
                  if (e && !u) {
                    a = animateNumber(t, s, h, n, easeOutQuad);
                  }
                }), u && easeInOutQuad);
              }
            }));
          }
        }), easeInOutQuad);
        return t => {
          l = true;
          if (t) {
            O();
          }
          S();
          a();
        };
      }
    }
  }))();
  const opsStringify = t => JSON.stringify(t, ((t, n) => {
    if (isFunction(n)) {
      throw 0;
    }
    return n;
  }));
  const getPropByPath = (t, n) => t ? `${n}`.split(".").reduce(((t, n) => t && hasOwnProperty(t, n) ? t[n] : void 0), t) : void 0;
  const Tt = [ 0, 33 ];
  const kt = [ 33, 99 ];
  const Mt = [ 222, 666, true ];
  const Rt = {
    paddingAbsolute: false,
    showNativeOverlaidScrollbars: false,
    update: {
      elementEvents: [ [ "img", "load" ] ],
      debounce: {
        mutation: Tt,
        resize: null,
        event: kt,
        env: Mt
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
  const getOptionsDiff = (t, n) => {
    const o = {};
    const s = concat(keys(n), keys(t));
    each(s, (s => {
      const e = t[s];
      const c = n[s];
      if (isObject(e) && isObject(c)) {
        assignDeep(o[s] = {}, getOptionsDiff(e, c));
        if (isEmptyObject(o[s])) {
          delete o[s];
        }
      } else if (hasOwnProperty(n, s) && c !== e) {
        let t = true;
        if (isArray(e) || isArray(c)) {
          try {
            if (opsStringify(e) === opsStringify(c)) {
              t = false;
            }
          } catch (r) {}
        }
        if (t) {
          o[s] = c;
        }
      }
    }));
    return o;
  };
  const createOptionCheck = (t, n, o) => s => [ getPropByPath(t, s), o || getPropByPath(n, s) !== void 0 ];
  let Vt;
  const getNonce = () => Vt;
  const setNonce = t => {
    Vt = t;
  };
  let Lt;
  const createEnvironment = () => {
    const getNativeScrollbarSize = (t, n, o) => {
      appendChildren(document.body, t);
      appendChildren(document.body, t);
      const s = T(t);
      const e = A(t);
      const c = getFractionalSize(n);
      if (o) {
        removeElements(t);
      }
      return {
        x: e.h - s.h + c.h,
        y: e.w - s.w + c.w
      };
    };
    const getNativeScrollbarsHiding = t => {
      let n = false;
      const o = addClass(t, U);
      try {
        n = getStyles(t, "scrollbar-width") === "none" || getStyles(t, "display", "::-webkit-scrollbar") === "none";
      } catch (s) {}
      o();
      return n;
    };
    const getFocusableScrollers = t => {
      const getActiveElement = () => t.ownerDocument.activeElement;
      const n = getActiveElement();
      const o = swallowFocusEvents([ t, n ]);
      setStyles(t, {
        visibility: "visible"
      });
      focusElement(t);
      const s = getActiveElement() === t;
      setStyles(t, {
        visibility: ""
      });
      t.blur();
      if (isHTMLElement(n)) {
        n.focus();
      }
      o();
      return s;
    };
    const t = `.${P}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${P} div{width:200%;height:200%;margin:10px 0}.${U}{scrollbar-width:none!important}@supports not (scrollbar-width:none){.${U}::-webkit-scrollbar,.${U}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}}`;
    const n = createDOM(`<div class="${P}"><div></div><style>${t}</style></div>`);
    const s = n[0];
    const e = s.firstChild;
    const c = s.lastChild;
    const r = getNonce();
    if (r) {
      c.nonce = r;
    }
    const [i, , l] = createEventListenerHub();
    const [a, u] = createCache({
      o: getNativeScrollbarSize(s, e),
      i: equalXY
    }, bind(getNativeScrollbarSize, s, e, true));
    const [f] = u();
    const _ = getNativeScrollbarsHiding(s);
    const d = getFocusableScrollers(s);
    const p = {
      x: f.x === 0,
      y: f.y === 0
    };
    const g = {
      elements: {
        host: null,
        padding: !_,
        viewport: t => _ && isBodyElement(t) && t,
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
    const h = assignDeep({}, Rt);
    const b = bind(assignDeep, {}, h);
    const y = bind(assignDeep, {}, g);
    const S = {
      U: f,
      M: p,
      P: _,
      G: d,
      J: !!v,
      K: bind(i, "r"),
      Z: y,
      tt: t => assignDeep(g, t) && y(),
      nt: b,
      ot: t => assignDeep(h, t) && b(),
      st: assignDeep({}, g),
      et: assignDeep({}, h)
    };
    removeAttrs(s, "style");
    removeElements(s);
    addEventListener(o, "resize", (() => {
      l("r", []);
    }));
    if (isFunction(o.matchMedia) && !_ && (!p.x || !p.y)) {
      const addZoomListener = t => {
        const n = o.matchMedia(`(resolution: ${o.devicePixelRatio}dppx)`);
        addEventListener(n, "change", (() => {
          t();
          addZoomListener(t);
        }), {
          A: true
        });
      };
      addZoomListener((() => {
        const [t, n] = a();
        assignDeep(S.U, t);
        l("r", [ n ]);
      }));
    }
    return S;
  };
  const getEnvironment = () => {
    if (!Lt) {
      Lt = createEnvironment();
    }
    return Lt;
  };
  const createEventContentChange = (t, n, o) => {
    let s = false;
    const e = o ? new WeakMap : false;
    const destroy = () => {
      s = true;
    };
    const updateElements = c => {
      if (e && o) {
        const r = o.map((n => {
          const [o, s] = n || [];
          const e = s && o ? (c || find)(o, t) : [];
          return [ e, s ];
        }));
        each(r, (o => each(o[0], (c => {
          const r = o[1];
          const i = e.get(c) || [];
          const l = t.contains(c);
          if (l && r) {
            const t = addEventListener(c, r, (o => {
              if (s) {
                t();
                e.delete(c);
              } else {
                n(o);
              }
            }));
            e.set(c, push(i, t));
          } else {
            runEachAndClear(i);
            e.delete(c);
          }
        }))));
      }
    };
    updateElements();
    return [ destroy, updateElements ];
  };
  const createDOMObserver = (t, n, o, s) => {
    let e = false;
    const {ct: c, rt: r, it: i, lt: l, ut: a, ft: u} = s || {};
    const [f, d] = createEventContentChange(t, (() => e && o(true)), i);
    const p = c || [];
    const v = r || [];
    const g = concat(p, v);
    const observerCallback = (e, c) => {
      if (!isEmptyArray(c)) {
        const r = a || noop;
        const i = u || noop;
        const f = [];
        const _ = [];
        let p = false;
        let g = false;
        each(c, (o => {
          const {attributeName: e, target: c, type: a, oldValue: u, addedNodes: d, removedNodes: h} = o;
          const b = a === "attributes";
          const y = a === "childList";
          const S = t === c;
          const w = b && e;
          const m = w && getAttr(c, e || "");
          const O = isString(m) ? m : null;
          const C = w && u !== O;
          const $ = inArray(v, e) && C;
          if (n && (y || !S)) {
            const n = b && C;
            const a = n && l && is(c, l);
            const _ = a ? !r(c, e, u, O) : !b || n;
            const p = _ && !i(o, !!a, t, s);
            each(d, (t => push(f, t)));
            each(h, (t => push(f, t)));
            g = g || p;
          }
          if (!n && S && C && !r(c, e, u, O)) {
            push(_, e);
            p = p || $;
          }
        }));
        d((t => deduplicateArray(f).reduce(((n, o) => {
          push(n, find(t, o));
          return is(o, t) ? push(n, o) : n;
        }), [])));
        if (n) {
          if (!e && g) {
            o(false);
          }
          return [ false ];
        }
        if (!isEmptyArray(_) || p) {
          const t = [ deduplicateArray(_), p ];
          if (!e) {
            o.apply(0, t);
          }
          return t;
        }
      }
    };
    const h = new _(bind(observerCallback, false));
    return [ () => {
      h.observe(t, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: g,
        subtree: n,
        childList: n,
        characterData: n
      });
      e = true;
      return () => {
        if (e) {
          f();
          h.disconnect();
          e = false;
        }
      };
    }, () => {
      if (e) {
        return observerCallback(true, h.takeRecords());
      }
    } ];
  };
  let Pt = null;
  const createSizeObserver = (t, n, o) => {
    const {_t: s} = o || {};
    const e = getStaticPluginModuleInstance(Ht);
    const [c] = createCache({
      o: false,
      u: true
    });
    return () => {
      const o = [];
      const r = createDOM(`<div class="${et}"><div class="${rt}"></div></div>`);
      const i = r[0];
      const l = i.firstChild;
      const onSizeChangedCallbackProxy = t => {
        const o = isArray(t) && !isEmptyArray(t);
        let s = false;
        let e = false;
        if (o) {
          const n = t[0];
          const [o, , r] = c(n.contentRect);
          const i = domRectHasDimensions(o);
          e = domRectAppeared(o, r);
          s = !e && !i;
        } else {
          e = t === true;
        }
        if (!s) {
          n({
            dt: true,
            _t: e
          });
        }
      };
      if (p) {
        if (!isBoolean(Pt)) {
          const n = new p(noop);
          n.observe(t, {
            get box() {
              Pt = true;
            }
          });
          Pt = Pt || false;
          n.disconnect();
        }
        const n = debounce(onSizeChangedCallbackProxy, {
          p: 0,
          v: 0
        });
        const resizeObserverCallback = t => n(t);
        const s = new p(resizeObserverCallback);
        s.observe(Pt ? t : l);
        push(o, [ () => {
          s.disconnect();
        }, !Pt && appendChildren(t, i) ]);
        if (Pt) {
          const n = new p(resizeObserverCallback);
          n.observe(t, {
            box: "border-box"
          });
          push(o, (() => n.disconnect()));
        }
      } else if (e) {
        const [n, c] = e(l, onSizeChangedCallbackProxy, s);
        push(o, concat([ addClass(i, ct), addEventListener(i, "animationstart", n), appendChildren(t, i) ], c));
      } else {
        return noop;
      }
      return bind(runEachAndClear, o);
    };
  };
  const createTrinsicObserver = (t, n) => {
    let o;
    const isHeightIntrinsic = t => t.h === 0 || t.isIntersecting || t.intersectionRatio > 0;
    const s = createDiv(ut);
    const [e] = createCache({
      o: false
    });
    const triggerOnTrinsicChangedCallback = (t, o) => {
      if (t) {
        const s = e(isHeightIntrinsic(t));
        const [, c] = s;
        return c && !o && n(s) && [ s ];
      }
    };
    const intersectionObserverCallback = (t, n) => triggerOnTrinsicChangedCallback(n.pop(), t);
    return [ () => {
      const n = [];
      if (d) {
        o = new d(bind(intersectionObserverCallback, false), {
          root: t
        });
        o.observe(s);
        push(n, (() => {
          o.disconnect();
        }));
      } else {
        const onSizeChanged = () => {
          const t = A(s);
          triggerOnTrinsicChangedCallback(t);
        };
        push(n, createSizeObserver(s, onSizeChanged)());
        onSizeChanged();
      }
      return bind(runEachAndClear, push(n, appendChildren(t, s)));
    }, () => o && intersectionObserverCallback(true, o.takeRecords()) ];
  };
  const createObserversSetup = (t, n, o, s) => {
    let e;
    let c;
    let r;
    let i;
    let l;
    let a;
    let u;
    let f;
    const _ = `[${B}]`;
    const d = `[${X}]`;
    const v = [ "id", "class", "style", "open", "wrap", "cols", "rows" ];
    const {vt: g, gt: h, L: b, ht: y, bt: S, V: w, yt: m, St: O, wt: C, Ot: $} = t;
    const getDirectionIsRTL = t => getStyles(t, "direction") === "rtl";
    const createDebouncedObservesUpdate = () => {
      let t;
      let n;
      let o;
      const e = debounce(s, {
        p: () => t,
        v: () => n,
        S: () => o,
        m(t, n) {
          const [o] = t;
          const [s] = n;
          return [ concat(keys(o), keys(s)).reduce(((t, n) => {
            t[n] = o[n] || s[n];
            return t;
          }), {}) ];
        }
      });
      const fn = (s, c) => {
        if (isArray(c)) {
          const [s, e, r] = c;
          t = s;
          n = e;
          o = r;
        } else if (isNumber(c)) {
          t = c;
          n = false;
          o = false;
        } else {
          t = false;
          n = false;
          o = false;
        }
        e(s);
      };
      fn.O = e.O;
      return fn;
    };
    const x = {
      Ct: false,
      j: getDirectionIsRTL(g)
    };
    const H = getEnvironment();
    const E = getStaticPluginModuleInstance(Dt);
    const [D] = createCache({
      i: equalWH,
      o: {
        w: 0,
        h: 0
      }
    }, (() => {
      const s = E && E.R(t, n, x, H, o).Y;
      const e = m && w;
      const c = !e && hasAttrClass(h, B, q);
      const r = !w && O(G);
      const i = r && getElementScroll(y);
      const l = i && $();
      const a = C(J, c);
      const u = r && s && s();
      const f = k(b);
      const _ = getFractionalSize(b);
      if (u) {
        u();
      }
      scrollElementTo(y, i);
      if (l) {
        l();
      }
      if (c) {
        a();
      }
      return {
        w: f.w + _.w,
        h: f.h + _.h
      };
    }));
    const z = createDebouncedObservesUpdate();
    const setDirection = t => {
      const n = getDirectionIsRTL(g);
      assignDeep(t, {
        $t: f !== n
      });
      assignDeep(x, {
        j: n
      });
      f = n;
    };
    const onTrinsicChanged = (t, n) => {
      const [o, e] = t;
      const c = {
        xt: e
      };
      assignDeep(x, {
        Ct: o
      });
      if (!n) {
        s(c);
      }
      return c;
    };
    const onSizeChanged = ({dt: t, _t: n}) => {
      const o = n ? s : z;
      const e = {
        dt: t || n,
        _t: n
      };
      setDirection(e);
      o(e, c);
    };
    const onContentMutation = (t, n) => {
      const [, o] = D();
      const s = {
        Ht: o
      };
      setDirection(s);
      if (o && !n) {
        z(s, t ? r : e);
      }
      return s;
    };
    const onHostMutation = (t, n, o) => {
      const s = {
        Et: n
      };
      setDirection(s);
      if (n && !o) {
        z(s, e);
      }
      return s;
    };
    const [I, A] = S ? createTrinsicObserver(h, onTrinsicChanged) : [];
    const T = !w && createSizeObserver(h, onSizeChanged, {
      _t: true
    });
    const [M, R] = createDOMObserver(h, false, onHostMutation, {
      rt: v,
      ct: v
    });
    const V = w && p && new p((t => {
      const n = t[t.length - 1].contentRect;
      onSizeChanged({
        dt: true,
        _t: domRectAppeared(n, u)
      });
      u = n;
    }));
    return [ () => {
      if (V) {
        V.observe(h);
      }
      const t = T && T();
      const n = I && I();
      const o = M();
      const s = H.K((t => {
        const [, n] = D();
        z({
          Dt: t,
          Ht: n,
          dt: m
        }, i);
      }));
      return () => {
        if (V) {
          V.disconnect();
        }
        if (t) {
          t();
        }
        if (n) {
          n();
        }
        if (a) {
          a();
        }
        o();
        s();
      };
    }, ({zt: t, It: n, At: o}) => {
      const s = {};
      const [u] = t("update.ignoreMutation");
      const [f, p] = t("update.attributes");
      const [g, h] = t("update.elementEvents");
      const [y, m] = t("update.debounce");
      const O = h || p;
      const C = n || o;
      const ignoreMutationFromOptions = t => isFunction(u) && !!u(t);
      if (O) {
        if (l) {
          l();
        }
        if (a) {
          a();
        }
        const [t, n] = createDOMObserver(S || b, true, onContentMutation, {
          ct: concat(v, f || []),
          it: g,
          lt: _,
          ft: (t, n) => {
            const {target: o, attributeName: s} = t;
            const e = !n && s && !w ? liesBetween(o, _, d) : false;
            return e || !!closest(o, `.${_t}`) || ignoreMutationFromOptions(t);
          }
        });
        a = t();
        l = n;
      }
      if (m) {
        z.O();
        if (isArray(y) || isNumber(y)) {
          e = y;
          c = false;
          r = kt;
          i = Mt;
        } else if (isPlainObject(y)) {
          e = y.mutation;
          c = y.resize;
          r = y.event;
          i = y.env;
        } else {
          e = false;
          c = false;
          r = false;
          i = false;
        }
      }
      if (C) {
        const t = R();
        const n = A && A();
        const o = l && l();
        if (t) {
          assignDeep(s, onHostMutation(t[0], t[1], C));
        }
        if (n) {
          assignDeep(s, onTrinsicChanged(n[0], C));
        }
        if (o) {
          assignDeep(s, onContentMutation(o[0], C));
        }
      }
      setDirection(s);
      return s;
    }, x ];
  };
  const resolveInitialization = (t, n) => isFunction(n) ? n.apply(0, t) : n;
  const staticInitializationElement = (t, n, o, s) => {
    const e = isUndefined(s) ? o : s;
    const c = resolveInitialization(t, e);
    return c || n.apply(0, t);
  };
  const dynamicInitializationElement = (t, n, o, s) => {
    const e = isUndefined(s) ? o : s;
    const c = resolveInitialization(t, e);
    return !!c && (isHTMLElement(c) ? c : n.apply(0, t));
  };
  const cancelInitialization = (t, n) => {
    const {nativeScrollbarsOverlaid: o, body: s} = n || {};
    const {M: e, P: c, Z: r} = getEnvironment();
    const {nativeScrollbarsOverlaid: i, body: l} = r().cancel;
    const a = o != null ? o : i;
    const u = isUndefined(s) ? l : s;
    const f = (e.x || e.y) && a;
    const _ = t && (isNull(u) ? !c : u);
    return !!f || !!_;
  };
  const createScrollbarsSetupElements = (t, n, o, s) => {
    const e = "--os-viewport-percent";
    const c = "--os-scroll-percent";
    const r = "--os-scroll-direction";
    const {Z: i} = getEnvironment();
    const {scrollbars: l} = i();
    const {slot: a} = l;
    const {vt: u, gt: f, L: _, Tt: d, ht: p, yt: g, V: h} = n;
    const {scrollbars: b} = d ? {} : t;
    const {slot: y} = b || {};
    const S = [];
    const w = [];
    const m = [];
    const O = dynamicInitializationElement([ u, f, _ ], (() => h && g ? u : f), a, y);
    const initScrollTimeline = t => {
      if (v) {
        let n = null;
        let s = [];
        const e = new v({
          source: p,
          axis: t
        });
        const cancelAnimation = () => {
          if (n) {
            n.cancel();
          }
          n = null;
        };
        const _setScrollPercentAnimation = c => {
          const {kt: r} = o;
          const i = isDefaultDirectionScrollCoordinates(r)[t];
          const l = t === "x";
          const a = [ getTrasformTranslateValue(0, l), getTrasformTranslateValue(`calc(-100% + 100cq${l ? "w" : "h"})`, l) ];
          const u = i ? a : a.reverse();
          if (s[0] === u[0] && s[1] === u[1]) {
            return cancelAnimation;
          }
          s = u;
          cancelAnimation();
          n = c.Mt.animate({
            transform: u
          }, {
            timeline: e,
            fill: "both"
          });
          return cancelAnimation;
        };
        return {
          Rt: _setScrollPercentAnimation
        };
      }
    };
    const C = {
      x: initScrollTimeline("x"),
      y: initScrollTimeline("y")
    };
    const getViewportPercent = () => {
      const {Vt: t, Lt: n} = o;
      const getAxisValue = (t, n) => capNumber(0, 1, t / (t + n) || 0);
      return {
        x: getAxisValue(n.x, t.x),
        y: getAxisValue(n.y, t.y)
      };
    };
    const scrollbarStructureAddRemoveClass = (t, n, o) => {
      const s = o ? addClass : removeClass;
      each(t, (t => {
        s(t.Pt, n);
      }));
    };
    const scrollbarStyle = (t, n) => {
      each(t, (t => {
        const [o, s] = n(t);
        setStyles(o, s);
      }));
    };
    const scrollbarsAddRemoveClass = (t, n, o) => {
      const s = isBoolean(o);
      const e = s ? o : true;
      const c = s ? !o : true;
      if (e) {
        scrollbarStructureAddRemoveClass(w, t, n);
      }
      if (c) {
        scrollbarStructureAddRemoveClass(m, t, n);
      }
    };
    const refreshScrollbarsHandleLength = () => {
      const t = getViewportPercent();
      const createScrollbarStyleFn = t => n => [ n.Pt, {
        [e]: roundCssNumber(t) + ""
      } ];
      scrollbarStyle(w, createScrollbarStyleFn(t.x));
      scrollbarStyle(m, createScrollbarStyleFn(t.y));
    };
    const refreshScrollbarsHandleOffset = () => {
      if (!v) {
        const {kt: t} = o;
        const n = getScrollCoordinatesPercent(t, getElementScroll(p));
        const createScrollbarStyleFn = t => n => [ n.Pt, {
          [c]: roundCssNumber(t) + ""
        } ];
        scrollbarStyle(w, createScrollbarStyleFn(n.x));
        scrollbarStyle(m, createScrollbarStyleFn(n.y));
      }
    };
    const refreshScrollbarsScrollCoordinates = () => {
      const {kt: t} = o;
      const n = isDefaultDirectionScrollCoordinates(t);
      const createScrollbarStyleFn = t => n => [ n.Pt, {
        [r]: t ? "0" : "1"
      } ];
      scrollbarStyle(w, createScrollbarStyleFn(n.x));
      scrollbarStyle(m, createScrollbarStyleFn(n.y));
      if (v) {
        w.forEach(C.x.Rt);
        m.forEach(C.y.Rt);
      }
    };
    const refreshScrollbarsScrollbarOffset = () => {
      if (h && !g) {
        const {Vt: t, kt: n} = o;
        const s = isDefaultDirectionScrollCoordinates(n);
        const e = getScrollCoordinatesPercent(n, getElementScroll(p));
        const styleScrollbarPosition = n => {
          const {Pt: o} = n;
          const c = parent(o) === _ && o;
          const getTranslateValue = (t, n, o) => {
            const s = n * t;
            return numberToCssPx(o ? s : -s);
          };
          return [ c, c && {
            transform: getTrasformTranslateValue({
              x: getTranslateValue(e.x, t.x, s.x),
              y: getTranslateValue(e.y, t.y, s.y)
            })
          } ];
        };
        scrollbarStyle(w, styleScrollbarPosition);
        scrollbarStyle(m, styleScrollbarPosition);
      }
    };
    const generateScrollbarDOM = t => {
      const n = t ? "x" : "y";
      const o = t ? pt : vt;
      const e = createDiv(`${_t} ${o}`);
      const c = createDiv(gt);
      const r = createDiv(ht);
      const i = {
        Pt: e,
        Ut: c,
        Mt: r
      };
      const l = C[n];
      push(t ? w : m, i);
      push(S, [ appendChildren(e, c), appendChildren(c, r), bind(removeElements, e), l && l.Rt(i), s(i, scrollbarsAddRemoveClass, t) ]);
      return i;
    };
    const $ = bind(generateScrollbarDOM, true);
    const x = bind(generateScrollbarDOM, false);
    const appendElements = () => {
      appendChildren(O, w[0].Pt);
      appendChildren(O, m[0].Pt);
      return bind(runEachAndClear, S);
    };
    $();
    x();
    return [ {
      Nt: refreshScrollbarsHandleLength,
      qt: refreshScrollbarsHandleOffset,
      jt: refreshScrollbarsScrollCoordinates,
      Bt: refreshScrollbarsScrollbarOffset,
      Ft: scrollbarsAddRemoveClass,
      Xt: {
        Yt: w,
        Wt: $,
        Gt: bind(scrollbarStyle, w)
      },
      Jt: {
        Yt: m,
        Wt: x,
        Gt: bind(scrollbarStyle, m)
      }
    }, appendElements ];
  };
  const createScrollbarsSetupEvents = (t, n, o, s, e) => (i, l, a) => {
    const {gt: f, L: _, V: d, ht: p, Kt: v, Ot: g} = n;
    const {Pt: h, Ut: b, Mt: y} = i;
    const [S, w] = selfClearTimeout(333);
    const [m, O] = selfClearTimeout(444);
    const scrollOffsetElementScrollBy = t => {
      if (isFunction(p.scrollBy)) {
        p.scrollBy({
          behavior: "smooth",
          left: t.x,
          top: t.y
        });
      }
    };
    const createInteractiveScrollEvents = () => {
      const n = "pointerup pointercancel lostpointercapture";
      const e = `client${a ? "X" : "Y"}`;
      const i = a ? $ : x;
      const l = a ? "left" : "top";
      const u = a ? "w" : "h";
      const f = a ? "x" : "y";
      const _ = [];
      return addEventListener(b, "pointerdown", s((s => {
        const d = closest(s.target, `.${ht}`) === y;
        const h = d ? y : b;
        const S = t.scrollbars;
        const w = S[d ? "dragScroll" : "clickScroll"];
        const {button: C, isPrimary: $, pointerType: x} = s;
        const {pointers: H} = S;
        const E = C === 0 && $ && w && (H || []).includes(x);
        if (E) {
          runEachAndClear(_);
          O();
          const t = !d && (s.shiftKey || w === "instant");
          const S = bind(getBoundingClientRect, y);
          const C = bind(getBoundingClientRect, b);
          const getHandleOffset = (t, n) => (t || S())[l] - (n || C())[l];
          const $ = c(getBoundingClientRect(p)[i]) / A(p)[u] || 1;
          const x = getElementScroll(p)[f];
          const scrollRelative = t => {
            scrollElementTo(p, {
              [f]: x + t
            });
          };
          const moveHandleRelative = t => {
            const {Vt: n} = o;
            const s = A(b)[u] - A(y)[u];
            const e = 1 / $ * t / s;
            scrollRelative(e * n[f]);
          };
          const H = s[e];
          const E = S();
          const D = C();
          const z = E[i];
          const I = getHandleOffset(E, D) + z / 2;
          const T = H - D[l];
          const k = T - I;
          const M = d ? 0 : k;
          const releasePointerCapture = t => {
            runEachAndClear(L);
            h.releasePointerCapture(t.pointerId);
          };
          const R = d || t;
          const V = g();
          const L = [ addEventListener(v, n, releasePointerCapture), addEventListener(v, "selectstart", (t => preventDefault(t)), {
            D: false
          }), addEventListener(b, n, releasePointerCapture), R && addEventListener(b, "pointermove", (t => moveHandleRelative(M + t[e] - H))), R && (() => {
            const t = getElementScroll(p);
            V();
            const n = getElementScroll(p);
            const o = {
              x: n.x - t.x,
              y: n.y - t.y
            };
            if (r(o.x) > 3 || r(o.y) > 3) {
              g();
              scrollElementTo(p, t);
              scrollOffsetElementScrollBy(o);
              m(V);
            }
          }) ];
          h.setPointerCapture(s.pointerId);
          if (t) {
            moveHandleRelative(k);
          } else if (!d) {
            const t = getStaticPluginModuleInstance(It);
            if (t) {
              const {Lt: n} = o;
              const s = t(scrollRelative, moveHandleRelative, bind(getHandleOffset), k, n[f], w, !!a, (t => {
                if (t) {
                  V();
                } else {
                  push(L, V);
                }
              }));
              push(L, s);
              push(_, bind(s, true));
            }
          }
        }
      })));
    };
    let C = true;
    return bind(runEachAndClear, [ addEventListener(y, "pointermove pointerleave", s(e)), addEventListener(h, "pointerenter", s((() => {
      l(St, true);
    }))), addEventListener(h, "pointerleave pointercancel", s((() => {
      l(St, false);
    }))), addEventListener(h, "wheel", s((t => {
      const {deltaX: n, deltaY: o, deltaMode: s} = t;
      if (C && s === 0 && parent(h) === f) {
        scrollOffsetElementScrollBy({
          x: n,
          y: o
        });
      }
      C = false;
      l(Ct, true);
      S((() => {
        C = true;
        l(Ct);
      }));
      preventDefault(t);
    })), {
      D: false,
      I: true
    }), !d && addEventListener(h, "mousedown", s((() => {
      const t = getFocusedElement();
      if (hasAttr(t, X) || hasAttr(t, B) || t === document.body) {
        u(bind(focusElement, _), 25);
      }
    }))), addEventListener(h, "pointerdown", (() => {
      const t = addEventListener(v, "click", (t => {
        n();
        stopAndPrevent(t);
      }), {
        A: true,
        I: true,
        D: false
      });
      const n = addEventListener(v, "pointerup pointercancel", (() => {
        n();
        setTimeout(t, 150);
      }), {
        I: true,
        D: true
      });
    }), {
      I: true,
      D: true
    }), createInteractiveScrollEvents(), w, O ]);
  };
  const createScrollbarsSetup = (t, n, o, s, e, c, r) => {
    let i;
    let l;
    let a;
    let u;
    let f;
    let _ = noop;
    let d = 0;
    const p = [ "mouse", "pen" ];
    const skipEventIfSleeping = t => n => {
      if (!o.Qt) {
        t(n);
      }
    };
    const isHoverablePointerType = t => p.includes(t.pointerType);
    const [v, g] = selfClearTimeout();
    const [h, b] = selfClearTimeout(100);
    const [y, S] = selfClearTimeout(50);
    const [w, m] = selfClearTimeout((() => d));
    const [O, C] = createScrollbarsSetupElements(t, c, e, createScrollbarsSetupEvents(n, c, e, skipEventIfSleeping, (t => isHoverablePointerType(t) && manageScrollbarsAutoHideInstantInteraction())));
    const {gt: $, Zt: x, yt: E} = c;
    const {Ft: z, Nt: I, qt: A, jt: T, Bt: k} = O;
    const manageScrollbarsAutoHide = (t, n) => {
      m();
      const hide = t => {
        if (o.Qt) {
          return;
        }
        z(Ot, t);
      };
      if (t) {
        hide();
      } else {
        const t = a ? !i : true;
        if (d > 0 && !n) {
          w(bind(hide, t));
        } else {
          hide(t);
        }
      }
    };
    const manageScrollbarsAutoHideInstantInteraction = () => {
      if (a ? !i : !u) {
        manageScrollbarsAutoHide(true);
        h((() => {
          manageScrollbarsAutoHide(false);
        }));
      }
    };
    const onHostMouseEnter = t => {
      if (isHoverablePointerType(t)) {
        i = true;
        if (!o.Qt && a) {
          manageScrollbarsAutoHide(true);
        }
      }
    };
    const onHostMouseLeave = t => {
      if (isHoverablePointerType(t)) {
        i = false;
        if (!o.Qt && a) {
          manageScrollbarsAutoHide(false);
        }
      }
    };
    const manageAutoHideSuspension = t => {
      z(mt, t, true);
      z(mt, t, false);
    };
    const M = [ m, b, S, g, () => _(), addEventListener($, "pointerover", onHostMouseEnter, {
      A: true
    }), addEventListener($, "pointerenter", onHostMouseEnter), addEventListener($, "pointerleave", onHostMouseLeave), addEventListener($, "pointermove", skipEventIfSleeping((t => {
      if (isHoverablePointerType(t) && l) {
        manageScrollbarsAutoHideInstantInteraction();
      }
    }))), addEventListener(x, "scroll", skipEventIfSleeping((t => {
      v((() => {
        A();
        manageScrollbarsAutoHideInstantInteraction();
      }));
      r(t);
      k();
    }))) ];
    const R = getStaticPluginModuleInstance(Dt);
    return [ () => bind(runEachAndClear, push(M, C())), ({zt: t, At: n, tn: o, nn: c}) => {
      const {sn: r, en: i, cn: p, rn: v} = c || {};
      const {$t: g, _t: h} = o || {};
      const {j: b} = s;
      const {M: S, P: w} = getEnvironment();
      const {ln: m, F: O} = e;
      const [C, $] = t("showNativeOverlaidScrollbars");
      const [M, V] = t("scrollbars.theme");
      const [L, P] = t("scrollbars.visibility");
      const [U, N] = t("scrollbars.autoHide");
      const [q, j] = t("scrollbars.autoHideSuspend");
      const [B] = t("scrollbars.autoHideDelay");
      const [F, X] = t("scrollbars.dragScroll");
      const [Y, W] = t("scrollbars.clickScroll");
      const [G, J] = t("overflow");
      const K = h && !n;
      const Q = r || i || v || g || n;
      const Z = p || P || J;
      const tt = C && S.x && S.y;
      const nt = !w && !R;
      const ot = tt || nt;
      const setScrollbarVisibility = (t, n, o) => {
        const s = t.includes(D) && (L === H || L === "auto" && n === D);
        z(bt, s, o);
        return s;
      };
      d = B;
      if ($ || nt) {
        z(ft, ot);
      }
      if (V) {
        z(f);
        z(M, true);
        f = M;
      }
      if (j || K) {
        manageAutoHideSuspension(!q);
        if (K && q) {
          if (O.x || O.y) {
            _();
            y((() => {
              _ = addEventListener(x, D, skipEventIfSleeping(bind(manageAutoHideSuspension, true)), {
                A: true
              });
            }));
          } else {
            manageAutoHideSuspension(true);
          }
        }
      }
      if (N) {
        l = U === "move";
        a = U === "leave";
        u = U === "never";
        manageScrollbarsAutoHide(u, true);
      }
      if (X) {
        z(xt, F);
      }
      if (W) {
        z($t, !!Y);
      }
      if (Z) {
        const t = setScrollbarVisibility(G.x, m.x, true);
        const n = setScrollbarVisibility(G.y, m.y, false);
        const o = t && n;
        z(yt, !o);
      }
      if (Q) {
        A();
        I();
        k();
        if (v) {
          T();
        }
        z(wt, !O.x, true);
        z(wt, !O.y, false);
        z(dt, b && !E);
      }
    }, {}, O ];
  };
  const createStructureSetupElements = t => {
    const n = getEnvironment();
    const {Z: s, G: e, P: c} = n;
    const {elements: r} = s();
    const {padding: i, viewport: l, content: a} = r;
    const u = isHTMLElement(t);
    const f = u ? {} : t;
    const {elements: _} = f;
    const {padding: d, viewport: p, content: v} = _ || {};
    const g = u ? t : f.target;
    const h = isBodyElement(g);
    const b = g.ownerDocument;
    const y = b.documentElement;
    const getDocumentWindow = () => b.defaultView || o;
    const S = bind(staticInitializationElement, [ g ]);
    const w = bind(dynamicInitializationElement, [ g ]);
    const m = bind(createDiv, "");
    const $ = bind(S, m, l);
    const x = bind(w, m, a);
    const elementHasOverflow = t => {
      const n = A(t);
      const o = k(t);
      const s = getStyles(t, O);
      const e = getStyles(t, C);
      return o.w - n.w > 0 && !overflowIsVisible(s) || o.h - n.h > 0 && !overflowIsVisible(e);
    };
    const H = $(p);
    const E = H === g;
    const D = E && h;
    const z = !E && x(v);
    const I = !E && H === z;
    const T = D ? y : H;
    const M = D ? T : g;
    const R = !E && w(m, i, d);
    const V = !I && z;
    const L = [ V, T, R, M ].map((t => isHTMLElement(t) && !parent(t) && t));
    const elementIsGenerated = t => t && inArray(L, t);
    const P = !elementIsGenerated(T) && elementHasOverflow(T) ? T : g;
    const U = D ? y : T;
    const q = D ? b : T;
    const Y = {
      vt: g,
      gt: M,
      L: T,
      an: R,
      bt: V,
      ht: U,
      Zt: q,
      un: h ? y : P,
      Kt: b,
      yt: h,
      Tt: u,
      V: E,
      fn: getDocumentWindow,
      St: t => hasAttrClass(T, X, t),
      wt: (t, n) => addRemoveAttrClass(T, X, t, n),
      Ot: () => addRemoveAttrClass(U, X, K, true)
    };
    const {vt: W, gt: G, an: J, L: Z, bt: tt} = Y;
    const nt = [ tt, Z, J, G, W ];
    const et = [ () => {
      removeAttrs(G, [ B, N ]);
      removeAttrs(W, N);
      if (h) {
        removeAttrs(y, [ N, B ]);
      }
    } ];
    let ct = contents(nt.find((t => t && !elementIsGenerated(t))));
    const rt = D ? W : tt || Z;
    const it = bind(runEachAndClear, et);
    const appendElements = () => {
      const t = getDocumentWindow();
      const n = getFocusedElement();
      const unwrap = t => {
        appendChildren(parent(t), contents(t));
        removeElements(t);
      };
      const o = "tabindex";
      const s = getAttr(Z, o);
      const r = swallowFocusEvents(concat(nt, [ n ]));
      setAttrs(G, B, E ? "" : F);
      setAttrs(J, ot, "");
      setAttrs(Z, X, "");
      setAttrs(tt, st, "");
      if (!E) {
        if (s || !e) {
          setAttrs(Z, o, s || "-1");
        }
        if (h) {
          setAttrs(y, j, "");
        }
      }
      appendChildren(rt, ct);
      appendChildren(G, J);
      appendChildren(J || G, !E && Z);
      appendChildren(Z, tt);
      push(et, [ r, () => {
        const t = getFocusedElement();
        const n = elementIsGenerated(Z);
        const e = n && t === Z ? W : t;
        const c = swallowFocusEvents(concat(nt, [ e ]));
        removeAttrs(J, ot);
        removeAttrs(tt, st);
        removeAttrs(Z, X);
        if (h) {
          removeAttrs(y, j);
        }
        if (s) {
          setAttrs(Z, o, s);
        } else {
          removeAttrs(Z, o);
        }
        if (elementIsGenerated(tt)) {
          unwrap(tt);
        }
        if (n) {
          unwrap(Z);
        }
        if (elementIsGenerated(J)) {
          unwrap(J);
        }
        focusElement(e);
        c();
      } ]);
      if (c && !E) {
        addAttrClass(Z, X, Q);
        push(et, bind(removeAttrs, Z, X));
      }
      focusElement(!E && h && n === W && t.top === t ? Z : n);
      r();
      ct = 0;
      return it;
    };
    return [ Y, appendElements, it ];
  };
  const createTrinsicUpdateSegment = ({bt: t}) => ({tn: n, _n: o, At: s}) => {
    const {xt: e} = n || {};
    const {Ct: c} = o;
    const r = t && (e || s);
    if (r) {
      setStyles(t, {
        [x]: c && "100%"
      });
    }
  };
  const createPaddingUpdateSegment = ({gt: t, an: n, L: o, V: s}, e) => {
    const [c, r] = createCache({
      i: equalTRBL,
      o: topRightBottomLeft()
    }, bind(topRightBottomLeft, t, "padding", ""));
    return ({zt: t, tn: i, _n: l, At: a}) => {
      let [u, f] = r(a);
      const {P: _} = getEnvironment();
      const {dt: d, Ht: p, $t: v} = i || {};
      const {j: O} = l;
      const [C, x] = t("paddingAbsolute");
      const H = a || p;
      if (d || f || H) {
        [u, f] = c(a);
      }
      const E = !s && (x || v || f);
      if (E) {
        const t = !C || !n && !_;
        const s = u.r + u.l;
        const c = u.t + u.b;
        const r = {
          [w]: t && !O ? -s : 0,
          [m]: t ? -c : 0,
          [S]: t && O ? -s : 0,
          top: t ? -u.t : 0,
          right: t ? O ? -u.r : "auto" : 0,
          left: t ? O ? "auto" : -u.l : 0,
          [$]: t && `calc(100% + ${s}px)`
        };
        const i = {
          [g]: t ? u.t : 0,
          [h]: t ? u.r : 0,
          [y]: t ? u.b : 0,
          [b]: t ? u.l : 0
        };
        setStyles(n || o, r);
        setStyles(o, i);
        assignDeep(e, {
          an: u,
          dn: !t,
          B: n ? i : assignDeep({}, r, i)
        });
      }
      return {
        pn: E
      };
    };
  };
  const createOverflowUpdateSegment = (t, n) => {
    const e = getEnvironment();
    const {gt: c, an: i, L: l, V: u, Zt: f, ht: _, yt: d, wt: p, fn: v} = t;
    const {P: g} = e;
    const h = d && u;
    const b = bind(s, 0);
    const y = {
      display: () => false,
      direction: t => t !== "ltr",
      flexDirection: t => t.endsWith("-reverse"),
      writingMode: t => t !== "horizontal-tb"
    };
    const S = keys(y);
    const w = {
      i: equalWH,
      o: {
        w: 0,
        h: 0
      }
    };
    const m = {
      i: equalXY,
      o: {}
    };
    const setMeasuringMode = t => {
      p(J, !h && t);
    };
    const getFlowDirectionStyles = () => getStyles(l, S);
    const getMeasuredScrollCoordinates = (t, n) => {
      const o = !keys(t).length;
      const s = n ? true : S.some((n => {
        const o = t[n];
        return isString(o) && y[n](o);
      }));
      if (o || !s || !hasDimensions(l)) {
        return {
          T: {
            x: 0,
            y: 0
          },
          k: {
            x: 1,
            y: 1
          }
        };
      }
      setMeasuringMode(true);
      const e = getElementScroll(_);
      const c = addEventListener(f, D, (t => {
        const n = getElementScroll(_);
        if (t.isTrusted && n.x === e.x && n.y === e.y) {
          stopPropagation(t);
        }
      }), {
        I: true,
        A: true
      });
      const i = p(Z, true);
      scrollElementTo(_, {
        x: 0,
        y: 0
      });
      const u = p(nt, true);
      const d = getElementScroll(_);
      const v = k(_);
      scrollElementTo(_, {
        x: v.w,
        y: v.h
      });
      const g = getElementScroll(_);
      const h = {
        x: g.x - d.x,
        y: g.y - d.y
      };
      scrollElementTo(_, {
        x: -v.w,
        y: -v.h
      });
      const b = getElementScroll(_);
      const w = {
        x: b.x - d.x,
        y: b.y - d.y
      };
      const m = {
        x: r(h.x) >= r(w.x) ? g.x : b.x,
        y: r(h.y) >= r(w.y) ? g.y : b.y
      };
      i();
      u();
      scrollElementTo(_, e);
      a((() => c()));
      return {
        T: d,
        k: m
      };
    };
    const getOverflowAmount = (t, n) => {
      const s = o.devicePixelRatio % 1 !== 0 ? 1 : 0;
      const e = {
        w: b(t.w - n.w),
        h: b(t.h - n.h)
      };
      return {
        w: e.w > s ? e.w : 0,
        h: e.h > s ? e.h : 0
      };
    };
    const getViewportOverflowStyle = (t, n) => {
      const getAxisOverflowStyle = (t, n, o, s) => {
        const e = t === H ? E : overflowBehaviorToOverflowStyle(t);
        const c = overflowIsVisible(t);
        const r = overflowIsVisible(o);
        if (!n && !s) {
          return E;
        }
        if (c && r) {
          return H;
        }
        if (c) {
          const t = n ? H : E;
          return n && s ? e : t;
        }
        const i = r && s ? H : E;
        return n ? e : i;
      };
      return {
        x: getAxisOverflowStyle(n.x, t.x, n.y, t.y),
        y: getAxisOverflowStyle(n.y, t.y, n.x, t.x)
      };
    };
    const setViewportOverflowStyle = t => {
      const createAllOverflowStyleClassNames = t => [ H, E, D ].map((n => createViewportOverflowStyleClassName(overflowCssValueToOverflowStyle(n), t)));
      const n = createAllOverflowStyleClassNames(true).concat(createAllOverflowStyleClassNames()).join(" ");
      p(n);
      p(keys(t).map((n => createViewportOverflowStyleClassName(t[n], n === "x"))).join(" "), true);
    };
    const [O, C] = createCache(w, bind(getFractionalSize, l));
    const [$, x] = createCache(w, bind(k, l));
    const [z, I] = createCache(w);
    const [A] = createCache(m);
    const [M, R] = createCache(w);
    const [V] = createCache(m);
    const [L] = createCache({
      i: (t, n) => equal(t, n, deduplicateArray(concat(keys(t), keys(n)))),
      o: {}
    });
    const [P, U] = createCache({
      i: (t, n) => equalXY(t.T, n.T) && equalXY(t.k, n.k),
      o: getZeroScrollCoordinates()
    });
    const N = getStaticPluginModuleInstance(Dt);
    return ({zt: o, tn: s, _n: r, At: a}, {pn: f}) => {
      const {dt: _, Et: d, Ht: y, $t: S, _t: w, Dt: m} = s || {};
      const H = N && N.R(t, n, r, e, o);
      const {X: E, Y: D, W: k} = H || {};
      const [j, F] = getShowNativeOverlaidScrollbars(o, e);
      const [X, Y] = o("overflow");
      const W = overflowIsVisible(X.x);
      const G = overflowIsVisible(X.y);
      const J = _ || f || y || S || m || F;
      let K = C(a);
      let Z = x(a);
      let nt = I(a);
      let st = R(a);
      if (F && g) {
        p(Q, !j);
      }
      if (J) {
        if (hasAttrClass(c, B, q)) {
          setMeasuringMode(true);
        }
        const t = u ? p(tt, true) : noop;
        const n = D && D();
        const [o] = K = O(a);
        const [s] = Z = $(a);
        const e = T(l);
        const r = h && getWindowSize(v());
        const i = {
          w: b(s.w + o.w),
          h: b(s.h + o.h)
        };
        const f = {
          w: b((r ? r.w : e.w + b(e.w - s.w)) + o.w),
          h: b((r ? r.h : e.h + b(e.h - s.h)) + o.h)
        };
        t();
        if (n) {
          n();
        }
        st = M(f);
        nt = z(getOverflowAmount(i, f), a);
      }
      const [et, ct] = st;
      const [rt, it] = nt;
      const [lt, at] = Z;
      const [ut, ft] = K;
      const [_t] = A({
        x: rt.w > 0,
        y: rt.h > 0
      });
      const dt = W && G && (_t.x || _t.y) || W && _t.x && !_t.y || G && _t.y && !_t.x;
      const pt = f || S || m || ft || at || ct || it || Y || F || J || d && h;
      const [vt] = o("update.flowDirectionStyles");
      const [gt, ht] = L(vt ? vt(l) || {} : getFlowDirectionStyles(), a);
      const bt = S || w || ht || a;
      const [yt, St] = bt ? P(getMeasuredScrollCoordinates(gt, !!vt), a) : U();
      let wt = getViewportOverflowStyle(_t, X);
      setMeasuringMode(false);
      if (pt) {
        setViewportOverflowStyle(wt);
        wt = getElementOverflowStyle(l, _t);
        if (k && E) {
          E(wt, lt, ut);
          setStyles(l, k(wt));
        }
      }
      const [mt, Ot] = V(wt);
      addRemoveAttrClass(c, B, q, dt);
      addRemoveAttrClass(i, ot, q, dt);
      assignDeep(n, {
        ln: mt,
        Lt: {
          x: et.w,
          y: et.h
        },
        Vt: {
          x: rt.w,
          y: rt.h
        },
        F: _t,
        kt: sanitizeScrollCoordinates(yt, rt)
      });
      return {
        cn: Ot,
        sn: ct,
        en: it,
        rn: St || it
      };
    };
  };
  const createStructureSetup = t => {
    const [n, o, s] = createStructureSetupElements(t);
    const e = {
      an: {
        t: 0,
        r: 0,
        b: 0,
        l: 0
      },
      dn: false,
      B: {
        [w]: 0,
        [m]: 0,
        [S]: 0,
        [g]: 0,
        [h]: 0,
        [y]: 0,
        [b]: 0
      },
      Lt: {
        x: 0,
        y: 0
      },
      Vt: {
        x: 0,
        y: 0
      },
      ln: {
        x: E,
        y: E
      },
      F: {
        x: false,
        y: false
      },
      kt: getZeroScrollCoordinates()
    };
    const {vt: c, ht: r, V: i, Ot: l} = n;
    const {P: a, M: u} = getEnvironment();
    const f = !a && (u.x || u.y);
    const _ = [ createTrinsicUpdateSegment(n), createPaddingUpdateSegment(n, e), createOverflowUpdateSegment(n, e) ];
    return [ o, t => {
      const n = {};
      const o = f;
      const s = o && getElementScroll(r);
      const e = s && l();
      each(_, (o => {
        assignDeep(n, o(t, n) || {});
      }));
      scrollElementTo(r, s);
      if (e) {
        e();
      }
      if (!i) {
        scrollElementTo(c, 0);
      }
      return n;
    }, e, n, s ];
  };
  const createSetups = (t, n, o, s) => {
    let e = false;
    const c = {
      Qt: false,
      vn: false
    };
    const r = createOptionCheck(n, {});
    const [i, l, a, u, f] = createStructureSetup(t);
    const [_, d, p] = createObserversSetup(u, a, r, (t => {
      update({}, t);
    }));
    const [v, g, , h] = createScrollbarsSetup(t, n, c, p, a, u, s);
    const updateHintsAreTruthy = t => keys(t).some((n => !!t[n]));
    const update = (t, s) => {
      const {Qt: r, vn: i} = c;
      if (i || r && e) {
        return false;
      }
      const {gn: a, At: u, It: f} = t;
      const _ = a || {};
      const v = !!u || !e;
      const h = {
        zt: createOptionCheck(n, _, v),
        gn: _,
        At: v
      };
      const b = s || d(assignDeep({}, h, {
        It: f
      }));
      const y = l(assignDeep({}, h, {
        _n: p,
        tn: b
      }));
      g(assignDeep({}, h, {
        tn: b,
        nn: y
      }));
      const S = updateHintsAreTruthy(b);
      const w = updateHintsAreTruthy(y);
      const m = S || w || !isEmptyObject(_) || v;
      e = true;
      if (m) {
        o(t, {
          tn: b,
          nn: y
        });
      }
      return m;
    };
    return [ () => {
      const {un: t, ht: n, Ot: o} = u;
      const s = getElementScroll(t);
      const e = [ _(), i(), v(), () => {
        c.vn = true;
      } ];
      const r = o();
      scrollElementTo(n, s);
      r();
      return bind(runEachAndClear, e);
    }, update, t => {
      const n = c.Qt;
      c.Qt = t;
      if (!t && n !== t) {
        update({
          At: true,
          It: true
        });
      }
    }, () => {
      g({
        zt: createOptionCheck(n, {}, false),
        gn: {},
        At: false
      });
    }, () => ({
      hn: c,
      bn: p,
      yn: a
    }), {
      Sn: u,
      wn: h
    }, f ];
  };
  const Ut = new WeakMap;
  const addInstance = (t, n) => {
    Ut.set(t, n);
  };
  const removeInstance = t => {
    Ut.delete(t);
  };
  const getInstance = t => Ut.get(t);
  const OverlayScrollbars = (t, n, o) => {
    const {nt: s} = getEnvironment();
    const e = isHTMLElement(t);
    const c = e ? t : t.target;
    const r = getInstance(c);
    if (n && !r) {
      const r = [];
      const i = {};
      const validateOptions = t => {
        const n = removeUndefinedProperties(t);
        const o = getStaticPluginModuleInstance(V);
        return o ? o(n, true) : n;
      };
      const l = assignDeep({}, s(), validateOptions(n));
      const [a, u, f] = createEventListenerHub();
      const [_, d, p] = createEventListenerHub(o);
      const triggerEvent = (t, n) => {
        p(t, n);
        f(t, n);
      };
      const [v, g, h, b, y, S, w] = createSetups(t, l, (({gn: t, At: n}, {tn: o, nn: s}) => {
        const {dt: e, $t: c, xt: r, Ht: i, Et: l, _t: a} = o;
        const {sn: u, en: f, cn: _, rn: d} = s;
        triggerEvent("updated", [ m, {
          updateHints: {
            sizeChanged: !!e,
            directionChanged: !!c,
            heightIntrinsicChanged: !!r,
            overflowEdgeChanged: !!u,
            overflowAmountChanged: !!f,
            overflowStyleChanged: !!_,
            scrollCoordinatesChanged: !!d,
            contentMutation: !!i,
            hostMutation: !!l,
            appear: !!a
          },
          changedOptions: t || {},
          force: !!n
        } ]);
      }), (t => triggerEvent("scroll", [ m, t ])));
      const destroy = t => {
        const {hn: n} = y();
        const {vn: o} = n;
        if (o) {
          return;
        }
        removeInstance(c);
        runEachAndClear(r);
        triggerEvent("destroyed", [ m, t ]);
        u();
        d();
      };
      const update = t => g({
        At: t,
        It: true
      });
      const m = {
        options(t, n) {
          if (t) {
            const o = n ? s() : {};
            const e = getOptionsDiff(l, assignDeep(o, validateOptions(t)));
            if (!isEmptyObject(e)) {
              assignDeep(l, e);
              g({
                gn: e
              });
            }
          }
          return assignDeep({}, l);
        },
        on: _,
        off: (t, n) => {
          if (t && n) {
            d(t, n);
          }
        },
        state() {
          const {hn: t, bn: n, yn: o} = y();
          const {vn: s, Qt: e} = t;
          const {j: c} = n;
          const {Lt: r, Vt: i, ln: l, F: a, an: u, dn: f, kt: _} = o;
          return assignDeep({}, {
            overflowEdge: r,
            overflowAmount: i,
            overflowStyle: l,
            hasOverflow: a,
            scrollCoordinates: {
              start: _.T,
              end: _.k
            },
            padding: u,
            paddingAbsolute: f,
            directionRTL: c,
            sleeping: e,
            destroyed: s
          });
        },
        elements() {
          const {vt: t, gt: n, an: o, L: s, bt: e, ht: c, Zt: r} = S.Sn;
          const {Xt: i, Jt: l} = S.wn;
          const translateScrollbarStructure = t => {
            const {Mt: n, Ut: o, Pt: s} = t;
            return {
              scrollbar: s,
              track: o,
              handle: n
            };
          };
          const translateScrollbarsSetupElement = t => {
            const {Yt: n, Wt: o} = t;
            const s = translateScrollbarStructure(n[0]);
            return assignDeep({}, s, {
              clone: () => {
                const t = translateScrollbarStructure(o());
                b();
                return t;
              }
            });
          };
          return assignDeep({}, {
            target: t,
            host: n,
            padding: o || s,
            viewport: s,
            content: e || s,
            scrollOffsetElement: c,
            scrollEventElement: r,
            scrollbarHorizontal: translateScrollbarsSetupElement(i),
            scrollbarVertical: translateScrollbarsSetupElement(l)
          });
        },
        update: update,
        destroy: bind(destroy, false),
        sleep: h,
        plugin: t => i[keys(t)[0]]
      };
      push(r, [ w ]);
      addInstance(c, m);
      registerPluginModuleInstances(M, OverlayScrollbars, [ m, a, i ]);
      if (cancelInitialization(S.Sn.yt, !e && t.cancel)) {
        destroy(true);
        return m;
      }
      push(r, v());
      triggerEvent("initialized", [ m ]);
      m.update();
      return m;
    }
    return r;
  };
  OverlayScrollbars.plugin = t => {
    const n = isArray(t);
    const o = n ? t : [ t ];
    const s = o.map((t => registerPluginModuleInstances(t, OverlayScrollbars)[0]));
    addPlugins(o);
    return n ? s : s[0];
  };
  OverlayScrollbars.valid = t => {
    const n = t && t.elements;
    const o = isFunction(n) && n();
    return isPlainObject(o) && !!getInstance(o.target);
  };
  OverlayScrollbars.env = () => {
    const {U: t, M: n, P: o, J: s, G: e, st: c, et: r, Z: i, tt: l, nt: a, ot: u} = getEnvironment();
    return assignDeep({}, {
      scrollbarsSize: t,
      scrollbarsOverlaid: n,
      scrollbarsHiding: o,
      scrollTimeline: s,
      focusableScrollers: e,
      staticDefaultInitialization: c,
      staticDefaultOptions: r,
      getDefaultInitialization: i,
      setDefaultInitialization: l,
      getDefaultOptions: a,
      setDefaultOptions: u
    });
  };
  OverlayScrollbars.nonce = setNonce;
  OverlayScrollbars.trustedTypePolicy = setTrustedTypePolicy;
  t.ClickScrollPlugin = At;
  t.OverlayScrollbars = OverlayScrollbars;
  t.ScrollbarsHidingPlugin = zt;
  t.SizeObserverPlugin = Et;
  Object.defineProperty(t, Symbol.toStringTag, {
    value: "Module"
  });
  return t;
}({});
//# sourceMappingURL=overlayscrollbars.browser.es6.js.map
