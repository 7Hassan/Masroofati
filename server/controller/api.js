

const { format, getISOWeek } = require('date-fns')
const catchError = require('../Errors/catch')
const AppError = require('../Errors/classError')
const helper = require('./helperFunc')


exports.protectAPI = catchError(async (req, res, next) => {
  const { user } = await helper.testJwtToken(req)
  if (!user) return next(new AppError('Please login', 401))
  req.user = user
  next()
})

exports.user = catchError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({ success: true, data: { firstName: user.firstName, lastName: user.lastName, labels: user.labels } });
})





exports.data = catchError(async (req, res, next) => {
  const today = new Date();
  const analyticsData = helper.calculateMoney(req.user.years, today);
  const transData = helper.getTransactions(req.user.years, today);

  res.status(200).json({ success: true, data: { analyticsData, transData } });
});


exports.analyticsData = catchError(async (req, res, next) => {
  const today = new Date();
  const data = helper.getTransactions(req.user.years, today);
  res.status(200).json({ success: true, data: data });
});




exports.add = catchError(async (req, res, next) => {
  const { value, type, date, label } = req.body;
  const transactionDate = new Date(date);
  const { day, week, month, monthNum, year } = helper.getDates(transactionDate)
  const user = req.user;
  let existYear = true;

  let yearData = user.years.find((y) => y.year === year);
  if (!yearData) {
    existYear = false;
    yearData = { year, totalIncome: 0, totalOutcome: 0, months: [] };
  }

  let monthData = yearData.months.find((m) => m.month === month);
  if (!monthData) {
    monthData = { month, monthNum: monthNum, totalIncome: 0, totalOutcome: 0, weeks: [] };
    yearData.months.push(monthData);
  }

  let weekData = monthData.weeks.find((w) => w.weekNumber === week);
  if (!weekData) {
    weekData = { weekNumber: week, totalIncome: 0, totalOutcome: 0, days: [] };
    monthData.weeks.push(weekData);
  }

  let dayData = weekData.days.find((d) => d.day === day);
  if (!dayData) {
    dayData = { day: day, name: format(transactionDate, 'EEE'), totalIncome: 0, totalOutcome: 0, income: [], outcome: [] };
    weekData.days.push(dayData);
  }

  if (type === "income") {
    dayData.totalIncome += value;
    weekData.totalIncome += value;
    monthData.totalIncome += value;
    yearData.totalIncome += value;
    dayData.income.push({ value, type, date: transactionDate, label });
  } else {
    dayData.totalOutcome += value;
    weekData.totalOutcome += value;
    monthData.totalOutcome += value;
    yearData.totalOutcome += value;
    dayData.outcome.push({ value, type, date: transactionDate, label });
  }


  if (!existYear) user.years.push(yearData);
  const labelCh = user.labels.find((r) => r === label);
  if (!labelCh) user.labels.push(label);
  user.save()
  res.status(200).json({ success: true, data: user.years });
});





exports.logOut = catchError(async (req, res, next) => {
  const user = req.user
  if (!user) return next(new AppError('You aren\'t register', 401))
  res.cookie('jwt', 'out', helper.cookieOptions).status(201)
    .json({ susses: true, msg: "Log out" })
})