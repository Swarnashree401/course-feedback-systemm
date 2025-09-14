const { getDB } = require('../utils/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

exports.getProfile = async (req, res) => {
  const db = getDB();
  const user = db.data.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  const safe = { ...user };
  delete safe.password;
  res.json(safe);
};

exports.updateProfile = async (req, res) => {
  try {
    const db = getDB();
    const user = db.data.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    const { name, phone, dob, address } = req.body;
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (dob !== undefined) user.dob = dob;
    if (address !== undefined) user.address = address;
    await db.write();
    const safe = { ...user }; delete safe.password;
    res.json(safe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Missing fields' });
    const db = getDB();
    const user = db.data.users.find(u => u.id === req.user.id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Current password incorrect' });
    if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      return res.status(400).json({ message: 'New password does not meet policy' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await db.write();
    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file' });
    const db = getDB();
    const user = db.data.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'Not found' });

    const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const ext = (req.file.originalname || 'img').split('.').pop();
    const filename = `${user.id}_${Date.now()}.${ext}`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, req.file.buffer);
    user.profileImage = `/uploads/${filename}`;
    await db.write();
    res.json({ profileImage: user.profileImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload error' });
  }
};
