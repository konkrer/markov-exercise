/** Textual markov chain generator */

const fs = require('fs');

class MarkovMachine {
  /** build markov machine; read in text.*/

  constructor(text) {
    // If not text given load default text for testing.
    if (!text) text = this.loadDefaultText();
    // Remove special characters (not . or ! or ?) and split words.
    let words = text
      .replace(/[“”—:'",;#@$%^&*_=`~><\|\-\{\}\[\]\+\(\)\/\\]+/g, '')
      .split(/[ \r\n]+/);
    // Remove empty strings
    this.words = words.filter(c => c !== '');
    // Make all words lowercase.
    // .map(w => w[0].toLowerCase() + w.slice(1));
    this.chains = {};
    this.makeChains();
  }

  /**
   *  Make markov chains object.
   */

  makeChains() {
    this.words.forEach((word, idx) => {
      // nextWord is the next word or null.
      const nextWord = this.words[idx + 1] || null;
      // If nextWord is key in chains object add to the set.
      if (this.chains[word]) this.chains[word].add(nextWord);
      // Else make a new set containing next word.
      else this.chains[word] = new Set([nextWord]);
    });
  }

  /** return random text from chains */

  makeText(numWords = 100) {
    // Find random first word.
    const distinctWords = Object.keys(this.chains);
    const seed = Math.floor(Math.random() * distinctWords.length);
    let currentWord = distinctWords[seed];
    // Add first word to output array.
    const out = [currentWord];

    // Add numWords number of words to ouput array unless null found.
    for (let i = 0; i < numWords - 1; i++) {
      // Make set an array for convienience.
      const nextWords = [...this.chains[currentWord]];
      // Pick a random word from nextWords array.
      currentWord = nextWords[Math.floor(Math.random() * nextWords.length)];
      if (currentWord === null) break;
      out.push(currentWord);
    }
    // return output sting
    const outString = out.join(' ');
    // If outString ends with a period don't add period else add one.
    return outString[outString.length - 1] === '.'
      ? outString
      : outString + '.';
  }

  /**
   * Load default Seuss as text for testing.
   */
  loadDefaultText() {
    try {
      var data = fs.readFileSync('eggs.txt', 'utf8');
    } catch (error) {
      console.error('Unable to load default text!', error);
      process.exit(1);
    }
    return data;
  }
}

module.exports = { MarkovMachine };
