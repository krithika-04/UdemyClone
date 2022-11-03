module.exports = (sequelize, Sequelize) => {
  const instructorPayment = sequelize.define("instructorPayment", {
    amount:{
      type:Sequelize.FLOAT
    },
    SessionId:{
      type:Sequelize.STRING
    }
  });

  return instructorPayment;
};
