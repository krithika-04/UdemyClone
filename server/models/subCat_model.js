module.exports = (sequelize, Sequelize) => {
    const SubCat = sequelize.define("SubCat", {
       category:{
        type:Sequelize.STRING
       }, slug:{
         type:Sequelize.STRING
       }
    },
    { timestamps: false });
  
    return SubCat;
  };