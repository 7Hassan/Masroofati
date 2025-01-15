const User = require('../models/user')
const catchError = require('../Errors/catch')
const AppError = require('../Errors/classError')
const helper = require('./helperFunc')



exports.protectAuth = async (req, res, next) => {
  const { user } = await helper.testJwtToken(req, res, next)
  if (!user || user.isGuest) return next()
  next(new AppError('You are register', 401))
}

exports.signUp = catchError(async (req, res, next) => {
  const data = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
  }
  const user = await User.findOne({ phoneNumber: data.phoneNumber }).select('+password')
  if (user) return next(new AppError('Phone number is used', 401))
  const newUser = await User.create(data)
  const jwtToken = helper.createJwtToken(newUser._id)
  res.cookie('jwt', jwtToken, helper.cookieOptions).status(200).json({ success: true })
})

exports.login = catchError(async (req, res, next) => {
  const { phoneNumber, password } = req.body
  if (!phoneNumber) return next(new AppError('Phone number required', 401))
  if (!password) return next(new AppError('Password required', 401))
  if (password.length < 8) return next(new AppError('Incorrect password', 401))
  const user = await User.findOne({ phoneNumber }).select('+password')
  if (!user) return next(new AppError('Incorrect phone number', 401))
  const isMatch = await user.isCorrectPass(password, user.password)
  if (!isMatch) return next(new AppError('Incorrect Password', 401))
  const jwtToken = helper.createJwtToken(user._id)
  const { firstName, lastName } = user;
  res.cookie('jwt', jwtToken, helper.cookieOptions).status(200).json({ success: true, data: { firstName, lastName } })
})
