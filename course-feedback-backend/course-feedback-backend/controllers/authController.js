const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDB } = require('../utils/db');
const { nanoid } = require('nanoid');

function validatePassword(pw) {
  if (typeof pw !== 'string') return false;
  return pw.length >= 8 && /\d/.test(pw) && /[!@#$%^&*(),.?":{}|<>]/.test(pw);
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    if (!validatePassword(password)) return res.status(400).json({ message: 'Password too weak' });

    const db = getDB();
    const exists = db.data.users.find(u => u.email === email.toLowerCase());
    if (exists) return res.status(400).json({ message: 'Email exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = {
      id: nanoid(),
      name,
      email: email.toLowerCase(),
      password: hash,
      role: 'student',
      phone: '',
      dob: null,
      address: '',
      profileImage: '',
      blocked: false,
      createdAt: new Date().toISOString()
    };
    db.data.users.push(user);
    await db.write();

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'change_this_only_if_you_want', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const db = getDB();
    const user = db.data.users.find(u => u.email === email.toLowerCase());
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'change_this_only_if_you_want', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
