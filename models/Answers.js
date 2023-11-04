const { mongoose, Schema } = require('mongoose');

const answersSchema = new Schema({
  answers: [{
    type: {
      answer: { type: String, require: true },
      author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      isSolution: { type: Boolean, default: Boolean(false) },
    },
    default: [],
  }],
});

module.exports = mongoose.model('Answers', answersSchema);
