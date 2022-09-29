const { Sequelize } = require('sequelize');


const dbConfig = require("../config/dbConfig");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  host: dbConfig.HOST,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.course = require("../models/course_model.js")(sequelize, Sequelize);
db.user = require("../models/user_model.js")(sequelize, Sequelize);
db.lesson = require("../models/lesson_model.js")(sequelize, Sequelize);
db.student = require("../models/student_model")(sequelize, Sequelize);
db.instructor = require("../models/instructor_model")(sequelize, Sequelize);
db.cart = require("../models/cart_model")(sequelize, Sequelize);
db.comment = require("../models/comments_model")(sequelize, Sequelize);
db.reply = require("../models/reply_model")(sequelize, Sequelize);
db.emailVerifaction = require("../models/emailVerification_model")(sequelize, Sequelize);
db.student_course_details= require("../models/student_course_details")(sequelize, Sequelize);
db.course_category= require("../models/course_Category")(sequelize, Sequelize);
db.user.hasOne(db.student);
db.user.hasOne(db.instructor);
db.instructor.hasMany(db.course)
db.course.hasMany(db.lesson);
db.course_category.hasMany(db.course);

module.exports = db
