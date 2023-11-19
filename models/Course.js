const { mongoose, Schema } = require('mongoose');
const difficultyLevels = require('../constants/difficultyLevels');

const courseSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    teachers: { type: [String], required: true },
    price: {
      type: Number, required: true, min: 0, max: 10000,
    },
    duration: {
      type: Number, required: true, min: 0, max: 100,
    },
    difficulty: { type: String, enum: difficultyLevels, required: true },
    image: { type: String, required: true },
  },
  { collection: 'courses' },
);

module.exports = mongoose.model('Course', courseSchema);
