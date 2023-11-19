const { Router } = require('express');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const coursesController = require('../controllers/coursesController');

const router = Router();

router.get('/', coursesController.getCourses);
router.post('/', uploadMiddleware.single('file'), coursesController.createCourse);

module.exports = router;
