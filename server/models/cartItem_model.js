module.exports = (sequelize, Sequelize) => {
    const CartItem = sequelize.define("CartItem", {
      saveForLater:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      }
    });
  
    return CartItem;
  };