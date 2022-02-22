import LocalizedStrings from "../lib/LocalizedStrings";

describe("Main Library Functions", () => {
  /**
   * Load up language file to use during tests
   */
  global.navigator = {};
  let strings;

  beforeEach(() => {
    strings = new LocalizedStrings(
      {
        en: {
          language: "english",
          how: "How do you want your egg today?",
          boiledEgg: "Boiled egg",
          softBoiledEgg: "Soft-boiled egg",
          choice: "How to choose the egg",
          formattedValue: "I'd like some {0} and {1}, or just {0}",
          ratings: {
            excellent: "excellent",
            good: "good",
            missingComplex: "missing value",
          },
          missing: "missing value",
          currentDate: "The current date is {month} {day}, {year}!",
          falsy: "{0} {1} {2} {3} {4} {5}",
          empty: "",
          reference: "$ref{ratings.excellent}",
          referenceAdvanced: "$ref{falsy}",
        },
        it: {
          language: "italian",
          how: "Come vuoi il tuo uovo oggi?",
          boiledEgg: "Uovo sodo",
          softBoiledEgg: "Uovo alla coque",
          choice: "Come scegliere l'uovo",
          ratings: {
            excellent: "eccellente",
            good: "buono",
          },
          formattedValue: "Vorrei un po' di {0} e {1}, o solo {0}",
          currentDate: "La data corrente è {month} {day}, {year}!",
          falsy: "{0} {1} {2} {3} {4} {5}",
          empty: "",
        },
      },
      { logsEnabled: false }
    );
  });

  it("Set default language to en", () => {
    expect(strings.getLanguage()).toEqual("en");
  });

  it("List available languages", () => {
    expect(strings.getAvailableLanguages()).toEqual(["en", "it"]);
  });

  // Default language
  it("Extract simple value from default language", () => {
    expect(strings.how).toEqual("How do you want your egg today?");
  });
  it("Extract complex value from default language", () => {
    expect(strings.ratings.good).toEqual("good");
  });
  it("Get complex missing key from default language", () => {
    expect(strings.ratings.missingComplex).toEqual("missing value");
  });
  it("Get missing key from default language", () => {
    expect(strings.ratings.notfound).toBe(undefined);
  });
  it("Format string in default language", () => {
    expect(
      strings.formatString(strings.formattedValue, "cake", "ice-cream")
    ).toEqual("I'd like some cake and ice-cream, or just cake");
  });

  // Switch language
  it("Switch language to italian", () => {
    strings.setLanguage("it");
    expect(strings.getLanguage()).toEqual("it");
  });
  it("Extract simple value from  other language", () => {
    strings.setLanguage("it");
    expect(strings.how).toEqual("Come vuoi il tuo uovo oggi?");
  });

  it("Extract complex value from other language", () => {
    strings.setLanguage("it");
    expect(strings.ratings.good).toEqual("buono");
  });

  it("Get missing key from other language", () => {
    strings.setLanguage("it");
    expect(strings.missing).toEqual("missing value");
  });

  it("Get complex missing key from other language", () => {
    strings.setLanguage("it");
    expect(strings.ratings.missingComplex).toEqual("missing value");
  });

  it("Format string in other language", () => {
    strings.setLanguage("it");
    expect(
      strings.formatString(strings.formattedValue, "torta", "gelato")
    ).toEqual("Vorrei un po' di torta e gelato, o solo torta");
  });

  it("Get string in a different language", () => {
    strings.setLanguage("it");
    expect(strings.getString("choice", "en")).toBe("How to choose the egg");
  });

  it("Switch to different props", () => {
    strings.setContent({
      fr: {
        hello: "bonjour",
      },
      en: {
        hello: "hello",
      },
      it: {
        hello: "ciao",
      },
    });
    strings.setLanguage("fr");
    expect(strings.hello).toEqual("bonjour");
  });

  it("Switch to different props with nested objects", () => {
    strings = new LocalizedStrings({
      en: {
        a: {
          b: { x: "foo", y: "bar" },
          c: { z: "baz" },
        },
      },
    });
    strings.setContent({
      en: {
        a: {
          b: { x: "a.b.x", y: "a.b.y" },
          c: { z: "a.c.z" },
        },
      },
    });
    strings.setLanguage("en");
    expect(strings.a.b.x).toEqual("a.b.x");
  });

  it("Should allow replacing a single language with the setContent method", () => {
    strings = new LocalizedStrings({
      en: {
        how: "How do you want your egg today?",
        boiledEgg: "Boiled egg",
      },
      it: {
        how: "Come vuoi il tuo uovo oggi?",
        boiledEgg: "Uovo bollito",
      },
    });

    strings.setContent(
      Object.assign({}, strings.getContent(), {
        en: {
          how: "How do you want your egg todajsie?",
          boiledEgg: "Boiled eggsie",
        },
      })
    );

    expect(strings.how).toEqual("How do you want your egg todajsie?");
    strings.setLanguage("it");
    expect(strings.how).toEqual("Come vuoi il tuo uovo oggi?");
  });

  it("Handles named tokens as part of the format string", () => {
    const formatTokens = {
      month: "January",
      day: "12",
      year: "2018",
    };
    expect(strings.formatString(strings.currentDate, formatTokens)).toEqual(
      "The current date is January 12, 2018!"
    );
  });

  it("Handles falsy values", () => {
    // falsy: "{0} {1} {2} {3} {4} {5}"
    expect(
      strings.formatString(strings.falsy, 0, false, "", null, undefined, NaN)
    ).toEqual([0, false, "", null, undefined, NaN].join(" "));
  });

  it("Handles empty values", () => {
    expect(
      strings.formatString(strings.thisKeyDoesNotExist, {
        thisReplacement: "doesNotExist",
      })
    ).toEqual("");
  });

  it("Handles empty strings", () => {
    expect(strings.empty).toEqual("");
  });

  // Checks for reference
  it("Handle reference values", () => {
    // reference: '$ref{ratings.excellent}'
    expect(strings.formatString(strings.reference)).toEqual("excellent");
  });
  it("Handle reference values and falsy", () => {
    expect(
      strings.formatString(
        strings.referenceAdvanced,
        0,
        false,
        "",
        null,
        undefined,
        NaN
      )
    ).toEqual([0, false, "", null, undefined, NaN].join(" "));
  });
});

