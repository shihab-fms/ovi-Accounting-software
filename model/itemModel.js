const mongoose = require('mongoose');
const slugify = require('slugify');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A item must have a name'],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
  slug: String,
});

itemSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const itemModel = mongoose.model('Item', itemSchema);

module.exports = itemModel;
