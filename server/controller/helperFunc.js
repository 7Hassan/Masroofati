const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const AppError = require('../Errors/classError')
const WebSocket = require('ws');
const multer = require('multer')
const sharp = require('sharp');
const { format, getISOWeek, startOfMonth, differenceInCalendarDays, getDay } = require("date-fns");


exports.cookieOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};

exports.createJwtToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED })


exports.testJwtToken = async (req) => {
  let cookie, user, time
  if (req.cookies) cookie = req.cookies.jwt
  if (!cookie) return { user, time }
  if (cookie.split('.').length !== 3) return { user, time }
  await promisify(jwt.verify)(cookie, process.env.JWT_SECRET)
    .then(async (decoded) => {
      time = decoded.iat
      user = await User.findOne({ _id: decoded.id })
    }).catch((err) => 0)
  return { user, time }
}

exports.sendSocket = (data) => wss.clients.forEach((client) => (client.readyState === WebSocket.OPEN) ? client.send(data) : 0)

exports.pageObject = (title, req) => {
  return {
    title: title,
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  }
}

const multerStorage = multer.memoryStorage()
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true)
  else cb(new AppError('Please upload only images', 400), false)
}

exports.upload = multer({ storage: multerStorage, fileFilter: multerFilter })

exports.sharpImg = (req) => sharp(req.file.buffer)
  .resize(500, 500)
  .toFormat('jpeg')
  .jpeg({ quality: 90 })
  .toFile(`public/imgs/users/${req.file.filename}`)


exports.conflictTime = (start, end, lectures) => {
  return lectures.some(lecture => {
    return (
      (start >= lecture.start && start < lecture.end) ||
      (end > lecture.start && end <= lecture.end) ||
      (start <= lecture.start && end >= lecture.end)
    );
  });
}


const getWeekOfMonth = (date) => {
  const weekStartsOn = 6
  const start = startOfMonth(date);
  const daysDifference = differenceInCalendarDays(date, start);
  const firstDayOfMonth = getDay(start);
  const offset = (firstDayOfMonth - weekStartsOn + 7) % 7; // تعديل الفرق ليبدأ من السبت
  return Math.floor((daysDifference + offset) / 7) + 1;
};




exports.getDates = (date) => {
  const year = format(date, "yyyy")
  const month = format(date, "MMM")
  const week = getWeekOfMonth(date);
  const day = format(date, "dd/MMM/yyyy")
  return { day, week, month, year }
}

exports.calculateMoney = (years, date) => {
  const { day, week, month, year } = exports.getDates(new Date(date));
  const initial = {
    dayIncome: 0, dayOutcome: 0,
    weekIncome: 0, weekOutcome: 0,
    monthIncome: 0, monthOutcome: 0,
    yearIncome: 0, yearOutcome: 0,
  }

  const yearData = years.find((y) => y.year == year);
  if (!yearData) return initial;

  initial.yearIncome += yearData.totalIncome;
  initial.yearOutcome += yearData.totalOutcome;

  const monthData = yearData.months.find((m) => m.month == month);
  if (!monthData) return initial;

  initial.monthIncome += monthData.totalIncome;
  initial.monthOutcome += monthData.totalOutcome;

  const weekData = monthData.weeks.find((w) => w.weekNumber == week);
  if (!weekData) return initial;

  initial.weekIncome += weekData.totalIncome;
  initial.weekOutcome += weekData.totalOutcome;

  const dayData = weekData.days.find((d) => d.day == day);
  if (!dayData) return initial;

  initial.dayIncome += dayData.totalIncome;
  initial.dayOutcome += dayData.totalOutcome;

  return initial;
};