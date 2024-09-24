const mongoose = require('mongoose');

const ContainerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  scriptContent: String,
  containerId: { type: String, unique: true },
});

module.exports = mongoose.model('Container', ContainerSchema);
