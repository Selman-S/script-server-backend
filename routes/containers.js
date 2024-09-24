// routes/containers.js

const express = require('express');
const router = express.Router();
const Container = require('../models/Container');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const CustomError = require('../utils/customError');

// Kullanıcının Container'larını Getirme
router.get('/', auth, async (req, res) => {
  const containers = await Container.find({ user: req.user.userId });
  res.json(containers);
});

// Yeni Container Oluşturma
router.post('/', auth, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new CustomError('Container adı gereklidir.', 400);
  }

  const container = new Container({
    user: req.user.userId,
    name,
    scriptContent: '',
    containerId: uuidv4(),
  });
  await container.save();
  res.status(201).json(container);
});

// Container Script İçeriğini Güncelleme
router.put('/:id', auth, async (req, res) => {
  const { scriptContent } = req.body;
  const container = await Container.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    { scriptContent },
    { new: true }
  );
  if (!container) {
    throw new CustomError('Container bulunamadı veya yetkiniz yok.', 404);
  }
  res.json(container);
});

// Container'a Özel Script'i Sunma
router.get('/scripts/:containerId.js', async (req, res) => {
  const container = await Container.findOne({ containerId: req.params.containerId });
  if (!container) {
    res.set('Content-Type', 'application/javascript');
    return res.send('// Container bulunamadı.');
  }
  res.set('Content-Type', 'application/javascript');
  res.send(container.scriptContent);
});

module.exports = router;
