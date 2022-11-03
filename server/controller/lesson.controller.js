const db = require("../helper/db");
const lessons = db.lesson;
const course = db.course;
const Op = db.Sequelize.Op;
const path = require("path");
const Datauri = require("datauri/parser");
const cloudinary = require("cloudinary").v2;
exports.create = (req, res) => {
  const lesson = req.body;

  // const imagename = req.file.filename;

  try {
    if (req.file) {
      const dUri = new Datauri();
      const imagename = req.file.originalname;
      console.log(imagename);
      const dataUri = (req) =>
        dUri.format(path.extname(imagename).toString(), req.file.buffer);
      const file = dataUri(req).content;
      console.log(imagename);
      const options ={ folder: "udemyUploads", resource_type: "video",
      eager: [
        {streaming_profile: "auto", format: "m3u8"}],                                   
      eager_async: true,
      chunk_size: 6000000 }
      // for videos add near folder resource_type: "video",
      cloudinary.uploader
      .upload_large(file,options )
        .then((result) => {
      // return res.json(result.eager[0].url)
          lesson.video_link = result.eager[0].url;
          console.log(result.eager.url);
          lesson.video_name = result.public_id;
        })
        .then(() => {
          // course.instructor_id=req.body.user_id;

          console.log(lesson);
          lessons.create(lesson).then(async (data) => {
            const courseDetails= await course.findByPk(lesson.course_id)
          await  courseDetails.addLesson(data)
            res.status(201).json({ message: "lesson created" });
          });
        })
        .catch((err) => {
          console.log("hello");
          console.log("error:", err);
        });
    }
  } catch (error) {
    res.status(400).json({ message1: error.message });
  }
};
exports.fetchAllLessonsbyId = async (req, res) => {
  try {
    const lesson = await lessons.findAll({
      
      where: { CourseId: req.params.c_id },
    });
    res.json(lesson);
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.fetchSingleLesson = async (req, res) => {
  try {
    const lesson = await lessons.findOne({ where: { id: req.params.l_id } });
    res.json(lesson);
  } catch (error) {
    console.log("Error:", error);
  }
};
exports.updateLesson = async (req, res) => {
  
  const LessonId = req.params.l_id;
  const updatedLesson = req.body;
  let new_video = "";

  try {
    if (req.file) {
      console.log("hello123")
      const videoname = req.file.originalname;
      const dUri = new Datauri();
      const dataUri = (req) =>
        dUri.format(path.extname(videoname).toString(), req.file.buffer);
      const file = dataUri(req).content;
      const options ={ folder: "udemyUploads", resource_type: "video",
      eager: [
        {streaming_profile: "auto", format: "m3u8"}],                                   
      eager_async: true,
      chunk_size: 6000000 }
      cloudinary.uploader
        .upload_large(file, options)
        .then((result) => {
         // return res.json(result)
          updatedLesson.video_link = result.eager[0].url;
          updatedLesson.video_name = result.public_id;
        })
        .then(async () => {
          const old_video_name = req.body.old_video_name;
         await cloudinary.uploader.destroy(old_video_name, {resource_type: 'video'}
          );
          await lessons.update(updatedLesson,{where:{
            id:LessonId
          }})
         
          res.status(200).json({ message: "Lesson updated" });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("hrnj")
      await lessons.update(updatedLesson,{where:{id:LessonId}})
         
      res.status(200).json({ message: "Lesson updated" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
exports.deleteLesson = async (req, res) => {

  const LessonId = req.params.l_id;

       try{
           const result = await lessons.findByPk(LessonId);
         //  return res.json(result)
           await lessons.destroy({
            where:{
              id:LessonId
           }})
           const old_video_name = result.video_name;
           console.log(old_video_name)
          await cloudinary.uploader.destroy(old_video_name,  {resource_type: 'video'});
           res.status(200).json({message: 'Lesson deleted'});
       }catch(error)
       {
           res.status(404).json({message:error.message});
       }
};
