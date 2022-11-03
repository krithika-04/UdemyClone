
import { requireSignin} from '../middleware/index';
module.exports = app => {
    const comments = require("../controller/comment.controller.js");
   
    var router = require("express").Router();
    router.post("/",requireSignin,comments.getAllcomments);
    router.post("/:id",requireSignin,comments.postComments)
    router.post("/upvote/Inc",requireSignin,comments.upvotesInc)
    router.post("/upvote/Dec",requireSignin,comments.upvotesDec)
    router.post("/reply/:id",requireSignin,comments.addReply)
    router.post("/reply/upvote/Inc",requireSignin,comments.ReplyUpvotesInc)
    router.post("/reply/upvote/Dec",requireSignin,comments.ReplyUpvotesDec)
    app.use('/api/comments', router);
  };