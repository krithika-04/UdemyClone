const db = require("../helper/db");
const courses = db.course;
const user = db.user;
const Instructor = db.instructor;
const Op = db.Sequelize.Op;
const path = require("path");
const Datauri = require("datauri/parser");
const cloudinary = require("cloudinary").v2;
const referralCodes = require("referral-codes");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const queryString = require("query-string");
require("dotenv").config();
exports.create = (req, res) => {
  const course = req.body;
  console.log("hii");
  // const imagename = req.file.filename;
  const instructor_id = req.params.id;
  try {
    if (req.file) {
      console.log("hii123");
      const dUri = new Datauri();
      const imagename = req.file.originalname;
      console.log(imagename);
      const dataUri = (req) =>
        dUri.format(path.extname(imagename).toString(), req.file.buffer);
      const file = dataUri(req).content;
      // for videos add near folder resource_type: "video",
      cloudinary.uploader
        .upload(file, { folder: "udemyUploads" })
        .then((result) => {
          course.course_img = result.url;
          console.log(result.url);
          course.course_img_name = result.public_id;
        })
        .then(() => {
          // course.instructor_id=req.body.user_id;
          course.slug = req.body.course_name.toLowerCase().replaceAll(" ", "-");
          console.log(course);
          courses.create(course).then(async (data) => {
            const courseData = data;
            const instData = await Instructor.findOne({
              where: { id: instructor_id },
            });
            instData.addCourse(courseData);
            res.status(201).json({ message: "Course created" });
          });
        })
        .catch((err) => {
          console.log("hello");
          console.log("error:", err);
        });
    }
    //post.image = image;
  } catch (error) {
    res.status(400).json({ message1: error.message });
  }
};
exports.fetchAllCoursesbyId = async (req, res) => {
  try {
    const course = await courses.findAll({
      where: { InstructorId: req.params.id },
    });
    res.json(course);
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.fetchSingleCourse = async (req, res) => {
  try {
    const course = await courses.findOne({
      where: {
        [Op.and]: [
          { slug: req.params.slug },
          { InstructorId: req.params.id },
          { id: req.params.c_id },
        ],
      },
    });
    res.json(course);
 
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.currentInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByPk(req.params.id, {
      include: {
        model: user,
        attributes: { exclude: ["password", "c_password"] },
      },
    }).then((result) => {
      res.json(result);
      if (result != null) res.json({ ok: true });
      else res.status(403).json({ message: "not an instructor" });
    });
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.publish = async (req, res) => {
  try {
    const course_id = req.body.course_id;

    const [referral_code] = referralCodes.generate({
      length: 10,
      count: 1,
    });
    const courseData = await courses.findOne({
      where: {
        [Op.and]: [{ id: course_id }, { InstructorId: req.params.id }],
      },
    });
    const response = await courses.update(
      { published: true },
      { where: { id: course_id } }
    );
    const slug = courseData.slug;
    const referral_link = `http://localhost:5000/api/enroll/referral/${slug}/?referralCode=${referral_code}`;
    console.log(referral_link);
    const date = new Date();
    date.setHours(date.getHours() + 24);
    const addPromo = await courseData.createPromotion({
      referral_link: referral_link,
      referral_code: referral_code,
      expiresAt: date,
      InstructorId: courseData.InstructorId,
    });

    if (response == 1)
      return res.json({
        status: "success",
        message: "course published",
        data: addPromo,
      });
    else
      return res.json({
        status: "failed",
        message: "no record found",
      });
  } catch (error) {
    return res.status(400).json(error);
  }
};
exports.onboarding = async (req, res) => {
  try {
    const insId = req.params.id;
    const instructorData = await Instructor.findByPk(insId, {
      include: {
        model: user,
      },
    });
    //return res.json(instructorData.User.email)
    if (!instructorData.stripe_acc_id) {
      const account = await stripe.accounts.create({
        type: "standard",
      });
      console.log("ACCOUNT => ", account.id);
      instructorData.stripe_acc_id = account.id;
    }
    let accountLink = await stripe.accountLinks.create({
      account: instructorData.stripe_acc_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: "account_onboarding",
    });
    accountLink = Object.assign(accountLink, {
      "stripe_user[email]": instructorData.User.email,
    });
    const saveData = await instructorData.save();
    console.log(accountLink.url);

    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
  } catch (error) {
    return res.status(400).json(error);
  }
};
exports.getAccountStatus = async (req, res) => {
  try {
    const insId = req.params.id;
    const instructorData = await Instructor.findByPk(insId);
    const account = await stripe.accounts.retrieve(
      instructorData.stripe_acc_id
    );
    res.json(account);
  } catch (error) {
    res.json(error);
  }
};
exports.updateCourse = async (req, res) => {
  const   InstructorId = req.params.id;
  const CourseId = req.params.c_id;
  const updatedCourse = req.body;
  let new_image = "";

  try {
    if (req.file) {
      const imagename = req.file.originalname;
      const dUri = new Datauri();
      const dataUri = (req) =>
        dUri.format(path.extname(imagename).toString(), req.file.buffer);
      const file = dataUri(req).content;
      cloudinary.uploader
        .upload(file, { folder: "udemyUploads" })
        .then((result) => {
          updatedCourse.course_img = result.url;
          updatedCourse.course_img_name = result.public_id;
        })
        .then(async () => {
          const old_img_name = req.body.old_img_name;
         await cloudinary.uploader.destroy(old_img_name, function (result) {
            console.log(result);
          });
          await courses.update(updatedCourse,{where:{
            [Op.and]:[{id:CourseId},{InstructorId:InstructorId}]
          }})
         
          res.status(200).json({ message: "Course updated" });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await courses.update(updatedCourse,{where:{
        [Op.and]:[{id:CourseId},{InstructorId:InstructorId}]
      }})
         
      res.status(200).json({ message: "Course updated" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
exports.deleteCourse = async (req, res) => {
  const InstructorId = req.params.id;
  const CourseId = req.params.c_id;

       try{
           const result = await courses.findByPk(CourseId);
           await courses.destroy({
            where:{
              [Op.and]:[{id:CourseId},{InstructorId:InstructorId}]
            }
           })
           const old_img_name = result.course_img_name;
           
           cloudinary.uploader.destroy(old_img_name, function(result) { console.log(result) });
           res.status(200).json({message: 'Course deleted'});
       }catch(error)
       {
           res.status(404).json({message:error.message});
       }
};
