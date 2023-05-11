const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have a mail ID'],
    validate: [validator.isEmail, 'Please provide an email'],
    trim: true,
    unique: [true,'Already have account with this email.']
  },
  role: {
    type: String,
    default: 'user',
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Please provide your password...'],
    select: false,
  },
  confirmPassword: {
    type: String,
    minlength: 8,
    required: [true, 'Please confirm your password'],

    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'password does not match, please confirm it',
    },
    select: false,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
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
  this.confirmPassword = undefined;
  next();
});

//login password comparing between user and bcrypt

userSchema.methods.loginCorrectPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.correctPassword = async function (
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
