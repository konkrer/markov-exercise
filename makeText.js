/** Command-line tool to generate Markov text. */

const fs = require('fs');
const axios = require('axios');
const { MarkovMachine } = require('./markov');

/**
 * Function to load and return text from file or URL depending on inputType.
 *
 * @param {string} inputType
 * @param {string} path
 */
async function loadText(inputType, path) {
  let text;

  if (inputType === 'file') text = loadFile(path);
  else text = await loadFromURL(path);

  return text;
}

function loadFile(path) {
  try {
    var text = fs.readFileSync(path, 'utf8');
  } catch (error) {
    console.error('Unable to load text file!', error.message);
    process.exit(1);
  }
  return text;
}

async function loadFromURL(path) {
  try {
    var { data: text } = await axios.get(path);
  } catch (error) {
    console.error('Unable to load text from URL!', error.message);
    process.exit(1);
  }
  return text;
}
/***************************************************************************/
/**
 * Script to process calls from command line.
 */
const inputType = process.argv[2];
const path = process.argv[3];

if (!inputType || !['file', 'url'].includes(inputType)) {
  console.error(
    'makeText.js requires input type of "file" or "url" as first argument.'
  );
  process.exit(1);
}

if (!path) {
  console.error(
    'makeText.js requires a text source path as the second argument. It may be a file path or a URL for a text file.'
  );
  process.exit(1);
}

loadText(inputType, path)
  .then(text => {
    const mkv = new MarkovMachine(text);
    const markovText = mkv.makeText();
    console.log(markovText);
  })
  .catch(reject => console.log(reject.message));
