const { Router } = require('express');
const authRoutes = require('./authRoutes');
const forumRoutes = require('./forumRoutes');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = Router();

router.get('/test', (_, res) => {
  res.status(200).json({ message: 'Response' });
});

router.use('/users', authRoutes);
router.use('/forum', authMiddleware, forumRoutes);
router.post('/upload', uploadMiddleware.single('file'));

module.exports = router;
