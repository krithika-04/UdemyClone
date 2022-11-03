module.exports = (sequelize, Sequelize) => {
    const Promotion = sequelize.define("Promotion", {
    referral_link:{
        type:Sequelize.STRING
    },
    expiresAt:{
        type:Sequelize.DATE,
    },
    referral_code:{
        type:Sequelize.STRING
    },
    
    });
  
    return Promotion;
  };