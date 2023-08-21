const mongoose = require('mongoose');
const validator = require('validator');
const { default: slugify } = require('slugify');

const ledgerSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'A ledger must have name'],
    maxLength: [50, 'A ledger name cound be max length of 50'],
  },
  typeof: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'PaymentType',
      required: [true, 'a ledger must have payment type'],
    },
  ],
  email: String,
  address: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    validate: [validator.isMobilePhone, 'please provide a phone'],
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  slug: String,
});

ledgerSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

ledgerSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'typeof',
    select: 'slug',
  });
  next();
});

const ledger = mongoose.model('Ledger', ledgerSchema);

module.exports = ledger;
