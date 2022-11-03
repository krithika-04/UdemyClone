module.exports = (sequelize, Sequelize) => {
    const Reply = sequelize.define("Reply", {
        description:{
            type:Sequelize.STRING
        },  
        upvotes:{
            type:Sequelize.INTEGER,
            defaultValue:0

        }  
    });
  
    return Reply;
  };