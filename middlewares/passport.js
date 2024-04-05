const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const User = require('../models/user');

passport.use(new LocalStrategy({
  usernameField: 'user[email]', // Specify the nested field path for the email
  passwordField: 'user[password]', // Specify the nested field path for the password
  passReqToCallback: true // Optionally pass the request object to the callback
}, async (req, email, password, done) => {
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return done(null, false, { message: 'Incorrect email' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordDigest);
    if (!passwordMatch) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user.info);
  } catch(err) {
    done(err);
  };
});

module.exports = passport;
