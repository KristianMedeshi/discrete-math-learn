const { mongoose, Schema } = require('mongoose');

const questionDetailsSchema = new Schema(
  {
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answers', required: true }],
  },
  { collection: 'questionDetails' },
);

module.exports = mongoose.model('QuestionDetails', questionDetailsSchema);
