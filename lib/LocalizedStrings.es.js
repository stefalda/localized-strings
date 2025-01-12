var f = Object.defineProperty;
var c = (n, e, t) => e in n ? f(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var l = (n, e, t) => c(n, typeof e != "symbol" ? e + "" : e, t);
function h() {
  const n = "en-US";
  if (typeof navigator > "u")
    return n;
  const e = navigator;
  if (e) {
    if (e.language)
      return e.language;
    if (e.languages && e.languages[0])
      return e.languages[0];
    if ("userLanguage" in e)
      return e.userLanguage;
    if ("browserLanguage" in e)
      return e.browserLanguage;
  }
  return n;
}
function _(n, e) {
  if (e[n]) return n;
  const t = n.indexOf("-"), a = t >= 0 ? n.substring(0, t) : n;
  return e[a] ? a : Object.keys(e)[0];
}
function d(n) {
  const e = [
    "_interfaceLanguage",
    "_language",
    "_defaultLanguage",
    "_defaultLanguageFirstLevelKeys",
    "_props"
  ];
  n.forEach((t) => {
    if (e.indexOf(t) !== -1)
      throw new Error(`${t} cannot be used as a key. It is a reserved word.`);
  });
}
function L(n) {
  let e = "";
  const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let a = 0; a < n; a += 1)
    e += t.charAt(Math.floor(Math.random() * t.length));
  return e;
}
const r = /(\{[\d|\w]+\})/, o = /(\$ref\{[\w|.]+\})/;
class b {
  /**
   * Constructor used to provide the strings objects in various language and the optional callback to get
   * the interface language
   * @param props - the strings object
   * @param options - configuration options
   */
  constructor(e, t) {
    l(this, "_opts");
    l(this, "_interfaceLanguage");
    l(this, "_language");
    l(this, "_defaultLanguage");
    l(this, "_defaultLanguageFirstLevelKeys");
    l(this, "_props");
    l(this, "_availableLanguages");
    typeof t == "function" && (t = { customLanguageInterface: t }), this._opts = {
      customLanguageInterface: h,
      pseudo: !1,
      pseudoMultipleLanguages: !1,
      logsEnabled: !0,
      ...t
    }, this._interfaceLanguage = this._opts.customLanguageInterface(), this._language = this._interfaceLanguage, this.setContent(e);
  }
  /**
   * Set the strings objects based on the parameter passed in the constructor
   */
  setContent(e) {
    const [t] = Object.keys(e);
    this._defaultLanguage = t, this._defaultLanguageFirstLevelKeys = [], this._props = e, d(Object.keys(e[this._defaultLanguage])), Object.keys(this._props[this._defaultLanguage]).forEach((a) => {
      typeof this._props[this._defaultLanguage][a] == "string" && this._defaultLanguageFirstLevelKeys.push(a);
    }), this.setLanguage(this._interfaceLanguage), this._opts.pseudo && this._pseudoAllValues(this._props);
  }
  /**
   * Replace all strings to pseudo value
   */
  _pseudoAllValues(e) {
    Object.keys(e).forEach((t) => {
      if (typeof e[t] == "object")
        this._pseudoAllValues(e[t]);
      else if (typeof e[t] == "string") {
        if (e[t].indexOf("[") === 0 && e[t].lastIndexOf("]") === e[t].length - 1)
          return;
        const a = e[t].split(" ");
        for (let s = 0; s < a.length; s += 1) {
          if (a[s].match(r) || a[s].match(o))
            continue;
          let i = a[s].length;
          this._opts.pseudoMultipleLanguages && (i = Math.floor(i * 1.4)), a[s] = L(i);
        }
        e[t] = `[${a.join(" ")}]`;
      }
    });
  }
  /**
   * Can be used from outside the class to force a particular language
   * independently from the interface one
   */
  setLanguage(e) {
    const t = _(e, this._props), a = Object.keys(this._props)[0];
    if (this._language = t, this._props[t]) {
      for (const i of this._defaultLanguageFirstLevelKeys)
        delete this[i];
      let s = { ...this._props[this._language] };
      Object.keys(s).forEach((i) => {
        this[i] = s[i];
      }), a !== this._language && (s = this._props[a], this._fallbackValues(s, this));
    }
  }
  /**
   * Load fallback values for missing translations
   */
  _fallbackValues(e, t) {
    Object.keys(e).forEach((a) => {
      Object.prototype.hasOwnProperty.call(e, a) && !t[a] && t[a] !== "" ? (t[a] = e[a], this._opts.logsEnabled && console.log(
        `🚧 👷 key '${a}' not found in localizedStrings for language ${this._language} 🚧`
      )) : typeof t[a] != "string" && this._fallbackValues(e[a], t[a]);
    });
  }
  getLanguage() {
    return this._language;
  }
  getInterfaceLanguage() {
    return this._interfaceLanguage;
  }
  getAvailableLanguages() {
    return this._availableLanguages || (this._availableLanguages = Object.keys(this._props)), this._availableLanguages;
  }
  formatString(e, ...t) {
    let a = e || "";
    return typeof a == "string" && (a = this.getString(e, null, !0) || a), a.split(o).filter(Boolean).map((i) => {
      if (i.match(o)) {
        const g = i.slice(5, -1), u = this.getString(g);
        return u || (this._opts.logsEnabled && console.log(
          `No Localization ref found for '${i}' in string '${e}'`
        ), `$ref(id:${g})`);
      }
      return i;
    }).join("").split(r).filter(Boolean).map((i) => {
      if (i.match(r)) {
        const g = i.slice(1, -1);
        let u = t[g];
        return u === void 0 && t[0] && (u = t[0][g]), u;
      }
      return i;
    }).join("");
  }
  getString(e, t, a = !1) {
    try {
      let s = this._props[t || this._language];
      const i = e.split(".");
      for (const g of i) {
        if (s[g] === void 0)
          throw new Error(g);
        s = s[g];
      }
      return s;
    } catch (s) {
      !a && this._opts.logsEnabled && console.log(
        `No localization found for key '${e}' and language '${t}', failed on ${s.message}`
      );
    }
    return null;
  }
  getContent() {
    return this._props;
  }
}
export {
  b as default
};
