/**
 * Return the current interface language
 * If the navigator object is defined it returns the current navigator language
 * otherwise it falls back to 'en-US'
 * Works in browsers
 */
export declare function getInterfaceLanguage(): string;
/**
 * Interface for the props object containing language strings
 */
interface LocalizedStringsProps {
    [language: string]: {
        [key: string]: any;
    };
}
/**
 * Get the best match based on the language passed and the available languages
 * @param language - The target language code
 * @param props - Object containing available language translations
 */
export declare function getBestMatchingLanguage(language: string, props: LocalizedStringsProps): string;
/**
 * Check that the keys used in the provided strings object don't collide with existing property
 * already defined in the LocalizedStrings object
 * @param translationKeys - Array of translation keys to validate
 */
export declare function validateTranslationKeys(translationKeys: string[]): void;
/**
 * Get a random pseudo string back after specified a length
 * @param len - How many characters to get back
 */
export declare function randomPseudo(len: number): string;
export {};
