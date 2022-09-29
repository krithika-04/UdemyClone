module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define("Cart", {
      
//          course_id: {
//     type: Sequelize.STRING,
    
//     get() {
        
        
//      let arr=   this.getDataValue('course_id').toString().split(',')
//      var nums = arr.map(function(str) {
       

//         return parseInt(str); });
//     //console.log("hii : ",nums)
//         return nums
//     },
//     set(val) {
//         //console.log("hi : ",val)
//        this.setDataValue('course_id',val.join(','));
//     },
// }
//       ,
     
    
//       user_id: {
//         type: Sequelize.INTEGER,
//         references: {
//           model: 'Users',
//           key: 'id'
//         }
//     }
    });
  
    return Cart;
  };