 # course feedback systemm

## Project Overview
The Course Feedback Management System is a web-based platform designed to streamline the collection and management of feedback from students. It allows students to register, submit, view, and manage their course feedback while providing administrators with tools to manage courses, users, and generate insightful reports.

This project consists of:
- **Backend (Node.js + Express + LowDB):**  
  Provides RESTful APIs for authentication, course management, feedback handling, and admin functionalities.
- **Frontend (Static HTML, CSS, JS):**  
  A lightweight interface that connects to the backend APIs for user interaction.

---

## Team Members
| Name | USN | Role |
|------|-----|------|
| *Add Member 1 Name* | *USN001* | *Backend Developer* |
| *Add Member 2 Name* | *USN002* | *Frontend Developer* |
| *Add Member 3 Name* | *USN003* | *Testing & Deployment* |
| *Add Member 4 Name* | *USN004* | *Documentation* |

> Replace the placeholders with actual team member details as required by your college guidelines.

---

## Project Objectives
1. Allow students to securely register, log in, and manage their profiles.
2. Provide a platform for submitting and viewing feedback for different courses.
3. Enable administrators to:
   - Manage courses and student accounts.
   - View all feedback entries with filters.
   - Block/unblock or delete student accounts.
   - Export feedback data to CSV format.
4. Provide an admin dashboard with:
   - Total feedback count.
   - Total student count.
   - Average ratings for courses.
5. Simplify deployment with no external dependencies like MongoDB or Cloudinary.

---

## Features Implemented

### For Students
- Secure registration and login with JWT authentication.
- Profile management:
  - Update details such as name, phone, DOB, and address.
  - Change password.
  - Upload profile picture.
- Submit, view, edit, and delete feedback for courses.

### For Admin
- Manage courses (create, update, delete).
- View and manage student accounts:
  - Block or unblock users.
  - Delete user accounts.
- View all feedback with filtering by:
  - Course
  - Rating
  - Student
- Export feedback reports as CSV files.
- Dashboard analytics:
  - Total students
  - Total feedback
  - Average rating per course

---

## Default Admin Account
The following admin account is automatically created when you run the seed script:

| Field    | Value              |
|----------|--------------------|
| Email    | `admin@example.com` |
| Password | `Admin@1234`        |

> Use this account to log in as admin and manage the system.

---

## Technologies Used

### Backend
- Node.js
- Express.js
- LowDB (JSON file-based database)
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- Multer for file uploads
- CORS for secure API calls

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (Fetch API)

---

## Installation and Setup

> **Note:** This project is completely self-contained and does **not require any external credentials** like MongoDB or Cloudinary.

### Backend Setup
1. Extract the `course-feedback-backend` folder.
2. Run the seed script to create default data:
   ```
   node seed.js
   ```
3. Start the backend:
   ```
   node server.js
   ```
4. The backend will be running at:  
   `http://localhost:5000`

---

### Frontend Setup
1. Extract the `course-feedback-frontend` folder.
2. Open `static/index.html` directly in a web browser, **or** serve it using a simple static server.
3. Ensure that the backend is running at `http://localhost:5000`.

---

## Deployment Instructions

### Backend Deployment
1. Push the `course-feedback-backend` folder to a GitHub repository.
2. Deploy the backend on **Render** or **Railway**.
3. Make sure port `5000` is open and `.env` defaults are configured.

### Frontend Deployment
1. Push the `course-feedback-frontend` folder to a separate GitHub repository.
2. Deploy to **Vercel** or **Netlify**.
3. Update the `API_BASE` variable in `static/index.html` to point to the deployed backend URL.

---

## API Endpoints

### Authentication
| Endpoint            | Method | Description           |
|--------------------|--------|-----------------------|
| `/api/auth/signup` | POST   | Register new student |
| `/api/auth/login`  | POST   | Login and get token  |

---

### Profile Management
| Endpoint               | Method | Description              |
|------------------------|--------|--------------------------|
| `/api/profile`         | GET    | Get current user's profile |
| `/api/profile`         | PUT    | Update user profile      |
| `/api/profile/password`| PUT    | Change password          |
| `/api/profile/upload`  | POST   | Upload profile image     |

---

### Course Management
| Endpoint          | Method | Description            |
|-------------------|--------|------------------------|
| `/api/courses`    | GET    | List all courses       |
| `/api/courses`    | POST   | Add course (Admin)     |
| `/api/courses/:id`| PUT    | Update course (Admin)  |
| `/api/courses/:id`| DELETE | Delete course (Admin)  |

---

### Feedback Management
| Endpoint                  | Method | Description                |
|---------------------------|--------|----------------------------|
| `/api/feedback`           | POST   | Submit new feedback        |
| `/api/feedback/me`        | GET    | View logged-in student's feedback |
| `/api/feedback/:id`       | PUT    | Update feedback            |
| `/api/feedback/:id`       | DELETE | Delete feedback            |
| `/api/feedback`           | GET    | View all feedback (Admin)  |
| `/api/feedback/export/csv`| GET    | Export feedback to CSV (Admin) |

---

### Admin Management
| Endpoint                      | Method | Description               |
|-------------------------------|--------|---------------------------|
| `/api/admin/stats`            | GET    | View dashboard statistics |
| `/api/admin/students`         | GET    | View all students         |
| `/api/admin/students/:id/block`| PUT   | Block or unblock student  |
| `/api/admin/students/:id`     | DELETE | Delete student account    |

---

## File Structure

### Backend
```
course-feedback-backend/
├── controllers/        # Business logic
├── routes/             # API endpoints
├── middleware/         # Auth and admin middleware
├── utils/              # Helper utilities
├── data/db.json        # JSON database
├── uploads/            # Profile image uploads
├── seed.js             # Seeding script
├── server.js           # Entry point
├── package.json
└── .env
```

### Frontend
```
course-feedback-frontend/
├── static/
│   └── index.html      # Main frontend file
├── package.json
└── README.md
```

---

## Usage Flow
1. **Admin Login:**  
   - Admin logs in using default credentials.
   - Adds or edits courses.
2. **Student Registration:**  
   - Students register, log in, and update profiles.
   - Submit course feedback.
3. **Admin Management:**  
   - Views feedback and student analytics on the dashboard.
   - Filters and exports feedback reports.
   - Blocks or deletes problematic users.

---

## Default Workflow
1. Start backend (`node server.js`).
2. Open frontend `index.html`.
3. Login as admin → Manage courses and view stats.
4. Login as student → Submit and view feedback.
5. Admin → Export feedback CSV for reports.

---

## License
This project is developed as part of academic coursework and is intended **only for educational purposes**.
