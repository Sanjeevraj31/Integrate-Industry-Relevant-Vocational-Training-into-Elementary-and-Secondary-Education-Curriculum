const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDB, isConnected } = require('../config/db');
const localDb = require('../utils/localDbHelper');

// Load Mongoose models
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Certificate = require('../models/Certificate');
const ChatMessage = require('../models/ChatMessage');

const seedData = async () => {
  try {
    // 1. Connect database
    console.log('Connecting to database for seeding...');
    await connectDB();
    
    const usingMongo = isConnected();
    console.log(`Seeding mode: ${usingMongo ? 'MongoDB + Local JSON Fallback' : 'Local JSON Fallback Only'}`);

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    // --- GENERATE USERS ---
    const users = [];
    
    // Super Admin
    users.push({
      _id: new mongoose.Types.ObjectId().toString(),
      name: 'Super Administrator',
      email: 'admin@skillbridge.gov.in',
      password: defaultPassword,
      role: 'Super Admin',
      status: 'Active',
      badges: [],
      schoolId: 'ADMIN-001'
    });

    // 5 Teachers
    const categories = [
      'Robotics', 'Artificial Intelligence', 'Python Programming', 'Web Development', 
      'Graphic Design', 'Digital Marketing', 'Electrical Basics', 'Electronics', 
      'Agriculture', 'Fashion Design', 'Carpentry', 'Cooking', 'Entrepreneurship', 
      'Communication Skills'
    ];
    for (let i = 1; i <= 5; i++) {
      users.push({
        _id: new mongoose.Types.ObjectId().toString(),
        name: `Teacher ${i}`,
        email: `teacher${i}@skillbridge.gov.in`,
        password: defaultPassword,
        role: 'Teacher',
        status: 'Active',
        badges: [],
        schoolId: `SCH-T${100 + i}`
      });
    }

    // 2 Industry Partners (Mentors)
    const companies = ['RoboTech Labs', 'Agritech India', 'Creative Studio', 'Standard Electricals'];
    for (let i = 1; i <= 2; i++) {
      users.push({
        _id: new mongoose.Types.ObjectId().toString(),
        name: `Mentor Partner ${i}`,
        email: `mentor${i}@industry.com`,
        password: defaultPassword,
        role: 'Industry Partner',
        status: 'Active',
        badges: [],
        companyName: companies[i - 1]
      });
    }

    // 20 Students
    for (let i = 1; i <= 20; i++) {
      users.push({
        _id: new mongoose.Types.ObjectId().toString(),
        name: `Student Learner ${i}`,
        email: `student${i}@school.edu`,
        password: defaultPassword,
        role: 'Student',
        status: 'Active',
        badges: i <= 5 ? [{ title: 'Intro to Robotics Badge', criteria: 'Completed basic assessment', date: new Date().toISOString() }] : [],
        schoolId: `SCH-S${1000 + i}`
      });
    }

    // --- GENERATE COURSES ---
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
        description: `Learn the fundamentals of ${ct.title} designed for school students. This course includes step-by-step video lessons, PDF reading materials, and a practical portfolio project assignment evaluated by industry experts.`,
        category: ct.category,
        duration: ct.duration,
        instructor,
        thumbnailImage: `https://images.unsplash.com/photo-${1500000000000 + index * 10000}?auto=format&fit=crop&w=800&q=80`,
        videoLessons: [
          { _id: new mongoose.Types.ObjectId().toString(), title: 'Lesson 1: Welcome and Course Overview', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '10 mins' },
          { _id: new mongoose.Types.ObjectId().toString(), title: 'Lesson 2: Basic Concepts and Principles', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15 mins' },
          { _id: new mongoose.Types.ObjectId().toString(), title: 'Lesson 3: Advanced Applications and Demos', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20 mins' }
        ],
        pdfNotes: [
          { _id: new mongoose.Types.ObjectId().toString(), title: 'Course Syllabus PDF', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { _id: new mongoose.Types.ObjectId().toString(), title: 'Lecture Study Guide', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
        ],
        learningOutcomes: [
          `Understand the absolute fundamentals of ${ct.category}`,
          `Build practical skills through hands-on workbook exercises`,
          `Earn a verifiable digital certificate recognized by partners`
        ],
        enrolledStudents: [] // Will populate after enrollments are generated
      });
    });

    // --- GENERATE QUIZZES (50 questions in total across courses) ---
    const quizzes = [];
    const quizResultList = [];
    
    courses.forEach((c, index) => {
      const qId = new mongoose.Types.ObjectId().toString();
      const quizQuestions = [];
      
      // Generate 3-4 questions per quiz to reach ~50 total questions across 15 courses
      const qCount = index % 2 === 0 ? 3 : 4;
      for (let j = 1; j <= qCount; j++) {
        quizQuestions.push({
          _id: new mongoose.Types.ObjectId().toString(),
          questionText: `Quiz Question ${j} for ${c.title}: Which of the following best defines this topic?`,
          options: [
            'Option A: This is a standard incorrect response.',
            'Option B: This represents the correct response.',
            'Option C: Another incorrect distracter.',
            'Option D: None of the above.'
          ],
          correctOption: 1, // Index 1 is Option B
          marks: 5
        });
      }

      quizzes.push({
        _id: qId,
        courseId: c._id,
        title: `${c.title} Assessment`,
        duration: 15,
        negativeMarking: 1.0, // 1 mark penalty
        questions: quizQuestions
      });
    });

    // --- GENERATE ENROLLMENTS & ASSIGNMENTS & CERTIFICATES ---
    const enrollments = [];
    const assignments = [];
    const certificates = [];

    const studentIds = users.filter(u => u.role === 'Student').map(u => u._id);

    // Let's enroll students and generate assignments
    // We want around 20 assignments, and 20 certificates
    studentIds.forEach((studentId, sIdx) => {
      // Each student enrolls in 1 to 2 courses
      const enrolledCoursesCount = sIdx % 2 === 0 ? 1 : 2;
      
      for (let c = 0; c < enrolledCoursesCount; c++) {
        const courseIdx = (sIdx + c) % courses.length;
        const course = courses[courseIdx];
        
        // Add student to course enrolled list
        course.enrolledStudents.push(studentId);

        const isCompleted = sIdx < 10; // First 10 students completed their courses
        const progress = isCompleted ? 100 : 33; // 1 out of 3 lessons completed
        const completedLessons = isCompleted 
          ? course.videoLessons.map(v => v._id) 
          : [course.videoLessons[0]._id];
        
        enrollments.push({
          _id: new mongoose.Types.ObjectId().toString(),
          studentId,
          courseId: course._id,
          progress,
          completedLessons,
          completed: isCompleted,
          completedDate: isCompleted ? new Date().toISOString() : null
        });

        // Generate assignment
        if (sIdx < 15) { // First 15 students submitted assignments
          const aId = new mongoose.Types.ObjectId().toString();
          const isGraded = sIdx < 10; // First 10 are graded
          
          assignments.push({
            _id: aId,
            studentId,
            courseId: course._id,
            title: `${course.title} Final Project`,
            description: `Here is my project overview demonstrating core practical concepts in ${course.category}.`,
            fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            marks: isGraded ? 85 : null,
            feedback: isGraded ? 'Outstanding application of trade skills. Excellent project compilation.' : '',
            status: isGraded ? 'Graded' : 'Submitted'
          });

          // Generate Certificate for completed & graded students
          if (isGraded && isCompleted) {
            const certId = 'CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
            certificates.push({
              _id: new mongoose.Types.ObjectId().toString(),
              studentId,
              courseId: course._id,
              instructorId: course.instructor,
              issueDate: new Date().toISOString(),
              certificateId: certId,
              qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://skillbridge.gov.in/verify/${certId}`
            });
          }
        }
      }
    });

    // --- SAVE TO DATABASES ---
    
    // Save to local JSON files (Always write to local files to keep fallback ready)
    console.log('Writing seed data to local JSON fallback database...');
    localDb.writeData('users', users);
    localDb.writeData('courses', courses);
    localDb.writeData('quizzes', quizzes);
    localDb.writeData('enrollments', enrollments);
    localDb.writeData('assignments', assignments);
    localDb.writeData('certificates', certificates);
    localDb.writeData('quizresults', []);
    localDb.writeData('chats', []);
    
    // Save to MongoDB if connected
    if (usingMongo) {
      console.log('Clearing MongoDB collections...');
      await User.deleteMany({});
      await Course.deleteMany({});
      await Quiz.deleteMany({});
      await Enrollment.deleteMany({});
      await Assignment.deleteMany({});
      await Certificate.deleteMany({});
      await QuizResult.deleteMany({});
      await ChatMessage.deleteMany({});

      console.log('Inserting seed records into MongoDB...');
      await User.insertMany(users);
      await Course.insertMany(courses);
      await Quiz.insertMany(quizzes);
      await Enrollment.insertMany(enrollments);
      await Assignment.insertMany(assignments);
      await Certificate.insertMany(certificates);
      
      console.log('MongoDB data seeded successfully.');
    }

    console.log('Seeding process completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
