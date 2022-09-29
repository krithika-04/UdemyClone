const db = require("../helper/db");
const courses = db.course;
const Op = db.Sequelize.Op;
const path = require("path");
const Datauri = require("datauri/parser");
const cloudinary = require("cloudinary").v2;
exports.create = (req, res) => {
    const course = req.body;
  
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
          .upload(file, { folder: "udemyUploads" })
          .then((result) => {
            course.course_img = result.url;
            console.log(result.url);
            course.course_img_name = result.public_id;
          })
          .then(() => {
            // course.instructor_id=req.body.user_id;
            course.slug = req.body.course_name.toLowerCase().replaceAll(" ", "-");
            console.log(course);
            courses.create(course).then(() => {
              res.status(201).json({ message: "Course created" });
            });
          })
          .catch((err) => {
            console.log("hello");
            console.log("error:", err);
          });
      }
      //post.image = image;
    } catch (error) {
      res.status(400).json({ message1: error.message });
    }
  };
  exports.fetchAllCoursesbyId = async (req, res) => {
    try {
      const course = await courses.findAll({ where: { user_id: req.params.id } });
      res.json(course);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  exports.fetchSingleCourse = async (req, res) => {
    try {
      const course = await courses.findOne({ where: { slug: req.params.slug } });
      res.json(course);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  exports.updateCourse = async (req, res) => {};
exports.deleteCourse = async (req, res) => {};