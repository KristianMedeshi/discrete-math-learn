const Question = require('../models/Question');
const Answer = require('../models/Answer');
const i18n = require('../i18n');

module.exports.createQuestion = async (req, res) => {
  const author = req.user.id;
  const { title, description, tags } = req.body;
  const question = await new Question({
    title, tags, author, description,
  });
  question.save();
  res.status(201).json({ message: i18n.__('question.created'), id: question.id });
};

module.exports.getQuestions = async (req, res) => {
  const questions = await Question.find()
    .populate([{
      path: 'author',
      transform: (doc, id) => (doc === null ? id : doc.getInfo(req)),
    }]);
  questions.forEach((question) => {
    question._doc.isAuthor = req.user.id === question.author.id.toString();
  });
  res.status(200).json(questions);
};

module.exports.getQuestion = async (req, res) => {
  const { id } = req.params;
  const question = await Question.findById(id).lean();
  if (!question) {
    return res.status(404).json({ error: i18n.__('question.notFound') });
  }
  question.isAuthor = req.user.id === question.author.toString();
  const answers = await Answer.find({ question: id }).populate({
    path: 'author',
    // eslint-disable-next-line no-shadow
    transform: (doc, id) => (doc === null ? id : doc.getInfo(req)),
  });
  res.status(200).json({ question, answers });
};

module.exports.updateQuestion = async (req, res) => {
  const { id } = req.params;
  const question = await Question.findOne({ _id: id });
  if (!question) {
    return res.status(404).json({ message: i18n.__('question.notFound') });
  }
  if (question.author.toString() !== req.user.id) {
    return res.status(403).json({ message: i18n.__('question.notAuthor') });
  }
  await question.updateOne(req.body);
  res.status(200).json({ message: i18n.__('question.updated'), id });
};

module.exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  const question = await Question.findOne({ _id: id });
  if (!question) {
    return res.status(404).json({ message: i18n.__('question.notFound') });
  }
  if (question.author.toString() !== req.user.id) {
    return res.status(403).json({ message: i18n.__('question.notAuthor') });
  }
  await question.deleteOne();
  res.status(200).json({ message: i18n.__('question.deleted') });
};

module.exports.getAnswer = async (req, res) => {
  const { id } = req.params;
  const answer = await Answer.findById(id);
  res.status(200).json(answer);
};

module.exports.createAnswer = async (req, res) => {
  const author = req.user.id;
  const { id } = req.params;
  const question = await Question.findById(id);
  if (!question) {
    return res.status(404).json({ error: i18n.__('question.notFound') });
  }
  const { answer } = req.body;
  await Answer.create({ question: id, author, answer });
  res.status(201).json({ message: i18n.__('question.answer.created') });
};
