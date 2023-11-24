const { mongoose, Schema } = require('mongoose');
const validLevels = require('../constants/validLevels');

const courseSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    instructors: { type: [String], required: true },
    price: {
      type: Number, required: true, min: 0, max: 10000,
    },
    duration: {
      type: Number, required: true, min: 0, max: 100,
    },
    level: { type: String, enum: validLevels, required: true },
    image: { type: String, required: true },
    usersBought: [{
      type: Schema.Types.ObjectId, ref: 'User', default: [], select: false,
    }],
  },
  {
    collection: 'courses',
  },
);

module.exports = mongoose.model('Course', courseSchema);
