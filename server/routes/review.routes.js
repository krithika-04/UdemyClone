
import { requireSignin} from '../middleware/index';
module.exports = app => {
    const review = require("../controller/review.controller.js");
   
    var router = require("express").Router();

    router.post("/:id",requireSignin,review.reviewAcourse) //id is user
  
    app.use('/api/review', router);
  };