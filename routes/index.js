const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const usersRoutes = require('./usersRoutes');
const forumRoutes = require('./forumRoutes');

const router = Router();

router.use('/', usersRoutes);
router.use('/forum', authMiddleware, forumRoutes);
router.post('/upload', authMiddleware, uploadMiddleware.single('file'));

module.exports = router;
