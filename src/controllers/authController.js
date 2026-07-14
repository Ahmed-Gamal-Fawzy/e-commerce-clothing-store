const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');
const jwt = require('jsonwebtoken');

// this method to generate token 
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};


//  Signup
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // check if user email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      status: 'fail',
      message: 'This email is already registered'
    });
  }

  // create user 
  const user = await User.create({
    name,
    email,
    password
  });

  // generate token for new account
  const token = generateToken(user._id);

  // return the response without password for security 
  res.status(201).json({
    status: 'success',
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});


exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // find user by email and return password  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid email or password'
    });
  }

  // 2. check if the password is correct  using the custom method in the model
  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid email or password'
    });
  }

  // generate token if everything is correct
  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});