import { beforeEach, describe, expect, it } from 'vitest';
import LocalizedStrings from '../lib/LocalizedStrings.es';

describe('Main Library Functions', () => {
  let strings: any;

  beforeEach(() => {
    global.navigator = {} as any; // Mocking the navigator object

    strings = new LocalizedStrings(
      {
        en: {
          language: 'english',
          how: 'How do you want your egg today?',
          boiledEgg: 'Boiled egg',
          softBoiledEgg: 'Soft-boiled egg',
          choice: 'How to choose the egg',
          formattedValue: "I'd like some {0} and {1}, or just {0}",
          ratings: {
            excellent: 'excellent',
            good: 'good',
            missingComplex: 'missing value',
          },
          missing: 'missing value',
          currentDate: 'The current date is {month} {day}, {year}!',
          falsy: '{0} {1} {2} {3} {4} {5}',
          empty: '',
          reference: '$ref{ratings.excellent}',
          referenceAdvanced: '$ref{falsy}',
        },
        it: {
          language: 'italian',
          how: 'Come vuoi il tuo uovo oggi?',
          boiledEgg: 'Uovo sodo',
          softBoiledEgg: 'Uovo alla coque',
          choice: "Come scegliere l'uovo",
          ratings: {
            excellent: 'eccellente',
            good: 'buono',
          },
          formattedValue: "Vorrei un po' di {0} e {1}, o solo {0}",
          currentDate: 'La data corrente è {month} {day}, {year}!',
          falsy: '{0} {1} {2} {3} {4} {5}',
          empty: '',
        },
      },
      { logsEnabled: false },
    );
  });

  it('Set default language to en', () => {
    expect(strings.getLanguage()).toEqual('en');
  });

  it('List available languages', () => {
    expect(strings.getAvailableLanguages()).toEqual(['en', 'it']);
  });

  it('Extract simple value from default language', () => {
    expect(strings.how).toEqual('How do you want your egg today?');
  });

  it('Extract complex value from default language', () => {
    expect(strings.ratings.good).toEqual('good');
  });

  it('Get complex missing key from default language', () => {
    expect(strings.ratings.missingComplex).toEqual('missing value');
  });

  it('Get missing key from default language', () => {
    expect(strings.ratings.notfound).toBeUndefined();
  });

  it('Format string in default language', () => {
    expect(
      strings.formatString(strings.formattedValue, 'cake', 'ice-cream'),
    ).toEqual("I'd like some cake and ice-cream, or just cake");
  });

  it('Switch language to Italian', () => {
    strings.setLanguage('it');
    expect(strings.getLanguage()).toEqual('it');
  });

  it('Extract simple value from Italian', () => {
    strings.setLanguage('it');
    expect(strings.how).toEqual('Come vuoi il tuo uovo oggi?');
  });

  it('Extract complex value from Italian', () => {
    strings.setLanguage('it');
    expect(strings.ratings.good).toEqual('buono');
  });

  it('Get missing key from Italian', () => {
    strings.setLanguage('it');
    expect(strings.missing).toEqual('missing value');
  });

  it('Get complex missing key from Italian', () => {
    strings.setLanguage('it');
    expect(strings.ratings.missingComplex).toEqual('missing value');
  });

  it('Format string in Italian', () => {
    strings.setLanguage('it');
    expect(
      strings.formatString(strings.formattedValue, 'torta', 'gelato'),
    ).toEqual("Vorrei un po' di torta e gelato, o solo torta");
  });

  it('Get string in a different language', () => {
    strings.setLanguage('it');
    expect(strings.getString('choice', 'en')).toBe('How to choose the egg');
  });

  it('Switch to different props', () => {
    strings.setContent({
      fr: { hello: 'bonjour' },
      en: { hello: 'hello' },
      it: { hello: 'ciao' },
    });
    strings.setLanguage('fr');
    expect(strings.hello).toEqual('bonjour');
  });

  it('Switch to different props with nested objects', () => {
    strings = new LocalizedStrings({
      en: { a: { b: { x: 'foo', y: 'bar' }, c: { z: 'baz' } } },
    }, {});
    strings.setContent({
      en: { a: { b: { x: 'a.b.x', y: 'a.b.y' }, c: { z: 'a.c.z' } } },
    });
    strings.setLanguage('en');
    expect(strings.a.b.x).toEqual('a.b.x');
  });

  it('Replace a single language using setContent', () => {
    strings = new LocalizedStrings({
      en: { how: 'How do you want your egg today?', boiledEgg: 'Boiled egg' },
      it: { how: 'Come vuoi il tuo uovo oggi?', boiledEgg: 'Uovo bollito' },
    }, {});

    strings.setContent({
      ...strings.getContent(),
      en: { how: 'How do you want your egg today, mate?', boiledEgg: 'Egg' },
    });

    expect(strings.how).toEqual('How do you want your egg today, mate?');
    strings.setLanguage('it');
    expect(strings.how).toEqual('Come vuoi il tuo uovo oggi?');
  });

  it('Handles named tokens in format strings', () => {
    const formatTokens = { month: 'January', day: '12', year: '2018' };
    expect(strings.formatString(strings.currentDate, formatTokens)).toEqual(
      'The current date is January 12, 2018!',
    );
  });

  it('Handles falsy values', () => {
    expect(
      strings.formatString(strings.falsy, 0, false, '', null, undefined, NaN),
    ).toEqual([0, false, '', null, undefined, NaN].join(' '));
  });

  it('Handles empty strings', () => {
    expect(strings.empty).toEqual('');
  });

  it('Handle reference values', () => {
    expect(strings.formatString(strings.reference)).toEqual('excellent');
  });

  it('Handle reference values with falsy replacements', () => {
    expect(
      strings.formatString(
        strings.referenceAdvanced,
        0,
        false,
        '',
        null,
        undefined,
        NaN,
      ),
    ).toEqual([0, false, '', null, undefined, NaN].join(' '));
  });

  //formattedValue: "I'd like some {0} and {1}, or just {0}",
  it('shouldn\'t crash when parameters are null or undefined', () => {
    expect(strings.formatString(strings.formattedValue, null, undefined))
      .toEqual("I'd like some  and , or just ");
  });


});
