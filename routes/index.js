const Router = require('express-promise-router');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const usersRoutes = require('./usersRoutes');
const forumRoutes = require('./forumRoutes');
const coursesRoutes = require('./coursesRoutes');
const getFullPath = require('../utils/getFullPath');

const router = Router();

router.use('/', usersRoutes);
router.use('/forum', auth, forumRoutes);
router.use('/courses', coursesRoutes);
router.post('/upload', upload.single('file'), (req, res) => {
  const filePath = getFullPath(req, req.file.path);
  res.status(201).send({ message: 'File uploaded successfully', path: filePath });
});

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  if (err.isJoi) {
    res.status(400);
  } else {
    res.status(err.status || 500);
  }
  res.json({ message: err.message });
  console.error(err.message);
});

module.exports = router;
