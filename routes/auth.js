// routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const CustomError = require('../utils/customError');

// Kayıt Olma
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  let userExists = await User.findOne({ email });
  if (userExists) {
    throw new CustomError('Bu email adresi zaten kullanılıyor.', 400);
  }

  let user = new User({ email, password });
  await user.save();
  res.status(201).send('Kullanıcı başarıyla kaydedildi.');
});

// Giriş Yapma
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError('Geçersiz email veya şifre.', 400);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new CustomError('Geçersiz email veya şifre.', 400);
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;
