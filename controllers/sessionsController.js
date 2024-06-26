const crypto = require("crypto");
const passport = require("passport");
const User = require("../models/user"); // Import User model

// GET /users/current
exports.new = (req, res) => {
  res.status(200).json(req.user || null);
};

// POST /users/sign_in
exports.create = async (req, res, next) => {
  if (!req.body.user || !req.body.user.email || !req.body.user.password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  passport.authenticate("local", (err, user) => {
    try {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      req.login(user, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        if (req.body.user.remember_me == 1) {
          let token;
          do {
            token = generateToken();
          } while (await User.findOne({ rememberMeToken: token }));

          // Issue the token as a cookie
          res.cookie("remember_me", token, {
            httpOnly: true,
            maxAge: 604800000,
          }); // 7 days
          // Save the user with the new token
          user.rememberMeToken = token;
          await user.save();
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
  if (req.user) {
    req.user.rememberMeToken = null;
    await req.user.save();
    req.logOut(req.user, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res.status(200).json({ message: "Logged out successfully" });
    }); // Log out the user (handled by Passport)
  }
};

function generateToken() {
  return crypto.randomBytes(36).toString("hex");
}
