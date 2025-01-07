const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const AppError = require('./Errors/classError')
const errorHandler = require('./Errors/errorHandling')
const dotenv = require('dotenv')
const limitReq = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors')


dotenv.config({ path: './.env' });
const app = express();
app.use(express.json())
app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

app.use(cors(corsOptions));
app.use(mongoSanitize())
app.use(xssClean())
app.use(hpp())
app.use(cookieParser());


app.use(async (req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

const limiter = limitReq({
  max: 200,
  windowMs: 1000 * 60 * 60,
  message: 'Too many requests, try again after one hour'
})


app.use('/auth', limiter)

app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.all('*', (req, res, next) => next(new AppError('not found', 404)))
app.use(errorHandler)


module.exports = app
