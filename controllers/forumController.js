const Question = require('../models/Question');
const QuestionDetails = require('../models/QuestionDetails');
const Answer = require('../models/Answer');

module.exports.createQuestion = async (req, res) => {
  try {
    const author = req.user.id;
    const { title, description, tags } = req.body;
    const details = new QuestionDetails();
    await details.save();
    await Question.create({
      title, tags, author, description, details,
    });
    res.status(201).json({ message: 'Question has been created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().select('-details').populate([
      {
        path: 'author',
        transform: (doc, id) => (doc == null ? id : `${doc.firstName} ${doc.lastName}`),
      },
    ]);
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

module.exports.getQuestionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id).populate('details');
    await question.populate('details.answers');
    await question.populate([{
      path: 'details.answers.author',
      // eslint-disable-next-line no-shadow
      transform: (doc, id) => (doc == null ? id : `${doc.firstName} ${doc.lastName}`),
    }]);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(200).json({ question, length: question.details.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = await Answer.findById(id);
    res.status(200).json(answer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.createAnswer = async (req, res) => {
  try {
    const author = req.user.id;
    const { id } = req.params;
    const { answer } = req.body;
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    const details = await QuestionDetails.findById(question.details);
    const answerDoc = new Answer({ author, answer });
    await answerDoc.save();
    details.answers.push(answerDoc);
    await details.save();
    res.status(201).json({ message: 'Answer has been added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
