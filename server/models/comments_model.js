module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("Comment", {
   
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    upvotes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
   
  });

  return Comment;
};
