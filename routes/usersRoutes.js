const Router = require('express-promise-router');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validateMiddleware');
const validators = require('../validators');
const usersController = require('../controllers/usersController');

const router = Router();

router.post('/sign-up', validate(validators.users.signUp), usersController.signUp);
router.post('/sign-in', usersController.signIn);
router.get('/users/me', auth, usersController.getMyInfo);
router.patch('/users/me', auth, upload.single('image'), validate(validators.users.updateMyInfo), usersController.updateMyInfo);

module.exports = router;
