import express from 'express'
import cors from 'cors'
import multer from 'multer'; // a middleware for handling formdata / mutipart data
const cloudinaryConfig  =require('./config/cloudinaryConfig') ;
const morgan= require("morgan")
const upload = multer();
require("dotenv").config()
const app = express()
app.use(express.json());

//connect db
const db = require("./helper/db");

 db.sequelize.sync({alter:true})
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err);
  });

// sequelize.authenticate().complete(function (err) {
//   if (err) {
//      console.log('There is connection in ERROR');
//   } else {
//      console.log('Connection has been established successfully');
//   }
//  });

//middleware
app.use(cors())

// cloudinary
app.use('*', cloudinaryConfig);
// app.use(upload.array());
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: false }));
// Json Body Middleware
app.use(morgan("dev"))
require("./routes/course.routes")(app);
require("./routes/lesson.routes")(app);
require("./routes/instructor.routes")(app);
require("./routes/user.routes")(app);
require("./routes/cart.routes")(app);
require("./routes/wishlist.routes")(app);
require("./routes/comment.routes")(app);
require("./routes/enroll.routes")(app);
require("./routes/review.routes")(app);
require("./routes/student.routes")(app);
const port= process.env.PORT ||5000

app.listen(port,process.env.host,()=>{
    console.log(`server is running  port${process.env.host}:${port}`)
})
