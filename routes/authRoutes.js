const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);

module.exports = router;
