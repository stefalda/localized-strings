declare module "localized-strings" {
  type Formatted = number | string;
  type FormatObject<U extends Formatted> = { [key: string]: U };

  export interface GlobalStrings<T> {
    [language: string]: T;
  }

  export interface LocalizedStringsMethods {
    /**
     * Can be used from ouside the class to force a particular language
     * indipendently from the interface one
     * @param language
     */
    setLanguage(language: string, loadLanguage?: boolean): void;

    /**
     *  The current language displayed (could differ from the interface language
     *  if it has been forced manually and a matching translation has been found)
     */
    getLanguage(): string;

    /**
     * The current interface language (could differ from the language displayed)
     */
    getInterfaceLanguage(): string;

    /**
     * Format the passed string replacing the numbered placeholders
     * i.e. I'd like some {0} and {1}, or just {0}
     * Use example:
     *   strings.formatString(strings.question, strings.bread, strings.butter)
     */
    formatString<T extends Formatted>(
      str: string,
      ...values: Array<T | FormatObject<T>>
    ): Array<string | T> | string;

    /**
     * Return an array containing the available languages passed as props in the constructor
     */
    getAvailableLanguages(): string[];

    /**
     * Return a string with the passed key in a different language
     * @param key
     * @param language
     * @param omitWarning
     */
    getString(key: string, language?: string, omitWarning?: boolean): string;

    /**
     * Replace the NamedLocalization object without reinstantiating the object
     * @param props
     */
    setContent(props: any, shouldSetLanguage?: boolean): void;

    /**
     * Return current locale object
     */
    getContent(): any;

    /**
     * Listen to language changes
     */
    addLanguageChangeListener: (callback: () => void) => void;

    /**
     * Remove language listener
     */
    removeLanguageChangeListener: (callback: () => void) => void;
  }

  export type LocalizedStrings<T> = LocalizedStringsMethods & T;

  type GetInterfaceLanguageCallback = () => string;
  type loadLanguageCallback = (countryCode: string) => void;

  interface Options {
    customLanguageInterface?: GetInterfaceLanguageCallback;
    loadLanguage?: loadLanguageCallback;
    logsEnabled?: boolean;
    pseudo?: boolean;
    pseudoMultipleLanguages?: boolean;
  }

  interface LocalizedStringsFactory {
    new <T>(props: GlobalStrings<T>, options?: Options): LocalizedStrings<T>;
  }

  const LocalizedStrings: LocalizedStringsFactory;
  export default LocalizedStrings;
}
