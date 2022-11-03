import { requireSignin,isInstructor } from '../middleware/index';
module.exports = app => {
    const instructor = require("../controller/instructor.controller.js");
    const multer = require('multer');
    const upload = multer()
    var router = require("express").Router();
  
    // Create a new course
    router.post("/createCourse/:id",upload.single('course_img'),requireSignin,isInstructor, instructor.create);
    router.post("/publishCourse/:id",requireSignin,isInstructor, instructor.publish);
    router.get("/fetch-course-by-id/:id",requireSignin,isInstructor, instructor.fetchAllCoursesbyId);
    router.get("/fetch-single-course/:id/:c_id/:slug",requireSignin,isInstructor, instructor.fetchSingleCourse);
    router.put("/updateCourse/:id/:c_id",upload.single('course_img'),requireSignin,isInstructor,instructor.updateCourse)
    router.delete("/deleteCourse/:id/:c_id",requireSignin,isInstructor,instructor.deleteCourse)
    router.get("/profile/current-instructor/:id", requireSignin,isInstructor, instructor.currentInstructor);
    router.post("/onboarding/:id",requireSignin,isInstructor,instructor.onboarding)
    router.get("/get-account-status/:id",requireSignin,isInstructor,instructor.getAccountStatus)
    app.use('/api/instructor', router);
  };