const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const usersController = require('../controllers/usersController');

const router = Router();

router.post('/sign-up', usersController.signUp);
router.post('/sign-in', usersController.signIn);
router.get('/users/me', authMiddleware, usersController.getMyInfo);
router.patch('/users/me', authMiddleware, uploadMiddleware.single('newImage'), usersController.updateMyInfo);

module.exports = router;
