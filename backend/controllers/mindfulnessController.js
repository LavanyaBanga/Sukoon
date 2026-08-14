const asyncHandler = require('express-async-handler');
const MindfulnessSession = require('../models/MindfulnessSession');

// @desc Log a completed mindfulness/breathing session
// @route POST /api/mindfulness
const logSession = asyncHandler(async (req, res) => {
  const { exercise, duration, completed = true } = req.body;
  const session = await MindfulnessSession.create({ user: req.user._id, exercise, duration, completed });
  res.status(201).json({ success: true, data: session });
});

// @desc Get mindfulness stats
// @route GET /api/mindfulness/stats
const getStats = asyncHandler(async (req, res) => {
  const sessions = await MindfulnessSession.find({ user: req.user._id });
  const totalMinutes = Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60);
  const totalSessions = sessions.length;
  const byExercise = sessions.reduce((acc, s) => {
    acc[s.exercise] = (acc[s.exercise] || 0) + 1;
    return acc;
  }, {});

  res.json({ success: true, data: { totalMinutes, totalSessions, byExercise } });
});

module.exports = { logSession, getStats };
