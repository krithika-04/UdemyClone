const { Sequelize } = require("sequelize");

const dbConfig = require("../config/dbConfig");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  host: dbConfig.HOST,
  // dialectOptions: {
  //   socketPath: '/var/run/mysqld/mysqld.sock'
  // },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
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
db.wishlist = require("../models/wishlist_model")(sequelize, Sequelize);
db.comment = require("../models/comments_model")(sequelize, Sequelize);
db.reply = require("../models/reply_model")(sequelize, Sequelize);
db.emailVerifaction = require("../models/emailVerification_model")(
  sequelize,
  Sequelize
);
db.student_course_details = require("../models/student_course_details")(
  sequelize,
  Sequelize
);
db.course_category = require("../models/course_Category")(sequelize, Sequelize);
db.cartItem = require("../models/cartItem_model")(sequelize, Sequelize);
db.wishListItem = require("../models/wishListItem_model")(sequelize, Sequelize);
db.enroll = require("../models/enroll_model")(sequelize, Sequelize);
db.review = require("../models/review_model")(sequelize, Sequelize);
db.completed = require("../models/completed_model")(sequelize, Sequelize);
db.promotion = require("../models/promotion_model")(sequelize, Sequelize);
db.subCat = require("../models/subCat_model")(sequelize, Sequelize);
db.instructorPayment = require("../models/InstructorPayment_model")(
  sequelize,
  Sequelize
);
db.user.hasOne(db.student);
db.student.belongsTo(db.user);
db.user.hasOne(db.instructor);
db.instructor.belongsTo(db.user);
db.instructor.hasMany(db.course, { onDelete: "CASCADE" });
db.course.belongsTo(db.instructor, { onDelete: "CASCADE" });
db.course.hasMany(db.lesson, { onDelete: "CASCADE" });
db.lesson.belongsTo(db.course, { onDelete: "CASCADE" });
db.course_category.hasMany(db.course, { onDelete: "CASCADE" });
db.course.belongsTo(db.course_category, { onDelete: "CASCADE" });
db.subCat.hasMany(db.course, { onDelete: "CASCADE" });
db.course.belongsTo(db.subCat, { onDelete: "CASCADE" });
db.course_category.hasMany(db.subCat, { onDelete: "CASCADE" });
db.subCat.belongsTo(db.course_category, { onDelete: "CASCADE" });
db.user.hasOne(db.emailVerifaction, {
  foreignKey: "user_id",
});
db.emailVerifaction.belongsTo(db.user, {
  foreignKey: "user_id",
});
// db.course.hasMany(db.cartItem,{onDelete:'CASCADE'})
// db.cartItem.belongsTo(db.course,{onDelete:'CASCADE'})
// db.cart.hasMany(db.cartItem,{onDelete:'CASCADE'})
// db.cartItem.belongsTo(db.cart,{onDelete:'CASCADE'})
db.cart.belongsToMany(db.course, { through: db.cartItem });
db.course.belongsToMany(db.cart, { through: db.cartItem });
db.cartItem.belongsTo(db.cart);
db.cartItem.belongsTo(db.course);
db.wishlist.belongsToMany(db.course, { through: db.wishListItem });
db.course.belongsToMany(db.wishlist, { through: db.wishListItem });
db.wishListItem.belongsTo(db.wishlist);
db.wishListItem.belongsTo(db.course);
db.student.hasOne(db.cart, { onDelete: "CASCADE" });
db.cart.belongsTo(db.student, { onDelete: "CASCADE" });
db.student.hasOne(db.wishlist, { onDelete: "CASCADE" });
db.wishlist.belongsTo(db.student, { onDelete: "CASCADE" });
db.comment.hasMany(db.reply, { onDelete: "CASCADE" });
db.reply.belongsTo(db.comment, { onDelete: "CASCADE" });
db.user.hasMany(db.comment, { onDelete: "CASCADE" });
db.comment.belongsTo(db.user, { onDelete: "CASCADE" });
db.user.hasMany(db.reply, { onDelete: "CASCADE" });
db.reply.belongsTo(db.user, { onDelete: "CASCADE" });
db.course.hasMany(db.comment, { onDelete: "CASCADE" });
db.comment.belongsTo(db.course, { onDelete: "CASCADE" });
db.student.hasMany(db.enroll, { onDelete: "CASCADE" });
db.enroll.belongsTo(db.student, { onDelete: "CASCADE" });
db.course.hasMany(db.enroll, { onDelete: "CASCADE" });
db.enroll.belongsTo(db.course, { onDelete: "CASCADE" });
db.student.hasMany(db.review, { onDelete: "CASCADE" });
db.review.belongsTo(db.student, { onDelete: "CASCADE" });
db.course.hasMany(db.review, { onDelete: "CASCADE" });
db.review.belongsTo(db.course, { onDelete: "CASCADE" });
db.enroll.belongsToMany(db.lesson, { through: db.completed });
db.lesson.belongsToMany(db.enroll, { through: db.completed });
db.completed.belongsTo(db.lesson);
db.completed.belongsTo(db.enroll);
db.instructor.hasMany(db.promotion, { onDelete: "CASCADE" });
db.promotion.belongsTo(db.instructor, { onDelete: "CASCADE" });
db.course.hasOne(db.promotion);
db.promotion.belongsTo(db.course);
db.instructor.hasMany(db.instructorPayment, { onDelete: "CASCADE" });
db.instructorPayment.belongsTo(db.instructor, { onDelete: "CASCADE" });
db.course.hasMany(db.instructorPayment,{ onDelete: "CASCADE" });
db.instructorPayment.belongsTo(db.course,{ onDelete: "CASCADE" })
module.exports = db;
