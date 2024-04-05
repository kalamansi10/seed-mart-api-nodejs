const bcrypt = require('bcryptjs');
const User = require("../models/user"); // Import User model

// GET /users/current
exports.new = (req, res) => {
  res.status(200).json( req.user || null );
};

// POST /users/sign_in
exports.create = async (req, res) => {
  try {
    const { email, password } = req.body.user;

    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found or password does not match
    if (!user || !(await bcrypt.compare(password, user.password_digest))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Log in the user and create a session (handled by Passport)
    req.login(user, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      return res.status(200).json({ message: 'Logged in successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// POST /users/sign_out
exports.destroy = (req, res) => {
  req.logout(); // Log out the user (handled by Passport)
  res.status(200).json({ message: 'Logged out successfully' });
};
