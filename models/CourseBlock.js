const { mongoose, Schema } = require('mongoose');

const courseBlockSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true,
    },
    title: { type: String, required: true },
    lecture: { type: String },
    tasks: {
      type: [{
        title: { type: String, required: true },
        answer: { type: String, required: true },
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
