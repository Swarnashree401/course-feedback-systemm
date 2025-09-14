const { getDB } = require('../utils/db');
const { nanoid } = require('nanoid');
const fs = require('fs');
const os = require('os');
const path = require('path');

exports.createFeedback = async (req, res) => {
  try {
    const { courseId, rating, message } = req.body;
    if (!courseId || !rating) return res.status(400).json({ message: 'Missing fields' });
    const db = getDB();
    const course = db.data.courses.find(c => c.id === courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const fb = { id: nanoid(), studentId: req.user.id, courseId, rating: Number(rating), message: message || '', createdAt: new Date().toISOString() };
    db.data.feedbacks.push(fb);
    await db.write();
    res.json(fb);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyFeedbacks = async (req, res) => {
  try {
    const db = getDB();
    const items = db.data.feedbacks.filter(f => f.studentId === req.user.id).map(f => {
      const course = db.data.courses.find(c => c.id === f.courseId) || {};
      return { ...f, course };
    }).sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
    res.json({ items, total: items.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, message, courseId } = req.body;
    const db = getDB();
    const fb = db.data.feedbacks.find(f => f.id === id);
    if (!fb) return res.status(404).json({ message: 'Not found' });
    if (fb.studentId !== req.user.id) return res.status(403).json({ message: 'Not allowed' });
    if (courseId) {
      const course = db.data.courses.find(c => c.id === courseId);
      if (!course) return res.status(404).json({ message: 'Course not found' });
      fb.courseId = courseId;
    }
    if (rating !== undefined) fb.rating = Number(rating);
    if (message !== undefined) fb.message = message;
    await db.write();
    res.json(fb);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const fb = db.data.feedbacks.find(f => f.id === id);
    if (!fb) return res.status(404).json({ message: 'Not found' });
    if (fb.studentId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Not allowed' });
    db.data.feedbacks = db.data.feedbacks.filter(f => f.id !== id);
    await db.write();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listAllFeedback = async (req, res) => {
  try {
    const { course, rating, student } = req.query;
    const db = getDB();
    let items = db.data.feedbacks.map(f => {
      const studentObj = db.data.users.find(u => u.id === f.studentId) || {};
      const courseObj = db.data.courses.find(c => c.id === f.courseId) || {};
      return { ...f, student: { id: studentObj.id, name: studentObj.name, email: studentObj.email }, course: { id: courseObj.id, title: courseObj.title } };
    });
    if (course) items = items.filter(i => i.course.id === course);
    if (rating) items = items.filter(i => Number(i.rating) === Number(rating));
    if (student) items = items.filter(i => i.student.id === student);
    items = items.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
    res.json({ items, total: items.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.exportCsv = async (req, res) => {
  try {
    const db = getDB();
    const items = db.data.feedbacks.map(f => {
      const studentObj = db.data.users.find(u => u.id === f.studentId) || {};
      const courseObj = db.data.courses.find(c => c.id === f.courseId) || {};
      return {
        id: f.id,
        studentName: studentObj.name || '',
        studentEmail: studentObj.email || '',
        course: courseObj.title || '',
        rating: f.rating,
        message: f.message || '',
        createdAt: f.createdAt
      };
    });
    const tmpPath = pathJoinTemp('feedback_export.csv');
    const header = 'ID,Student,Email,Course,Rating,Message,CreatedAt' + '\n';
    const rows = items.map(it => [it.id, csvSafe(it.studentName), csvSafe(it.studentEmail), csvSafe(it.course), it.rating, csvSafe(it.message), it.createdAt].join(',')).join('\n');
    fs.writeFileSync(tmpPath, header + rows, 'utf8');
    res.download(tmpPath, 'feedback_export.csv', err => { if (err) console.error(err); try { fs.unlinkSync(tmpPath); } catch (e) {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const fs = require('fs');
const os = require('os');
const path = require('path');

function pathJoinTemp(name) {
  return path.join(os.tmpdir(), name);
}
function csvSafe(s) {
  if (!s && s !== 0) return '';
  return '"' + String(s).replace(/"/g, '""') + '"';
}
