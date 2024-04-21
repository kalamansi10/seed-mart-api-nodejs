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

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with the hashed password
    const user = new User({
      email: email,
      passwordDigest: hashedPassword, // Store the hashed password
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

// POST /users
exports.update = async (req, res) => {
  try {
    await req.user.updateOne(sanitizeUserInfo(req.body.user));
    res.status(201).json({ message: "User updated successfully" });
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

function sanitizeUserInfo(userInfoBody) {
  const formattedDate = new Date(userInfoBody.birthday);
  return {
    email: userInfoBody.email,
    name: userInfoBody.name,
    gender: userInfoBody.gender,
    ...(formattedDate && {birthday: formattedDate.toISOString().split('T')[0]}),
  };
}
