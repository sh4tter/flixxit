const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    // Check if SECRET_KEY is set
    if (!process.env.SECRET_KEY) {
      console.error("SECRET_KEY environment variable is not set");
      return res.status(500).json({ message: "Server configuration error" });
    }

    console.log('Registration request received:', {
      body: req.body,
      headers: req.headers
    });

    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      console.log('Missing required fields:', { username: !!username, email: !!email, password: !!password });
      return res.status(400).json({
        message: "All fields are required: username, email, and password"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({
        message: "Please provide a valid email address"
      });
    }

    // Validate username length
    if (username.length < 3) {
      console.log('Username too short:', username.length);
      return res.status(400).json({
        message: "Username must be at least 3 characters long"
      });
    }

    // Validate password length
    if (password.length < 6) {
      console.log('Password too short:', password.length);
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    });
    
    if (existingUser) {
      console.log('User already exists:', { email: existingUser.email, username: existingUser.username });
      if (existingUser.email === email.toLowerCase()) {
        return res.status(409).json({
          message: "Email already registered"
        });
      } else {
        return res.status(409).json({
          message: "Username already taken"
        });
      }
    }

    console.log('Creating new user:', { username: username.toLowerCase(), email: email.toLowerCase() });

    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: CryptoJS.AES.encrypt(
        password,
        process.env.SECRET_KEY
      ).toString(),
    });
    
    const user = await newUser.save();
    const { password: userPassword, ...userInfo } = user._doc;
    console.log('User created successfully:', userInfo._id);
    res.status(201).json(userInfo);
  } catch (err) {
    console.error("Registration error:", err);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        message: validationErrors.join(', ')
      });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }
    
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    // Check if SECRET_KEY is set
    if (!process.env.SECRET_KEY) {
      console.error("SECRET_KEY environment variable is not set");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Wrong email or password!" });
    }

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password) {
      return res.status(401).json({ message: "Wrong email or password!" });
    }

    //getting a json web token to store userid, and admin data
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    const { password, ...info } = user._doc;

    res.status(200).json({ ...info, accessToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const adminLogin = async (req, res) => {
  try {
    // Check if SECRET_KEY is set
    if (!process.env.SECRET_KEY) {
      console.error("SECRET_KEY environment variable is not set");
      return res.status(500).json({ message: "Server configuration error" });
    }

    console.log('Admin login attempt:', { email: req.body.email });
    
    const user = await User.findOne({ email: req.body.email });
    if (!user || !user.isAdmin) {
      console.log('Admin login failed - user not found or not admin:', { 
        userFound: !!user, 
        isAdmin: user?.isAdmin 
      });
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password) {
      console.log('Admin login failed - wrong password for:', req.body.email);
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    console.log('Admin login successful for:', req.body.email);
    
    // Generate JWT token only for users with isAdmin set to true
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    const { password, ...info } = user._doc;

    res.status(200).json({ ...info, accessToken });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  adminLogin,
};
