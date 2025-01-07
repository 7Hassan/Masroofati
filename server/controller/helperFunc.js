const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../Errors/classError');
const WebSocket = require('ws');
const multer = require('multer');
const sharp = require('sharp');
const { format, getISOWeek, startOfMonth, differenceInCalendarDays, getDay, getDaysInMonth } = require("date-fns");
const { daysData } = require('./variables');

exports.cookieOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};

exports.createJwtToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED });

exports.testJwtToken = async (req) => {
  let cookie = req.cookies?.jwt;
  if (!cookie || cookie.split('.').length !== 3) return { user: null, time: null };

  try {
    const decoded = await promisify(jwt.verify)(cookie, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });
    return { user, time: decoded.iat };
  } catch (err) {
    return { user: null, time: null };
  }
};

exports.sendSocket = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

exports.pageObject = (title, req) => ({
  title,
  errors: req.flash('errors'),
  warning: req.flash('warning'),
  success: req.flash('success'),
  toast: req.flash('toast'),
});

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  file.mimetype.startsWith('image')
    ? cb(null, true)
    : cb(new AppError('Please upload only images', 400), false);
};

exports.upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.sharpImg = (req) =>
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/imgs/users/${req.file.filename}`);

exports.conflictTime = (start, end, lectures) =>
  lectures.some(
    (lecture) =>
      (start >= lecture.start && start < lecture.end) ||
      (end > lecture.start && end <= lecture.end) ||
      (start <= lecture.start && end >= lecture.end)
  );

const getWeekOfMonth = (date) => {
  const weekStartsOn = 6;
  const start = startOfMonth(date);
  const daysDifference = differenceInCalendarDays(date, start);
  const firstDayOfMonth = getDay(start);
  const offset = (firstDayOfMonth - weekStartsOn + 7) % 7;
  return Math.floor((daysDifference + offset) / 7) + 1;
};

exports.getDates = (date) => ({
  day: format(date, "dd/MMM/yyyy"),
  week: getWeekOfMonth(date),
  month: format(date, "MMM"),
  year: format(date, "yyyy"),
  monthNum: format(date, "M"),
  numWeekInMon: Math.ceil(getDaysInMonth(new Date(date)) / 7)
});

exports.calculateMoney = (years, date) => {
  const { day, week, month, year } = exports.getDates(date);

  const initial = {
    dayIncome: 0, dayOutcome: 0,
    weekIncome: 0, weekOutcome: 0,
    monthIncome: 0, monthOutcome: 0,
    yearIncome: 0, yearOutcome: 0,
  };

  const yearData = years.find((y) => y.year == year);
  if (!yearData) return initial;

  Object.assign(initial, {
    yearIncome: yearData.totalIncome,
    yearOutcome: yearData.totalOutcome,
  });

  const monthData = yearData.months.find((m) => m.month == month);
  if (!monthData) return initial;

  Object.assign(initial, {
    monthIncome: monthData.totalIncome,
    monthOutcome: monthData.totalOutcome,
  });

  const weekData = monthData.weeks.find((w) => w.weekNumber == week);
  if (!weekData) return initial;

  Object.assign(initial, {
    weekIncome: weekData.totalIncome,
    weekOutcome: weekData.totalOutcome,
  });

  const dayData = weekData.days.find((d) => d.day == day);
  if (dayData) {
    Object.assign(initial, {
      dayIncome: dayData.totalIncome,
      dayOutcome: dayData.totalOutcome,
    });
  }

  return initial;
};

function objCreator(weekNumberInMon) {
  const createPeriodObject = (length) => ({
    totalIncome: 0,
    totalOutcome: 0,
    incomeValues: Array(length).fill(0),
    outcomeValues: Array(length).fill(0),
    income: [],
    outcome: [],
  });

  return {
    day: { totalIncome: 0, totalOutcome: 0, income: [], outcome: [] },
    week: createPeriodObject(7),
    month: createPeriodObject(weekNumberInMon),
    year: createPeriodObject(12),
  };
}


exports.getTransactions = (years, date) => {
  const { day, week, month, year, numWeekInMon } = exports.getDates(date);
  const initial = objCreator(numWeekInMon);

  const yearData = years.find((y) => y.year == year);
  if (!yearData) return initial;

  Object.assign(initial.year, {
    totalIncome: yearData.totalIncome,
    totalOutcome: yearData.totalOutcome,
  });

  yearData.months.forEach((month) => {
    const index = month.monthNum - 1;
    initial.year.incomeValues[index] = month.totalIncome;
    initial.year.outcomeValues[index] = month.totalOutcome;

    month.weeks.forEach((week) => {
      week.days.forEach((day) => {
        initial.year.income.push(...day.income);
        initial.year.outcome.push(...day.outcome);
      });
    });
  });

  const monthData = yearData.months.find((m) => m.month == month);
  if (!monthData) return initial;

  Object.assign(initial.month, {
    totalIncome: monthData.totalIncome,
    totalOutcome: monthData.totalOutcome,
  });

  monthData.weeks.forEach((week) => {
    const index = week.weekNumber - 1;
    initial.month.incomeValues[index] = week.totalIncome;
    initial.month.outcomeValues[index] = week.totalOutcome;

    week.days.forEach((day) => {
      initial.month.income.push(...day.income);
      initial.month.outcome.push(...day.outcome);
    });
  });

  const weekData = monthData.weeks.find((w) => w.weekNumber == week);
  if (!weekData) return initial;

  Object.assign(initial.week, {
    totalIncome: weekData.totalIncome,
    totalOutcome: weekData.totalOutcome,
  });

  weekData.days.forEach((day) => {
    const index = daysData.findIndex((d) => d == day.name);
    initial.week.incomeValues[index] = day.totalIncome;
    initial.week.outcomeValues[index] = day.totalOutcome;
    initial.week.income.push(...day.income);
    initial.week.outcome.push(...day.outcome);
  });

  const dayData = weekData.days.find((d) => d.day == day);
  if (dayData) {
    Object.assign(initial.day, {
      totalIncome: dayData.totalIncome,
      totalOutcome: dayData.totalOutcome,
      income: dayData.income,
      outcome: dayData.outcome,
    });
  }

  return initial;
};
