const express = require('express');
const {
  askGita, chatWithCompanion, getConversations, getConversation, deleteConversation,
  sortThoughtsHandler, journalReflectionHandler, weeklyInsight,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.post('/gita', askGita);
router.post('/chat', chatWithCompanion);
router.post('/sort-thoughts', sortThoughtsHandler);
router.post('/journal-reflection', journalReflectionHandler);
router.get('/weekly-insight', weeklyInsight);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversation);
router.delete('/conversations/:id', deleteConversation);

module.exports = router;
