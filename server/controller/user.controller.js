const db = require("../helper/db");
const user = db.user;
const Student = db.student;
const Instructor = db.instructor;
const EmailVerification = db.emailVerifaction;
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

require("dotenv").config();
const key = process.env.secret;

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.mailid,
    pass: "black&white12",
  },
});
const tokenList = {};
exports.register = async (req, res) => {
  try {
    const user_data = req.body;
    // Check for the unique Username

    const chk_uname = await user.findOne({
      where: { username: user_data.username },
    });

    const chk_email = await user.findOne({
      where: { email: user_data.email },
    });

    if (chk_uname) {
      return res.status(202).json({
        msg: "Username is already taken.",
        success: false,
      });
    }

    // Check for the Unique Email
    else if (chk_email) {
      return res.status(202).json({
        msg: "Email is already registered. Did you forgot your password.",
        success: false,
      });
    }
   
  

    // The data is valid and new we can register the user

    //Hash pass
    const salt = await bcrypt.genSaltSync(10);
    const password = await req.body.password;

    await bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      user_data.password = hash;
      user
        .create(user_data)
        .then(async (data) => {
          const dataObj = {
            id: data.id,
            email: data.email,
          };
          sendOtpVerification(dataObj, res);
          if (data.user_type == "S") {
            data.createStudent(Student);
          } else if (data.user_type == "I") {
            data.createInstructor(Instructor);
          }
          
        })
        .catch((err) => {
          console.log("Error:", err);
        });
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//login
exports.login = async (req, res) => {
  try {
    console.log(process.env.secret)
    await user
      .findOne({
        where: { email: req.body.email },
      })
      .then((user) => {
      // return res.json(user)
        if (!user) {
          return res.status(202).json({
            msg: "Email is not found.",
            success: false,
          });
        }
        // If there is user we are now going to compare the password
        bcrypt.compare(req.body.password, user.password).then((isMatch) => {
          if (isMatch) {
            // User's password is correct and we need to send the JSON Token for that user
            const payload = {
              id: user.id,
              username: user.username,
              f_name: user.f_name,
              l_name: user.l_name,
              email: user.email,
            };

            const token = jwt.sign(payload, key, {
              expiresIn: 604800,
            });
            const refreshToken = jwt.sign(payload, key, {
              expiresIn: process.env.refreshTokenLife,
            });
            const response = {
              success: true,
              status: "Logged in",
              token: `Bearer ${token}`,
              user: user,
              refreshToken: `Bearer ${refreshToken}`,
              msg: "Hurry! You are now logged in.",
            };
            tokenList[`Bearer ${refreshToken}`] = response;
            console.log(tokenList);
            res.cookie(
              "token",
              token
              //,{httpOnly:true}
            );
            res.status(200).json(response);
          } else {
            return res.status(202).json({
              msg: "Incorrect password.",
              success: false,
            });
          }
        });
      });
  } catch (error) {
    // console.log("hey")
    res.status(404).json({ message: error.message });
  }
};
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.json({ message: "user signed out successfully" });
  } catch (error) {}
};
exports.currentUser = async (req, res) => {
  try {
    const user_data = await user.findByPk(req.body.user_id, {
      attributes: { exclude: ["password"] },
    });
    console.log("user data: ", user_data);
    return res.json(user_data);
  } catch (error) {
    console.log("Error:", error);
  }
};

