const fs = require("fs");
const path = require("path");

const paths = [
  path.join(__dirname, "rawData", "features.csv"),
  path.join(__dirname, "rawData", "product.csv"),
  path.join(__dirname, "rawData", "related.csv"),
  path.join(__dirname, "rawData", "skus.csv"),
];

let featuresPath = paths[0];

const featuresObj = [];

const stream = fs.createReadStream(featuresPath, "utf8");

let flag = 0;

stream.on("data", (a) => {
  if (flag < 1) {
    console.log(a);
    flag++;
  }
});
