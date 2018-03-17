import LocalizedStrings from '../src/LocalizedStrings';

describe('Main Library Functions', function () {
  global.navigator = {};
  let strings;

  beforeEach(() => {
    strings = new LocalizedStrings({
      en: {
        language:"english",
        how:"How do you want your egg today?",
        boiledEgg:"Boiled egg",
        softBoiledEgg:"Soft-boiled egg",
        choice:"How to choose the egg",
        formattedValue:"I'd like some {0} and {1}, or just {0}",
        ratings: {
          excellent:"excellent",
          good:"good",
          missingComplex:"missing value"
        },
        missing:"missing value",
        currentDate: "The current date is {month} {day}, {year}!",
        falsy: "{0} {1} {2} {3} {4} {5}"
      },
      it: {
        language: "italian",
        how:"Come vuoi il tuo uovo oggi?",
        boiledEgg:"Uovo sodo",
        softBoiledEgg:"Uovo alla coque",
        choice:"Come scegliere l'uovo",
        ratings: {
          excellent:"eccellente",
          good:"buono"
        },
        formattedValue:"Vorrei un po' di {0} e {1}, o solo {0}",
        currentDate: "La data corrente è {month} {day}, {year}!",
        falsy: "{0} {1} {2} {3} {4} {5}"
      }
    });
  });

  it("Set default language to en", function(){
    expect(strings.getLanguage()).toEqual("en");
  });

  it("List available languages", function(){
    expect(strings.getAvailableLanguages()).toEqual(["en", "it"]);
  });

  //Default language
  it('Extract simple value from default language', function () {
    expect(strings.how).toEqual('How do you want your egg today?');
  });
  it('Extract complex value from default language', function () {
    expect(strings.ratings.good).toEqual('good');
  });
  it('Get complex missing key from default language', function () {
    expect(strings.ratings.missingComplex).toEqual('missing value');
  });
  it('Get missing key from default language', function () {
    expect(strings.ratings.notfound).toBe(undefined);
  });
  it('Format string in default language', function () {
    expect(strings.formatString(strings.formattedValue, "cake", "ice-cream"))
      .toEqual(["I'd like some ", "cake", " and ", "ice-cream", ", or just ", "cake"]);
  });

  //Switch language
  it("Switch language to italian", function(){
    strings.setLanguage("it");
    expect(strings.getLanguage()).toEqual("it");
  });
  it('Extract simple value from  other language', function () {
    strings.setLanguage("it");
    expect(strings.how).toEqual('Come vuoi il tuo uovo oggi?');
  });

  it('Extract complex value from other language', function () {
    strings.setLanguage("it");
    expect(strings.ratings.good).toEqual('buono');
  });

  it('Get missing key from other language', function () {
    strings.setLanguage("it");
    expect(strings.missing).toEqual('missing value');
  });

  it('Get complex missing key from other language', function () {
    strings.setLanguage("it");
    expect(strings.ratings.missingComplex).toEqual('missing value');
  });

  it('Format string in other language', function () {
    strings.setLanguage("it");
    expect(strings.formatString(strings.formattedValue, "torta", "gelato"))
      .toEqual(["Vorrei un po' di ", "torta", " e ", "gelato", ", o solo ", "torta"]);
  });

  it('Get string in a different language', function () {
    strings.setLanguage("it");
    expect(strings.getString("choice", "en")).toBe("How to choose the egg");
  });

  it('Switch to different props', function () {
    strings.setContent({
      fr: {
        "hello":"bonjour"
      },
      en: {
        "hello":"hello"
      },
      it: {
        "hello":"ciao"
      }
    });
    strings.setLanguage("fr");
    expect(strings.hello).toEqual('bonjour');
  });

  it('Switch to different props not working', function () {
    strings = new LocalizedStrings({
          en: {
            a: {
              b: { x: "foo", y: "bar" },
              c: { z: "baz" }
              }
          }
          });
    strings.setContent({
      en: {
        a: {
          b: { x: "a.b.x", y: "a.b.y" },
          c: { z: "a.c.z" }
        }
      }
    });
    strings.setLanguage("en");
    expect(strings.a.b.x).toEqual('a.b.x');
  });

  it('Handles named tokens as part of the format string', () => {
    const formatTokens = {
      month: "January",
      day: "12",
      year: "2018"
    };
    expect(strings.formatString(strings.currentDate, formatTokens))
      .toEqual(["The current date is ", "January", " ", "12", ", ", "2018", "!"]);
  });

  it('Handles falsy values', () => {
    expect(strings.formatString(strings.falsy, 0, false, '', null, undefined, NaN))
      .toEqual([0, " ", false, " ", '', " ", null, " ", undefined, " ", NaN]);
  });

});

describe('use the default getInterfaceLanguageMethod', () => {
  let strings = new LocalizedStrings({
    en: {
      language:"english"
    },
    it:{
      language:"italian"
    }});
    it('Use the default method that returns en-US', () => {
      expect (strings.language).toBe("english");
    });
});

describe('use a custom getInterfaceLanguageMethod', () => {
  let strings = new LocalizedStrings({
    en: {
      language:"english"
    },
    it:{
      language:"italian"
    }}, ()=>'it-IT');
    it('Use the default method that returns en-US', () => {
      expect (strings.language).toBe("italian");
    });
});