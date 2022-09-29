import { instructor } from '../helper/db';
import { requireSignin,isInstructor } from '../middleware/index';
module.exports = app => {
    const lessons = require("../controller/lesson.controller.js");
    const multer = require('multer');
    const upload = multer()
    var router = require("express").Router();
  
    // Create a new lesson
    router.post("/createLesson/:id",upload.single('course_video'),requireSignin,isInstructor, lessons.create);
    router.get("/:id/:c_id",requireSignin,isInstructor, lessons.fetchAllLessonsbyId);
    router.get("/lesson/:id/:l_id",requireSignin,isInstructor, lessons.fetchSingleLesson);
    router.patch("/updateLesson/:id/:l_id",requireSignin,isInstructor,lessons.updateLesson)
    router.delete("/deleteLesson/:id/:l_id",requireSignin,isInstructor,lessons.deleteLesson)
    
    
  
    app.use('/api/courses/lecture', router);
  };