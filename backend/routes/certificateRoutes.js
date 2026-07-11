const express = require('express');
const router = express.Router();
const { getCertificatesByStudent, getCertificateById, verifyCertificate } = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCertificatesByStudent);
router.get('/verify/:key', verifyCertificate); // Publicly accessible verification endpoint
router.get('/:id', protect, getCertificateById);

module.exports = router;
