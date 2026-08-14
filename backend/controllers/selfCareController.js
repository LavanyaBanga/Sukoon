const asyncHandler = require('express-async-handler');
const SelfCareTask = require('../models/SelfCareTask');

const SUGGESTIONS = [
  'Drink a glass of water',
  'Walk outside for 10 minutes',
  'Keep your phone away for 15 minutes',
  'Write three thoughts down',
  'Call someone you trust',
  'Stretch for five minutes',
  'Do one pending small task',
];

// @desc Get today's self-care suggestions (creates pending tasks if none exist today)
// @route GET /api/selfcare
const getTasks = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  let tasks = await SelfCareTask.find({ user: req.user._id, createdAt: { $gte: startOfDay } });

  if (tasks.length === 0) {
    const picks = [...SUGGESTIONS].sort(() => 0.5 - Math.random()).slice(0, 4);
    tasks = await SelfCareTask.insertMany(picks.map((task) => ({ user: req.user._id, task })));
  }

  res.json({ success: true, data: tasks });
});

// @desc Update task status (done/skip/saved)
// @route PUT /api/selfcare/:id
const updateTask = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await SelfCareTask.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { status },
    { new: true }
  );
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.json({ success: true, data: task });
});

module.exports = { getTasks, updateTask };
