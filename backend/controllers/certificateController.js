const db = require('../utils/db');

const getCertificatesByStudent = async (req, res) => {
  try {
    const certificates = await db.Certificate.find({ studentId: req.user._id });
    res.json(certificates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching certificates' });
  }
};

const getCertificateById = async (req, res) => {
  try {
    const certificate = await db.Certificate.findOne({ _id: req.params.id });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json(certificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching certificate' });
  }
};

const verifyCertificate = async (req, res) => {
  try {
    const certificate = await db.Certificate.findOne({ certificateId: req.params.key });
    if (!certificate) {
      return res.status(404).json({ verified: false, message: 'Invalid Verification Key: Certificate does not exist' });
    }
    res.json({
      verified: true,
      studentName: certificate.studentId ? certificate.studentId.name : 'Unknown Student',
      courseName: certificate.courseId ? certificate.courseId.title : 'Unknown Course',
      instructorName: certificate.instructorId ? certificate.instructorId.name : 'SkillBridge Instructor',
      companyName: certificate.instructorId ? certificate.instructorId.companyName || '' : '',
      issueDate: certificate.issueDate,
      certificateId: certificate.certificateId,
      qrCodeUrl: certificate.qrCodeUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during certificate verification' });
  }
};

module.exports = { getCertificatesByStudent, getCertificateById, verifyCertificate };
