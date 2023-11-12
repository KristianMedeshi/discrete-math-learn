const { mongoose, Schema } = require('mongoose');

const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  teachers: { type: [String], required: true },
  difficulty: { type: String, required: true },
  duration: { type: Number, required: true },
  content: { type: Schema.Types.ObjectId, ref: 'CourseContent', required: true },
});

module.exports = mongoose.model('Course', courseSchema);
