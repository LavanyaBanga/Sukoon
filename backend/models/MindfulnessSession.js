const mongoose = require('mongoose');

const mindfulnessSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    exercise: { type: String, enum: ['Box Breathing', '4-7-8', 'Calm Breathing'], required: true },
    duration: { type: Number, required: true }, // in seconds
    completed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MindfulnessSession', mindfulnessSessionSchema);