const sendOtpVerification = async ({ id, email }, res) => {
  try {
    console.log("hey");
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const options = {
      from: process.env.mailid,
      to: email,
      subject: "Verify your email",
      text: `${otp} is the otp to verify your email.  Note: The otp expires in 1 hour`,
    };
    const saltrounds = 10;
    const hashedotp = await bcrypt.hash(otp, saltrounds);
    const date = new Date();
    date.setHours(date.getHours() + 1);
    console.log(date);
    const verifiData = {
      user_id: id,
      otp: hashedotp,
      expiresAt: date,
    };
    console.log(verifiData);
    const response = await EmailVerification.create(verifiData);
    console.log(verifiData);
    await transporter.sendMail(options);
    return res.json({
      status: "PENDING",
      message: "verification for otp is sent to your mail id",
      data: {
        user_id: id,
        email: email,
      },
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    let { user_id, otp } = req.body;
    if (!user_id || !otp) throw new Error("Otp details are empty");
    else {
      const verifiDetails = await EmailVerification.findOne({
        where: { user_id: user_id },
      });
      if (verifiDetails == null) {
        //no records
        throw new Error(
          "Your account details doesn't or have been verified already.Please sign up or login"
        );
      } else {
        const { expiresAt } = verifiDetails;
        const hashedotp = verifiDetails.otp;
        const today = new Date();
        console.log(expiresAt, today);
        if (expiresAt < today) {
          //otp expired
          await EmailVerification.destroy({ where: { user_id: user_id } });
          throw new Error("Your otp expired please request again");
        } else {
          console.log(hashedotp);
          const validotp = await bcrypt.compare(otp, hashedotp);
          if (!validotp) throw new Error("Invalid otp");
          else {
            //sucess
            console.log("hey");
            await user.update({ verified: true }, { where: { id: user_id } });
            await EmailVerification.destroy({ where: { user_id: user_id } });
            return res.json({
              status: "SUCCESS",
              message: "otp verifed succesfully",
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};
exports.resendOtp = async (req, res) => {
  try {
    let { user_id, email } = req.body;
    if (!user_id || !email) throw new Error("Otp details are empty");
    else {
      //delete existing record and resnd
      await EmailVerification.destroy({ where: { user_id: user_id } });
      sendOtpVerification({ id: user_id, email }, res);
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};
exports.forgotPass = async (req, res) => {
  try {
    const userMail = req.body.email;

    const user_data = await user.findOne({
      where: { email: userMail },
    });
    console.log(user_data == null);
    //chk user exist or not
    if (user_data == null) {
      
      return res.status(202).json({
        msg: "Email not registred.Please register to continue",
        success: false,
      });
    } //user exist and create one time link valid for 15 mins
    else {
     
      const fp_secret = key + user_data.password;
      const payload = {
        email: user_data.email,
        id: user_data.id,
      };
      // res.json(user_data.email)
      const token = jwt.sign(payload, fp_secret, { expiresIn: "15m" });
      const link = `http://localhost:5000/api/user/resetPassword/${user_data.id}/${token}`;
      console.log(link);
      const options = {
        from: process.env.mailid,
        to: user_data.email,
        subject: "Password reset request",
        text: `Password reset request has been initiated please click the link to reset  ${link}.   Note: The will be active for only 15 mins`,
      };
      transporter.sendMail(options, function (err, info) {
        if (err) {
          console.log(err);
          return res.status(400).json({
            msg: "Link expired",
            success: false,
          });
          // return;
        }
        return res.status(200).json({
          msg: "Password reset link has been sent to your email",
          success: true,
        });
      });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
exports.reset = async (req, res) => {
  try {
    const { id, token } = req.params;
    const user_data = await user.findByPk(id);
    const secret = key + user_data.password;
    try {
      const payload = jwt.verify(token, secret);
      res.send(200).json({
        id: id,
        token: token,
        email: user_data.email,
      });
    } catch (error) {
      console.log(error.message);
      res.send(404).json({ message: error.message });
    }
    //check
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
exports.resetPass = async (req, res) => {
  try {
    const { id, token } = req.params;
    var password = req.body.password;
    //  var c_password = req.body.c_password;
    const user_data = await user.findByPk(id);

    const secret = key + user_data.password;
    try {
      const payload = jwt.verify(token, secret);

      const salt = await bcrypt.genSaltSync(10);
      await bcrypt.hash(password, salt, async (err, hash) => {
        if (err) throw err;

        password = hash;
        const update = await user.update(
          { password: password },
          { where: { id: id } }
        );
        console.log(update);
        return res.status(200).json({
          msg: "Password reset successfull",
          success: true,
        });
      });
      
    } catch (error) {
      console.log(error.message);
      res.status(404).json({ message: error.message });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
exports.changeToIns = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    await user.update({ user_type: "B" }, { where: { id: user_id } });
    const data = await user.findByPk(user_id);
    data.createInstructor(Instructor);
    res.json({
      status: "success",
      message: "user changed to instructor",
    });
  } catch (error) {
    console.log("Error:", error);
  }
};
