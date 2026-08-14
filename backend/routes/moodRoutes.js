const express = require('express');
const { createMood, getMoods, getMoodAnalytics } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/').post(createMood).get(getMoods);
router.get('/analytics', getMoodAnalytics);

module.exports = router;
