const db = require("../helper/db");
const courses = db.course;
const reviews = db.review;
const students = db.student;
const Op = db.Sequelize.Op;
exports.reviewAcourse = async (req, res) => {
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
    const { description, rating, course_id } = req.body;
    const response = await stuData.createReview({
      description: description,
      rating: rating,
      CourseId: course_id,
    });
    const courseData = await courses.findByPk(course_id);
    const no_of_ratings = await courseData.countReviews();
    console.log(no_of_ratings);
    try {
      console.log("hello");
      // const ratingData = await reviews.findAll( {attributes: [
      //     'CourseId',
      //     [sequelize.fn('SUM', sequelize.col('rating')), 'total_rating'],
      //   ],
      //   group: ['CourseId'],raw: true},
      //   );
      const ratingData = await reviews.sum("rating", {
        where: { CourseId: course_id },
      });
      console.log(ratingData);
      const avgRating = ratingData / no_of_ratings;
      const response = await courses.update(
        { rating: avgRating },
        { where: { id: course_id } }
      );
      return res.json(response);
    } catch (error) {
      return res.status(400).json(error);
    }
    return res.json(ratingData);
  } catch (error) {
    res.status(400).json(error);
  }
};
