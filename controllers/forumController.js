const User = require('../models/User');
const Question = require('../models/Question');
const Answers = require('../models/Answers');

module.exports.createQuestion = async (req, res) => {
  try {
    const authorId = req.user.userId;
    const { title, details, tags } = req.body;
    const answersDoc = new Answers();
    await answersDoc.save();
    const newQuestion = new Question({
      title, tags, authorId, details, answers: answersDoc,
    });
    await newQuestion.save();
    res.status(201).json({ message: 'Question has been created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().select('-details').populate('authorId', 'firstName lastName');
    const modifiedQuestions = questions.map((element) => ({
      ...element._doc,
      author: `${element.authorId.firstName} ${element.authorId.lastName}`,
    }));
    res.status(200).json(modifiedQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// module.exports.deleteQuestion = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     res.status(200).json();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

module.exports.createAnswer = async (req, res) => {
  try {
    const authorId = req.user.userId;
    const { answersId } = req.params;
    const { answer } = req.body;
    const answersDoc = await Answers.findById(answersId);
    answersDoc.answers.push({ answer, authorId });
    await answersDoc.save();
    res.status(201).json({ message: 'Answer has been added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getQuestionDetails = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findById(questionId);
    const { answers } = await Answers.findById(question.answers);
    const answersWithAuthor = await Promise.all(answers.map(async (answer) => {
      const author = await User.findById(answer.authorId);
      return {
        ...answer.toObject(),
        author: `${author.firstName} ${author.lastName}`,
      };
    }));
    res.status(200).json({ question, answers: answersWithAuthor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const answer = await Answers.find(
      { 'answers._id': answerId },
      { 'answers.$': 1 },
    );
    console.log('answer', answer);
    res.status(200).json({ ...answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
