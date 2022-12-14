import express from 'express'
import cors from 'cors'

const bodyParser = require('body-parser');
const cloudinaryConfig  =require('./config/cloudinaryConfig') ;
const morgan= require("morgan")

require("dotenv").config()
const app = express()


//connect db
const db = require("./helper/db");

db.sequelize.sync({force:true})
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

//middleware
app.use(cors())
app.use(express.json());
// cloudinary
app.use('*', cloudinaryConfig);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
// Json Body Middleware
app.use(morgan("dev"))
require("./routes/course.routes")(app);
require("./routes/lesson.routes")(app);
require("./routes/instructor.routes")(app);
require("./routes/user.routes")(app);
require("./routes/cart.routes")(app);
require("./routes/comment.routes")(app);
const port= process.env.PORT ||5000

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
