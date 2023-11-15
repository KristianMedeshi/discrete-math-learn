const { Router } = require('express');
const forumController = require('../controllers/forumController');

const router = Router();

router.get('/', forumController.getQuestions);
router.post('/', forumController.createQuestion);
router.get('/:id', forumController.getQuestionDetails);
router.post('/:id', forumController.createAnswer);
router.get('/answer/:id', forumController.getAnswer);

module.exports = router;
