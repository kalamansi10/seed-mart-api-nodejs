const mongoose = require('mongoose');

// Define the schema for the user
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_digest: { type: String, required: true },
  // reset_password_token: { type: String, unique: true },
  // reset_password_sent_at: { type: Date },
  // remember_created_at: { type: Date },
  name: { type: String },
  gender: { type: String },
  birthday: { type: Date },
}, { timestamps: true });

userSchema.virtual('userInfo').get(function() {
  return {
    email: this.email,
    name: this.name,
    gender: this.gender,
    birthday: this.birthday,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
    // Add other fields as needed
  };
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
