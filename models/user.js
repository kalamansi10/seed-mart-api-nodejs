const mongoose = require("mongoose");

// Define the schema for the user
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordDigest: { type: String, required: true },
    // reset_password_token: { type: String, unique: true },
    // reset_password_sent_at: { type: Date },
    rememberMeToken: { type: String },
    name: { type: String },
    gender: { type: String },
    birthday: { type: Date },
  },
  { timestamps: true }
);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

// Create a model based on the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
