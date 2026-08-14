const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['general', 'gita'], required: true },
    title: { type: String, default: 'New conversation' },
    messages: [messageSchema],
  },
  { timestamps: true }
);

conversationSchema.index({ user: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
