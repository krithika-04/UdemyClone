const jwt = require("jsonwebtoken");
const db = require("../helper/db");
const Instructor = db.instructor;
require("dotenv").config();
export const requireSignin = (req, res, next) => {
  //console.log(req.headers.cookie);
  //return res.json(req)
  let token = null;
  if (req.headers.cookie) {
    token = req.headers.cookie.slice(6);
  }

  console.log(token);
  jwt.verify(token, process.env.secret, function (err, decode) {
    if (err) {
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized access." });
    } else {
      next();
    }
  });

  // console.log(decode)
};
export const isInstructor = async (req, res, next) => {
  try {
    // console.log(req.params)

    const instructor = await Instructor.findByPk(req.params.id).then(
      (result) => {
        // console.log(result)
        if (result != null) {
          next();
        } else res.status(403).json({ message: "not an instructor" });
      }
    );
  } catch (error) {
    console.log("Error:", error);
  }
};
