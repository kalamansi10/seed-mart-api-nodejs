const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const RememberMeStrategy = require("passport-remember-me").Strategy;

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "user[email]", // Specify the nested field path for the email
      passwordField: "user[password]", // Specify the nested field path for the password
      passReqToCallback: true, // Optionally pass the request object to the callback
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email: email });

        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        const passwordMatch = await bcrypt.compare(
          password,
          user.passwordDigest
        );
        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new RememberMeStrategy(
    async (token, done) => {
      const user = await User.findOne({ rememberMeToken: token });
      if (!user) {
        return done(null, false);
      } // Token not valid or user not found
      return done(null, user); // User found, authentication successful
    },
    async (user, done) => {
      let newToken = generateNewToken(); // Implement your own token generation logic
      user.rememberMeToken = newToken;
      user.save();
      return done(null, newToken); // Return the new token
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-passwordDigest");
    done(null, user);
  } catch (err) {
    done(err);
  }
});

function generateNewToken() {
  return crypto.randomBytes(36).toString("hex");
}

module.exports = passport;
