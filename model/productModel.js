const mongoose = require('mongoose');
const slugify = require('slugify');

const producetSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'A product must have name'],
    unique: [true, 'Product must be unique'],
  },
  typeOf: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'TypeOfProduct',
    },
  ],
  slug: String,
});

producetSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

producetSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'typeOf',
    select: '-_v',
  });

  next();
});

const product = mongoose.model('Product', producetSchema);

module.exports = product;
