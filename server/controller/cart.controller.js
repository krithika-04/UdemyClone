const db = require("../helper/db");
const students = db.student;
const carts = db.cart;
const courses = db.course;
const cartItems = db.cartItem;
const Op = db.Sequelize.Op;
exports.getAllcourses = async (req, res) => {
  //get all courses in a specific user's cart
  try {
    console.log(req.params.id);
    const stuData = await students.findOne({
      where: { UserId: req.params.id },
    });
    if (stuData == null) {
      return res.json({
        status: "failed",
        message: "not a student",
      });
    }
    const stuId = stuData.id;
    const cartData = await carts.findAll({
      include: {
        model: courses,
      },
      where: {
        StudentId: stuId,
      },
    });
    if (cartData) res.json(cartData);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.addTocart = async (req, res) => {
  try {
    console.log(req.params.id);
    const stuData = await students.findOne({
      where: { UserId: req.params.id },
    });
    if (stuData == null) {
      return res.json({
        status: "failed",
        message: "not a student",
      });
    }
    const userCart = await carts.findOne({ where: { StudentId: stuData.id } });
    const course_id = req.body.course_id;
    const courseData = await courses.findByPk(course_id);
    const currCourseAmt = courseData.price;
    console.log(currCourseAmt);
    if (userCart == null) {
      // cart doesn't exist so create new cart
      const cart = await stuData.createCart();
      const cartItem = await cart.addCourse(courseData);
      cart.total += currCourseAmt;
      const response = await cart.save();
      if (response)
        res.json({
          status: "success",
          message: "added to cart",
          data: response,
        });
    } else {
      // cart already exist
      try {
        const cartItem = await userCart.addCourse(courseData);
        userCart.total += currCourseAmt;
        const response = await userCart.save();
        if (response)
          res.json({
            status: "success",
            message: "added to cart",
            data: response,
          });
      } catch (error) {
        res.status(400).json(error);
      }
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};
exports.deletecart = async (req, res) => {
  try {
    const stuData = await students.findOne({
      where: { UserId: req.params.id },
    });
    if (stuData == null) {
      return res.json({
        status: "failed",
        message: "not a student",
      });
    }
    const course_id = req.body.course_id;
    const cart_id = req.body.cart_id;
    try {
      const response = await cartItems.destroy({
        where: {
          [Op.and]: [{ CourseId: course_id }, { CartId: cart_id }],
        },
      });
      if (response == 1)
        res.json({
          status: "success",
          message: "removed from cart successfully",
        });
      else {
        res.json({
          status: "failed",
          message: "course not found",
        });
      }
    } catch (error) {
      res.status(400).json(error);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.saveForLater = async (req, res) => {
  try {
    const stuData = await students.findOne({
      where: { UserId: req.params.id },
    });
    if (stuData == null) {
      return res.json({
        status: "failed",
        message: "not a student",
      });
    }
    const course_id = req.body.course_id;
    const cart_id = req.body.cart_id;
    const response = await cartItems.update(
      { saveForLater: true },
      {
        where: {
          [Op.and]: [{ CourseId: course_id }, { CartId: cart_id }],
        },
      }
    );
    if (response == 1)
      return res.json({
        status: "success",
        message: "saved for later",
      });
    else {
      return res.json({
        status: "failed",
        message: "no record found",
      });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.moveTocart = async (req, res) => {
  try {
    const stuData = await students.findOne({
      where: { UserId: req.params.id },
    });
    if (stuData == null) {
      return res.json({
        status: "failed",
        message: "not a student",
      });
    }
    const course_id = req.body.course_id;
    const cart_id = req.body.cart_id;
    const response = await cartItems.update(
      { saveForLater: false },
      {
        where: {
          [Op.and]: [{ CourseId: course_id }, { CartId: cart_id }],
        },
      }
    );
    if (response == 1)
      return res.json({
        status: "success",
        message: "moved to cart",
      });
    else {
      return res.json({
        status: "failed",
        message: "no record found",
      });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
