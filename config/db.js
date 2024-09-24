// db.js

const mongoose = require('mongoose');
const logger = require('../logs/logger');
require('dotenv').config()


const connectDB = async () => {
    
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB bağlantısı başarılı');
  } catch (err) {
    logger.error('MongoDB bağlantısı başarısız: ' + err.message);
    process.exit(1); // Uygulamayı sonlandır
  }
};

module.exports = connectDB;
