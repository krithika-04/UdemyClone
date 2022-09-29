const db = require("../helper/db");
const courses = db.course;
const Op = db.Sequelize.Op;
const path = require("path");
const Datauri = require("datauri/parser");
const cloudinary = require("cloudinary").v2;



exports.fetchAllCourses = async (req, res) => {
  try {
    const course = await courses.findAll();
    res.json(course);
  } catch (error) {
    console.log("Error:", error);
  }
};


