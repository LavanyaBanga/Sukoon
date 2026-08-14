const asyncHandler = require('express-async-handler');
const Gratitude = require('../models/Gratitude');

// @desc Add gratitude entry
// @route POST /api/gratitude
const addGratitude = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const entry = await Gratitude.create({ user: req.user._id, text });
  const count = await Gratitude.countDocuments({ user: req.user._id });

  let milestone = null;
  if (count === 1) milestone = { emoji: '🌱', label: 'First gratitude' };
  else if (count === 5) milestone = { emoji: '🌷', label: '5 gratitude entries' };
  else if (count === 10) milestone = { emoji: '🌻', label: '10 entries' };
  else if (count === 30) milestone = { emoji: '🌳', label: '30 entries' };

  res.status(201).json({ success: true, data: entry, count, milestone });
});

// @desc Get gratitude entries
// @route GET /api/gratitude
const getGratitude = asyncHandler(async (req, res) => {
  const entries = await Gratitude.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: entries, count: entries.length });
});

module.exports = { addGratitude, getGratitude };
