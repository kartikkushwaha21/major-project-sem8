require("dotenv").config()

const connect = require("../config/database")
const Category = require("../models/Category")
const Course = require("../models/Course")
const defaultCategories = require("../data/defaultCategories")
const { seedDefaultCategories } = require("../utils/seedDefaultData")
const { seedSampleCourses } = require("../utils/seedSampleData")

async function run() {
  try {
    await connect()
    await seedDefaultCategories()
    const sampleSeedResult = await seedSampleCourses()
    const totalCategories = await Category.countDocuments({
      name: { $in: defaultCategories.map((category) => category.name) },
    })
    const totalCourses = await Course.countDocuments({
      courseName: {
        $in: require("../data/sampleCourses").map((course) => course.courseName),
      },
    })

    console.log(
      `Database seeded successfully. Starter categories available: ${totalCategories}, sample courses available: ${totalCourses}, demo instructor: ${sampleSeedResult.instructorEmail}, demo student: ${sampleSeedResult.studentEmail}`
    )
    process.exit(0)
  } catch (error) {
    console.error("Database seed failed:", error)
    process.exit(1)
  }
}

run()
