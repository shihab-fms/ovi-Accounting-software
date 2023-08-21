const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'provide your email'],
    trim: true,
  },
  photo: String,
  role: {
    type: String,
    // enum: []
    default: 'supervisor',
  },
  dateOfBirth: Date,
  password: {
    type: String,
    required: [true, 'please provide your password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'password not matched, please confirm',
    },
  },
  passwordChangeAt: Date,
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
    select: false,
  },
  authBrunch: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Branch',
    },
  ],
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  slug: String,
});

userSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Hashing user password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // making hash
  this.password = await bcrypt.hash(this.password, 12);

  // do not saving confirm password on database
  this.passwordConfirm = undefined;
  next();
});

//login password comparing between user and bcrypt

userSchema.methods.loginCorrectPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.chandedPasswordAfter = function (jwtTimeStmp) {
  if (this.passwordChangeAt) {
    const changedTimeStmp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    // console.log(changedTimeStmp, jwtTimeStmp)

    return changedTimeStmp > jwtTimeStmp;
  }
  return false;
};

// Used for when search for user only active user shoud show.
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const user = mongoose.model('User', userSchema);

module.exports = user;
