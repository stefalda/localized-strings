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
    private _opts;
    private _interfaceLanguage;
    private _language;
    private _defaultLanguage;
    private _defaultLanguageFirstLevelKeys;
    private _props;
    private _availableLanguages?;
    [key: string]: any;
    /**
     * Constructor used to provide the strings objects in various language and the optional callback to get
     * the interface language
     * @param props - the strings object
     * @param options - configuration options
     */
    constructor(props: LocalizedStringsProps, options?: LocalizedStringsOptions | (() => string));
    /**
     * Set the strings objects based on the parameter passed in the constructor
     */
    setContent(props: LocalizedStringsProps): void;
    /**
     * Replace all strings to pseudo value
     */
    private _pseudoAllValues;
    /**
     * Can be used from outside the class to force a particular language
     * independently from the interface one
     */
    setLanguage(language: string): void;
    /**
     * Load fallback values for missing translations
     */
    private _fallbackValues;
    getLanguage(): string;
    getInterfaceLanguage(): string;
    getAvailableLanguages(): string[];
    formatString(str: string, ...valuesForPlaceholders: any[]): string | any[];
    getString(key: string, language?: string | null, omitWarning?: boolean): string | null;
    getContent(): LocalizedStringsProps;
}
export {};
