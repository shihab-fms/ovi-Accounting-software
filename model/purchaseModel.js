const mongoose = require('mongoose');
const slugify = require('slugify');

const purchaseSchema = new mongoose.Schema({
  purchases: [
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
        min: [1, 'Total purchase shoud more then 1'],
      },
    },
  ],
  date: {
    type: Date,
    default: new Date(Date.now()),
  },
  summeryAmount: {
    type: Number,
    min: [1, 'total purchase sould more then 1'],
    default: function (el) {
      return (this.el = this.purchases
        .reduce((acc, el) => acc + el.totalAmount * 1, 0)
        .toFixed(2));
    },
  },
});

purchaseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'purchases',
    populate: {
      path: 'name',
      select: '-_v',
    },
  });
  next();
});

purchaseSchema.methods.updateSummeryAmount = function () {
  let summeryAmount = this.purchases.reduce(
    (acc, el) => acc + el.totalAmount * 1,
    0
  );
  // console.log(summeryAmount);
  return summeryAmount;
};

const purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = purchase;
