import LocalizedStrings from "./../../lib/LocalizedStrings";

interface L10n {
    home: string;
}

const en: L10n = {
    home: "Home",
};

const l10n = new LocalizedStrings<L10n>({ en });

export default l10n;