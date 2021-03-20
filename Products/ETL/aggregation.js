
//1.RELATED ITEMS
//----------------------------------------------------------------------------------------------------------------------

//filtering related items into a single array for each product, containing all the ids of related items
db.related.aggregate([
  {$group: {_id: '$current_product_id', related: {$addToSet: '$related_product_id'}}},
  {$out: { db: 'sdc', coll: 'mergedRelated' }}
], {allowDiskUse: true})

mergedRelated.createIndex({id: 1})

//adding related items array to product with matching id
db.products.aggregate([
  {
    $lookup: {
      from: "mergedRelated",
      localField: "id",
      foreignField: "_id",
      as: "relatedItems"
    }
  },
  {$unwind: '$relatedItems'},
  {$out: { db: 'sdc', coll: 'products' }}
 ])

// //pulling out the related items array to root level
db.products.updateMany({}, {$rename: {'relatedItems.related': 'related'}})

// //deleting the skeleton of the nested related items array
db.products.aggregate([{$unset: 'relatedItems'}, {$out: { db: 'sdc', coll: 'products' }}])


//2.FEATURES
//----------------------------------------------------------------------------------------------------------------------

db.features.aggregate([
  {$group: {_id: '$productId', features: {$push: {feature: '$feature', value: '$value'}}}},
  {$out: { db: 'sdc', coll: 'mergedFeatures' }}
], {allowDiskUse: true})

mergedFeatures.createIndex({id: 1})

db.products.aggregate([
  {
    $lookup: {
      from: "mergedFeatures",
      localField: "id",
      foreignField: "_id",
      as: "featuresParent"
    }
  },
  {$unwind: '$featuresParent'},
  {$out: { db: 'sdc', coll: 'products' }}
])

db.products.updateMany({}, {$rename: {'featuresParent.features': 'features'}})

db.products.aggregate([{$unset: 'featuresParent'}, {$out: { db: 'sdc', coll: 'products' }}])


// 3.SKUS
// ----------------------------------------------------------------------------------------------------------------------

//filtering skus into single array for each style, filling the array with objects that have key value pairs (key is the sku id, value is the sku info)
db.skus.aggregate([
  {$group: {_id: '$styleId', skus: {$push: {'k': {$toString: '$id'}, 'v': {quantity: '$quantity', size: '$size'}}}}},
  {$out: { db: 'sdc', coll: 'mergedSkus' }}
], {allowDiskUse: true})

mergedSkuscreateIndex({id: 1})

//Merging into matching product and pulling out the array as normal
db.styles.aggregate([
  {
    $lookup: {
      from: "mergedSkus",
      localField: "id",
      foreignField: "_id",
      as: "skusParent"
    }
  },
  {$unwind: '$skusParent'},
  {$out: { db: 'sdc', coll: 'styles' }}
])

db.styles.updateMany({}, {$rename: {'skusParent.skus': 'skus'}})

//Removing old field as normal, also turning skus array into objects using the key value pairs set earlier
db.styles.aggregate([
  {$unset: 'skusParent'},
  {$project: {id: 1, productId: 1, name: 1, sale_price: 1, original_price: 1, default_style: 1, photos: 1, skus: {$arrayToObject: '$skus'}}},
  {$out: { db: 'sdc', coll: 'styles' }}
])


//4.PHOTOS
//----------------------------------------------------------------------------------------------------------------------

db.photos.aggregate([
  {$group: {_id: '$styleId', photos: {$push: {url: '$url', thumbnail_url: '$thumbnail_url'}}}},
  {$out: { db: 'sdc', coll: 'mergedPhotos' }}
], {allowDiskUse: true})

mergedPhotos.createIndex({id: 1})

db.styles.aggregate([
  {
    $lookup: {
      from: "mergedPhotos",
      localField: "id",
      foreignField: "_id",
      as: "photosParent"
    }
  },
  {$unwind: '$photosParent'},
  {$out: { db: 'sdc', coll: 'styles' }}
])

db.styles.updateMany({}, {$rename: {'photosParent.photos': 'photos'}})

db.styles.aggregate([{$unset: 'photosParent'}, {$out: { db: 'sdc', coll: 'styles' }}])


//5.STYLES
//----------------------------------------------------------------------------------------------------------------------

db.styles.aggregate([
  {$group: {_id: '$productId', styles: {$push: {style_id: '$id', name: '$name', original_price: '$original_price', sale_price: '$sale_price', skus: '$skus', photos: '$photos', default: '$id' === '$default_style' ? true : false}}}},
  {$out: { db: 'sdc', coll: 'mergedStyles' }}
], {allowDiskUse: true})

mergedStyles.createIndex({id: 1})

db.products.aggregate([
  {
    $lookup: {
      from: "mergedStyles",
      localField: "id",
      foreignField: "_id",
      as: "stylesParent"
    }
  },
  {$unwind: '$stylesParent'},
  {$out: { db: 'sdc', coll: 'products' }}
])

db.products.updateMany({}, {$rename: {'stylesParent.styles': 'styles'}})

db.products.aggregate([{$unset: 'stylesParent'}, {$out: { db: 'sdc', coll: 'products' }}])

db.mergedRelated.drop()
db.mergedFeatures.drop()
db.mergedSkus.drop()
db.mergedPhotos.drop()
db.mergedStyles.drop()
db.related.drop()
db.features.drop()
db.skus.drop()
db.photos.drop()
db.styles.drop()