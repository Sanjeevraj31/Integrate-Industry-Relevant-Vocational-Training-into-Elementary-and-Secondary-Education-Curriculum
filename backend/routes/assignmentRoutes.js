const express = require('express');
const router = express.Router();
const { submitAssignment, getAssignments, gradeAssignment } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Student'), submitAssignment);
router.get('/', protect, getAssignments);
router.put('/:id', protect, authorize('Teacher', 'Industry Partner', 'Super Admin'), gradeAssignment);

module.exports = router;
