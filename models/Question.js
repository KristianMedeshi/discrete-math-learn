const { mongoose, Schema } = require('mongoose');
const validTags = require('../constants/tags');

const questionSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: {
      type: [String],
      enum: validTags,
      default: [],
    },
    details: { type: Schema.Types.ObjectId, ref: 'QuestionDetails', required: true },
  },
  { collection: 'questions', timestamps: true },
);

module.exports = mongoose.model('Question', questionSchema);
