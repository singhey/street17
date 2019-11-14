var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dbConfig = require('./config/database.connection.js')
const mongoose = require('mongoose')
let cors = require('cors')
let fileUpload = require('express-fileupload')
import User from './controller/User.controller'
import Category from './routes/Category.route'
import Dish from './routes/Dish.route'
import Bill from './routes/Bill.route'
import Details from './routes/Details.route'

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(fileUpload())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', User);
app.use('/api/category', Category)
app.use('/api/dish', Dish)
app.use('/api/bill', Bill)
app.use('/api/details', Details)
//app.use('/users', usersRouter);

mongoose.Promise = global.Promise

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true
}).then( () => {
  console.log("Connected to database");
}).catch((e) => {
  console.log("Unable to connect to database")
  process.exit(1)
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
