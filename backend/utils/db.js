const { isConnected } = require('../config/db');
const localDb = require('./localDbHelper');

// Load Mongoose models
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Certificate = require('../models/Certificate');
const ChatMessage = require('../models/ChatMessage');

// Populate helpers for JSON mode
const populateUser = (userId) => {
  if (!userId) return null;
  const user = localDb.findById('users', String(userId));
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const populateCourse = (courseId) => {
  if (!courseId) return null;
  const course = localDb.findById('courses', String(courseId));
  if (!course) return null;
  return {
    ...course,
    instructor: populateUser(course.instructor)
  };
};

module.exports = {
  User: {
    find: async (filter) => {
      if (isConnected()) return await User.find(filter).select('-password');
      return localDb.find('users', filter).map(({ password, ...u }) => u);
    },
    findOne: async (filter, includePassword = false) => {
      if (isConnected()) {
        const query = User.findOne(filter);
        if (includePassword) return await query;
        return await query.select('-password');
      }
      const user = localDb.findOne('users', filter);
      if (!user) return null;
      if (includePassword) return user;
      const { password, ...u } = user;
      return u;
    },
    findById: async (id) => {
      if (isConnected()) return await User.findById(id).select('-password');
      const user = localDb.findById('users', String(id));
      if (!user) return null;
      const { password, ...u } = user;
      return u;
    },
    create: async (data) => {
      if (isConnected()) return await User.create(data);
      return localDb.create('users', data);
    },
    findByIdAndUpdate: async (id, update) => {
      if (isConnected()) return await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
      const user = localDb.findByIdAndUpdate('users', String(id), update);
      if (!user) return null;
      const { password, ...u } = user;
      return u;
    },
    findByIdAndDelete: async (id) => {
      if (isConnected()) return await User.findByIdAndDelete(id);
      return localDb.findByIdAndDelete('users', String(id));
    }
  },
  Course: {
    find: async (filter) => {
      if (isConnected()) return await Course.find(filter).populate('instructor', 'name email role companyName');
      return localDb.find('courses', filter).map(course => ({
        ...course,
        instructor: populateUser(course.instructor)
      }));
    },
    findById: async (id) => {
      if (isConnected()) return await Course.findById(id).populate('instructor', 'name email role companyName');
      const course = localDb.findById('courses', String(id));
      if (!course) return null;
      return {
        ...course,
        instructor: populateUser(course.instructor)
      };
    },
    findOne: async (filter) => {
      if (isConnected()) return await Course.findOne(filter).populate('instructor', 'name email role companyName');
      const course = localDb.findOne('courses', filter);
      if (!course) return null;
      return {
        ...course,
        instructor: populateUser(course.instructor)
      };
    },
    create: async (data) => {
      if (isConnected()) return await Course.create(data);
      return localDb.create('courses', data);
    },
    findByIdAndUpdate: async (id, update) => {
      if (isConnected()) return await Course.findByIdAndUpdate(id, update, { new: true }).populate('instructor', 'name email role companyName');
      const course = localDb.findByIdAndUpdate('courses', String(id), update);
      if (!course) return null;
      return {
        ...course,
        instructor: populateUser(course.instructor)
      };
    },
    findByIdAndDelete: async (id) => {
      if (isConnected()) return await Course.findByIdAndDelete(id);
      return localDb.findByIdAndDelete('courses', String(id));
    }
  },
  Enrollment: {
    find: async (filter) => {
      if (isConnected()) return await Enrollment.find(filter).populate('studentId', 'name email').populate('courseId');
      return localDb.find('enrollments', filter).map(enrollment => ({
        ...enrollment,
        studentId: populateUser(enrollment.studentId),
        courseId: populateCourse(enrollment.courseId)
      }));
    },
    findOne: async (filter) => {
      if (isConnected()) return await Enrollment.findOne(filter).populate('studentId', 'name email').populate('courseId');
      const enrollment = localDb.findOne('enrollments', filter);
      if (!enrollment) return null;
      return {
        ...enrollment,
        studentId: populateUser(enrollment.studentId),
        courseId: populateCourse(enrollment.courseId)
      };
    },
    create: async (data) => {
      if (isConnected()) return await Enrollment.create(data);
      return localDb.create('enrollments', data);
    },
    findByIdAndUpdate: async (id, update) => {
      if (isConnected()) return await Enrollment.findByIdAndUpdate(id, update, { new: true }).populate('studentId', 'name email').populate('courseId');
      const enrollment = localDb.findByIdAndUpdate('enrollments', String(id), update);
      if (!enrollment) return null;
      return {
        ...enrollment,
        studentId: populateUser(enrollment.studentId),
        courseId: populateCourse(enrollment.courseId)
      };
    },
    findByIdAndDelete: async (id) => {
      if (isConnected()) return await Enrollment.findByIdAndDelete(id);
      return localDb.findByIdAndDelete('enrollments', String(id));
    }
  },
  Assignment: {
    find: async (filter) => {
      if (isConnected()) return await Assignment.find(filter).populate('studentId', 'name email').populate('courseId', 'title category');
      return localDb.find('assignments', filter).map(assignment => ({
        ...assignment,
        studentId: populateUser(assignment.studentId),
        courseId: populateCourse(assignment.courseId)
      }));
    },
    findById: async (id) => {
      if (isConnected()) return await Assignment.findById(id).populate('studentId', 'name email').populate('courseId', 'title category');
      const assignment = localDb.findById('assignments', String(id));
      if (!assignment) return null;
      return {
        ...assignment,
        studentId: populateUser(assignment.studentId),
        courseId: populateCourse(assignment.courseId)
      };
    },
    create: async (data) => {
      if (isConnected()) return await Assignment.create(data);
      return localDb.create('assignments', data);
    },
    findByIdAndUpdate: async (id, update) => {
      if (isConnected()) return await Assignment.findByIdAndUpdate(id, update, { new: true }).populate('studentId', 'name email').populate('courseId', 'title category');
      const assignment = localDb.findByIdAndUpdate('assignments', String(id), update);
      if (!assignment) return null;
      return {
        ...assignment,
        studentId: populateUser(assignment.studentId),
        courseId: populateCourse(assignment.courseId)
      };
    },
    findByIdAndDelete: async (id) => {
      if (isConnected()) return await Assignment.findByIdAndDelete(id);
      return localDb.findByIdAndDelete('assignments', String(id));
    }
  },
  Quiz: {
    find: async (filter) => {
      if (isConnected()) return await Quiz.find(filter).populate('courseId', 'title');
      return localDb.find('quizzes', filter).map(quiz => ({
        ...quiz,
        courseId: populateCourse(quiz.courseId)
      }));
    },
    findById: async (id) => {
      if (isConnected()) return await Quiz.findById(id).populate('courseId', 'title');
      const quiz = localDb.findById('quizzes', String(id));
      if (!quiz) return null;
      return {
        ...quiz,
        courseId: populateCourse(quiz.courseId)
      };
    },
    findOne: async (filter) => {
      if (isConnected()) return await Quiz.findOne(filter).populate('courseId', 'title');
      const quiz = localDb.findOne('quizzes', filter);
      if (!quiz) return null;
      return {
        ...quiz,
        courseId: populateCourse(quiz.courseId)
      };
    },
    create: async (data) => {
      if (isConnected()) return await Quiz.create(data);
      return localDb.create('quizzes', data);
    },
    findByIdAndUpdate: async (id, update) => {
      if (isConnected()) return await Quiz.findByIdAndUpdate(id, update, { new: true }).populate('courseId', 'title');
      const quiz = localDb.findByIdAndUpdate('quizzes', String(id), update);
      if (!quiz) return null;
      return {
        ...quiz,
        courseId: populateCourse(quiz.courseId)
      };
    },
    findByIdAndDelete: async (id) => {
      if (isConnected()) return await Quiz.findByIdAndDelete(id);
      return localDb.findByIdAndDelete('quizzes', String(id));
    }
  },
  QuizResult: {
    find: async (filter) => {
      if (isConnected()) return await QuizResult.find(filter).populate('studentId', 'name email').populate('quizId');
      return localDb.find('quizresults', filter).map(qr => ({
        ...qr,
        studentId: populateUser(qr.studentId),
        quizId: localDb.findById('quizzes', String(qr.quizId))
      }));
    },
    create: async (data) => {
      if (isConnected()) return await QuizResult.create(data);
      return localDb.create('quizresults', data);
    }
  },
  Certificate: {
    find: async (filter) => {
      if (isConnected()) return await Certificate.find(filter).populate('studentId', 'name email').populate('courseId').populate('instructorId', 'name companyName');
      return localDb.find('certificates', filter).map(cert => ({
        ...cert,
        studentId: populateUser(cert.studentId),
        courseId: populateCourse(cert.courseId),
        instructorId: populateUser(cert.instructorId)
      }));
    },
    findOne: async (filter) => {
      if (isConnected()) return await Certificate.findOne(filter).populate('studentId', 'name email').populate('courseId').populate('instructorId', 'name companyName');
      const cert = localDb.findOne('certificates', filter);
      if (!cert) return null;
      return {
        ...cert,
        studentId: populateUser(cert.studentId),
        courseId: populateCourse(cert.courseId),
        instructorId: populateUser(cert.instructorId)
      };
    },
    create: async (data) => {
      if (isConnected()) return await Certificate.create(data);
      return localDb.create('certificates', data);
    }
  },
  ChatMessage: {
    find: async (filter) => {
      if (isConnected()) return await ChatMessage.find(filter);
      return localDb.find('chats', filter);
    },
    create: async (data) => {
      if (isConnected()) return await ChatMessage.create(data);
      return localDb.create('chats', data);
    }
  }
};
