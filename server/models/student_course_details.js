module.exports = (sequelize, Sequelize) => {
    const Student_course_details = sequelize.define("Student_course_details", {
      progress :{
        type:Sequelize.STRING
      },
      rating:{
        type:Sequelize.INTEGER
      },
      review:{
        type:Sequelize.STRING
      }
       
    });
  
    return Student_course_details;
  };