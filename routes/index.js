const Router = require('express-promise-router');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const usersRoutes = require('./usersRoutes');
const forumRoutes = require('./forumRoutes');
const coursesRoutes = require('./coursesRoutes');
const getFullPath = require('../utils/getFullPath');

const router = Router();

router.use('/', usersRoutes);
router.use('/forum', authMiddleware, forumRoutes);
router.use('/courses', coursesRoutes);
router.post('/upload', uploadMiddleware.single('file'), (req, res) => {
  const filePath = getFullPath(req, req.file.path);
  res.status(201).send({ message: 'File uploaded successfully', path: filePath });
});

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = router;
