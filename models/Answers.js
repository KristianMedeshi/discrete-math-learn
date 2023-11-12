const { mongoose, Schema } = require('mongoose');

const answersSchema = new Schema({
  answers: [{
    type: new Schema(
      {
        answer: { type: String, required: true },
        authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        isSolution: { type: Boolean, default: Boolean(false) },
      },
      { timestamps: true },
    ),
  }],
});

module.exports = mongoose.model('Answers', answersSchema);
