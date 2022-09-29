const { comment } = require("../helper/db");
const db = require("../helper/db");
const comments = db.comment;
const replies = db.reply;
const Op = db.Sequelize.Op;
exports.getAllcomments = async (req, res) => {
  try {
    const comment = await comments.findAll();

    res.json(result);
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.postComments = async (req, res) => {
  try {
    let comment = req.body;
    const result = await comments.create(comment);
    res.json(result);
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.addReply = async (req, res) => {
  try {
    let reply = req.body;
    replies.create(reply).then((response) => {
      console.log(response.id);
      comments
        .findOne({ where: { id: response.comment_id } })
        .then((comment) => {
          let rep = [];
          if (isNaN(comment.reply[0])) {
            console.log("**1**");
            rep.push(response.id);
            comment.reply = rep;
            //console.log(comment.reply)
          } else {
            console.log("**2**");
            rep = comment.reply;
            rep.push(response.id);
          }

          comments
            .update({ reply: rep }, { where: { id: response.comment_id } })
            .then((result) => {
              console.log("hello");
              res.json(result);
            })
            .catch((err) => {
              console.log("Error:", err);
              //replies.destroy({where:{id:response.id}})
            });
        });
    });
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.upvotesInc = async (req, res) => {
  try {
    const result = await comment.increment(
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
    const result = await comment.decrement(
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
