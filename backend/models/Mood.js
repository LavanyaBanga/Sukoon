const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mood: { type: String, required: true },
    score: { type: Number, required: true, min: 1, max: 9 },
    factors: [{ type: String }],
    note: { type: String, default: '', maxlength: 2000 },
  },
  { timestamps: true }
);

moodSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Mood', moodSchema);
