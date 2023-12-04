const Router = require('express-promise-router');
const forumController = require('../controllers/forumController');

const router = Router();

router.get('/', forumController.getQuestions);
router.post('/', forumController.createQuestion);
router.get('/:id', forumController.getQuestionAnswers);
router.post('/:id', forumController.createAnswer);
router.get('/answer/:id', forumController.getAnswer);

module.exports = router;
