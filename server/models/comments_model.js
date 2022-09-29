module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("Comment", {
   
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    // reply: {
    //   type: Sequelize.STRING,
    //   defaultValue: "",
    //   get() {
    //     //console.log("hello")
    //     let arr = this.getDataValue("reply").toString().split(",");
    //     var nums = arr.map(function (str) {
    //       return parseInt(str);
    //     });
    //     //console.log("hii : ",nums)
    //     return nums;
    //   },
    //   set(val) {
    //     console.log("hi : ", val);
    //     this.setDataValue("reply", val.join(","));
    //   },
    // },

    
    // REPLY add pannu
    upvotes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
   
  });

  return Comment;
};
