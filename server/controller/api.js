

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
  const user = req.user
  const { firstName, lastName, img } = user
  res.status(200).json({ success: true, data: { firstName, lastName } });
})





exports.homeData = catchError(async (req, res, next) => {
  const today = new Date();
  const data = helper.calculateMoney(req.user.years, today);
  res.status(200).json({ success: true, data });
});

exports.add = catchError(async (req, res, next) => {
  const { amount, type, date, reason } = req.body;
  const transactionDate = new Date(date);
  const year = transactionDate.getFullYear().toString();
  const month = (transactionDate.getMonth() + 1).toString().padStart(2, "0");
  const week = Math.ceil(transactionDate.getDate() / 7);
  const user = req.user;
  let existYear = true;

  let yearData = user.years.find((y) => y.year === year);
  if (!yearData) {
    existYear = false;
    yearData = { year, months: [] };
  }

  let monthData = yearData.months.find((m) => m.month === month);
  if (!monthData) {
    monthData = { month, weeks: [] };
    yearData.months.push(monthData);
  }

  let weekData = monthData.weeks.find((w) => w.weekNumber === week);
  if (!weekData) {
    weekData = { weekNumber: week, transactions: [] };
    monthData.weeks.push(weekData);
  }
  weekData.transactions.push({ amount, type, date: transactionDate, reason });
  if (!existYear) user.years.push(yearData);

  const reasonCh = user.reasons.find((r) => r === reason);
  if (!reasonCh) user.reasons.push(reason);
  user.save()
  res.status(200).json({ success: true, data: user.years });
});





exports.logOut = catchError(async (req, res, next) => {
  const user = req.user
  if (!user) return next(new AppError('You aren\'t register', 401))
  res.cookie('jwt', 'out', helper.cookieOptions).status(201)
    .json({ susses: true, msg: "Log out" })
})