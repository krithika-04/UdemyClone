module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define("Course", {
      course_name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      price:{
        type:Sequelize.INTEGER,
        
      },
      paid:{
        type: Sequelize.BOOLEAN,
        defaultValue:true
      },
      slug:{
        type: Sequelize.STRING
      },
      published: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      course_img:{
        type:Sequelize.STRING
      },
      course_img_name:{
        type:Sequelize.STRING
      },
      rating:{
        //type:Sequelize.
      }
      //lesson add pannu
    });
  
    return Course;
  };