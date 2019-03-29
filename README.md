# localized-strings

Simple module to localize the strings of any JS based program using the same syntax used in the
[ReactLocalization module](https://github.com/stefalda/react-localization/) and
[ReactNativeLocalization module](https://github.com/stefalda/ReactNativeLocalization/) libraries.

## How it works

The library uses the current interface language, then it loads and displays the strings matching the current interface locale or the default language (the first one if a match is not found) if a specific localization can't be found.

It's possible to force a language different from the interface one.

It's possible to configure the library to use a specific routine that return the interface language, so it's possible to extend it in any possible environment.

## Installation

`npm install --save localized-strings`

## Usage

In the class that you want to localize require the library and define the strings object passing to the constructor a simple object containing a language key (i.e. en, it, fr..) and then a list of key-value pairs with the needed localized strings.

```js
\\ES6 module syntax
import LocalizedStrings from 'localized-strings';
\\CommonJS module syntax
const LocalizedStrings = require('LocalizedStrings').default;

let strings = new LocalizedStrings({
  en:{
    how:"How do you want your egg today?",
    boiledEgg:"Boiled egg",
    softBoiledEgg:"Soft-boiled egg",
    choice:"How to choose the egg",
    fridge: {
      egg: "Egg",
      milk: "Milk",
    }
  },
  it: {
    how:"Come vuoi il tuo uovo oggi?",
    boiledEgg:"Uovo sodo",
    softBoiledEgg:"Uovo alla coque",
    choice:"Come scegliere l'uovo",
    fridge: {
      egg: "Uovo",
      milk: "Latte",
    }
  }},
    {/* options */}
);
```

Then use the `strings` object literal directly in the render method accessing the key of the localized string.

```js
console.log("HOW: " + strings.how);
// or
console.log("HOW:" + strings.getString("how"));
```

If value is missing getString will not throw an error and break (e.g. using React)

```js
// gives err that breaks app
console.log("Missing: " + strings.fridge.cabinet.toast);
// returns null
console.log("Missing:" + strings.getString("fridge.cabinet.toast"));
```

The first language is considered the default one, so if a translation is missing for the selected language, the default one is shown and a line is written to the log as a reminder.

#### Update / Overwrite Locale

You might have default localized in the build but then download the latest localization strings from a server. Use setContent to overwrite the whole object.

**NOTE** that this will remove all other localizations if used.

```js
strings.setContent({
  en: {
    how: "How do you want your egg todajsie?",
    boiledEgg: "Boiled eggsie",
    softBoiledEgg: "Soft-boiled egg",
    choice: "How to choose the egg"
  }
});
```

You can also only overwrite a specific language using:

```js
strings.setContent(
  Object.assign({}, strings.getContent(), {
    en: {
      how: "How do you want your egg todajsie?",
      boiledEgg: "Boiled eggsie",
      softBoiledEgg: "Soft-boiled egg",
      choice: "How to choose the egg"
    }
  })
);
```

## Custom getInterfaceLanguage method

You can pass a custom method to get the current interface based on the context.

The default method check the browser language but it could be replaced with other check if you are in a Server, ReactNative or [Nativescript](https://www.nativescript.org) project.

The getInterfaceLanguage method can be as simple as:

```js
function getCustomInterfaceLanguage() {
  return "it-IT";
}

let strings = new LocalizedStrings(
  {
    en: {
      how: "How do you want your egg today?",
      boiledEgg: "Boiled egg",
      softBoiledEgg: "Soft-boiled egg",
      choice: "How to choose the egg"
    },
    it: {
      how: "Come vuoi il tuo uovo oggi?",
      boiledEgg: "Uovo sodo",
      softBoiledEgg: "Uovo alla coque",
      choice: "Come scegliere l'uovo"
    }
  },
  {
    customLanguageInterface: getCustomInterfaceLanguage
  }
);
```

### Nativescript example

This is how you can use the library in a [Nativescript](https://www.nativescript.org) project

```js
const platform = require("platform");
this.strings = new LocalizedStrings(
  {
    en: {
      score: "Score",
      time: "Time"
    }
  },
  {
    customLanguageInterface: () => {
      return platform.device.language;
    }
  }
);
```

## Psuedo Helper

Sometimes you have already a lot of text string in your project and starts to implement a language component. Using Psuedo during this phase can help to speed up finding what is done and not.

In constructor you can enable

```js
pseudo: true;
```

This will turn a string as 'hello you' to '[qxjE2gx qtBy]'. This will help you quickly to see what strings are not using the localized-strings component. The randomized characters are wrapped in [ ]. These are to help you view the bounds of the string, so if they arent visible it might be outside the viewing area.

### Multiple Languages

If you are about to implement multiple languages you can enable

```js
pseudoMultipleLanguages: true;
```

This will make all strings about 40% longer.

## API

- constructor(languageObject,options)

```js
  options
  {
    // custom function that returns device language
    // @see 'Custom getInterfaceLanguage method' for more info
    customLanguageInterface: () => return 'it-IT'
    // Output issues finding strings and references
    logsEnabled: true
    // Helper for finding string that is implemented
    // @see Pseudo Helper for more info
    pseudo: false
    // Helper for preparing multiple langauges
    // @see Pseudo Helper for more info
    pseudoMultipleLanguages: false
  }
```

- setLanguage(languageCode) - to force manually a particular language
- getLanguage() - to get the current displayed language
- getInterfaceLanguage() - to get the current device interface language (from Navigation.language in browsers, BCP-47, https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language)
- getString(path) - get value from string path, returns error instead of throws exception as with . notation
- formatString() - to format the passed string replacing its placeholders {n} with the other arguments strings. Can also be used with $ref{id} to reference another string

```js
  en:{
    question:"I'd like {0} and {1}, or just {0}",
    questionWithReferences:"I'd like $ref{fridge.bread} and $ref{fridge.butter}, or just $ref{fridge.bread}",
    january: 'January',
    currentDate: 'The current date is {month} {day}, {year}!',
    fridge: {
      milk: 'milk',
      eggs: 'eggs',
      bread: 'bread',
      butter: 'butter'
    }
  }
  ...
  // Will output: I'd like bread and butter, or just bread
  strings.formatString(strings.question, strings.fridge.bread, strings.fridge.butter)

  // Will output: I'd like bread and butter, or just bread
  strings.formatString(strings.question, strings.fridge)

  // Will output: I'd like bread and butter, or just bread
  strings.formatString(strings.questionWithReferences)

  // Named tokens can also be used to give some extra context to the format strings
  // You cannot mix tokens, something like formatString('{0}, {name}', 'Hello', {name: 'Bob'}) won't work
  strings.formatString(strings.currentDate, {
    month: strings.january,
    day: 12,
    year: 2018
  })

  // Possible to use formatString with dot-notation, this is same as .getString and will not crash the application if the key isn't found.
  strings.formatString('fridge.missing.subnode')
```

**Beware: do not define a string key as formatString!**

- setContent(props) - to dynamically load another set of strings
- getAvailableLanguages() - to get an array of the languages passed in the constructor

## Examples

To force a particular language use something like this:

```js
_onSetLanguageToItalian() {
  strings.setLanguage('it');
  this.setState({});
}
```

## Typescript support

Because of the dynamically generated class properties, it's a little tricky to have the autocomplete functionality working.

Anyway it's possible to gain the desired results by:

1. defining an Interface that extends the LocalizedStringsMethods interface and has all the object string's keys
2. defining that the LocalizedStrings instance implements that interface

This is the suggested solution to work with Typescript:

```js
export interface IStrings extends LocalizedStringsMethods{
    score:string;
    time: String;
}

public strings: IStrings;
this.strings = new LocalizedStrings({
            it: {
                score: "Punti",
                time: "Tempo"
            },
            en: {
                score: "Score",
                time: "Time"
            }
        });
```

## Questions or suggestions?

Feel free to contact me on [Twitter](https://twitter.com/talpaz) or [open an issue](https://github.com/stefalda/localized-strings/issues/new).
