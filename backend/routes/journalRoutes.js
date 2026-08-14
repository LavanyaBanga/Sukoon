const express = require('express');
const {
  createJournal, getJournals, getJournal, updateJournal, deleteJournal,
} = require('../controllers/journalController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/').post(createJournal).get(getJournals);
router.route('/:id').get(getJournal).put(updateJournal).delete(deleteJournal);

module.exports = router;
