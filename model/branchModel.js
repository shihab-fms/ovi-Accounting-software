const mongoose = require('mongoose');
const slugify = require('slugify');

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A brunch must have name'],
      unique: true,
      trim: true
    },
    address: {
      type: String,
      trim: true,
    },
    employees: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    images: [String],
    description: String,
    createdAt: {
      type: Date,
      default: new Date(),
    },
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

branchSchema.index({ slug: 1 });

// presave middleware for sluging name fields
branchSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// branchSchema.pre('findByIdAndUpdate', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// Get Employee status and Details from User Model via populating

branchSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'employees',
    select: '-_v',
  });

  next();
});

const branch = mongoose.model('Branch', branchSchema);

module.exports = branch;
