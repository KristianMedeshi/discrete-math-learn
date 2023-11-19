const { mongoose, Schema } = require('mongoose');

const courseBlockSchema = new Schema(
  {
    lecture: { type: String },
    tasks: { type: [String] },
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
