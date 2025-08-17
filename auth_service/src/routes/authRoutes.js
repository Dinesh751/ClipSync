const express = require('express');

const router = express.Router();

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    result: "success",
    message: "Auth routes are working"
  });
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  res.json({
    result: "success",
    message: "User logged in successfully",
    data: {
      userId: "user_" + Date.now(),
      email: email,
      token: "jwt_token_" + Date.now()
    }
  });
});

// Signup route
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  res.json({
    result: "success",
    message: "User registered successfully",
    data: {
      userId: "user_" + Date.now(),
      name: name,
      email: email
    }
  });
});

// Verify user route
router.post('/verifyUser', (req, res) => {
  const { token } = req.body;
  res.json({
    result: "success",
    message: "User verified successfully",
    data: {
      userId: "user_" + Date.now(),
      verified: true,
      token: token
    }
  });
});

module.exports = router;