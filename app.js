const express = require('express');
const session = require("express-session");
const passport = require('./passport'); 
const bodyParser = require('body-parser');
const logger = require('morgan');
const createError = require('http-errors');
const mongoose = require("mongoose");

const api_v1 = require("./routes/api_v1");
const userRoutes = require("./routes/user");

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

// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routing
app.use("/api/v1", api_v1);
app.use("/users", userRoutes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;