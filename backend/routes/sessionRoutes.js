const express = require('express');
const router = express.Router();

const { bookSession } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/book', protect, bookSession);

module.exports = router;