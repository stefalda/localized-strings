const LocalizedStrings = require('./lib/LocalizedStrings').default;

const strings = new LocalizedStrings({
  en: {
    question: "I'd like {0} and {1}, or just {0}",
    questionWithObject: "I'd like {bread} and {eggs}, or just {bread}",
    questionWithReferences:
      "I'd like $ref{fridge.bread} and $ref{fridge.butter}, or just $ref{fridge.bread}",
    login: 'login',
    onlyForMembers: 'You have to {0} in order to use our app',
    bold: 'bold',
    iAmText: 'I am {0} text',
    january: 'January',
    currentDate: 'The current date is {month} {day}, {year}!',
    fridge: {
      milk: 'milk',
      eggs: 'eggs',
      bread: 'bread',
      butter: 'butter',
    },
  },
});

// Will output: I'd like bread and butter, or just bread
console.log('Input each value');
console.log(
  '   ',
  strings.formatString(
    strings.question,
    strings.fridge.bread,
    strings.fridge.butter,
  ),
);

// Will output: I'd like bread and butter, or just bread
console.log('Input object');
console.log(
  '   ',
  strings.formatString(strings.questionWithObject, strings.fridge),
);

// Will output: I'd like bread and butter, or just bread
console.log('Input references from string');
console.log('   ', strings.formatString(strings.questionWithReferences));

// Possible to use formatString with dot-notation, this is same as .getString and will not crash the application if the key isn't found.
console.log('Input string that doesnt exists');
console.log('   ', strings.formatString('fridge.missing'));

console.log('Input object that doesnt exists');
console.log('   ', strings.formatString(strings.fridge.missing.more));
