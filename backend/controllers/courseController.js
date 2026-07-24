const db = require('../utils/db');

const getCourses = async (req, res) => {
  try {
    let courses = await db.Course.find({});
    
    // Search filter
    const search = req.query.search;
    if (search) {
      const regex = new RegExp(search, 'i');
      courses = courses.filter(c => regex.test(c.title) || regex.test(c.description));
    }
    
    // Category filter
    const category = req.query.category;
    if (category) {
      courses = courses.filter(c => c.category === category);
    }
    
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await db.Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching course details' });
  }
};

const createCourse = async (req, res) => {
  const { title, description, category, duration, thumbnailImage, videoLessons, pdfNotes, learningOutcomes } = req.body;
  
  if (!title || !description || !category || !duration) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  try {
    const course = await db.Course.create({
      title,
      description,
      category,
      duration,
      instructor: req.user._id,
      thumbnailImage: thumbnailImage || '',
      videoLessons: videoLessons || [],
      pdfNotes: pdfNotes || [],
      learningOutcomes: learningOutcomes || [],
      enrolledStudents: []
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating course' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await db.Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Restrict editing to the instructor who created it, or admin
    if (req.user.role !== 'Super Admin' && String(course.instructor._id || course.instructor) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to edit this course' });
    }

    const updated = await db.Course.findByIdAndUpdate(req.params.id, {
      title: req.body.title || course.title,
      description: req.body.description || course.description,
      category: req.body.category || course.category,
      duration: req.body.duration || course.duration,
      thumbnailImage: req.body.thumbnailImage !== undefined ? req.body.thumbnailImage : course.thumbnailImage,
      videoLessons: req.body.videoLessons || course.videoLessons,
      pdfNotes: req.body.pdfNotes || course.pdfNotes,
      learningOutcomes: req.body.learningOutcomes || course.learningOutcomes
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating course' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await db.Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role !== 'Super Admin' && String(course.instructor._id || course.instructor) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await db.Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting course' });
  }
};

const enrollInCourse = async (req, res) => {
  try {
    const course = await db.Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await db.Enrollment.findOne({
      studentId: req.user._id,
      courseId: course._id
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create Enrollment
    const enrollment = await db.Enrollment.create({
      studentId: req.user._id,
      courseId: course._id,
      progress: 0,
      completedLessons: [],
      completed: false
    });

    // Add student to course enrolledStudents list
    await db.Course.findByIdAndUpdate(course._id, {
      $push: { enrolledStudents: req.user._id }
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error enrolling in course' });
  }
};

const updateProgress = async (req, res) => {
  const { lessonId } = req.body;
  if (!lessonId) {
    return res.status(400).json({ message: 'Lesson ID is required' });
  }

  try {
    const enrollment = await db.Enrollment.findOne({
      studentId: req.user._id,
      courseId: req.params.id
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment record not found' });
    }

    // If already marked complete, do nothing
    if (enrollment.completedLessons.includes(lessonId)) {
      return res.json(enrollment);
    }

    const course = await db.Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const totalLessons = (course.videoLessons ? course.videoLessons.length : 0);
    const currentCompleted = enrollment.completedLessons || [];
    const completedLessons = [...currentCompleted, lessonId];
    
    // Calculate progress
    const progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 100;
    const completed = progress >= 100;
    const completedDate = completed ? new Date() : null;

    const updatedEnrollment = await db.Enrollment.findByIdAndUpdate(enrollment._id, {
      completedLessons,
      progress,
      completed,
      completedDate
    });

    res.json(updatedEnrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating progress' });
  }
};

const getEnrollments = async (req, res) => {
  try {
    let enrollments;
    if (req.user.role === 'Student') {
      enrollments = await db.Enrollment.find({ studentId: req.user._id });
    } else {
      // Teachers/Admins see all
      enrollments = await db.Enrollment.find({});
    }
    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching enrollments' });
  }
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, enrollInCourse, updateProgress, getEnrollments };
