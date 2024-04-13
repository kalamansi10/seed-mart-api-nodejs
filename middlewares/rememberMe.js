const crypto = require("crypto");
const User = require("../models/user"); // Import User model

// Middleware to attach CSRF token to response
exports.authenticate = async (req, res, next) => {
  const rememberMeToken = req.cookies.remember_me;
  if (!req.user && rememberMeToken) {
    const user = await User.findOne({ rememberMeToken: rememberMeToken });
    if (user) {
      req.login(user, async (err) => {
        if (err) {
          console.error(err);
          refreshToken();
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
    }
  }
  next();
};

// Function to generate a rememberMeToken token
const refreshToken = async (req, res, next) => {
  const rememberMeToken = req.cookies.remember_me;
  const user = await User.findOne({ rememberMeToken: rememberMeToken });
  console.log(user);
  if (user) {
    const token = crypto.randomBytes(36).toString("hex");
    // Issue the token as a cookie
    res.cookie("remember_me", token, {
      httpOnly: true,
      maxAge: 604800000,
    }); // 7 days
    // Save the user with the new token
    user.rememberMeToken = token;
    await user.save();
  }
  next();
};
