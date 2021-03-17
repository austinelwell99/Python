const fs = require('fs');
const path = require('path');
const readline = require('readline');

const paths = [
  path.join(__dirname, 'rawData', 'product.csv'),
  path.join(__dirname, 'rawData', 'related.csv'),
  path.join(__dirname, 'rawData', 'features.csv'),
  path.join(__dirname, 'rawData', 'styles.csv'),
  path.join(__dirname, 'rawData', 'skus.csv'),
];

const objs = {};

paths.forEach((path, index) => {
  const readInterface = readline.createInterface({
    input: fs.createReadStream(path, 'utf8'),
  });

  let currLine = 0;
  let template = {};

  readInterface.on('line', (entry) => {
    if (currLine === 0) {
      entry.split(',').map((val) => (template[val.trim()] = null));
    } else if (currLine < 2) {
      let currObj = {};
      let keys = Object.keys(template);
      let values = entry.split(',');

      for (let i = 0; i < keys.length; i++) {
        currObj[keys[i]] = values[i].trim() || null;
      }

      //product table
      if (index === 0) {
        objs[currObj.id] = { ...objs[currObj.id], ...currObj };
        console.log('objs[currObj.id]:', objs[currObj.id]);
      }

      //related items table
      if (index === 1) {
        let related = objs[currObj.current_product_id].related || [];
        objs[currObj.current_product_id].related = [
          ...related,
          currObj.related_product_id,
        ];
        console.log('objs[currObj.id]:', objs[currObj.id]);
      }

      //features table
      if (index === 2) {
        console.log(currObj);
      }

      //styles table
      // if (index === 3) {
      //   console.log(currObj);
      // }

      //skus table
      // if (index === 4) {
      //   console.log(currObj);
      // }
    }
    currLine++;
  });
});
