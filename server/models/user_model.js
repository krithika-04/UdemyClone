module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    f_name: {
      type: Sequelize.STRING,
    },
    l_name: {
      type: Sequelize.STRING,
    },
    user_type: {
      type: Sequelize.ENUM("S", "I", "B"),
    },
    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    //user_profile
  });

  return User;
};
