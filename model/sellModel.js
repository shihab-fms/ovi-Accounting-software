const mongoose = require('mongoose');
const slugify = require('slugify');

const sellSchema = new mongoose.Schema({
  sells: [
    {
      name: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'A item must have a name'],
        trim: true,
      },
      quantity: {
        type: Number,
        required: [true, 'A item must have quantity'],
        min: [1, 'Quantity shoud more then 1'],
      },
      rate: {
        type: Number,
        required: [true, 'Product must have rate'],
        min: [1, 'Rate could not less then 1'],
      },
      totalAmount: {
        type: Number,
        default: function (el) {
          return (this.el = (this.rate * this.quantity * 1).toFixed(2));
        },
        min: [1, 'Total sell shoud more then 1'],
      },
    },
  ],
  date: {
    type: Date,
    default: new Date(Date.now()),
  },
  summeryAmount: {
    type: Number,
    min: [1, 'total sell sould more then 1'],
    default: function (el) {
      return (this.el = this.sells
        .reduce((acc, el) => acc + el.totalAmount * 1, 0)
        .toFixed(2));
    },
  },
});

sellSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'sells',
    populate: {
      path: 'name',
      select: '-_v',
    },
  });
  next();
});

sellSchema.methods.updateSummeryAmount = function () {
  let summeryAmount = this.sells.reduce(
    (acc, el) => acc + el.totalAmount * 1,
    0
  );
  // console.log(summeryAmount);
  return summeryAmount;
};

const sell = mongoose.model('Sell', sellSchema);

module.exports = sell;
