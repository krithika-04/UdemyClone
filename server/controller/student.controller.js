const db = require("../helper/db");
const sequelize = db.sequelize;
const courses = db.course;
const users = db.user;
const lessons = db.lesson;
const students = db.student;
const instructors = db.instructor;
const Op = db.Sequelize.Op;
const enrolls = db.enroll;

exports.fetchSingleCourse = async (req, res) => {
  try {
    const stuData = await students.findOne({
      where: { UserId: req.params.id },
    });
    if (stuData == null) {
      return res.json({
        status: "failed",
        message: "not a student",
      });
    }

    const response = await enrolls.findOne({
      include: {
        model: courses,
        where: { slug: req.params.slug },
      },
      where: { StudentId: stuData.id },
    });
    if (response) res.json(response);
    else {
      res.json({
        message: "no data found",
      });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.fetchAllEnrolledCourses = async (req, res) => {
  try {
    const stuData = await students.findOne({
      where: { UserId: req.body.user_id },
    });
    if (stuData == null) {
      return res.json({
        status: "failed",
        message: "not a student",
      });
    }

    const response = await enrolls.findAll({
      include: {
        model: courses,
      },
      where: { StudentId: stuData.id },
    });

    res.json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.markComplete = async (req, res) => {
  try {
    const enrollId = req.body.enroll_id;
    const lessonId = req.body.lesson_id;
    const enrollData = await enrolls.findByPk(enrollId);
    const lessonData = await lessons.findByPk(lessonId);
    const completed = await enrollData.addLesson(lessonData);
    // update progress
    const prevProgress = enrollData.progress;
    try {
      const no_of_lessons = await lessons.findOne({
        attributes: [[sequelize.fn("COUNT", sequelize.col("id")), "n_lessons"]],
        where: { CourseId: lessonData.CourseId },
      });
      const nLessons = JSON.parse(JSON.stringify(no_of_lessons));
      const currProgress = Math.round((1 / nLessons.n_lessons) * 100);
      const progress = prevProgress + currProgress;
      console.log(prevProgress, currProgress, progress, nLessons.n_lessons);
      const response = await enrolls.update(
        { progress: progress },
        { where: { id: enrollId } }
      );
      return res.json(response);
    } catch (error) {
      res.status(400).json(error);
    }
    // res.json(completed);
  } catch (error) {
    return res.status(400).json(error);
  }
};
exports.completedLessons = async (req, res) => {
  try {
    const enrollId = req.body.enroll_id;
    const response = await enrolls.findByPk(enrollId, {
      include: {
        model: lessons,
      },
    });
    return res.json(response);
  } catch (error) {
    return res.status(400).json(error);
  }
};
