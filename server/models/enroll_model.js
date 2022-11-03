module.exports = (sequelize, Sequelize) => {
  const queryInterface = sequelize.getQueryInterface();
    const Enroll = sequelize.define("Enroll", {
    progress:{
      type:Sequelize.INTEGER,
      defaultValue:0
    },
    enrolledViaReferal:{
      type:Sequelize.BOOLEAN
    }
    },
    {
      indexes:[
        {
          fields:['StudentId','CourseId'],
          unique:true
        }
      ]
    },
    
    )
  
    return Enroll;
  };