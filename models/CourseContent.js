const { mongoose, Schema } = require('mongoose');

const courseContentSchema = new Schema({
  content: {
    type: [{
      topic: { type: String },
      materials: { type: [String] },
      // tasks:
    }],
  },
});

module.exports = mongoose.model('CourseContent', courseContentSchema);
