const mongoose = require('mongoose');
const slugify = require('slugify');

const paymentSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: 'Branch',
    require: [true, 'A payment must have a branch name'],
  },
  payment: [
    {
      ledgerName: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ledger',
        require: [true, 'A payment must have ledger'],
      },
      purpose: {
        type: String,
        require: [true, 'you need put some comments'],
        maxlength: [100, 'must belongs under 100 words'],
      },
      amount: {
        type: Number,
        require: [true, 'please put amount'],
        min: [1, 'a payment should be more than or equle one'],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
  date: {
    type: Date,
    require: [true, 'a payment must have a data'],
  },
  summeryAmount: {
    type: Number,
    default: function (el) {
      return (el = this.payment.reduce((acc, el) => acc + el.amount * 1, 0));
    },
  },
});

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

/* Methods and Middleware */

// paymentSchema.pre(/^findById/, function (next) {
//   if (!this.isModified('payment')) return next();
//   let sum = 0;
//   // console.log(this.payment);
//   sum = this.payment.reduce((acc, el) => acc + el.amount * 1, 0);
//   this.summeryAmount = sum;
//   console.log(sum);
//   console.log(this.summeryAmount);
//   next();
// });

// paymentSchema.pre('save', function (next) {
//   if (!this.isModified('payment')) return next();
//   let sum = 0;
//   console.log(this.payment);
//   sum = this.payment.reduce((acc, el) => acc + el.amount * 1, 0);
//   this.summeryAmount = sum;
//   console.log(sum);
//   console.log(this.summeryAmount);
//   next();
// });

paymentSchema.methods.updateSummeryAmount = function () {
  let summeryAmount = this.payment.reduce((acc, el) => acc + el.amount * 1, 0);
  // console.log(summeryAmount);
  return summeryAmount;
};

paymentSchema.methods.authorizedUser = function (authId) {
  
  if (authId.includes(this.branch.id)) return true;

  return false;
};

paymentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'payment',
    populate: {
      path: 'ledgerName',
      select: 'name',
    },
  });

  next();
});

paymentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'branch',
    select: 'name slug',
  });
  next();
});

const payment = mongoose.model('Payment', paymentSchema);

module.exports = payment;
