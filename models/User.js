const { mongoose, Schema } = require('mongoose');
const getFullPath = require('../utils/getFullPath');

const userSchema = new Schema(
  {
    email: {
      type: String, required: true, index: true, unique: true,
    },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    cardNumber: { type: String },
    cardCvv: { type: Number },
    cardExpiry: { type: String },
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
          return `${this.firstName} ${this.lastName}`;
        },
      },
    },
    methods: {
      getInfo(req) {
        return {
          fullName: `${this.firstName} ${this.lastName}`,
          image: getFullPath(req, this.image),
          id: this._id,
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
