const User = require('../models/User');
const Course = require('../models/Course');
const CourseBlock = require('../models/CourseBlock');
const validLevels = require('../constants/validLevels');
const getFullPath = require('../utils/getFullPath');

module.exports.getCourses = async (req, res) => {
  try {
    const {
      skip, limit, levels, durationRange,
    } = req.query;
    const filter = {
      level: { $in: levels ?? validLevels },
      duration: {
        $gte: durationRange?.[0] ?? 0,
        $lte: durationRange?.[1] ?? Infinity,
      },
    };
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
      author, name, description, instructors, price, duration, level, image, usersBought: [author],
    });
    await newCourse.save();
    res.status(201).json({ message: 'Course has been created successfully', id: newCourse._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports.getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    const blocks = await CourseBlock.find({ course: id }).select('title');
    course.image = getFullPath(req, course.image);
    res.status(200).json({ course, blocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports.buyCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user || !user.card || !user.card.number || !user.card.cvv || !user.card.expiry) {
      return res.status(400).json({ error: 'User does not have a valid card' });
    }
    const courseId = req.params.id;
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { usersBought: userId } },
      { new: true },
    );
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
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
    console.log(course.author, userId);
    if (course.author.toString() !== userId) {
      return res.status(403).json({ error: 'You are not the author of this course' });
    }
    const data = JSON.parse(req.body.jsonData);
    data.course = courseId;
    data.attachments = req.files?.map((file) => file.path);
    const newCourseBlock = new CourseBlock(data);
    await newCourseBlock.save();
    res.status(201).json({ message: 'Course block has been created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports.getCourseBlock = async (req, res) => {
  try {
    const { blockId } = req.params;
    const block = await CourseBlock.findById(blockId);
    block.attachments = block.attachments.map((attachment) => getFullPath(req, attachment));
    res.status(200).json({ block });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
