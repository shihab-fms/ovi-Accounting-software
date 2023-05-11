const mongoose = require('mongoose');
const slugify = require('slugify');

const typeOfProductSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Must have to put name of product type'],
    unique: [true,'Product type should be unique']
  },
  slug: String,
});

typeOfProductSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const typeOfProduct = mongoose.model('TypeOfProduct', typeOfProductSchema);

module.exports = typeOfProduct;
