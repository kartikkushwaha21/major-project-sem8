const {
  getRazorpayInstance,
  getRazorpayConfigError,
  getRazorpayKeyId,
  isDemoPaymentEnabled,
} = require("../config/razorpay")
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
const Payment = require("../models/Payment")

const ensureRazorpayConfigured = (res) => {
  const configError = getRazorpayConfigError()

  if (!configError) {
    return true
  }

  res.status(500).json({
    success: false,
    message: configError,
  })
  return false
}

const normalizeCourseIds = (courses = []) => [...new Set(courses.map(String))]

const resolveCourseInstructor = async (course) => {
  if (course?.instructor) {
    const directInstructor = await User.findById(course.instructor).select(
      "_id accountType courses"
    )

    if (directInstructor?.accountType === "Instructor") {
      return directInstructor
    }
  }

  const fallbackInstructor = await User.findOne({
    accountType: "Instructor",
    courses: course._id,
  }).select("_id accountType courses")

  return fallbackInstructor
}

const getPaymentDetailsForCourses = async (courses, userId) => {
  const normalizedCourseIds = normalizeCourseIds(courses)

  if (normalizedCourseIds.length === 0) {
    const error = new Error("Please Provide Course ID")
    error.statusCode = 400
    throw error
  }

  const uid = new mongoose.Types.ObjectId(userId)
  const selectedCourses = []
  let totalAmount = 0

  for (const courseId of normalizedCourseIds) {
    const course = await Course.findById(courseId).select(
      "_id courseName price studentsEnroled instructor"
    )

    if (!course) {
      const error = new Error("Could not find the Course")
      error.statusCode = 404
      throw error
    }

    const alreadyEnrolled = course.studentsEnroled.some(
      (studentId) => studentId.toString() === uid.toString()
    )

    if (alreadyEnrolled) {
      const error = new Error(`Student is already Enrolled in ${course.courseName}`)
      error.statusCode = 409
      throw error
    }

    totalAmount += course.price
    selectedCourses.push(course)
  }

  return {
    totalAmount,
    selectedCourses,
    normalizedCourseIds,
  }
}

const verifyOrderNotes = (order, userId, expectedCourseIds) => {
  const orderNotes = order?.notes || {}
  const noteUserId = orderNotes.userId ? String(orderNotes.userId) : null
  const noteCourseIds = orderNotes.courseIds
    ? String(orderNotes.courseIds)
        .split(",")
        .map((courseId) => courseId.trim())
        .filter(Boolean)
        .sort()
    : []

  const sortedExpectedCourseIds = [...expectedCourseIds].sort()

  return (
    noteUserId === String(userId) &&
    noteCourseIds.length === sortedExpectedCourseIds.length &&
    noteCourseIds.every((courseId, index) => courseId === sortedExpectedCourseIds[index])
  )
}

const createDemoPaymentId = (prefix) =>
  `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`

