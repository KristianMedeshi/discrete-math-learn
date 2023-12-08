const Router = require('express-promise-router');
const forumController = require('../controllers/forumController');

const router = Router();

router.get('/', forumController.getQuestions);
router.post('/', forumController.createQuestion);
router.get('/:id', forumController.getQuestion);
router.patch('/:id', forumController.updateQuestion);
router.delete('/:id', forumController.deleteQuestion);
router.post('/:id', forumController.createAnswer);
router.get('/answer/:id', forumController.getAnswer);

module.exports = router;
