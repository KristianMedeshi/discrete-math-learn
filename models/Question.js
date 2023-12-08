const { mongoose, Schema } = require('mongoose');
const Answer = require('./Answer');
const validTags = require('../constants/validTags');

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
  },
  { collection: 'questions', timestamps: true },
);

// eslint-disable-next-line func-names
questionSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const questionId = this._id;
  try {
    await Answer.deleteMany({ question: questionId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Question', questionSchema);
