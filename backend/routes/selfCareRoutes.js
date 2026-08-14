const express = require('express');
const { getTasks, updateTask } = require('../controllers/selfCareController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.get('/', getTasks);
router.put('/:id', updateTask);

module.exports = router;
