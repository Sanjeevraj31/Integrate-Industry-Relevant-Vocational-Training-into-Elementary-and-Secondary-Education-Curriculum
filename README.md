# SkillBridge — Vocational Learning & Mentorship Platform

SkillBridge is a beginner-friendly, fully functional MERN Stack web application designed based on the Smart India Hackathon (SIH) project: **"Integrate Industry-Relevant Vocational Training into Elementary and Secondary Education Curriculum (Grades 6–12)"**.

The platform aligns school educational curricula with India's National Education Policy (NEP 2020) by introducing practical trade courses, timed auto-graded quizzes, project portfolio grading, direct messaging with corporate mentors, and tamper-evident digitally verifiable credentials.

---

## 🚀 Key Architectural Highlight: Server-Side Offline Fallback Layer

SkillBridge implements a **transparent local database fallback logic**. When the Node.js backend starts or executes queries, it continuously checks if the primary MongoDB server is connected.
- **Online Mode**: Queries are routed through Mongoose to the MongoDB database.
- **Offline/Fallback Mode**: When MongoDB is unreachable, the system transparently routes all read and write queries to structured JSON files in `./backend/data/*.json`. This ensures zero downtime for schools situated in low-connectivity or rural areas.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite template), Tailwind CSS v4, React Router DOM, Axios, Lucide Icons, Custom SVG Charts
- **Backend**: Node.js, Express.js, JWT Authentication, Bcrypt Password Hashing
- **Database**: MongoDB with Mongoose (Primary), Local JSON Files (Fallback)

---

## 📁 Folder Structure

```
skillbridge/
├── backend/
│   ├── config/db.js           # Mongoose and JSON fallback database connector
│   ├── controllers/           # REST Route controllers (auth, courses, quizzes, etc.)
│   ├── middleware/            # JWT validation and authorization gates
│   ├── models/                # Mongoose Schema definitions
│   ├── routes/                # Express routing endpoints
│   ├── scripts/seed.js        # Script to seed sample users, courses, quizzes
│   └── utils/localDbHelper.js # Custom JSON datastore query mirror
└── frontend/
    ├── src/
    │   ├── components/        # Reusable view cards, navbars, and metrics
    │   ├── context/           # Auth and Dark Mode Theme state container
    │   ├── layouts/           # Page master frames
    │   ├── pages/             # Student, Teacher, Mentor, and Admin views
    │   ├── services/api.js    # Axios wrapper with header tokens
    │   ├── App.jsx            # Application router maps
    │   └── index.css          # Design system base
    └── vite.config.js
```

---

## 🚀 Installation & Running Guide

### Prerequisites
- Node.js (v18 or later)
- MongoDB installed locally (Optional; if not running, the system automatically runs in local JSON fallback mode)

### 1. Database Seeding
First, initialize and populate the datastores (both MongoDB and JSON files are seeded simultaneously):
```bash
cd backend
npm install
node scripts/seed.js
```

Seeded credentials:
* **Admin**: `admin@skillbridge.gov.in` / `password123`
* **Student**: `student1@school.edu` to `student20@school.edu` / `password123`
* **Teacher**: `teacher1@skillbridge.gov.in` / `password123`
* **Mentor**: `mentor1@industry.com` / `password123`

### 2. Start the Backend Server
```bash
npm start
```
The backend server runs on `http://localhost:5000`.

### 3. Start the Frontend Dev Client
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend Vite server runs on `http://localhost:5173`.
All requests to `/api` are automatically proxied to the backend on port 5000.
