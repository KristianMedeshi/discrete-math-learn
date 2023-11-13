const { Router } = require('express');
const forumController = require('../controllers/forumController');

const router = Router();

router.get('/', forumController.getQuestions);
router.post('/', forumController.createQuestion);
router.get('/:questionId', forumController.getQuestionAnswers);
router.post('/answers/:answersId', forumController.createAnswer);
// router.get('/answer/:answerId', forumController.getAnswer);

module.exports = router;
