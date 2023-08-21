const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.ObjectId,
      ref: 'Branch',
      require: [true, 'A purchase must have a Branch'],
    },
    ladgerName: {
      type: mongoose.Schema.ObjectId,
      ref: 'Ledger',
      require: [true, 'A Purchase must belongs to a party'],
    },
    date: {
      type: Date,
      default: new Date(Date.now()),
    },
    items: [
      {
        itemName: {
          type: mongoose.Schema.ObjectId,
          ref: 'Item',
          require: [true, 'A item must have a name'],
        },
        unit: {
          type: mongoose.Schema.ObjectId,
          ref: 'Unit',
          require: [true, 'A item must have a unit'],
        },
        narration: {
          type: String,
          trim: true,
          require: [true, 'A item must need comments'],
          maxlength: [100, 'Comments must belongs under 100 words'],
        },
        quantity: {
          type: Number,
          require: [true, 'A item must have a quantity'],
          min: [1, 'Quantity should be more then one'],
        },
        rate: {
          type: Number,
          require: [true, 'A item must have rate'],
          min: [1, 'Rate should be more then one'],
        },
        total: {
          type: Number,
          default: function (el) {
            return (el = this.quantity * this.rate).toFixed(2);
          },
        },
      },
    ],
    summeryAmount: {
      type: Number,
      min: [1, 'Total amount should be more then one.'],
      default: function (el) {
        return (el = this.items.reduce(
          (acc, el) => acc + el.total * 1,
          0
        )).toFixed(2);
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// purchaseSchema.pre('findByIdAndUpdate', function (next) {
//   this.summeryAmount = this.items
//     .reduce((acc, el) => acc + el.total, 0)
//     .toFixed(2);
//   console.log(this.summeryAmount);
//   next();
// });

purchaseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'branch',
    select: 'name'
  })
  next();
})

purchaseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'ladgerName',
    select: 'name typeof',
  });
  next();
})

purchaseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items',
    populate: {
      path: 'itemName',
      select: 'name slug',
    },
  });

  next();
});

purchaseSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items',
    populate: {
      path: 'unit',
      select: 'name',
    },
  });

  next();
});

const purchaseModel = mongoose.model('Purchase', purchaseSchema);

module.exports = purchaseModel;
