const mongoose = require('mongoose');
const slugify = require('slugify');

const unitSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A unit must have a name'],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
  slug: String,
});

unitSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const unitModel = mongoose.model('Unit', unitSchema);

module.exports = unitModel;
