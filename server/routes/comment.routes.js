
import { requireSignin} from '../middleware/index';
module.exports = app => {
    const comments = require("../controller/comment.controller.js");
   
    var router = require("express").Router();
  
    // Create a new course
    router.get("/",requireSignin,comments.getAllcomments);
    router.post("/",requireSignin,comments.postComments)
    router.post("/upvoteInc",requireSignin,comments.upvotesInc)
    router.post("/upvoteDec",requireSignin,comments.upvotesDec)
    router.post("/reply",requireSignin,comments.addReply)
    router.post("/reply/upvoteInc",requireSignin,comments.ReplyUpvotesInc)
    router.post("/reply/upvoteDec",requireSignin,comments.ReplyUpvotesDec)
    
    
  
    app.use('/api/comments', router);
  };