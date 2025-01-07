const User = require('../models/user')
const crypto = require('crypto')
const catchError = require('../Errors/catch')
const AppError = require('../Errors/classError')
const helper = require('./helperFunc')



exports.protectAuth = async (req, res, next) => {
  const { user } = await helper.testJwtToken(req, res, next)
  if (!user || user.isGuest) return next()
  next(new AppError('You are register', 401))
}

exports.userTemp = async (req, res, next) => {
  const user = await User.findOne({ email: "hassanhossam.dev@gmail.com" });
  const { firstName, lastName, img } = user;
  const jwtToken = helper.createJwtToken(user._id)
  res.cookie('jwt', jwtToken, helper.cookieOptions).status(201).json({ success: true });
}



exports.signUp = catchError(async (req, res, next) => {
  const data = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
  }
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

exports.forgetPass = catchError(async (req, res, next) => {
  const user = await User.findOne({ userName: req.body.userName })
  if (!user) return next(new AppError('Incorrect Email', 401))
  const code = user.createCode()
  await user.save()
  await new Email(user.name, user.email, code).codeVerification()
  res.status(201).send({ success: true, data: {} })
})

exports.changePass = catchError(async (req, res, next) => {
  const { code, newPassword } = req.body;
  const token = crypto.createHash('sha256').update(code).digest('hex')
  const user = await User.findOne({ code: token, codeEx: { $gt: Date.now() } }).select('+password +code +codeEx')
  if (!user) return next(new AppError('Invalid Code', 404))
  user.password = newPassword
  user.code = undefined
  user.codeEx = undefined
  await user.save()
  const jwtToken = helper.createJwtToken(user._id)
  res.cookie('jwt', jwtToken, helper.cookieOptions).status(200).json({ success: true, data: user })
})

