const db = require("../helper/db");
const carts = db.cart;
const courses = db.course;
const Op = db.Sequelize.Op;
exports.getAllcourses = async (req, res) => {
  const user_id = req.params.id;
  const addedCourse = await carts.findOne({ where: { user_id: user_id } });
  const course = await courses.findAll({
    where: {
      id: {
        [Op.in]: addedCourse.course_id,
      },
    },
  });
  res.json(course);
};
exports.addTocart = async (req, res) => {
  try {
    const user_id = req.body.user_id;

    const addedCourses = await carts.findOne({ where: { user_id: user_id } });
    //const course=await carts.findOne({where:{user_id:req.body.user_id}})
    //res.json(addedCourses)

    //console.log(addedCourses.course_id)
    let cartcourses = null;
    if (addedCourses != null) cartcourses = addedCourses.course_id;
    const cart = {
      user_id: req.body.user_id,
      course_id: [],
    };
    if (cartcourses != null) {
      console.log(cartcourses);
      cart.course_id.push(cartcourses);
    }
    //console.log("hey",req.body.course_id.length)

    for (let i = 0; i < req.body.course_id.length; i++) {
      cart.course_id.push(req.body.course_id[i]);
      console.log(req.body.course_id[i]);
    }
    console.log(cart);
    // return;
    if (addedCourses != null) {
      carts
        .update(cart, { where: { user_id: req.body.user_id } })
        .then(async (result) => {
          console.log("hello", result);
          const response = await carts.findOne({
            where: { user_id: req.body.user_id },
          });
          return res.status(200).json(response);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      carts
        .create(cart)
        .then((result) => {
          //console.log(result)

          return res.status(200).json(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.deletecart = async (req, res) => {
  try {
    const user_id = req.body.user_id;

    const addedCourses = await carts.findOne({ where: { user_id: user_id } });
    if (addedCourses == null) {
      return res.json({
        message: "your cart is empty",
      });
    }

    let cartcourses = null;
    if (addedCourses != null) cartcourses = addedCourses.course_id;
    const cart = {
      user_id: req.body.user_id,
      course_id: [],
    };
    const index = cartcourses.indexOf(req.body.course_id);
    if (index > -1) {
      cartcourses.splice(index, 1);
    }
    if (cartcourses != null) {
      console.log(cartcourses);
      cart.course_id.push(cartcourses);
    }

    console.log(cart);

    carts
      .update(cart, { where: { user_id: req.body.user_id } })
      .then(async () => {
        //console.log(result)
        const response = await carts.findOne({
          where: { user_id: req.body.user_id },
        });
        return res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log("Error:", error);
  }
};
