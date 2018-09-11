'use strict';

import * as utils from './utils';
/**
 * Simple module to localize the React interface using the same syntax
 * used in the ReactNativeLocalization module
 * (https://github.com/stefalda/ReactNativeLocalization)
 *
 * Originally developed by Stefano Falda (stefano.falda@gmail.com)
 *
 * It uses a call to the Navigator/Browser object to get the current interface language,
 * then display the correct language strings or the default language (the first
 * one if a match is not found).
 *
 * How to use:
 * Check the instructions at:
 * https://github.com/stefalda/localized-strings
 */

const placeholderRegex = /(\{[\d|\w]+\})/;

export default class LocalizedStrings {
    /**
     * Get the best match based on the language passed and the available languages
     * @param {*} language
     * @param {*} props
     */
    _getBestMatchingLanguage(language, props) {
        //If an object with the passed language key exists return it
        if (props[language]) return language;

        //if the string is composed try to find a match with only the first language identifiers (en-US --> en)
        const idx = language.indexOf('-');
        const auxLang = (idx >= 0) ? language.substring(0, idx) : language;
        return props[auxLang] ? auxLang : Object.keys(props)[0];
    }

    /**
     * Constructor used to provide the strings objects in various language and the optional callback to get
     * the interface language
     * @param {*} props - the strings object
     * @param {*} getInterfaceLanguageCallback - the optional method to use to get the InterfaceLanguage
     */
    constructor(props, getInterfaceLanguageCallback) {
        if (getInterfaceLanguageCallback){
            this._interfaceLanguage = getInterfaceLanguageCallback();
        } else {
            this._interfaceLanguage = utils.getInterfaceLanguage();
        }
        this._language = this._interfaceLanguage;
        this.setContent(props);
    }

    /**
     * Set the strings objects based on the parameter passed in the constructor
     * @param {*} props
     */
    setContent(props){
        this._defaultLanguage = Object.keys(props)[0];
        this._defaultLanguageFirstLevelKeys = [];
        //Store locally the passed strings
        this._props = props;
        utils.validateTranslationKeys(Object.keys(props[this._defaultLanguage]));
        //Store first level keys (for identifying missing translations)
        for (let key in this._props[this._defaultLanguage]) {
                if (typeof this._props[this._defaultLanguage][key]=="string") {
                    this._defaultLanguageFirstLevelKeys.push(key);
                }
            }
        //Set language to its default value (the interface)
        this.setLanguage(this._interfaceLanguage);
    }

    /**
     * Can be used from ouside the class to force a particular language
     * indipendently from the interface one
     * @param {*} language
     */
    setLanguage(language) {
        //Check if exists a translation for the current language or if the default
        //should be used
        const bestLanguage = this._getBestMatchingLanguage(language, this._props);
        const defaultLanguage = Object.keys(this._props)[0];
        this._language = bestLanguage;
        //Associate the language object to the this object
        if (this._props[bestLanguage]) {
            //delete default propery values to identify missing translations
            for (let i=0; i< this._defaultLanguageFirstLevelKeys.length;i++){
                delete this[this._defaultLanguageFirstLevelKeys[i]];
            }
            let localizedStrings = Object.assign({}, this._props[this._language]);
            for (let key in localizedStrings) {
                if (localizedStrings.hasOwnProperty(key)) {
                    this[key] = localizedStrings[key];
                }
            }
            //Now add any string missing from the translation but existing in the default language
            if (defaultLanguage !== this._language) {
                localizedStrings = this._props[defaultLanguage];
                this._fallbackValues(localizedStrings, this);
            }
        }
    }

    /**
     * Load fallback values for missing translations
     * @param {*} defaultStrings
     * @param {*} strings
     */
    _fallbackValues(defaultStrings, strings) {
        for (let key in defaultStrings) {
            if (defaultStrings.hasOwnProperty(key) && !strings[key] && strings[key] !== '') {
                strings[key] = defaultStrings[key];
                console.log(`🚧 👷 key '${key}' not found in localizedStrings for language ${this._language} 🚧`);
            } else {
                if (typeof strings[key] != "string") {
                    //It's an object
                    this._fallbackValues(defaultStrings[key], strings[key]);
                }
            }
        }
    }

    /**
     * The current language displayed (could differ from the interface language
     * if it has been forced manually and a matching translation has been found)
     */
    getLanguage() {
        return this._language;
    }

    /**
     * The current interface language (could differ from the language displayed)
     */
    getInterfaceLanguage() {
        return this._interfaceLanguage;
    }

    /**
     * Return an array containing the available languages passed as props in the constructor
     */
    getAvailableLanguages() {
        if (!this._availableLanguages) {
            this._availableLanguages = [];
            for (let language in this._props) {
                this._availableLanguages.push(language);
            }
        }
        return this._availableLanguages;
    }

    //Format the passed string replacing the numbered or tokenized placeholders
    //eg. 1: I'd like some {0} and {1}, or just {0}
    //eg. 2: I'd like some {bread} and {butter}, or just {bread}
    //Use example:
    //eg. 1: strings.formatString(strings.question, strings.bread, strings.butter)
    //eg. 2: strings.formatString(strings.question, { bread: strings.bread, butter: strings.butter })
    formatString(str, ...valuesForPlaceholders) {
        return (str || '')
            .split(placeholderRegex)
            .filter(textPart => !!textPart)
            .map((textPart, index) => {
                if (textPart.match(placeholderRegex)) {
                    const matchedKey = textPart.slice(1, -1);
                    let valueForPlaceholder = valuesForPlaceholders[matchedKey];

                    // If no value found, check if working with an object instead
                    if(valueForPlaceholder == undefined) {
                      const valueFromObjectPlaceholder = valuesForPlaceholders[0][matchedKey];
                      if(valueFromObjectPlaceholder !== undefined) {
                        valueForPlaceholder = valueFromObjectPlaceholder;
                      } else {
                        // If value still isn't found, then it must have been undefined/null
                        return valueForPlaceholder;
                      }
                    }

                    return valueForPlaceholder;
                }
                return textPart;
            }).join('');
    }

    //Return a string with the passed key in a different language
    getString(key, language) {
        try {
            return this._props[language][key];
        } catch (ex) {
            console.log("No localization found for key " + key + " and language " + language);
        }
        return null;
    }

     /**
      * The current props (locale object)
      */
     getContent() {
        return this._props;
    }
}
