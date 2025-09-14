# Course Feedback Backend (file-db, no credentials required)

This backend uses a small file-based JSON database (lowdb) and stores uploads locally — **no MongoDB, no Cloudinary, no external credentials**.

## Quick start

1. Clone / copy this folder to your machine or push to GitHub.
2. (Optional) run `npm install` if you didn't commit node_modules.
3. Seed initial data:
   ```
   node seed.js
   ```
   Admin: `admin@example.com` / `Admin@1234`
4. Run:
   ```
   node server.js
   ```
   Server runs on `http://localhost:5000` by default.

## API overview
- `POST /api/auth/signup` - { name, email, password }
- `POST /api/auth/login` - { email, password }
- `GET /api/courses` - list courses (protected)
- Admin endpoints and other feedback/profile endpoints are listed in the code.

## Notes
- JWT secret is set in `.env`. Default is present so you don't need to edit anything.
- Uploaded profile images are saved to `/uploads` and served at `/uploads/<filename>`.
- Database file is written to `./data/db.json`.
