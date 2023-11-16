const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const usersRoutes = require('./usersRoutes');
const forumRoutes = require('./forumRoutes');

const router = Router();

router.use('/', usersRoutes);
router.use('/forum', authMiddleware, forumRoutes);
router.post('/upload', uploadMiddleware.single('file'), (req, res) => {
  const filePath = `${req.protocol}://${req.get('host')}/${req.file.path}`;
  res.status(201).send({ message: 'File uploaded successfully', path: filePath });
});

module.exports = router;
