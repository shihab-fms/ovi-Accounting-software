const mongoose = require('mongoose');
const slugify = require('slugify');

const paymentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A payment type must have name'],
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
});

paymentTypeSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const paymentType = mongoose.model('PaymentType', paymentTypeSchema);

module.exports = paymentType;
