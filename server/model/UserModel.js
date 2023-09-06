const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: mongoose.SchemaTypes.String,
      required: [true, "Please provide a unique username"],
      unique: [true, "Username Exist"],
    },
    password: {
      type: mongoose.SchemaTypes.String,
      required: [true, "Please provide a password"],
      unique: false,
    },
    email: {
      type: mongoose.SchemaTypes.String,
      required: [true, "Please provide a email"],
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    address: {
      type: String,
    },
    profile: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema) || mongoose.model.Users;
