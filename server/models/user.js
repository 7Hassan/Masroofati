/* eslint-disable func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "outcome"], required: true },
  date: { type: Date, required: true },
  reason: { type: String },
});

const WeekSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  transactions: [TransactionSchema],
});

const MonthSchema = new mongoose.Schema({
  month: { type: String, required: true },
  weeks: [WeekSchema],
});

const YearSchema = new mongoose.Schema({
  year: { type: String, required: true },
  months: [MonthSchema],
});


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name must not exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name must not exceed 50 characters'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      maxlength: [128, 'Password must not exceed 128 characters'],
      select: false, // Ensure password is not returned in queries by default
    },
    passwordToken: String,
    expPasswordToken: Date,
    years: [YearSchema],
    reasons: [
      { type: String, unique: true }
    ]
  },
  { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.isCorrectPass = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password has changed after a specific timestamp
userSchema.methods.isChangedPass = function (tokenTimestamp) {
  if (this.updatedAt) {
    const passwordChangeTime = parseInt(this.updatedAt.getTime() / 1000, 10); // Convert to seconds
    return passwordChangeTime > tokenTimestamp;
  }
  return false;
};

// Method to create a token for password reset or validation
userSchema.methods.createToken = function (type) {
  const token = crypto.randomBytes(32).toString('hex'); // Generate a random token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex'); // Hash the token

  if (type === 'password') {
    this.passwordToken = hashedToken; // Save hashed token
    this.expPasswordToken = Date.now() + 30 * 60 * 1000; // Token expires in 30 minutes
  }
  return token; // Return the raw token
};

// Ensure unique index on `phoneNumber`
userSchema.index({ phoneNumber: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
module.exports = User;



