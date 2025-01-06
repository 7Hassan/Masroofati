const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const AppError = require('../Errors/classError')
const WebSocket = require('ws');
const multer = require('multer')
const sharp = require('sharp');
const { format, getISOWeek } = require("date-fns");


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


const monthMoney = (monthData) => {
  let monthIncome = 0;
  let monthOutcome = 0;
  monthData.weeks.forEach(week => {
    week.transactions.map(tran => {
      if (tran.type === 'income') monthIncome += tran.value
      else monthOutcome += tran.value
    })
  })

  return { monthIncome, monthOutcome }
}

const weekMoney = (weekData) => {
  let weekIncome = 0;
  let weekOutcome = 0;

  weekData.transactions.map(tran => {
    if (tran.type === 'income') weekIncome += tran.value
    else weekOutcome += tran.value
  })

  return { weekIncome, weekOutcome }
}

const dayMoney = (dayData) => {
  let dayIncome = 0;
  let dayOutcome = 0;

  dayData.map(tran => {
    if (tran.type === 'income') dayIncome += tran.value
    else dayOutcome += tran.value
  })

  return { dayIncome, dayOutcome }
}

exports.getDates = (date) => {
  const year = format(date, "yyyy")
  const month = format(date, "MMM")
  const week = getISOWeek(date);
  const day = format(date, "dd/MMM/yyyy")
  return { day, week, month, year }
}

exports.calculateMoney = (years, date) => {
  const { day, week, month, year } = helper.getDates(new Date(date));
  const initial = {
    dayIncome: 0, dayOutcome: 0,
    weekIncome: 0, weekOutcome: 0,
    monthIncome: 0, monthOutcome: 0,
    yearIncome: 0, yearOutcome: 0,
  }

  const yearData = years.find((y) => y.year === year);
  if (yearData) {
    initial.yearIncome += transaction.value;
    initial.yearOutcome += transaction.value;
  }

  const monthData = yearData.months.find((m) => m.month === month);
  if (!monthData) return initial;

  const weekData = monthData.weeks.find((w) => w.weekNumber === week);
  if (!weekData) return initial;

  const dayData = weekData.transactions.filter((tarns) => format(new Date(tarns.date), "dd/MM/yyyy") == day);
  if (!dayData) return initial;

  const data = { ...dayMoney(dayData), ...weekMoney(weekData), ...monthMoney(monthData) }
  return data;
};