

module.exports = (sequelize, Sequelize) => {
    const Lesson = sequelize.define("Lesson", {
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      video_name:{
        type:Sequelize.STRING
      },
     video_link:{
        type:Sequelize.STRING
      },
      free_preview:{
        type: Sequelize.BOOLEAN
      },
      
    
    });
  
    return Lesson;
  };