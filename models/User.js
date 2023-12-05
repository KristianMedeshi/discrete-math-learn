const { mongoose, Schema } = require('mongoose');
const getFullPath = require('../utils/getFullPath');

const userSchema = new Schema(
  {
    email: {
      type: String, required: true, index: true, unique: true,
    },
    password: { type: String, required: true },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    card: {
      number: { type: String },
      cvv: { type: Number },
      expiry: { type: String },
    },
    image: { type: String, default: 'uploads/1700510085788.jpg' },
    courses: {
      type: [{
        course: {
          type: Schema.Types.ObjectId, ref: 'Course', required: true,
        },
        passedBlocks: [{
          type: Schema.Types.ObjectId, ref: 'CourseBlock', required: true,
        }],
      }],
    },
  },
  {
    toJSON: { virtuals: true },
    virtuals: {
      fullName: {
        get() {
          return `${this.name.first} ${this.name.last}`;
        },
      },
    },
    methods: {
      getInfo(req) {
        return {
          fullName: `${this.name.first} ${this.name.last}`,
          image: getFullPath(req, this.image),
        };
      },
      addToCourses(courseId, passedBlocks = []) {
        if (!this.courses) {
          this.courses = [];
        }
        const course = this.courses.find((item) => item.course.equals(courseId));
        if (course) {
          course.passedBlocks = course.passedBlocks.concat(passedBlocks);
        } else {
          this.courses.push({ course: courseId, passedBlocks });
        }
      },
      hasPassedBlock(courseId, blockId) {
        const course = this.courses?.find((item) => item.course.equals(courseId));
        return course && course.passedBlocks.some((passedBlock) => passedBlock.equals(blockId));
      },
    },
    collection: 'users',
  },
);

module.exports = mongoose.model('User', userSchema);
