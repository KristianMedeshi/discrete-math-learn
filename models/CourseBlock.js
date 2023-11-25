const { mongoose, Schema } = require('mongoose');

const courseBlockSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true,
    },
    title: { type: String, required: false },
    lecture: { type: String },
    tasks: {
      type: [{
        title: { type: String, required: false },
        answer: { type: String, required: false },
      }],
    },
    tests: {
      type: [{
        questionText: { type: String },
        options: { type: [String] },
        correctOptionIndex: { type: Number },
      }],
    },
    attachments: { type: [String] },
  },
  { collection: 'courseBlocks' },
);

module.exports = mongoose.model('CourseBlock', courseBlockSchema);
