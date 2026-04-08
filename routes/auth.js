const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Auth service. Use POST /register or POST /login.' });
});

router.get('/register', (req, res) => {
  res.json({ message: 'Use POST /api/auth/register with name, email, password, role.' });
});

router.get('/login', (req, res) => {
  res.json({ message: 'Use POST /api/auth/login with email and password.' });
});

router.post('/register', register);
router.post('/login', login);

module.exports = router;
