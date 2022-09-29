
module.exports = (sequelize, Sequelize) => {
    const Course_Cat = sequelize.define("Course_Cat", {
       category:{
        type:Sequelize.STRING,
        primaryKey: true,
        
       }
    });
  
    return Course_Cat;
  };