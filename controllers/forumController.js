const Question = require('../models/Question');
const Answer = require('../models/Answer');

module.exports.createQuestion = async (req, res) => {
  try {
    const author = req.user.id;
    const { title, description, tags } = req.body;
    await Question.create({
      title, tags, author, description,
    });
    res.status(201).json({ message: 'Question has been created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });

  }
};

module.exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .select('-details')
      .populate([{
        path: 'author',
        transform: (doc, id) => (doc == null ? id : doc.fullName),
      }]);
    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });

  }
};

// module.exports.deleteQuestion = async (req, res) => {
//   try {
//     const { userId } = req.user;
//     res.status(200).json();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error', details: error.message });

//   }
// };

module.exports.getQuestionAnswers = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    const answers = await Answer.find({ question: id }).populate({
      path: 'author',
      // eslint-disable-next-line no-shadow
      transform: (doc, id) => (doc == null ? id : doc.fullName),
    });
    res.status(200).json({ question, answers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });

  }
};

module.exports.getAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = await Answer.findById(id);
    res.status(200).json(answer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });

  }
};

module.exports.createAnswer = async (req, res) => {
  try {
    const author = req.user.id;
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    const { answer } = req.body;
    await Answer.create({ question: id, author, answer });
    res.status(201).json({ message: 'Answer has been added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });

  }
};
