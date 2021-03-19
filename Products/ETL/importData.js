const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/sdc`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number,
});
const Product = mongoose.model('Product', productSchema);
//mongoimport --collection products --db sdc --file ETL/rawData/product.csv --ignoreBlanks --headerline --type csv

const featureSchema = new mongoose.Schema({
  id: Number,
  productId: Number,
  feature: String,
  value: String,
});
const Feature = mongoose.model('Feature', featureSchema);
//mongoimport --collection features --db sdc --file ETL/rawData/features.csv --ignoreBlanks --headerline --type csv

const relatedSchema = new mongoose.Schema({
  id: Number,
  current_product_id: Number,
  related_product_id: Number,
});
const Related = mongoose.model('Related', relatedSchema);
//mongoimport --collection related --db sdc --file ETL/rawData/related.csv --ignoreBlanks --headerline --type csv

const styleSchema = new mongoose.Schema({
  id: Number,
  productId: Number,
  name: String,
  sale_price: Number,
  original_price: Number,
  default_style: Boolean,
});
const Style = mongoose.model('Styles', styleSchema);
//mongoimport --collection styles --db sdc --file ETL/rawData/styles.csv --ignoreBlanks --headerline --type csv

const skuSchema = new mongoose.Schema({
  id: Number,
  styleId: Number,
  size: Number,
  quantity: Number,
});
const Sku = mongoose.model('Skus', skuSchema);
//mongoimport --collection skus --db sdc --file ETL/rawData/skus.csv --ignoreBlanks --headerline --type csv

const photoSchema = new mongoose.Schema({
  id: Number,
  styleId: Number,
  url: String,
  thumbnail_url: String,
});
const Photo = mongoose.model('Photos', photoSchema);
//mongoimport --collection photos --db sdc --file ETL/rawData/photos.csv --ignoreBlanks --headerline --type csv

//testing with first 10 products
// mongoimport --collection testProducts --db sdc --file ETL/rawData/testProducts.csv --ignoreBlanks --headerline --type csv
// mongoimport --collection testStyles --db sdc --file ETL/rawData/testStyles.csv --ignoreBlanks --headerline --type csv