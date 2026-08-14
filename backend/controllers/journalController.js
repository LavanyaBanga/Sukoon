const asyncHandler = require('express-async-handler');
const Journal = require('../models/Journal');
const { getJournalReflection } = require('../services/groqService');

// @desc Create journal entry
// @route POST /api/journals
const createJournal = asyncHandler(async (req, res) => {
  const { title, content, type, mood, tags, wantsReflection } = req.body;

  let aiReflection = '';
  if (wantsReflection) {
    try {
      aiReflection = await getJournalReflection(content);
    } catch (err) {
      aiReflection = '';
    }
  }

  const journal = await Journal.create({
    user: req.user._id,
    title,
    content,
    type,
    mood,
    tags: tags || [],
    aiReflection,
  });

  res.status(201).json({ success: true, data: journal });
});

// @desc Get all journals for user (with optional search/filter)
// @route GET /api/journals
const getJournals = asyncHandler(async (req, res) => {
  const { search, mood, favorite, type } = req.query;
  const filter = { user: req.user._id };
  if (mood) filter.mood = mood;
  if (type) filter.type = type;
  if (favorite === 'true') filter.favorite = true;
  if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }];

  const journals = await Journal.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: journals });
});

// @desc Get single journal
// @route GET /api/journals/:id
const getJournal = asyncHandler(async (req, res) => {
  const journal = await Journal.findOne({ _id: req.params.id, user: req.user._id });
  if (!journal) {
    res.status(404);
    throw new Error('Journal entry not found');
  }
  res.json({ success: true, data: journal });
});

// @desc Update journal
// @route PUT /api/journals/:id
const updateJournal = asyncHandler(async (req, res) => {
  const journal = await Journal.findOne({ _id: req.params.id, user: req.user._id });
  if (!journal) {
    res.status(404);
    throw new Error('Journal entry not found');
  }

  const { title, content, type, mood, tags, favorite, requestReflection } = req.body;
  if (title !== undefined) journal.title = title;
  if (content !== undefined) journal.content = content;
  if (type !== undefined) journal.type = type;
  if (mood !== undefined) journal.mood = mood;
  if (tags !== undefined) journal.tags = tags;
  if (favorite !== undefined) journal.favorite = favorite;

  if (requestReflection) {
    try {
      journal.aiReflection = await getJournalReflection(journal.content);
    } catch (err) {
      // leave existing reflection untouched on failure
    }
  }

  await journal.save();
  res.json({ success: true, data: journal });
});

// @desc Delete journal
// @route DELETE /api/journals/:id
const deleteJournal = asyncHandler(async (req, res) => {
  const journal = await Journal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!journal) {
    res.status(404);
    throw new Error('Journal entry not found');
  }
  res.json({ success: true, message: 'Journal entry deleted' });
});

module.exports = { createJournal, getJournals, getJournal, updateJournal, deleteJournal };
