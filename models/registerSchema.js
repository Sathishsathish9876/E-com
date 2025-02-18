const mongoose = require("mongoose");
const validator = require("validator");

const RegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    validate: {
      validator: (value) => /^[a-zA-Z ]+$/.test(value),
      message: "Only alphabets are allowed",
    },
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Email is not valid",
    },
  },

  phoneNumber: {
    type: String, // Changed to String to avoid issues with leading zeros
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: (value) => /^\d{10}$/.test(value), // Checks if phone number is exactly 10 digits
      message: "Phone number must be 10 digits",
    },
  },

  password: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) =>
        validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        }),
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
    },
  },

  retypePassword: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match",
    },
  },
});

const Register = mongoose.model("Register", RegisterSchema);

module.exports = Register;
