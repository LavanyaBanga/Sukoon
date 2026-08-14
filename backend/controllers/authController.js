const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      onboardingCompleted: user.onboardingCompleted,
      token: generateToken(user._id),
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      onboardingCompleted: user.onboardingCompleted,
      token: generateToken(user._id),
    },
  });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

// @desc    Complete onboarding preferences
// @route   PUT /api/auth/onboarding
// @access  Private
const completeOnboarding = asyncHandler(async (req, res) => {
  const { focusAreas, strugglesMostAt, copingStyles } = req.body;

  req.user.preferences = { focusAreas, strugglesMostAt, copingStyles };
  req.user.onboardingCompleted = true;
  await req.user.save();

  res.json({ success: true, data: req.user });
});

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar, settings, trustedContacts } = req.body;

  if (name) req.user.name = name;
  if (avatar !== undefined) req.user.avatar = avatar;
  if (settings) req.user.settings = { ...req.user.settings.toObject(), ...settings };
  if (trustedContacts) req.user.trustedContacts = trustedContacts;

  await req.user.save();
  res.json({ success: true, data: req.user });
});

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = asyncHandler(async (req, res) => {
  const Mood = require('../models/Mood');
  const Journal = require('../models/Journal');
  const Gratitude = require('../models/Gratitude');
  const Conversation = require('../models/Conversation');
  const MindfulnessSession = require('../models/MindfulnessSession');
  const SelfCareTask = require('../models/SelfCareTask');

  const userId = req.user._id;
  await Promise.all([
    Mood.deleteMany({ user: userId }),
    Journal.deleteMany({ user: userId }),
    Gratitude.deleteMany({ user: userId }),
    Conversation.deleteMany({ user: userId }),
    MindfulnessSession.deleteMany({ user: userId }),
    SelfCareTask.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId),
  ]);

  res.json({ success: true, message: 'Account and all associated data deleted' });
});

module.exports = { registerUser, loginUser, getMe, completeOnboarding, updateProfile, deleteAccount };
