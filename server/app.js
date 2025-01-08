const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const AppError = require('./Errors/classError');
const errorHandler = require('./Errors/errorHandling');
const dotenv = require('dotenv');
const limitReq = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash')
const morgan = require('morgan')
const compression = require('compression')


dotenv.config({ path: './.env' });
const app = express();
app.enable('trust proxy')

const corsOptions = {
  origin: 'http://localhost:5173',
  // origin: 'https://masroofati.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(mongoSanitize()) /
  app.use(xssClean())
app.use(hpp())
app.use(cookieParser());
app.use(session({
  key: 'client.side',
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 100 },
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp());
app.use(async (req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

const limiter = limitReq({
  max: 200,
  windowMs: 1000 * 60 * 60,
  message: 'Too many requests, try again after one hour',
});
app.use('/auth', limiter);
app.use(morgan('tiny'));
app.use(compression())
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.all('*', (req, res, next) => next(new AppError('Not found', 404)));
app.use(errorHandler);

module.exports = app;


