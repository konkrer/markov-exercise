/**Tests for markov generator - markov.js */

const { MarkovMachine } = require('./markov');

describe('Test MarkovMachine class', function () {
  let testText = 'The smart brown cow seeks shelter.';

  // beforeAll not needed? I'll use it when it seems necessary.
  const mkvDefault = new MarkovMachine();
  const mkvGiven = new MarkovMachine(testText);

  test('Test class instantiation default text', function () {
    expect(mkvDefault.words.length).toEqual(778);
    expect(Object.keys(mkvDefault.chains).length).toEqual(114);
    const samiamNexts = ['That', 'Do', 'Would', null];
    expect(mkvDefault.chains['SamIam']).toEqual(new Set(samiamNexts));
  });

  test('Test class intantiation with given text', function () {
    expect(mkvGiven.words.length).toEqual(6);
    expect(Object.keys(mkvGiven.chains).length).toEqual(6);
    expect(mkvGiven.chains['cow']).toEqual(new Set(['seeks']));
  });

  test('Test makeText with default text', function () {
    const text = mkvDefault.makeText();
    const words = text.split(' ');

    expect(words.length).toBeGreaterThanOrEqual(1);
    expect(words.length).toBeLessThanOrEqual(100);

    if (words.length > 1) {
      const firstWord = words[0];
      const secondWord = words[1];
      expect(mkvDefault.chains[firstWord]).toContain(secondWord);
    }
  });

  test('Test makeText with default text with numWords input', function () {
    const text = mkvDefault.makeText(20);
    const words = text.split(' ');

    expect(words.length).toBeGreaterThanOrEqual(1);
    expect(words.length).toBeLessThanOrEqual(20);

    if (words.length > 1) {
      const firstWord = words[0];
      const secondWord = words[1];
      expect(mkvDefault.chains[firstWord]).toContain(secondWord);
    }
  });

  test('Test makeText with given text', function () {
    const text = mkvGiven.makeText();
    const words = text.split(' ');

    expect(words.length).toBeGreaterThanOrEqual(1);
    expect(words.length).toBeLessThanOrEqual(6);

    if (words.length > 1) {
      const firstWord = words[0];
      const secondWord = words[1];
      expect(mkvGiven.chains[firstWord]).toContain(secondWord);
    }
  });

  test('Test makeText with given text with numWords input', function () {
    const text = mkvGiven.makeText(3);
    const words = text.split(' ');

    expect(words.length).toBeGreaterThanOrEqual(1);
    expect(words.length).toBeLessThanOrEqual(3);

    if (words.length > 1) {
      const firstWord = words[0];
      const secondWord = words[1];
      expect(mkvGiven.chains[firstWord]).toContain(secondWord);
    }
  });

  test('Test makeChains', function () {
    expect(mkvGiven.chains).toEqual({
      The: new Set(['smart']),
      smart: new Set(['brown']),
      brown: new Set(['cow']),
      cow: new Set(['seeks']),
      seeks: new Set(['shelter.']),
      'shelter.': new Set([null]),
    });
  });
});
