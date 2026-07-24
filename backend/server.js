require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes = require('./routes/quizRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins for local dev
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to check/connect database on-demand (critical for serverless execution)
let isDbConnected = false;
app.use(async (req, res, next) => {
  if (!isDbConnected) {
    try {
      await connectDB();
      isDbConnected = true;
    } catch (err) {
      console.error('Database connection error in middleware:', err);
    }
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/chat', chatRoutes);

// Cloud Seeding Endpoint (Protected by secret key)
app.get('/api/seed', async (req, res) => {
  const { key } = req.query;
  if (key !== 'sanjeev_seed_key_123') {
    return res.status(403).json({ message: 'Unauthorized seeding request' });
  }
  
  try {
    const bcrypt = require('bcryptjs');
    const mongoose = require('mongoose');
    const User = require('./models/User');
    const Course = require('./models/Course');
    const Quiz = require('./models/Quiz');
    const Enrollment = require('./models/Enrollment');
    const Assignment = require('./models/Assignment');
    const Certificate = require('./models/Certificate');
    const QuizResult = require('./models/QuizResult');
    const ChatMessage = require('./models/ChatMessage');

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    // Users Array
    const users = [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: 'Super Administrator',
        email: 'admin@skillbridge.gov.in',
        password: defaultPassword,
        role: 'Super Admin',
        status: 'Active',
        schoolId: 'ADMIN-001'
      }
    ];
    
    // Add 5 Teachers
    for (let i = 1; i <= 5; i++) {
      users.push({
        _id: new mongoose.Types.ObjectId().toString(),
        name: `Teacher ${i}`,
        email: `teacher${i}@skillbridge.gov.in`,
        password: defaultPassword,
        role: 'Teacher',
        status: 'Active',
        schoolId: `SCH-T${100 + i}`
      });
    }

    // Add 2 Industry Partners
    for (let i = 1; i <= 2; i++) {
      users.push({
        _id: new mongoose.Types.ObjectId().toString(),
        name: `Mentor Partner ${i}`,
        email: `mentor${i}@industry.com`,
        password: defaultPassword,
        role: 'Industry Partner',
        status: 'Active',
        companyName: i === 1 ? 'RoboTech Labs' : 'Agritech India'
      });
    }

    // Add 20 Students
    for (let i = 1; i <= 20; i++) {
      users.push({
        _id: new mongoose.Types.ObjectId().toString(),
        name: `Student Learner ${i}`,
        email: `student${i}@school.edu`,
        password: defaultPassword,
        role: 'Student',
        status: 'Active',
        schoolId: `SCH-S${1000 + i}`
      });
    }

    // Save Users
    await User.deleteMany({});
    await User.insertMany(users);

    // Courses Array
    const courses = [];
    const courseTitles = [
      { title: 'Robotics Workshop for Beginners', category: 'Robotics', duration: '4 weeks' },
      { title: 'Introduction to Artificial Intelligence', category: 'Artificial Intelligence', duration: '6 weeks' },
      { title: 'Python Programming Essentials', category: 'Python Programming', duration: '5 weeks' },
      { title: 'Responsive Web Design Mastery', category: 'Web Development', duration: '8 weeks' },
      { title: 'Graphic Design and UI layouts', category: 'Graphic Design', duration: '4 weeks' },
      { title: 'Digital Marketing Fundamentals', category: 'Digital Marketing', duration: '3 weeks' },
      { title: 'House Wiring & Electrical Basics', category: 'Electrical Basics', duration: '4 weeks' },
      { title: 'Electronics and Microcontrollers', category: 'Electronics', duration: '6 weeks' },
      { title: 'Modern Sustainable Agriculture', category: 'Agriculture', duration: '6 weeks' },
      { title: 'Basic Fashion & Apparel Design', category: 'Fashion Design', duration: '5 weeks' },
      { title: 'Woodworking & Carpentry Basics', category: 'Carpentry', duration: '4 weeks' },
      { title: 'Healthy Cooking & Baking Basics', category: 'Cooking', duration: '3 weeks' },
      { title: 'Launch Your Business: Entrepreneurship', category: 'Entrepreneurship', duration: '6 weeks' },
      { title: 'Spoken English & Communication Skills', category: 'Communication Skills', duration: '4 weeks' },
      { title: 'Advanced Robotics and Automation', category: 'Robotics', duration: '8 weeks' }
    ];

    const teacherIds = users.filter(u => u.role === 'Teacher').map(u => u._id);
    courseTitles.forEach((ct, index) => {
      const instructor = teacherIds[index % teacherIds.length];
      courses.push({
        _id: new mongoose.Types.ObjectId().toString(),
        title: ct.title,
        description: `Learn the fundamentals of ${ct.title} designed for school students.`,
        category: ct.category,
        duration: ct.duration,
        instructor,
        thumbnailImage: `https://images.unsplash.com/photo-${1500000000000 + index * 10000}?auto=format&fit=crop&w=800&q=80`,
        videoLessons: [
          { _id: new mongoose.Types.ObjectId().toString(), title: 'Lesson 1: Welcome and Course Overview', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '10 mins' },
          { _id: new mongoose.Types.ObjectId().toString(), title: 'Lesson 2: Basic Concepts and Principles', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15 mins' }
        ],
        pdfNotes: [
          { _id: new mongoose.Types.ObjectId().toString(), title: 'Course Syllabus PDF', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
        ],
        learningOutcomes: [
          `Understand the absolute fundamentals of ${ct.category}`,
          `Earn a verifiable digital certificate recognized by partners`
        ],
        enrolledStudents: []
      });
    });

    // Save Courses
    await Course.deleteMany({});
    await Course.insertMany(courses);

    // Quizzes Array
    const quizzes = [];
    courses.forEach((c, index) => {
      const quizQuestions = [
        {
          _id: new mongoose.Types.ObjectId().toString(),
          questionText: `Quiz Question 1 for ${c.title}: Which of the following best defines this topic?`,
          options: ['Option A', 'Option B (Correct)', 'Option C', 'Option D'],
          correctOption: 1,
          marks: 5
        }
      ];
      quizzes.push({
        _id: new mongoose.Types.ObjectId().toString(),
        courseId: c._id,
        title: `${c.title} Assessment`,
        duration: 15,
        negativeMarking: 1.0,
        questions: quizQuestions
      });
    });

    // Save Quizzes
    await Quiz.deleteMany({});
    await Quiz.insertMany(quizzes);

    // Clear and reset extra collections
    await Enrollment.deleteMany({});
    await Assignment.deleteMany({});
    await Certificate.deleteMany({});
    await QuizResult.deleteMany({});
    await ChatMessage.deleteMany({});

    res.json({ message: 'Cloud database seeded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Simple Health Check
app.get('/api/health', (req, res) => {
  const { isConnected } = require('./config/db');
  res.json({
    status: 'online',
    database: isConnected() ? 'MongoDB' : 'Local JSON Fallback',
    timestamp: new Date().toISOString()
  });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An internal server error occurred', error: err.message });
});

// Start server locally only if not running inside Vercel serverless runtime
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`SkillBridge Backend running on port ${PORT}`);
  });
}

module.exports = app;
