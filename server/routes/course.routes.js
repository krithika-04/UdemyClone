module.exports = app => {
    const courses = require("../controller/course.controller.js");

    var router = require("express").Router();

    router.get("/", courses.fetchAllCourses);

  
    // Retrieve all courses
    
  
    app.use('/api/courses', router);
  };