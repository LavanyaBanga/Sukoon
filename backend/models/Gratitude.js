const mongoose = require('mongoose');

const gratitudeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    text: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gratitude', gratitudeSchema);
