const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');
const Mood = require('../models/Mood');
const Journal = require('../models/Journal');
const Gratitude = require('../models/Gratitude');
const MindfulnessSession = require('../models/MindfulnessSession');

const {
  getGitaWisdom,
  getCompanionReply,
  sortThoughts,
  getWeeklyInsight,
  getJournalReflection,
} = require('../services/groqService');


// ======================================================
// ASK KRISHNA
// POST /api/ai/gita
// ======================================================

const askGita = asyncHandler(async (req, res) => {
  const { message, conversationId } = req.body;

  if (!message || !message.trim()) {
    res.status(400);
    throw new Error('Please share what is on your mind');
  }

  let result;

  try {
    result = await getGitaWisdom(message);
  } catch (err) {
    console.error('Groq Gita Error:', err.message);

    res.status(502);
    throw new Error(
      'Sukoon is having trouble reaching its wisdom source right now. Please try again in a moment.'
    );
  }

  let conversation;

  if (conversationId) {
    conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user._id,
      type: 'gita',
    });
  }

  if (!conversation) {
    conversation = await Conversation.create({
      user: req.user._id,
      type: 'gita',
      title: message.slice(0, 40),
      messages: [],
    });
  }

  conversation.messages.push({
    role: 'user',
    content: message,
  });

  conversation.messages.push({
    role: 'assistant',
    content: result.text,
  });

  await conversation.save();

  res.json({
    success: true,
    data: {
      reply: result.text,
      crisis: result.crisis,
      conversationId: conversation._id,
    },
  });
});


// ======================================================
// TALK TO SUKOON
// POST /api/ai/chat
// ======================================================

const chatWithCompanion = asyncHandler(async (req, res) => {
  const { message, conversationId } = req.body;

  if (!message || !message.trim()) {
    res.status(400);
    throw new Error('Please share what is on your mind');
  }

  let conversation;

  if (conversationId) {
    conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user._id,
      type: 'general',
    });
  }

  if (!conversation) {
    conversation = await Conversation.create({
      user: req.user._id,
      type: 'general',
      title: message.slice(0, 40),
      messages: [],
    });
  }

  const history = conversation.messages.slice(-10);

  let result;

  try {
    result = await getCompanionReply(message, history);
  } catch (err) {
    console.error('Groq Companion Error:', err.message);

    res.status(502);
    throw new Error(
      'Sukoon is having trouble responding right now. Please try again in a moment.'
    );
  }

  conversation.messages.push({
    role: 'user',
    content: message,
  });

  conversation.messages.push({
    role: 'assistant',
    content: result.text,
  });

  await conversation.save();

  res.json({
    success: true,
    data: {
      reply: result.text,
      crisis: result.crisis,
      conversationId: conversation._id,
    },
  });
});


// ======================================================
// GET CONVERSATIONS
// GET /api/ai/conversations?type=general|gita
// ======================================================

const getConversations = asyncHandler(async (req, res) => {
  const { type } = req.query;

  const filter = {
    user: req.user._id,
  };

  if (type) {
    filter.type = type;
  }

  const conversations = await Conversation.find(filter)
    .sort({ updatedAt: -1 })
    .select('-messages');

  res.json({
    success: true,
    data: conversations,
  });
});


// ======================================================
// GET SINGLE CONVERSATION
// GET /api/ai/conversations/:id
// ======================================================

const getConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  res.json({
    success: true,
    data: conversation,
  });
});


// ======================================================
// DELETE CONVERSATION
// DELETE /api/ai/conversations/:id
// ======================================================

const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  res.json({
    success: true,
    message: 'Conversation deleted',
  });
});


// ======================================================
// UNLOAD YOUR MIND
// POST /api/ai/sort-thoughts
// ======================================================

const sortThoughtsHandler = asyncHandler(async (req, res) => {
  const { thoughts } = req.body;

  if (!thoughts || !thoughts.trim()) {
    res.status(400);
    throw new Error('Please write down what is on your mind first');
  }

  try {
    const sorted = await sortThoughts(thoughts);

    res.json({
      success: true,
      data: sorted,
    });
  } catch (err) {
    console.error('Groq Sort Thoughts Error:', err.message);

    res.status(502);
    throw new Error(
      'Sukoon could not sort your thoughts right now. Please try again shortly.'
    );
  }
});


// ======================================================
// JOURNAL REFLECTION
// POST /api/ai/journal-reflection
// ======================================================

const journalReflectionHandler = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    res.status(400);
    throw new Error('No content provided to reflect on');
  }

  try {
    const reflection = await getJournalReflection(content);

    res.json({
      success: true,
      data: {
        reflection,
      },
    });
  } catch (err) {
    console.error('Groq Journal Reflection Error:', err.message);

    res.status(502);
    throw new Error(
      'Sukoon could not generate a reflection right now.'
    );
  }
});


// ======================================================
// WEEKLY INSIGHT
// GET /api/ai/weekly-insight
// ======================================================

const weeklyInsight = asyncHandler(async (req, res) => {
  const since = new Date();

  since.setDate(since.getDate() - 7);

  const [moods, journals, gratitude, sessions] = await Promise.all([
    Mood.find({
      user: req.user._id,
      createdAt: { $gte: since },
    }),

    Journal.find({
      user: req.user._id,
      createdAt: { $gte: since },
    }).select('type mood createdAt'),

    Gratitude.countDocuments({
      user: req.user._id,
      createdAt: { $gte: since },
    }),

    MindfulnessSession.find({
      user: req.user._id,
      createdAt: { $gte: since },
    }).select('duration exercise'),
  ]);

  const summaryText = `
Moods this week: ${
    moods
      .map(
        (m) =>
          `${m.mood} (factors: ${
            (m.factors || []).join(', ') || 'none'
          })`
      )
      .join('; ') || 'no mood entries logged'
  }.

Journal entries: ${journals.length} 
(types: ${journals.map((j) => j.type).join(', ') || 'none'}).

Gratitude entries: ${gratitude}.

Mindfulness sessions: ${sessions.length}, 
total minutes: ${Math.round(
    sessions.reduce((sum, s) => sum + s.duration, 0) / 60
  )}.
`;

  try {
    const insight = await getWeeklyInsight(summaryText);

    res.json({
      success: true,
      data: {
        insight,
      },
    });
  } catch (err) {
    console.error('Groq Weekly Insight Error:', err.message);

    res.json({
      success: true,
      data: {
        insight:
          'Not enough data yet this week for a reflection — keep checking in and it will grow richer over time.',
      },
    });
  }
});


module.exports = {
  askGita,
  chatWithCompanion,
  getConversations,
  getConversation,
  deleteConversation,
  sortThoughtsHandler,
  journalReflectionHandler,
  weeklyInsight,
};