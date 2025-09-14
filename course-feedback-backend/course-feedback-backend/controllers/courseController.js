const { getDB } = require('../utils/db');
const { nanoid } = require('nanoid');

exports.createCourse = async (req, res) => {
  try {
    const { title, code, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    const db = getDB();
    if (db.data.courses.find(c => c.title.toLowerCase() === title.toLowerCase())) {
      return res.status(400).json({ message: 'Course exists' });
    }
    const course = { id: nanoid(), title, code: code || '', description: description || '', createdAt: new Date().toISOString() };
    db.data.courses.push(course);
    await db.write();
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listCourses = async (req, res) => {
  try {
    const db = getDB();
    res.json(db.data.courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, code, description } = req.body;
    const db = getDB();
    const course = db.data.courses.find(c => c.id === id);
    if (!course) return res.status(404).json({ message: 'Not found' });
    if (title) course.title = title;
    if (code !== undefined) course.code = code;
    if (description !== undefined) course.description = description;
    await db.write();
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    db.data.courses = db.data.courses.filter(c => c.id !== id);
    await db.write();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
