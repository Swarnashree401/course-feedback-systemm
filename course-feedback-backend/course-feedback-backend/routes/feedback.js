const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const feedbackController = require('../controllers/feedbackController');

router.post('/', protect, feedbackController.createFeedback);
router.get('/me', protect, feedbackController.getMyFeedbacks);
router.put('/:id', protect, feedbackController.updateFeedback);
router.delete('/:id', protect, feedbackController.deleteFeedback);

// admin
router.get('/', protect, adminOnly, feedbackController.listAllFeedback);
router.get('/export/csv', protect, adminOnly, feedbackController.exportCsv);

module.exports = router;
