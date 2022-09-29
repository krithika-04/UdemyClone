import { requireSignin,isInstructor } from '../middleware/index';
module.exports = app => {
    const instructor = require("../controller/instructor.controller.js");
    const multer = require('multer');
    const upload = multer()
    var router = require("express").Router();
  
    // Create a new course
    router.post("/createCourse/:id",upload.single('course_img'),requireSignin,isInstructor, instructor.create);
    router.get("/:id",requireSignin,isInstructor, instructor.fetchAllCoursesbyId);
    router.get("/:id/:slug",requireSignin,isInstructor, instructor.fetchSingleCourse);
    router.patch("/updateCourse/:id/:c_id",requireSignin,isInstructor,instructor.updateCourse)
    router.delete("deleteCourse/:id/:c_id",requireSignin,isInstructor,instructor.deleteCourse)
  
    
  
    app.use('/api/instructor', router);
  };