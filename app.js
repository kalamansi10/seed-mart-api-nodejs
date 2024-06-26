const express = require("express");
const session = require("express-session");
const passport = require("./middlewares/passport");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const createError = require("http-errors");
const mongoose = require("mongoose");
const csrf = require("./middlewares/csrf");
const rememberMe = require("./middlewares/rememberMe");
const cors = require("cors");

const api_v1 = require("./routes/api_v1");
const userRoutes = require("./routes/user");

// Enable dotenv
require("dotenv").config();

const app = express();
const mongoDB = process.env.MONGODB_URL;

// Set up mongoose connection
mongoose.set("strictQuery", false);
// Set global maxTimeMS for all queries
mongoose.set("maxTimeMS", 30000);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Middlewares
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from this origin
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allow these HTTP methods
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use("/users/sign_in", passport.authenticate("remember-me"));
// app.use(rememberMe.authenticate);
app.use(csrf.verifyToken);
app.use(csrf.attachToken);

// Routing
app.use("/api/v1", api_v1);
app.use("/users", userRoutes);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.json("error");
});

module.exports = app;
