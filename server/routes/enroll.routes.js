
import { requireSignin} from '../middleware/index';
module.exports = app => {
    const enroll = require("../controller/enroll.controller.js");
   
    var router = require("express").Router();

    router.post("/course/:id",requireSignin,enroll.enrollAcourse)
    router.post("/referral/:slug/",requireSignin,enroll.enrollViaReferral)
    router.get("/order/success",enroll.paymentStatus)
    app.use('/api/enroll', router);
  };