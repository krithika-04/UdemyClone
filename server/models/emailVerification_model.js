module.exports = (sequelize, Sequelize) => {
    const EmailVerification = sequelize.define("EmailVerification", {
        otp:{
            type:Sequelize.STRING
        },
        expiresAt:{
            type:Sequelize.DATE,
        }
    });
  
    return EmailVerification;
  };