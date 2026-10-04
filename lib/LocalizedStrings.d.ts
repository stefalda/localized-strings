export interface LocalizedStringsProps {
    [language: string]: {
        [key: string]: any;
    };
}
export interface LocalizedStringsOptions {
    customLanguageInterface?: () => string;
    pseudo?: boolean;
    pseudoMultipleLanguages?: boolean;
    logsEnabled?: boolean;
}
export interface LocalizedStringsMethods {
    setContent(props: LocalizedStringsProps): void;
    setLanguage(language: string): void;
    getLanguage(): string;
    getInterfaceLanguage(): string;
    getAvailableLanguages(): string[];
    formatString(str: string, ...valuesForPlaceholders: any[]): string | any[];
    getString(key: string, language?: string | null, omitWarning?: boolean): string | null;
    getContent(): LocalizedStringsProps;
}
export type LocalizedStrings<T = Record<string, any>> = LocalizedStringsMethods & T;
interface LocalizedStringsFactory {
    new <T extends Record<string, any>>(props: {
        [language: string]: T;
    }, options?: LocalizedStringsOptions | (() => string)): LocalizedStrings<T>;
}
declare const LocalizedStrings: LocalizedStringsFactory;
export default LocalizedStrings;
