const mongoose = require('mongoose');

mongoose.connect('mongodb://172.31.47.239:27017/sdc', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const featureSchema = new mongoose.Schema({
  feature: String,
  value: String,
});

const individualSkuSchema = new mongoose.Schema({
  size: Number,
  quantity: Number,
});

const skuSchema = new mongoose.Schema({
  id: [individualSkuSchema],
});

const photoSchema = new mongoose.Schema({
  url: String,
  thumbnail_url: String,
});

const styleSchema = new mongoose.Schema({
  style_id: Number,
  name: String,
  original_price: Number,
  sale_price: Number,
  default: Boolean,
  skus: [skuSchema],
  photos: [photoSchema],
});

const productSchema = mongoose.Schema({
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number,
  related: [],
  features: [featureSchema],
  styles: [styleSchema],
});

const Product = mongoose.model('Product', productSchema);

const sendAll = (count, skip) => {
  return Product.find().skip(+skip).limit(+count).hint({ id : 1 });
};

const sendOne = (idIn) => {
  return Product.find({id: idIn});
};

module.exports.sendAll = sendAll;
module.exports.sendOne = sendOne;
