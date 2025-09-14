const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const courseController = require('../controllers/courseController');

router.get('/', protect, courseController.listCourses);
router.post('/', protect, adminOnly, courseController.createCourse);
router.put('/:id', protect, adminOnly, courseController.updateCourse);
router.delete('/:id', protect, adminOnly, courseController.deleteCourse);

module.exports = router;
