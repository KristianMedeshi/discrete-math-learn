const Question = require('../models/Question');
const Answers = require('../models/Answers');

module.exports.createQuestion = async (req, res) => {
  try {
    const author = req.user.userId;
    const { title } = req.body;
    const answers = new Answers();
    await answers.save();
    const newQuestion = new Question({ title, author, answers });
    await newQuestion.save();
    res.status(201).json({ message: 'Question has been created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
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
    const author = req.user.userId;
    const { answersId, answer } = req.body;
    const answersDoc = await Answers.findById(answersId);
    console.log(answersDoc);
    answersDoc.answers.push({ answer, author });
    await answersDoc.save();
    res.status(201).json({ message: 'Answer has been added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getAnswers = async (req, res) => {
  try {
    const { questionId } = req.body;
    const question = await Question.findById(questionId);
    const answers = await Answers.findById(question.answers);
    res.status(200).json({ question, answers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
