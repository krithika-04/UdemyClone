module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("Review", {
      description:{
        type:Sequelize.STRING
      },
      rating:{
        type:Sequelize.INTEGER
      }
    });
  
    return Review;
  };