const { Router } = require('express');
const forumController = require('../controllers/forumController');

const router = Router();

router.get('/', forumController.getQuestions);
router.post('/', forumController.createQuestion);
router.get('/answers', forumController.getAnswers);
router.post('/answers', forumController.createAnswer);

module.exports = router;
