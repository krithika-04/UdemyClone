const db = require("../helper/db");
const lessons = db.lesson;
const Op = db.Sequelize.Op;
const path = require("path");
const Datauri = require("datauri/parser");
const cloudinary = require("cloudinary").v2;
exports.create = (req, res) => {
  const lesson = req.body;

  // const imagename = req.file.filename;

  try {
    if (req.file) {
      const dUri = new Datauri();
      const imagename = req.file.originalname;
      console.log(imagename);
      const dataUri = (req) =>
        dUri.format(path.extname(imagename).toString(), req.file.buffer);
      const file = dataUri(req).content;
      // for videos add near folder resource_type: "video",
      cloudinary.uploader
        .upload(file, { folder: "udemyUploads", resource_type: "video" })
        .then((result) => {
          lesson.video_link = result.url;
          console.log(result.url);
          lesson.video_name = result.public_id;
        })
        .then(() => {
          // course.instructor_id=req.body.user_id;

          console.log(lesson);
          lessons.create(lesson).then(() => {
            res.status(201).json({ message: "lesson created" });
          });
        })
        .catch((err) => {
          console.log("hello");
          console.log("error:", err);
        });
    }
  } catch (error) {
    res.status(400).json({ message1: error.message });
  }
};
exports.fetchAllLessonsbyId = async (req, res) => {
  try {
    const lesson = await lessons.findAll({
      where: { course_id: req.params.c_id },
    });
    res.json(lesson);
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.fetchSingleLesson = async (req, res) => {
  try {
    const lesson = await lessons.findOne({ where: { id: req.params.l_id } });
    res.json(lesson);
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.updateLesson = async (req, res) => {};
exports.deleteLesson = async (req, res) => {};
