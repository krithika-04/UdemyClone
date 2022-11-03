module.exports = (sequelize, Sequelize) => {
    const Course_Cat = sequelize.define("Course_Cat", {
       category:{
        type:Sequelize.STRING
       },
       slug:{
         type:Sequelize.STRING
       }
    },
    { timestamps: false });
  
    return Course_Cat;
  };