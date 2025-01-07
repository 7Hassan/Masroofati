/* eslint-disable func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { colorsData, daysData } = require('../controller/variables');

const getRandomColor = () => colorsData[Math.floor(Math.random() * colorsData.length)];

const TransactionSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  type: { type: String, enum: ["income", "outcome"], required: true },
  date: { type: Date, required: true },
  label: { type: String },
  color: { type: String, default: getRandomColor }
});

const DaySchema = new mongoose.Schema({
  day: { type: String, required: true },
  name: { type: String, required: true, enum: daysData },
  totalIncome: { type: Number, default: 0 },
  totalOutcome: { type: Number, default: 0 },
  income: [TransactionSchema],
  outcome: [TransactionSchema],
});


const WeekSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  totalIncome: { type: Number, default: 0 },
  totalOutcome: { type: Number, default: 0 },
  days: [DaySchema],
});

const MonthSchema = new mongoose.Schema({
  month: { type: String, required: true },
  monthNum: { type: Number, required: true },
  totalIncome: { type: Number, default: 0 },
  totalOutcome: { type: Number, default: 0 },
  weeks: [WeekSchema],
});

const YearSchema = new mongoose.Schema({
  year: { type: String, required: true },
  totalIncome: { type: Number, default: 0 },
  totalOutcome: { type: Number, default: 0 },
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
      select: false,
    },
    years: {
      type: [YearSchema], // Array of strings
      default: [],    // Default value as an empty array
    },
    labels: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  this.date = Date.now() - 1000
  next()
})

userSchema.methods.isCorrectPass = async function (password, hashPassword) {
  return await bcrypt.compare(password, hashPassword)
}

let User = mongoose.model('users', userSchema)
module.exports = User;


