const { Low, JSONFile } = require('lowdb');
const path = require('path');
const defaultData = {
  users: [],
  courses: [],
  feedbacks: []
};

let db;

async function initDB() {
  const file = process.env.DATA_FILE ? path.resolve(process.env.DATA_FILE) : path.resolve('./data/db.json');
  const adapter = new JSONFile(file);
  db = new Low(adapter);
  await db.read();
  db.data = db.data || defaultData;
  // ensure arrays exist
  db.data.users = db.data.users || [];
  db.data.courses = db.data.courses || [];
  db.data.feedbacks = db.data.feedbacks || [];
  await db.write();
  return db;
}

function getDB() {
  if (!db) throw new Error('DB not initialized. Call initDB() first.');
  return db;
}

module.exports = { initDB, getDB };
