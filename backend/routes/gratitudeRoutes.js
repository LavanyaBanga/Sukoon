const express = require('express');
const { addGratitude, getGratitude } = require('../controllers/gratitudeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/').post(addGratitude).get(getGratitude);

module.exports = router;
