const User = require('../models/User');
const Course = require('../models/Course');
const CourseBlock = require('../models/CourseBlock');
const validLevels = require('../constants/validLevels');
const getFullPath = require('../utils/getFullPath');

module.exports.getCourses = async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      skip, limit, name, levels, durationRange,
    } = req.query;
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports.createCourse = async (req, res) => {
  try {
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
    res.status(201).json({ message: 'Course has been created successfully', id: newCourse._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports.getCourse = async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports.buyCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('card').lean();
    if (!user || !user.card || !user.card.number || !user.card.cvv || !user.card.expiry) {
      return res.status(400).json({ error: 'User does not have a valid card' });
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
      return res.status(404).json({ error: 'Course not found' });
    }
    user.addToCourses(courseId);
    res.status(200).json({ message: 'Course purchased successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports.createCourseBlock = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    if (course.author.toString() !== userId) {
      return res.status(403).json({ error: 'You are not the author of this course' });
    }
    const data = JSON.parse(req.body.jsonData);
    data.course = courseId;
    data.attachments = req.files?.map((file) => ({
      path: file.path,
      originalName: file.originalname,
    }));
    const newCourseBlock = new CourseBlock(data);
    await newCourseBlock.save();
    res.status(201).json({ message: 'Course block has been created successfully', id: newCourseBlock._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports.getCourseBlock = async (req, res) => {
  try {
    const { blockId } = req.params;
    const block = await CourseBlock.findById(blockId).lean();
    block.attachments = block.attachments.map((file) => ({
      originalName: file.originalName,
      path: getFullPath(req, file.path),
    }));
    const user = await User.findById(req.user.id);
    block.isPassed = user.hasPassedBlock(block.course, block._id);
    res.status(200).json({ block });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports.markCourseBlock = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseBlockId = req.params.id;
    const { answersTests, answersTasks } = req.body;
    const courseBlock = await CourseBlock.findById(courseBlockId).lean();
    if (!courseBlock) {
      return res.status(404).json({ error: 'Course block not found' });
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
      res.status(200).json({ message: 'Course block marked as complete and added to courses', correct, total });
    } else {
      res.status(200).json({ message: 'Course block not completed, answers were incorrect', correct, total });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
