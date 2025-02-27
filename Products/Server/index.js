/* eslint-disable no-console */
const express = require('express');
require('newrelic');

const app = express();
const port = 3000;
const db = require('../Database/Index.js');

app.use(express.json())

app.get('/loaderio-67921d4cb8f53beee31643c5f638e905', (req, res) => {
  res.send('loaderio-67921d4cb8f53beee31643c5f638e905').status(200)
})

app.get('/products', (req, res) => {
  let count = req.query?.count|| 5
  if (count > 500) count = 500
  const skip = (req.query?.page || 1) * count - count
  db.sendAll(count, skip)
    .then(data => {
      const output = []
      data.forEach(curr => {
        let shaped = (({id, name, slogan, description, category, default_price}) => ({id, name, slogan, description, category, default_price}))(curr)
        shaped.default_price = shaped.default_price.toString()
        output.push(shaped)
      })
      res.status(200).send(output)
    })
    .catch(err => res.status(500).send(err))
});

app.get('/products/:product_id', (req, res) => {
  return db.sendOne(req.params.product_id)
    .then(data => {
      const output = (({id, name, slogan, description, category, default_price, features}) => ({id, name, slogan, description, category, default_price, features}))(data[0])
      res.send(output).status(200)
    })
    .catch(err => res.send(err).status(500))
});

app.get('/products/:product_id/styles', (req, res) => {
  return db.sendOne(req.params.product_id)
  .then(data => {
    const output = {product_id: data[0].id, results:data[0].styles}
    res.send(output).status(200)
  })
  .catch(err => res.send(err).status(500))
});

app.get('/products/:product_id/related', (req, res) => {
  return db.sendOne(req.params.product_id)
  .then(data => res.send(data[0].related).status(200))
  .catch(err => res.send(err).status(500))
});

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});
