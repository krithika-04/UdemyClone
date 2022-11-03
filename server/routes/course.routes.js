module.exports = app => {
    const courses = require("../controller/course.controller.js");

    var router = require("express").Router();

    router.get("/", courses.fetchAllCourses);
    router.get("/category/:category", courses.fetchCoursesbyCategory);
    router.get("/:category/:subcategory", courses.fetchCoursesbySubCategory);
    router.get("/:id", courses.fetchCoursesbyId);
    app.use('/api/courses', router);
  };