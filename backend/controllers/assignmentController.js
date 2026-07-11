const db = require('../utils/db');

const submitAssignment = async (req, res) => {
  const { courseId, title, description, fileUrl } = req.body;

  if (!courseId || !title || !description) {
    return res.status(400).json({ message: 'Please provide course, title, and description' });
  }

  try {
    const enrollment = await db.Enrollment.findOne({
      studentId: req.user._id,
      courseId
    });

    if (!enrollment) {
      return res.status(400).json({ message: 'You must be enrolled in this course to submit projects' });
    }

    const assignment = await db.Assignment.create({
      studentId: req.user._id,
      courseId,
      title,
      description,
      fileUrl: fileUrl || '',
      status: 'Submitted'
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during project submission' });
  }
};

const getAssignments = async (req, res) => {
  try {
    let assignments;
    if (req.user.role === 'Student') {
      assignments = await db.Assignment.find({ studentId: req.user._id });
    } else if (req.user.role === 'Industry Partner') {
      // Mentors see assignments by students who have chat/mentor associations
      // For simplicity in fallback, they see all assignments and filter, or see assignments for courses they specialize in
      assignments = await db.Assignment.find({});
    } else {
      // Teachers & Admins see all
      assignments = await db.Assignment.find({});
    }
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching assignments' });
  }
};

const gradeAssignment = async (req, res) => {
  const { marks, feedback, status } = req.body;

  if (marks === undefined || !status) {
    return res.status(400).json({ message: 'Please enter marks and evaluation status' });
  }

  try {
    const assignment = await db.Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const updated = await db.Assignment.findByIdAndUpdate(req.params.id, {
      marks: Number(marks),
      feedback: feedback || '',
      status
    });

    // If assignment is graded and marks are passing (say, >= 50%), AND course progress is 100%, 
    // let's see if we should auto-award a badge or trigger certificate check!
    if (status === 'Graded' && Number(marks) >= 50) {
      // Check if student finished the course progress as well
      const enrollment = await db.Enrollment.findOne({
        studentId: assignment.studentId._id || assignment.studentId,
        courseId: assignment.courseId._id || assignment.courseId
      });

      if (enrollment && enrollment.completed) {
        // Issue Certificate if not already issued
        const existingCert = await db.Certificate.findOne({
          studentId: assignment.studentId._id || assignment.studentId,
          courseId: assignment.courseId._id || assignment.courseId
        });

        if (!existingCert) {
          const courseObj = await db.Course.findById(assignment.courseId._id || assignment.courseId);
          const uniqId = 'CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
          
          await db.Certificate.create({
            studentId: assignment.studentId._id || assignment.studentId,
            courseId: assignment.courseId._id || assignment.courseId,
            instructorId: courseObj ? courseObj.instructor._id || courseObj.instructor : req.user._id,
            certificateId: uniqId,
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://skillbridge.gov.in/verify/${uniqId}`
          });

          // Award badge to student
          const badgeTitle = `${courseObj ? courseObj.title : 'Vocational'} Graduate`;
          const badgeCriteria = `Passed assessment & project grading with ${marks}%`;
          
          await db.User.findByIdAndUpdate(assignment.studentId._id || assignment.studentId, {
            $push: {
              badges: {
                title: badgeTitle,
                criteria: badgeCriteria,
                date: new Date()
              }
            }
          });
        }
      }
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during assignment evaluation' });
  }
};

module.exports = { submitAssignment, getAssignments, gradeAssignment };
