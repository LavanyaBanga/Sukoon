const express = require('express');
const { body } = require('express-validator');
const {
  registerUser, loginUser, getMe, completeOnboarding, updateProfile, deleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  registerUser
);

router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/onboarding', protect, completeOnboarding);
router.put('/profile', protect, updateProfile);
router.delete('/account', protect, deleteAccount);

module.exports = router;
