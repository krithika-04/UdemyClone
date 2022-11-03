
import { requireSignin} from '../middleware/index';
module.exports = app => {
    const wishlist = require("../controller/wishlist.controller");
    var router = require("express").Router();
    router.get("/:id",requireSignin,wishlist.getAllcourses);
    router.post("/:id",requireSignin, wishlist.addTowishlist);// here id is user id
    router.delete("/:id",requireSignin, wishlist.deletewishlist);

  
    app.use('/api/wishlist', router);
  };