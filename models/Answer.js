const { mongoose, Schema } = require('mongoose');

const answersSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true, collection: 'answers' },
);

module.exports = mongoose.model('Answers', answersSchema);
