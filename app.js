const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const createError = require('http-errors');
const mongoose = require("mongoose");


// Enable dotenv
require('dotenv').config();

const app = express();
const mongoDB = process.env.MONGODB_URL;

// Set up mongoose connection
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(logger('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json(req.body);
});

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
  res.json('error');
});

module.exports = app;