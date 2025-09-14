require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const { initDB } = require('./utils/db');
const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
const profileRoutes = require('./routes/profile');
const courseRoutes = require('./routes/courses');
const adminRoutes = require('./routes/admin');

const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// ensure folders exist
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(path.dirname(process.env.DATA_FILE || './data/db.json'))) {
  fs.mkdirSync(path.dirname(process.env.DATA_FILE || './data/db.json'), { recursive: true });
}

initDB(); // initialize lowdb with default structure

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(UPLOAD_DIR)));

app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: 'Course Feedback (file-db) API' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
