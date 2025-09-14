const jwt = require('jsonwebtoken');
const { getDB } = require('../utils/db');

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_only_if_you_want');
    const db = getDB();
    const user = db.data.users.find(u => u.id === decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    if (user.blocked) return res.status(403).json({ message: 'Account blocked' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid' });
  }
};
