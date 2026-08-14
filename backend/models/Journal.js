const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: '', maxlength: 150 },
    content: { type: String, required: true, maxlength: 20000 },
    type: {
      type: String,
      enum: ['Brain Dump', 'Gratitude', 'Reflection', 'Something Hurting', 'Something Beautiful', 'Daily Journal'],
      default: 'Daily Journal',
    },
    mood: { type: String, default: '' },
    tags: [{ type: String }],
    favorite: { type: Boolean, default: false },
    aiReflection: { type: String, default: '' },
  },
  { timestamps: true }
);

journalSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Journal', journalSchema);
