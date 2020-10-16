const mongoose = require('mongoose');

const product = {
  id: 'string',
  name: 'string',
  productPrice: 'number',
  productNotation: 'number',
  inStock: 'boolean',
  num: 'number',
  category: 'string',
  shortDescription: 'string',
  notation: 'number',
  filename: 'string'
};

module.exports = mongoose.model('product', product);
