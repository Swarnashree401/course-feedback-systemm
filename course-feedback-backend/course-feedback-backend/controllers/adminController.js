const { getDB } = require('../utils/db');

exports.dashboardStats = async (req, res) => {
  try {
    const db = getDB();
    const totalFeedback = db.data.feedbacks.length;
    const totalStudents = db.data.users.filter(u => u.role === 'student').length;
    // avg rating per course
    const map = {};
    for (const f of db.data.feedbacks) {
      map[f.courseId] = map[f.courseId] || { sum: 0, count: 0 };
      map[f.courseId].sum += Number(f.rating);
      map[f.courseId].count += 1;
    }
    const avgRatings = Object.keys(map).map(cid => {
      const course = db.data.courses.find(c => c.id === cid) || {};
      return { courseId: cid, courseTitle: course.title || 'Unknown', avgRating: map[cid].sum / map[cid].count, count: map[cid].count };
    }).sort((a,b)=> b.avgRating - a.avgRating);
    res.json({ totalFeedback, totalStudents, avgRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listStudents = async (req, res) => {
  try {
    const db = getDB();
    const students = db.data.users.filter(u => u.role === 'student').map(u => {
      const copy = { ...u }; delete copy.password; return copy;
    });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.blockUnblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const user = db.data.users.find(u => u.id === id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    user.blocked = !user.blocked;
    await db.write();
    res.json({ message: user.blocked ? 'Blocked' : 'Unblocked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    db.data.users = db.data.users.filter(u => u.id !== id);
    db.data.feedbacks = db.data.feedbacks.filter(f => f.studentId !== id);
    await db.write();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
