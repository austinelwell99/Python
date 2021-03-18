
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream(path.join(__dirname, 'rawData', 'photos.csv'), 'utf8'),
});

let currLine = 0;

readInterface.on('line', (entry) => {

  if (currLine !== 0) {
    if (entry.charAt(entry.length - 1) !== '"') {
      console.log(currLine)
    }
  }
  currLine++

})
