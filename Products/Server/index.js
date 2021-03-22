/* eslint-disable no-console */
const express = require('express');

const app = express();
const port = 3000;
const db = require('../Database/Index.js');

app.use(express.json())

app.get('/products', (req, res) => {
  const count = req.body?.count || 5
  const skip = (req.body?.page || 1) * count - count
  return db.sendAll(count, skip)
    .then(data => {
      const output = []
      data.forEach(curr => {
        let shaped = (({id, name, slogan, description, category, default_price}) => ({id, name, slogan, description, category, default_price}))(curr)
        shaped.default_price = shaped.default_price.toString()
        output.push(shaped)
      })
      res.send(output).status(200)
    })
    .catch(err => res.send(err).status(500))
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
