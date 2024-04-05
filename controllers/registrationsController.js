const bcrypt = require("bcryptjs");

const User = require("../models/user"); // Import User model

// // GET /users
// exports.new = async (req, res) => {
//   try {
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// POST /users
exports.create = async (req, res) => {
  try {
    // Extract user data from request body
    const { email, password, name } = req.body.user;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with the hashed password
    const user = new User({
      email: email,
      password_digest: hashedPassword, // Store the hashed password
      name: name,
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// // PATCH /users
// exports.edit = async (req, res) => {
//   try {
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
