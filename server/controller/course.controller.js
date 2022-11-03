const db = require("../helper/db");
const courses = db.course;
const users = db.user;
const lessons = db.lesson;
const instructors = db.instructor;
const Op = db.Sequelize.Op;
const path = require("path");
const { where } = require("sequelize");
const category = db.course_category;
const subcat = db.subCat;

exports.fetchAllCourses = async (req, res) => {
  try {
    console.log("helloo123");
    const course = await courses.findAll({});
    res.json(course);
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.fetchCoursesbyId = async (req, res) => {
  try {
    const course = await courses.findOne({
      where: { id: req.params.id },
      include: {
        model: instructors,
        include: { model: users },
      },
    });
    res.json(course);
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.fetchCoursesbyCategory = async (req, res) => {
  try {
    console.log("cat");
    const course_category = req.params.category;
    const categoryData = await category.findOne({
      where: { slug: course_category },
    });
    const response = await courses.findAll({
      where: { CourseCatId: categoryData.id },
    });
    return res.json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.fetchCoursesbySubCategory = async (req, res) => {
  try {
    console.log("subcat");
    const course_category = req.params.category;
    const subcourse_category = req.params.subcategory;
    const categoryData = await category.findOne({
      where: { slug: course_category },
    });
    const subcategoryData = await subcat.findOne({
      where: { slug: subcourse_category },
    });
    const response = await courses.findAll({
      where: {
        [Op.and]: [
          { CourseCatId: categoryData.id },
          { SubCatId: subcategoryData.id },
        ],
      },
    });
    return res.json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};
