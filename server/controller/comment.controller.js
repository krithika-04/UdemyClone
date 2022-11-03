const db = require("../helper/db");
const comments = db.comment;
const replies = db.reply;
const users = db.user;
const courses = db.course;
const Op = db.Sequelize.Op;
exports.getAllcomments = async (req, res) => {
  try {
    const comment = await comments.findAll({
      where: {
        CourseId: req.body.course_id,
      },
      include: {
        model: replies,
      },
    });

    res.json(comment);
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.postComments = async (req, res) => {
  try {
    let { title, description, course_id } = req.body;
    const userData = await users.findByPk(req.params.id);
    const result = await userData.createComment({
      title: title,
      description: description,
      CourseId: course_id,
    });
    res.json(result);
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.addReply = async (req, res) => {
  try {
    let { description, comment_id } = req.body;
    const userData = await users.findByPk(req.params.id);
    const result = await userData.createReply({
      description: description,
      CommentId: comment_id,
    });
    res.json(result);
  } catch ({ error }) {
    res.status(400).json(error);
  }
};
exports.upvotesInc = async (req, res) => {
  try {
    const result = await comments.increment(
      "upvotes",
      { where: { id: req.body.comment_id } },
      { by: 1 }
    );
    res.json({
      message: "upvoted",
    });
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.upvotesDec = async (req, res) => {
  try {
    const result = await comments.decrement(
      "upvotes",
      { where: { id: req.body.comment_id } },
      { by: 1 }
    );
    res.json({
      message: "upvote removed",
    });
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.ReplyUpvotesInc = async (req, res) => {
  try {
    const result = await replies.increment(
      "upvotes",
      { where: { id: req.body.reply_id } },
      { by: 1 }
    );
    res.json({
      message: "upvoted",
    });
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.ReplyUpvotesDec = async (req, res) => {
  try {
    const result = await replies.decrement(
      "upvotes",
      { where: { id: req.body.reply_id } },
      { by: 1 }
    );
    res.json({
      message: "upvote removed",
    });
  } catch (error) {
    console.log("Error:", error);
  }
};
