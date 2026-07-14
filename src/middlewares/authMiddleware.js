const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/User');


// 1. check if the token is valid 
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in! Please log in to get access.'
    });
  }

  // 2. decode the token and verify it
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. check if the user exists in the database
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      status: 'fail',
      message: 'The user belonging to this token no longer exists.'
    });
  }

  // pass the user data to the next controller 
  req.user = currentUser;
  next();
});

// 2. Role-based Authorization
exports.restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    // check if the user has the permission to perform this action 
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};