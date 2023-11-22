const Course = require('../models/Course');
const difficultyLevels = require('../constants/difficultyLevels');
const getFullPath = require('../utils/getFullPath');

module.exports.getCourses = async (req, res) => {
  try {
    const {
      skip, limit, difficulties, durationRange,
    } = req.query;
    const filter = {
      difficulty: { $in: difficulties ?? difficultyLevels },
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
      name, description, teachers, price, duration, difficulty,
    } = req.body;
    if (!req?.file) {
      req.file = { path: 'uploads/1700295692126.jpeg' };
    }
    const image = req.file.path;
    const newCourse = new Course({
      author, name, description, teachers, price, duration, difficulty, image,
    });
    await newCourse.save();
    res.status(201).json({ message: 'Course has been created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
