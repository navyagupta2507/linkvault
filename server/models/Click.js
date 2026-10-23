const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true },
  timestamp: { type: Date, default: Date.now },
  userAgent: { type: String, default: 'unknown' },
  browser: { type: String, default: 'unknown' },
  referrer: { type: String, default: 'direct' },
});

module.exports = mongoose.model('Click', clickSchema);