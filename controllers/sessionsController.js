const bcrypt = require("bcryptjs");
const passport = require('passport');
const User = require("../models/user"); // Import User model

// GET /users/current
exports.new = (req, res) => {
  res.status(200).json(req.user || null);
};

// POST /users/sign_in
exports.create = async (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    try {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      req.login(user, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        return res.status(200).json({ message: "Logged in successfully" });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })(req, res, next);
};

// POST /users/sign_out
exports.destroy = async (req, res) => {
  const user = await User.findById(req.user.id);
  req.logOut(user, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "Logged out successfully" });
  }); // Log out the user (handled by Passport)
};