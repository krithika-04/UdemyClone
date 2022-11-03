module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define("Cart", {
      total:{
        type:Sequelize.INTEGER,
        defaultValue:0
      }
    });
  
    return Cart;
  };