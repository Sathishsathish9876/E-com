const Register = require("../models/registerSchema");
const bcrypt = require("bcrypt");

// GET method
const getRegister = async (req, res) => {
  try {
    const register = await Register.find({});
    res.status(200).json({
      status: "success",
      message: "Fetched registered users successfully",
      register,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Error fetching registered users",
      error: error.message,
    });
  }
};

// POST method
const postRegister = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, retypePassword } = req.body;

    // Validate that passwords match
    if (password !== retypePassword) {
      return res.status(400).json({
        status: "fail",
        message: "Passwords do not match",
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with hashed password
    const register = await Register.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      retypePassword: hashedPassword,
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      register,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Error registering user",
      error: err.message,
    });
  }
};

// LOGIN USER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Email not registered",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect password",
      });
    }
    // Successful login
    return res.status(200).json({
      status: "success",
      message: "Login Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = {
  getRegister,
  postRegister,
  login,
};
