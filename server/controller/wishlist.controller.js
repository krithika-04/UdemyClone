const db = require("../helper/db");
const students = db.student;
const wishlists = db.wishlist;
const courses = db.course;
const wishListItems = db.wishListItem;
const Op = db.Sequelize.Op;
exports.getAllcourses = async (req, res) => {
  //get all courses in a specific user's wishlist
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
    const wishlistData = await wishlists.findAll({
      include: {
        model: courses,
      },
      where: {
        StudentId: stuId,
      },
    });
    if (wishlistData) res.json(wishlistData);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.addTowishlist = async (req, res) => {
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
    const userWishlist = await wishlists.findOne({
      where: { StudentId: stuData.id },
    });
    const course_id = req.body.course_id;
    const courseData = await courses.findByPk(course_id);
    if (courseData == null) {
      return res.json({
        status: "failed",
        message: "course doesn't exist",
      });
    }
    if (userWishlist == null) {
      // wishlist doesn't exist so create new wishlist
      const wishlist = await stuData.createWishlist();
      const wishListItem = await wishlist.addCourse(courseData);
      console.log(wishListItem == null);
      if (wishListItem) {
        console.log("heyyy");
        return res.json({
          status: "success",
          message: "added to wishlist",
          data: wishListItem,
        });
      } else {
        return res.json({
          status: "failed",
          message: "failed to add to wishlist",
          data: wishListItem,
        });
      }
    } else {
      // wishlist already exist
      try {
        const wishListItem = await userWishlist.addCourse(courseData);

        if (wishListItem) {
          console.log("heyyy");
          return res.json({
            status: "success",
            message: "added to wishlist",
            data: wishListItem,
          });
        } else {
          return res.json({
            status: "failed",
            message: "failed to add to wishlist",
            data: wishListItem,
          });
        }
      } catch (error) {
        res.status(400).json(error);
      }
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};
exports.deletewishlist = async (req, res) => {
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
    const wishlist_id = req.body.wishlist_id;
    try {
      const response = await wishListItems.destroy({
        where: {
          [Op.and]: [{ CourseId: course_id }, { WishlistId: wishlist_id }],
        },
      });
      if (response == 1)
        res.json({
          status: "success",
          message: "removed from wishlist successfully",
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
