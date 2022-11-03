module.exports = (sequelize, Sequelize) => {
    const Instructor = sequelize.define("Instructor", {
    optedForDeals:{
      type:Sequelize.BOOLEAN,
      defaultValue:false
    },
    stripe_acc_id:{
      type:Sequelize.STRING
    },
    instructorRevenue:{
      type:Sequelize.FLOAT,
      defaultValue:0
    }
     
    });
  
    return Instructor;
  };