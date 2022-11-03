import { requireSignin } from "../middleware/index";
module.exports = (app) => {
  const user = require("../controller/user.controller.js");
  var router = require("express").Router();
  router.post("/register", user.register);
  router.post("/login", user.login);
  router.get("/logout", user.logout);
  router.get("/current-user", requireSignin, user.currentUser);
  router.post("/changeToIns",requireSignin,user.changeToIns)
  router.post("/verifyOtp", user.verifyOtp);
  router.post("/resendOtp", user.resendOtp);
  router.post("/forgot-password", user.forgotPass);
  router.get("/reset-password/:id/:token", user.reset);
  router.post("/resetPassword/:id/:token", user.resetPass);
  app.use("/api/user", router);
};
