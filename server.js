// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan'); // Eklendi
const logger = require('./logs/logger'); // Eklendi
require('express-async-errors');
const connectDB = require('./config/db'); // Veritabanı bağlantısı
require('dotenv').config();


const app = express();

// Middleware
app.use(cors({
  origin: 'https://script-service-frontend.vercel.app'
}));
app.use(express.json());

// Morgan'ı winston ile birlikte kullanma
app.use(
    morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );

// Veritabanına Bağlanma
connectDB();


// Rotaları İçe Aktarma
const authRoutes = require('./routes/auth');
const containerRoutes = require('./routes/containers');

// Rotaları Kullanma
app.use('/api/auth', authRoutes);
app.use('/api/containers', containerRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
