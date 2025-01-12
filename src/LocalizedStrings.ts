import * as utils from "./utils";

// Define constant regex patterns
const placeholderReplaceRegex = /(\{[\d|\w]+\})/;
const placeholderReferenceRegex = /(\$ref\{[\w|.]+\})/;

// Define interfaces for props and options
interface LocalizedStringsProps {
  [language: string]: {
    [key: string]: any;
  };
}

interface LocalizedStringsOptions {
  customLanguageInterface?: () => string;
  pseudo?: boolean;
  pseudoMultipleLanguages?: boolean;
  logsEnabled?: boolean;
}

export default class LocalizedStrings {
  private _opts: Required<LocalizedStringsOptions>;
  private _interfaceLanguage: string;
  private _language: string;
  private _defaultLanguage!: string;
  private _defaultLanguageFirstLevelKeys!: string[];
  private _props!: LocalizedStringsProps;
  private _availableLanguages?: string[];
  [key: string]: any;

  /**
   * Constructor used to provide the strings objects in various language and the optional callback to get
   * the interface language
   * @param props - the strings object
   * @param options - configuration options
   */
  constructor(props: LocalizedStringsProps, options?: LocalizedStringsOptions | (() => string)) {
    // Compatibility fix with previous version
    if (typeof options === "function") {
      options = { customLanguageInterface: options };
    }

    this._opts = {
      customLanguageInterface: utils.getInterfaceLanguage,
      pseudo: false,
      pseudoMultipleLanguages: false,
      logsEnabled: true,
      ...options
    };

    this._interfaceLanguage = this._opts.customLanguageInterface();
    this._language = this._interfaceLanguage;
    this.setContent(props);
  }

  /**
   * Set the strings objects based on the parameter passed in the constructor
   */
  setContent(props: LocalizedStringsProps): void {
    const [defaultLang] = Object.keys(props);
    this._defaultLanguage = defaultLang;
    this._defaultLanguageFirstLevelKeys = [];
    this._props = props;

    utils.validateTranslationKeys(Object.keys(props[this._defaultLanguage]));

    Object.keys(this._props[this._defaultLanguage]).forEach(key => {
      if (typeof this._props[this._defaultLanguage][key] === "string") {
        this._defaultLanguageFirstLevelKeys.push(key);
      }
    });

    this.setLanguage(this._interfaceLanguage);

    if (this._opts.pseudo) {
      this._pseudoAllValues(this._props);
    }
  }

  /**
   * Replace all strings to pseudo value
   */
  private _pseudoAllValues(obj: { [key: string]: any }): void {
    Object.keys(obj).forEach(property => {
      if (typeof obj[property] === "object") {
        this._pseudoAllValues(obj[property]);
      } else if (typeof obj[property] === "string") {
        if (
          obj[property].indexOf("[") === 0 &&
          obj[property].lastIndexOf("]") === obj[property].length - 1
        ) {
          return;
        }

        const strArr = obj[property].split(" ");
        for (let i = 0; i < strArr.length; i += 1) {
          if (strArr[i].match(placeholderReplaceRegex) || strArr[i].match(placeholderReferenceRegex)) {
            // Keep special strings
            continue;
          }

          let len = strArr[i].length;
          if (this._opts.pseudoMultipleLanguages) {
            len = Math.floor(len * 1.4); // add length with 40%
          }
          strArr[i] = utils.randomPseudo(len);
        }
        obj[property] = `[${strArr.join(" ")}]`;
      }
    });
  }

  /**
   * Can be used from outside the class to force a particular language
   * independently from the interface one
   */
  setLanguage(language: string): void {
    const bestLanguage = utils.getBestMatchingLanguage(language, this._props);
    const defaultLanguage = Object.keys(this._props)[0];
    this._language = bestLanguage;

    if (this._props[bestLanguage]) {
      // Delete default property values to identify missing translations
      for (const key of this._defaultLanguageFirstLevelKeys) {
        delete this[key];
      }

      let localizedStrings = { ...this._props[this._language] };
      Object.keys(localizedStrings).forEach(key => {
        this[key] = localizedStrings[key];
      });

      if (defaultLanguage !== this._language) {
        localizedStrings = this._props[defaultLanguage];
        this._fallbackValues(localizedStrings, this);
      }
    }
  }

  /**
   * Load fallback values for missing translations
   */
  private _fallbackValues(defaultStrings: { [key: string]: any }, strings: { [key: string]: any }): void {
    Object.keys(defaultStrings).forEach(key => {
      if (
        Object.prototype.hasOwnProperty.call(defaultStrings, key) &&
        !strings[key] &&
        strings[key] !== ""
      ) {
        strings[key] = defaultStrings[key];
        if (this._opts.logsEnabled) {
          console.log(
            `🚧 👷 key '${key}' not found in localizedStrings for language ${this._language} 🚧`
          );
        }
      } else if (typeof strings[key] !== "string") {
        this._fallbackValues(defaultStrings[key], strings[key]);
      }
    });
  }

  getLanguage(): string {
    return this._language;
  }

  getInterfaceLanguage(): string {
    return this._interfaceLanguage;
  }

  getAvailableLanguages(): string[] {
    if (!this._availableLanguages) {
      this._availableLanguages = Object.keys(this._props);
    }
    return this._availableLanguages;
  }

  formatString(str: string, ...valuesForPlaceholders: any[]): string | any[] {
    let input = str || "";
    if (typeof input === "string") {
      input = this.getString(str, null, true) || input;
    }

    const ref = input
      .split(placeholderReferenceRegex)
      .filter(Boolean)
      .map(textPart => {
        if (textPart.match(placeholderReferenceRegex)) {
          const matchedKey = textPart.slice(5, -1);
          const referenceValue = this.getString(matchedKey);
          if (referenceValue) return referenceValue;
          if (this._opts.logsEnabled) {
            console.log(
              `No Localization ref found for '${textPart}' in string '${str}'`
            );
          }
          return `$ref(id:${matchedKey})`;
        }
        return textPart;
      })
      .join("");

    return ref
      .split(placeholderReplaceRegex)
      .filter(Boolean)
      .map(textPart => {
        if (textPart.match(placeholderReplaceRegex)) {
          const matchedKey = textPart.slice(1, -1);
          let valueForPlaceholder = valuesForPlaceholders[matchedKey as any];

          if (valueForPlaceholder === undefined && valuesForPlaceholders[0]) {
            valueForPlaceholder = valuesForPlaceholders[0][matchedKey];
          }

          return valueForPlaceholder;
        }
        return textPart;
      })
      .join("");
  }

  getString(key: string, language?: string | null, omitWarning = false): string | null {
    try {
      let current = this._props[language || this._language];
      const paths = key.split(".");
      for (const path of paths) {
        if (current[path] === undefined) {
          throw new Error(path);
        }
        current = current[path];
      }
      return current as any;
    } catch (ex: any) {
      if (!omitWarning && this._opts.logsEnabled) {
        console.log(
          `No localization found for key '${key}' and language '${language}', failed on ${ex.message}`
        );
      }
    }
    return null;
  }

  getContent(): LocalizedStringsProps {
    return this._props;
  }
}