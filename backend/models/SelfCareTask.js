const mongoose = require('mongoose');

const selfCareTaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    task: { type: String, required: true },
    status: { type: String, enum: ['pending', 'done', 'skipped', 'saved'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SelfCareTask', selfCareTaskSchema);
