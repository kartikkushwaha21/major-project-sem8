const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body
  const userId = req.user.id
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      // Find the course by its ID
      course = await Course.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId)
      if (course.studentsEnroled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
      }

      // Add the price of the course to the total amount
      total_amount += course.price
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
// exports.verifyPayment = async (req, res) => {
//   const courseID = req.body.courseID
//   console.log("VPB" + courseID)
//   const userId = req.user.id

//   if (!courseID || !userId) {
//     return res
//       .status(200)
//       .json({ success: false, message: `"Paymen Failed,${userId}` })
//   }

//   try {
//     await enrollStudents(courseID, userId, res)
//     return res.status(200).json({ success: true, message: "Payment Verified" })
//   } catch (err) {
//     console.log("eroor" + err)
//   }
// }
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courses,
    } = req.body;

    const userId = req.user.id;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      courses.length === 0
    ) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");
      
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Enroll the student into all courses
    for (const courseId of courses) {
      await enrollStudents(courseId, userId, res);
    }

    res.status(200).json({ success: true, message: "Payment Verified" });

  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ success: false, message: "Internal error during verification" });
  }
};

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  // const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// enroll the student in the courses
const enrollStudents = async (courseID, userId, res) => {
  if (!courseID || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  // for (const courseId of courses) {
  try {
    // Find the course and enroll the student in it
    const enrolledCourse = await Course.findOneAndUpdate(
      { _id: courseID },
      { $push: { studentsEnroled: userId } },
      { new: true }
    )

    if (!enrolledCourse) {
      return res.status(500).json({ success: false, error: "Course not found" })
    }
    console.log("Updated course: ", enrolledCourse)

    const courseProgress = await CourseProgress.create({
      courseID: courseID,
      userId: userId,
      completedVideos: [],
    })
    // Find the student and add the course to their list of enrolled courses
    const enrolledStudent = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          courses: courseID,
          courseProgress: courseProgress._id,
        },
      },
      { new: true }
    )

    console.log("Enrolled student: ", enrolledStudent)
    // Send an email notification to the enrolled student
    const emailResponse = await mailSender(
      enrolledStudent.email,
      `Successfully Enrolled into ${enrolledCourse.courseName}`,
      courseEnrollmentEmail(
        enrolledCourse.courseName,
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
      )
    )

    console.log("Email sent successfully: ", emailResponse.response)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, error: error.message })
  }
}
// }
