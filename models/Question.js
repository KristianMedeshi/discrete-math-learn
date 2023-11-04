const { mongoose, Schema } = require('mongoose');

const questionSchema = new Schema({
  title: { type: String, require: true },
  tags: { type: [String], default: undefined },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  answers: { type: Schema.Types.ObjectId, ref: 'Answers', required: true },
});

module.exports = mongoose.model('Question', questionSchema);
