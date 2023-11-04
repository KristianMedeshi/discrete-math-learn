const { mongoose, Schema } = require('mongoose');

const courseSchema = new Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  price: { type: Number, require: true },
  teachers: { type: [String], require: true },
  difficulty: { type: String, require: true },
  duration: { type: Number, require: true },
  content: { type: Schema.Types.ObjectId, ref: 'CourseContent', required: true },
});

module.exports = mongoose.model('Course', courseSchema);
