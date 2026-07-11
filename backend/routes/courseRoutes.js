const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, enrollInCourse, updateProgress, getEnrollments } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/enrollments', protect, getEnrollments);
router.get('/:id', getCourseById);

// Teacher/Admin course authoring
router.post('/', protect, authorize('Teacher', 'Super Admin'), createCourse);
router.put('/:id', protect, authorize('Teacher', 'Super Admin'), updateCourse);
router.delete('/:id', protect, authorize('Teacher', 'Super Admin'), deleteCourse);

// Student learning interactions
router.post('/:id/enroll', protect, authorize('Student'), enrollInCourse);
router.post('/:id/progress', protect, authorize('Student'), updateProgress);

module.exports = router;
