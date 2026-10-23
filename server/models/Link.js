const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  title: { type: String, default: '' },
  expiresAt: { type: Date, default: null },
  clickCount: { type: Number, default: 0 },
}, { timestamps: true });
linkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Link', linkSchema);