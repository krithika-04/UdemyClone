
import { requireSignin} from '../middleware/index';
module.exports = app => {
    const carts = require("../controller/cart.controller.js");
   
    var router = require("express").Router();
  
    // Create a new course
    router.get("/:id",requireSignin,carts.getAllcourses);
    router.post("/",requireSignin, carts.addTocart);
    router.delete("/remove",requireSignin, carts.deletecart);
    
    
  
    app.use('/api/cart', router);
  };