const bcrypt = require('bcrypt');
const { initDB, getDB } = require('./utils/db');
const { nanoid } = require('nanoid');

async function seed() {
  await initDB();
  const db = getDB();
  // admin
  const adminEmail = 'admin@example.com';
  if (!db.data.users.find(u => u.email === adminEmail)) {
    const hashed = await bcrypt.hash('Admin@1234', 10);
    db.data.users.push({
      id: nanoid(),
      name: 'Site Admin',
      email: adminEmail,
      password: hashed,
      role: 'admin',
      phone: '',
      dob: null,
      address: '',
      profileImage: '',
      blocked: false,
      createdAt: new Date().toISOString()
    });
    console.log('Admin created: admin@example.com / Admin@1234');
  } else {
    console.log('Admin already exists');
  }

  // courses
  const courses = [
    { title: 'Data Structures', code: 'CS201', description: 'Intro to DS' },
    { title: 'Operating Systems', code: 'CS301', description: 'OS concepts' },
    { title: 'Computer Networks', code: 'CS302', description: 'Networking' },
    { title: 'Database Systems', code: 'CS303', description: 'DBMS concepts' }
  ];
  for (const c of courses) {
    if (!db.data.courses.find(x => x.title === c.title)) {
      db.data.courses.push({ id: nanoid(), ...c, createdAt: new Date().toISOString() });
      console.log('Seeded course:', c.title);
    }
  }
  await db.write();
  console.log('Seeding done.');
}

seed().catch(err => { console.error(err); process.exit(1); });