exports.capturePayment = async (req, res) => {
  const demoPaymentEnabled = isDemoPaymentEnabled()

  if (!demoPaymentEnabled && !ensureRazorpayConfigured(res)) {
    return
  }

  const { courses } = req.body
  const userId = req.user.id

  try {
    const { totalAmount, normalizedCourseIds } = await getPaymentDetailsForCourses(
      courses,
      userId
    )

    if (demoPaymentEnabled) {
      const demoOrderId = createDemoPaymentId("order")

      await Payment.findOneAndUpdate(
        { orderId: demoOrderId },
        {
          user: userId,
          courses: normalizedCourseIds,
          orderId: demoOrderId,
          receipt: `receipt_${Date.now()}`,
          amount: totalAmount,
          currency: "INR",
          status: "created",
          provider: "razorpay",
          rawOrder: {
            id: demoOrderId,
            amount: totalAmount,
            currency: "INR",
            notes: {
              userId: String(userId),
              courseIds: normalizedCourseIds.join(","),
            },
            demoMode: true,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      )

      return res.json({
        success: true,
        data: {
          id: demoOrderId,
          amount: totalAmount,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          demoMode: true,
          key: null,
        },
      })
    }

    const razorpayInstance = getRazorpayInstance()

    if (!razorpayInstance) {
      return res.status(500).json({
        success: false,
        message: getRazorpayConfigError(),
      })
    }

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
      notes: {
        userId: String(userId),
        courseIds: normalizedCourseIds.join(","),
      },
    }

    const paymentResponse = await razorpayInstance.orders.create(options)

    await Payment.findOneAndUpdate(
      { orderId: paymentResponse.id },
      {
        user: userId,
        courses: normalizedCourseIds,
        orderId: paymentResponse.id,
        receipt: paymentResponse.receipt,
        amount: paymentResponse.amount / 100,
        currency: paymentResponse.currency,
        status: "created",
        rawOrder: paymentResponse,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    )

    res.json({
      success: true,
      data: {
        ...paymentResponse,
        key: getRazorpayKeyId(),
      },
    })
  } catch (error) {
    const statusCode = error.statusCode || 500
    res
      .status(statusCode)
      .json({ success: false, message: error.message || "Could not initiate order." })
  }
}

exports.verifyPayment = async (req, res) => {
  try {
    const demoPaymentEnabled = isDemoPaymentEnabled()

    if (!demoPaymentEnabled && !ensureRazorpayConfigured(res)) {
      return
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courses,
    } = req.body

    const userId = req.user.id

    if (!razorpay_order_id || !courses || courses.length === 0) {
      return res.status(400).json({ success: false, message: "Missing fields" })
    }

    const { totalAmount, selectedCourses, normalizedCourseIds } =
      await getPaymentDetailsForCourses(courses, userId)

    const instructorAllocations = []

    for (const course of selectedCourses) {
      const instructor = await resolveCourseInstructor(course)

      if (!instructor?._id) {
        return res.status(400).json({
          success: false,
          message: `Could not determine instructor for ${course.courseName}`,
        })
      }

      instructorAllocations.push({
        instructor: instructor._id,
        course: course._id,
        amount: Number(course.price || 0),
      })
    }

    let payment = null
    let order = null

    if (demoPaymentEnabled) {
      payment = {
        id: razorpay_payment_id || createDemoPaymentId("payment"),
        order_id: razorpay_order_id,
        amount: totalAmount * 100,
        currency: "INR",
        status: "captured",
        method: "upi",
        demoMode: true,
      }
      order = {
        id: razorpay_order_id,
        amount: totalAmount * 100,
        currency: "INR",
        notes: {
          userId: String(userId),
          courseIds: normalizedCourseIds.join(","),
        },
        demoMode: true,
      }
    } else {
      if (!razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: "Missing fields" })
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex")

      if (expectedSignature !== razorpay_signature) {
        return res
          .status(400)
          .json({ success: false, message: "Payment verification failed" })
      }

      const razorpayInstance = getRazorpayInstance()

      if (!razorpayInstance) {
        return res.status(500).json({
          success: false,
          message: getRazorpayConfigError(),
        })
      }

      ;[payment, order] = await Promise.all([
        razorpayInstance.payments.fetch(razorpay_payment_id),
        razorpayInstance.orders.fetch(razorpay_order_id),
      ])

      if (!payment || !order) {
        return res
          .status(400)
          .json({ success: false, message: "Could not validate Razorpay payment" })
      }

      const validPaymentStatuses = ["authorized", "captured"]
      const expectedAmountInPaise = totalAmount * 100

      if (
        payment.order_id !== razorpay_order_id ||
        order.id !== razorpay_order_id ||
        payment.amount !== expectedAmountInPaise ||
        order.amount !== expectedAmountInPaise ||
        payment.currency !== "INR" ||
        order.currency !== "INR" ||
        !validPaymentStatuses.includes(payment.status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Payment details do not match the selected courses",
        })
      }

      if (!verifyOrderNotes(order, userId, normalizedCourseIds)) {
        return res.status(400).json({
          success: false,
          message: "Order details do not match this user or course selection",
        })
      }
    }

    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        user: userId,
        courses: normalizedCourseIds,
        paymentId: razorpay_payment_id || payment.id,
        signature: razorpay_signature || "signature",
        amount: totalAmount,
        currency: "INR",
        status: "verified",
        instructorAllocations,
        provider: "razorpay",
        rawOrder: order,
        rawPayment: payment,
        verifiedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    )

    for (const course of selectedCourses) {
      await enrollStudents(course, userId)
    }

    return res.status(200).json({ success: true, message: "Payment Verified" })
  } catch (err) {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Internal error during verification",
    })
  }
}

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body
  const userId = req.user.id

  if (!userId || !orderId || !paymentId || !amount) {
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
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount,
        orderId,
        paymentId
      )
    )

    return res.status(200).json({
      success: true,
      message: "Payment success email sent",
    })
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

const enrollStudents = async (course, userId) => {
  const courseID = course?._id || course

  if (!courseID || !userId) {
    const error = new Error("Please Provide Course ID and User ID")
    error.statusCode = 400
    throw error
  }

  const existingCourse = await Course.findById(courseID).select(
    "_id courseName studentsEnroled instructor price"
  )

  if (!existingCourse) {
    const error = new Error("Course not found")
    error.statusCode = 404
    throw error
  }

  const resolvedInstructor = await resolveCourseInstructor(existingCourse)

  if (!resolvedInstructor?._id) {
    const error = new Error("Instructor not found for this course")
    error.statusCode = 404
    throw error
  }

  const alreadyEnrolled = existingCourse.studentsEnroled.some(
    (studentId) => studentId.toString() === String(userId)
  )

  if (!alreadyEnrolled) {
    await Course.findByIdAndUpdate(
      courseID,
      {
        $addToSet: { studentsEnroled: userId },
        $inc: { sold: 1 },
      },
      { new: true }
    )

    await User.findByIdAndUpdate(
      resolvedInstructor._id,
      {
        $inc: {
          totalEarnings: Number(existingCourse.price || 0),
          totalStudentsTaught: 1,
        },
      },
      { new: true }
    )

    if (String(existingCourse.instructor) !== String(resolvedInstructor._id)) {
      await Course.findByIdAndUpdate(courseID, {
        $set: { instructor: resolvedInstructor._id },
      })
    }
  }

  let courseProgress = await CourseProgress.findOne({
    courseID,
    userId,
  })

  if (!courseProgress) {
    courseProgress = await CourseProgress.create({
      courseID,
      userId,
      completedVideos: [],
    })
  }

  const enrolledStudent = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: {
        courses: courseID,
        courseProgress: courseProgress._id,
      },
    },
    { new: true }
  )

  if (!enrolledStudent) {
    const error = new Error("Student not found")
    error.statusCode = 404
    throw error
  }

  await mailSender(
    enrolledStudent.email,
    `Successfully Enrolled into ${existingCourse.courseName}`,
    courseEnrollmentEmail(
      existingCourse.courseName,
      `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
    )
  )
}
