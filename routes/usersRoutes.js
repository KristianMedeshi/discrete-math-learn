const { Router } = require('express');
const usersController = require('../controllers/usersController');

const router = Router();

router.post('/sign-up', usersController.signUp);
router.post('/sign-in', usersController.signIn);

module.exports = router;
