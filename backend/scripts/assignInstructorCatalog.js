require("dotenv").config()

const connect = require("../config/database")
require("../models/Category")
const Course = require("../models/Course")
const User = require("../models/User")

const TARGET_INSTRUCTOR = {
  email: "kkartikchauhan514@gmail.com",
  firstName: "Nihkil",
  lastName: "Gill",
}

const TARGET_CATEGORIES = [
  "Web Development",
  "Data Science",
  "DevOps & Cloud",
]

const TARGET_PRICE_OVERRIDES = {
  "Full Stack Web Development Bootcamp": 1499,
  "JavaScript Essentials": 499,
  "React Frontend Development": 999,
  "SQL and Database Fundamentals": 799,
  "DBMS Fundamentals": 699,
  "DevOps and Cloud Essentials": 1299,
}

async function recalculateInstructorStats(instructorId) {
  const courses = await Course.find({ instructor: instructorId }).select(
    "price studentsEnroled"
  )

  const summary = courses.reduce(
    (acc, course) => {
      const enrolledCount = course.studentsEnroled?.length || 0
      acc.totalEarnings += Number(course.price || 0) * enrolledCount
      acc.totalStudentsTaught += enrolledCount
      return acc
    },
    { totalEarnings: 0, totalStudentsTaught: 0 }
  )

  await User.findByIdAndUpdate(instructorId, summary)
}

async function run() {
  try {
    await connect()

    const instructor = await User.findOne({
      email: TARGET_INSTRUCTOR.email,
    })

    if (!instructor) {
      throw new Error(
        `No user found with email ${TARGET_INSTRUCTOR.email}. Please sign up this instructor first.`
      )
    }

    const matchingCourses = await Course.find()
      .populate("category", "name")
      .select("courseName instructor category")

    const coursesToAssign = matchingCourses.filter((course) =>
      TARGET_CATEGORIES.includes(course.category?.name)
    )

    if (coursesToAssign.length === 0) {
      throw new Error(
        `No courses found in categories: ${TARGET_CATEGORIES.join(", ")}`
      )
    }

    const affectedInstructorIds = new Set([String(instructor._id)])

    for (const course of coursesToAssign) {
      if (course.instructor) {
        affectedInstructorIds.add(String(course.instructor))
      }
    }

    await User.findByIdAndUpdate(instructor._id, {
      firstName: TARGET_INSTRUCTOR.firstName,
      lastName: TARGET_INSTRUCTOR.lastName,
      accountType: "Instructor",
      approved: true,
    })

    const assignedCourseIds = coursesToAssign.map((course) => course._id)

    await User.updateMany(
      { courses: { $in: assignedCourseIds } },
      { $pull: { courses: { $in: assignedCourseIds } } }
    )

    for (const course of coursesToAssign) {
      await Course.findByIdAndUpdate(course._id, {
        $set: {
          instructor: instructor._id,
          status: "Published",
          ...(TARGET_PRICE_OVERRIDES[course.courseName]
            ? { price: TARGET_PRICE_OVERRIDES[course.courseName] }
            : {}),
        },
      })
    }

    await User.findByIdAndUpdate(instructor._id, {
      $addToSet: { courses: { $each: assignedCourseIds } },
    })

    for (const instructorId of affectedInstructorIds) {
      await recalculateInstructorStats(instructorId)
    }

    console.log(
      `Assigned ${assignedCourseIds.length} catalog courses to ${TARGET_INSTRUCTOR.firstName} ${TARGET_INSTRUCTOR.lastName} (${TARGET_INSTRUCTOR.email}).`
    )
    console.log(
      `Categories included: ${TARGET_CATEGORIES.join(", ")}.`
    )
    process.exit(0)
  } catch (error) {
    console.error("Instructor catalog assignment failed:", error.message)
    process.exit(1)
  }
}

run()
