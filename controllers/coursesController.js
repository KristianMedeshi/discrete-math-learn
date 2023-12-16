const User = require('../models/User');
const Course = require('../models/Course');
const CourseBlock = require('../models/CourseBlock');
const validLevels = require('../constants/validLevels');
const getFullPath = require('../utils/getFullPath');
const i18n = require('../i18n');

module.exports.getCourses = async (req, res) => {
  const userId = req.user?.id;
  const { name, levels, durationRange } = req.query;
  const skip = req.query.skip || 0;
  const limit = req.query.limit || 10;
  const filter = {
    level: { $in: levels ?? validLevels },
    duration: {
      $gte: durationRange?.[0] ?? 0,
      $lte: durationRange?.[1] ?? Infinity,
    },
  };
  if (name) {
    filter.name = { $regex: new RegExp(name, 'i') };
  }
  const resultsLength = await Course.countDocuments(filter);
  const courses = await Course
    .find(filter)
    .skip(skip)
    .limit(limit)
    .populate([{
      path: 'author',
      transform: (doc, id) => (doc === null ? id : doc.getInfo(req)),
    }]);
  courses.forEach((course) => {
    course.image = getFullPath(req, course.image);
    course.isBought = course.usersBought?.includes(userId);
  });
  res.status(200).json({ courses, resultsLength });
};

module.exports.createCourse = async (req, res) => {
  const author = req.user.id;
  const {
    name, description, instructors, price, duration, level,
  } = req.body;
  if (!req?.file) {
    req.file = { path: 'uploads/1700295692126.jpeg' };
  }
  const image = req.file.path;
  const newCourse = new Course({
    author,
    name,
    description,
    instructors,
    price,
    duration,
    level,
    image,
    usersBought: [author],
  });
  await newCourse.save();
  const user = await User.findById(author);
  user.addToCourses(newCourse._id);
  await user.save();
  res.status(201).json({ message: i18n.__('course.created'), id: newCourse._id });
};

module.exports.getCourse = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const course = await Course.findById(id).lean();
  const blocks = await CourseBlock.find({ course: id }).select('title').lean();
  course.image = getFullPath(req, course.image);
  course.isAuthor = course.author.toString() === userId;
  course.isBought = course.usersBought?.includes(userId);
  const user = await User.findById(userId);
  blocks.forEach((block) => {
    block.isPassed = user.hasPassedBlock(course._id, block._id);
  });
  res.status(200).json({ course, blocks });
};

module.exports.buyCourse = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select('courses cardNumber cardCvv cardExpiry');
  if (!user || !user.cardNumber || !user.cardCvv || !user.cardExpiry) {
    return res.status(400).json({ error: i18n.__('course.invalidCard') });
  }
  const courseId = req.params.id;
  const course = await Course
    .findByIdAndUpdate(
      courseId,
      { $addToSet: { usersBought: userId } },
      { new: true },
    )
    .lean();
  if (!course) {
    return res.status(404).json({ error: i18n.__('course.notFound') });
  }
  user.addToCourses(courseId);
  console.log('save', user);
  await user.save();
  res.status(200).json({ message: i18n.__('course.bought') });
};

module.exports.createCourseBlock = async (req, res) => {
  const userId = req.user.id;
  const courseId = req.params.id;
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ error: i18n.__('course.notFound') });
  }
  if (course.author.toString() !== userId) {
    return res.status(403).json({ error: i18n.__('course.notAuthor') });
  }
  const data = JSON.parse(req.body.jsonData);
  data.course = courseId;
  data.attachments = req.files?.map((file) => ({
    path: file.path,
    originalName: file.originalname,
  }));
  const newCourseBlock = new CourseBlock(data);
  await newCourseBlock.save();
  res.status(201).json({ message: i18n.__('course.chapter.created'), id: newCourseBlock._id });
};

module.exports.getCourseBlock = async (req, res) => {
  const { blockId } = req.params;
  const block = await CourseBlock.findById(blockId).lean();
  block.attachments = block.attachments.map((file) => ({
    originalName: file.originalName,
    path: getFullPath(req, file.path),
  }));
  const user = await User.findById(req.user.id);
  block.isPassed = user.hasPassedBlock(block.course, block._id);
  res.status(200).json({ block });
};

module.exports.markCourseBlock = async (req, res) => {
  const userId = req.user.id;
  const courseBlockId = req.params.id;
  const { answersTests, answersTasks } = req.body;
  const courseBlock = await CourseBlock.findById(courseBlockId).lean();
  if (!courseBlock) {
    return res.status(404).json({ error: i18n.__('course.chapter.notFound') });
  }
  let correct = 0;
  let total = 0;
  if (courseBlock.tasks) {
    total += courseBlock.tasks.length;
    courseBlock.tasks.forEach((task, index) => {
      if (answersTasks?.[index] === task.answer) {
        correct += 1;
      }
    });
  }
  if (courseBlock.tests) {
    total += courseBlock.tests.length;
    courseBlock.tests.forEach((test, index) => {
      if (answersTests?.[index] === test.options[test.correctOptionIndex]) {
        correct += 1;
      }
    });
  }
  if (total === correct) {
    const user = await User.findById(userId);
    user.addToCourses(courseBlock.course._id, [courseBlock._id]);
    await user.save();
    res.status(200).json({ message: i18n.__('course.chapter.marked'), correct, total });
  } else {
    res.status(200).json({ message: i18n.__('course.chapter.answersIncorrect'), correct, total });
  }
};

module.exports.getMyCourses = async (req, res) => {
  const skip = parseInt(req.query.skip, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 9;
  const user = await User.findById(req.user.id).select('courses').lean();
  const totalCount = user.courses?.length;
  if (!user.courses) {
    return res.status(200).json({ courses: [], totalCount });
  }
  const courses = await Promise.all(
    user.courses
      .slice(skip, skip + limit)
      .map(async (item) => {
        const course = await Course.findById(item.course).lean();
        const total = await CourseBlock.find({ course: item.course }).countDocuments();
        return {
          ...course,
          image: getFullPath(req, course.image),
          passed: item.passedBlocks?.length ?? 0,
          total,
        };
      }),
  );
  res.status(200).json({ courses, totalCount });
};
