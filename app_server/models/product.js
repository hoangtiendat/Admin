const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: String,
  new: Boolean,
  name: String,
  urlImage: String,
  discount: String,
  price: String,
  category: String
});

productSchema.index({coords: '2dsphere'});
mongoose.model('Product', productSchema);