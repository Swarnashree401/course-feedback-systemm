const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const adminController = require('../controllers/adminController');

router.get('/stats', protect, adminOnly, adminController.dashboardStats);
router.get('/students', protect, adminOnly, adminController.listStudents);
router.put('/students/:id/block', protect, adminOnly, adminController.blockUnblockUser);
router.delete('/students/:id', protect, adminOnly, adminController.deleteUser);

module.exports = router;
