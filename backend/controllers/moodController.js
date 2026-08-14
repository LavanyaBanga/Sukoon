const asyncHandler = require('express-async-handler');
const Mood = require('../models/Mood');
const User = require('../models/User');

const MOOD_SCORES = {
  'Amazing': 9, 'Great': 9,
  'Happy': 8, 'Good': 7,
  'Okay': 5, 'Neutral': 5,
  'Anxious': 4,
  'Low': 3, 'Sad': 3,
  'Angry': 3,
  'Exhausted': 3,
  'Very Low': 2, 'Very Sad': 2,
};

const updateStreak = async (user) => {
  const now = new Date();
  const last = user.lastCheckIn;
  if (!last) {
    user.streak = 1;
  } else {
    const diffDays = Math.floor((now.setHours(0, 0, 0, 0) - new Date(last).setHours(0, 0, 0, 0)) / 86400000);
    if (diffDays === 1) user.streak += 1;
    else if (diffDays > 1) user.streak = 1;
    // diffDays === 0 -> already checked in today, streak unchanged
  }
  user.lastCheckIn = new Date();
  await user.save();
};

// @desc Create a mood entry
// @route POST /api/moods
const createMood = asyncHandler(async (req, res) => {
  const { mood, factors = [], note = '' } = req.body;
  const score = MOOD_SCORES[mood] ?? 5;

  const entry = await Mood.create({ user: req.user._id, mood, score, factors, note });
  await updateStreak(req.user);

  res.status(201).json({ success: true, data: entry, streak: req.user.streak });
});

// @desc Get mood entries (optional range in days via ?days=)
// @route GET /api/moods
const getMoods = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 0;
  const filter = { user: req.user._id };
  if (days > 0) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    filter.createdAt = { $gte: since };
  }
  const moods = await Mood.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: moods });
});

// @desc Get mood analytics
// @route GET /api/moods/analytics
const getMoodAnalytics = asyncHandler(async (req, res) => {
  const moods = await Mood.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(90);

  const frequency = {};
  const factorFrequency = {};
  const weekdayTotals = Array(7).fill(0);
  const weekdayCounts = Array(7).fill(0);

  moods.forEach((m) => {
    frequency[m.mood] = (frequency[m.mood] || 0) + 1;
    (m.factors || []).forEach((f) => {
      factorFrequency[f] = (factorFrequency[f] || 0) + 1;
    });
    const day = new Date(m.createdAt).getDay();
    weekdayTotals[day] += m.score;
    weekdayCounts[day] += 1;
  });

  const mostFrequentMood = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const topFactors = Object.entries(factorFrequency).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([f]) => f);
  const weekdayAverages = weekdayTotals.map((total, i) => (weekdayCounts[i] ? +(total / weekdayCounts[i]).toFixed(2) : null));
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const bestDayIndex = weekdayAverages.reduce((bestIdx, val, idx, arr) => (val !== null && (bestIdx === -1 || val > arr[bestIdx]) ? idx : bestIdx), -1);

  res.json({
    success: true,
    data: {
      totalEntries: moods.length,
      mostFrequentMood,
      topFactors,
      weekdayAverages: dayNames.map((name, i) => ({ day: name, average: weekdayAverages[i] })),
      bestDayOfWeek: bestDayIndex >= 0 ? dayNames[bestDayIndex] : null,
      recent: moods.slice(0, 30).reverse().map((m) => ({ date: m.createdAt, mood: m.mood, score: m.score })),
    },
  });
});

module.exports = { createMood, getMoods, getMoodAnalytics };
