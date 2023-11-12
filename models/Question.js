const { mongoose, Schema } = require('mongoose');
const validTags = require('../constants/tags');

const questionSchema = new Schema(
  {
    title: { type: String, required: true },
    tags: {
      type: [String],
      enum: validTags,
      default: [],
    },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    details: { type: String, required: true },
    answers: { type: Schema.Types.ObjectId, ref: 'Answers', required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Question', questionSchema);