describe("use the default getInterfaceLanguageMethod", () => {
  const strings = new LocalizedStrings(
    {
      en: {
        language: "english",
      },
      it: {
        language: "italian",
      },
    },
    { logsEnabled: false }
  );
  it("Use the default method that returns en-US", () => {
    expect(strings.language).toBe("english");
  });
});

describe("use a custom getInterfaceLanguageMethod", () => {
  const strings = new LocalizedStrings(
    {
      en: {
        language: "english",
      },
      it: {
        language: "italian",
      },
    },
    { customLanguageInterface: () => "it-IT", logsEnabled: false }
  );
  it("Use the custom method that returns it_IT", () => {
    expect(strings.language).toBe("italian");
  });
  it("Use the custom interface methods when checking the getInterfaceLanguage", () => {
    expect(strings.getInterfaceLanguage()).toBe("it-IT");
  });
});

describe("use psuedo characters", () => {
  const strings = new LocalizedStrings(
    {
      en: {
        language: "english",
      },
    },
    { pseudo: true, logsEnabled: false }
  );
  it("Psuedo changed value", () => {
    expect(strings.formatString("language")).not.toBe("english");
  });
});

describe("language listener", () => {
  const strings = new LocalizedStrings(
    {
      en: {
        language: "english",
      },
      sv: {
        language: "swedish",
      },
    },
    { pseudo: true, logsEnabled: false }
  );

  const listener = () => {};

  it("set listener", () => {
    strings.addLanguageChangeListener(listener);

    expect(strings._languageListeners).toHaveSize(1);
  });

  it("remove listener", () => {
    strings.removeLanguageChangeListener(listener);

    expect(strings._languageListeners).toHaveSize(0);
  });

  it("run listener", (done) => {
    strings.addLanguageChangeListener((language) => {
      expect(language).toBe("sv");
      done();
    });

    strings.setLanguage("sv");
  });
});
