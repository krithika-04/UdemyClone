module.exports = (sequelize, Sequelize) => {
    const Student_course_details = sequelize.define("Student_course_details", {
      progress :{
        type:Sequelize.STRING
      },
      rating:{
        type:Sequelize.ENUM(1,2,3,4,5)
      },
      review:{
        type:Sequelize.STRING
      }
       
    });
  
    return Student_course_details;
  };