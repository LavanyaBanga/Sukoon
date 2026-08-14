const express = require('express');
const { logSession, getStats } = require('../controllers/mindfulnessController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/').post(logSession);
router.get('/stats', getStats);

module.exports = router;
