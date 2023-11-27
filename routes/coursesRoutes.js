const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const coursesController = require('../controllers/coursesController');

const router = Router();

router.get('/', coursesController.getCourses);
router.post('/', authMiddleware, uploadMiddleware.single('file'), coursesController.createCourse);
router.get('/:id', authMiddleware, coursesController.getCourse);
router.post('/:id', authMiddleware, uploadMiddleware.array('attachments'), coursesController.createCourseBlock);
router.post('/buy/:id', authMiddleware, coursesController.buyCourse);
router.get('/:courseId/:blockId', authMiddleware, coursesController.getCourseBlock);

module.exports = router;
