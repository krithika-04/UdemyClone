import { requireSignin } from "../middleware/index";
module.exports = (app) => {
  const students = require("../controller/student.controller.js");

  var router = require("express").Router();

  router.get(
    "/:slug/learn/lecture/:id",
    requireSignin,
    students.fetchSingleCourse
  );
  router.post("/learning", requireSignin, students.fetchAllEnrolledCourses);
  router.post("/markComplete", requireSignin, students.markComplete);
  router.post("/completedLessons", requireSignin, students.completedLessons);
  
  app.use("/api/course/", router);
};
