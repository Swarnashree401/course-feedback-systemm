const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { protect } = require('../middleware/auth');
const profileController = require('../controllers/profileController');

router.get('/', protect, profileController.getProfile);
router.put('/', protect, profileController.updateProfile);
router.put('/password', protect, profileController.changePassword);
router.post('/upload', protect, upload.single('file'), profileController.uploadProfileImage);

module.exports = router;
