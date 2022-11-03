
import { requireSignin} from '../middleware/index';
module.exports = app => {
    const carts = require("../controller/cart.controller.js");
    var router = require("express").Router();
    router.get("/:id",requireSignin,carts.getAllcourses);
    router.post("/:id",requireSignin, carts.addTocart);// here id is user id
    router.delete("/:id",requireSignin, carts.deletecart);
    router.put("/saveForLater/:id",requireSignin,carts.saveForLater)
    router.put("/moveTocart/:id",requireSignin,carts.moveTocart)
    app.use('/api/cart', router);
  };