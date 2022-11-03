const { promotion } = require("../helper/db");
const db = require("../helper/db");
const students = db.student;
const courses = db.course;
const users = db.user;
const instructors = db.instructor;
const promotions = db.promotion;
const Op = db.Sequelize.Op;
const stripe = require("stripe")(process.env.STRIPE_SECRET);
exports.enrollAcourse = async (req, res) => {
  try {
    const stuData = await students.findOne({
      where: { UserId: req.params.id },
    });
    if (stuData == null) {
      return res.json({
        status: "failed",
        message: "not a student",
      });
    }
    //console.log(req.body.course_id)
    const courseData = await courses.findByPk(req.body.course_id);
    // return res.json(courseData)

    if (courseData.price != 0) {
      const price = courseData.price;
      const ins_amt = Number(
        ((price * process.env.INSTRUCTOR_PER) / 100).toFixed(2)
      );

      const owner_amt = courseData.price - ins_amt;
      console.log(ins_amt, owner_amt);
      const instructorData = await instructors.findByPk(
        courseData.InstructorId
      );

      const payment_type = req.body.type;
      if (payment_type == "card") {
        card = {
          number: req.body.accno,
          exp_month: req.body.exp_month,
          exp_year: req.body.exp_year,
        };
      }
      try {
        paymentDetails = await payment(
          owner_amt,
          courseData.course_name
        );
      //  return res.json(paymentDetails);
        if (paymentDetails.statusCode >= 400 || paymentDetails == {}) {
          return res.json(paymentDetails);
          return res.json({
            status: "failed",
            message: "error occured during payment",
          });
          // return  res.status(400).json(error)
        }
        const paymentToins = await instructorData.createInstructorPayment({
          CourseId: courseData.id,
          amount: ins_amt,
          SessionId: paymentDetails.id,
        });
        const prevRev = instructorData.instructorRevenue;
        const currRev = prevRev + ins_amt;
        const updateRev = await instructors.update(
          { instructorRevenue: currRev },
          {
            where: { id: instructorData.id },
          }
        );
      } catch (error) {
        return console.log(error);
      }
    }
    const enrollData = {
      CourseId: req.body.course_id,
      enrolledViaReferal: false,
    };
    const enrollCourse = await stuData.createEnroll(enrollData);
    return res.json({
      enrollData: enrollCourse,
      paymentDetails: paymentDetails,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};
exports.enrollViaReferral = async (req, res) => {
  try {
    console.log(req.body.user_id);
    // console.log(req)
    const stuData = await students.findOne({
      where: { UserId: req.body.user_id },
    });
    if (stuData == null) {
      return res.json({
        status: "failed",
        message: "not a student",
      });
    }
    const slug = req.params.slug;
    const referralCode = req.query.referralCode;
    const courseData = await courses.findOne({ where: { slug: slug } });
    const promotionData = await promotions.findOne({
      where: { referral_code: referralCode },
    });
    const expiresAt = promotionData.expiresAt;
    const today = new Date();
    //console.log(expiresAt, today);
    if (expiresAt < today) {
      return res.json({
        status: "failed",
        message: "referral code has been expired",
      });
    }
    if (courseData.price != 0) {
      const price = courseData.price;
      const ins_amt = Number(
        ((price * process.env.REF_INSTRUCTOR) / 100).toFixed(2)
      );
      const owner_amt = courseData.price - ins_amt;
      const instructorData = await instructors.findByPk(
        courseData.InstructorId
      );
      const paymentToins = await instructorData.createInstructorPayment({
        CourseId: courseData.id,
        amount: ins_amt,
      });
      const prevRev = instructorData.instructorRevenue;
      const currRev = prevRev + ins_amt;
      const updateRev = await instructors.update(
        { instructorRevenue: currRev },
        {
          where: { id: instructorData.id },
        }
      );
      const payment_type = req.body.type;
      if (payment_type == "card") {
        card = {
          number: req.body.accno,
          exp_month: req.body.exp_month,
          exp_year: req.body.exp_year,
        };
      }
      try {
        paymentDetails = await payment(
          owner_amt,
          courseData.course_name
        );
        console.log(paymentDetails);
        return;
        if (paymentDetails.susCode >= 400) {
          return res.json(paymentDetails);
          return res.json({
            status: "failed",
            message: "error occured during payment",
          });
          // return  res.status(400).json(error)
        }
      } catch (error) {
        return console.log(error);
      }
    }
    const enrollData = {
      CourseId: courseData.id,
      enrolledViaReferal: true,
    };

    const enrollCourse = await stuData.createEnroll(enrollData);
    return res.json({
      enrollData: enrollCourse,
      paymentDetails: paymentDetails,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const payment = async ( price, c_name) => {
  try {
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "inr",
            unit_amount: price * 100,
            product_data: {
              name: c_name,
            },
          },
        },
      ],

      mode: "payment",
      success_url:
        `${process.env.STRIPE_SUCCESS}/order/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.STRIPE_FAILIURE,
    });
    console.log("session => ", session);
    return session;
    // let paymentMethod = await stripe.paymentMethods.create({
    //   type: "card",
    //   card: {
    //     number: card.number,
    //     exp_month: card.exp_month,
    //     exp_year: card.exp_year,
    //   },
    //   // card:{...card}
    // });
    // const paymentIntent = await stripe.paymentIntents.create({
    //   payment_method: paymentMethod.id,
    //   amount: price * 100,
    //   currency: "inr",
    //   confirm: true,
    //   payment_method_types: ["card"],
    // });
    // return paymentIntent;
  } catch (error) {
    return error;
  }
};
exports.paymentStatus = async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  console.log(session.status);
  // const customer = await stripe.customers.retrieve(session.customer);
  if (session.status == "complete")
    res.send(
      `<html><body><h1>Thanks for your order, ${session.customer_details.name}!</h1></body></html>`
    );
};
