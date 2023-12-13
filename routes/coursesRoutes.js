const Router = require('express-promise-router');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const coursesController = require('../controllers/coursesController');

const router = Router();

router.get('/', coursesController.getCourses);
router.post('/', auth, upload.single('image'), coursesController.createCourse);
router.get('/my', auth, coursesController.getMyCourses);
router.get('/:id', auth, coursesController.getCourse);
router.post('/:id', auth, upload.array('attachments'), coursesController.createCourseBlock);
router.post('/buy/:id', auth, coursesController.buyCourse);
router.get('/:courseId/:blockId', auth, coursesController.getCourseBlock);
router.post('/mark/:id', auth, coursesController.markCourseBlock);

module.exports = router;
