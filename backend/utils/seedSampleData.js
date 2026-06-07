const bcrypt = require("bcryptjs")

const Category = require("../models/Category")
const Course = require("../models/Course")
const Profile = require("../models/Profile")
const RatingAndReview = require("../models/RatingandReview")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const User = require("../models/User")
const sampleCourses = require("../data/sampleCourses")

const instructorOverridesByCategory = {
  "Web Development": {
    firstName: "Nihkil",
    lastName: "Gill",
    email: "kkartikchauhan514@gmail.com",
    accountType: "Instructor",
    password: "Instructor123",
    about: "Instructor account for web, data, and cloud catalog courses.",
  },
  "Data Science": {
    firstName: "Nihkil",
    lastName: "Gill",
    email: "kkartikchauhan514@gmail.com",
    accountType: "Instructor",
    password: "Instructor123",
    about: "Instructor account for web, data, and cloud catalog courses.",
  },
  "DevOps & Cloud": {
    firstName: "Nihkil",
    lastName: "Gill",
    email: "kkartikchauhan514@gmail.com",
    accountType: "Instructor",
    password: "Instructor123",
    about: "Instructor account for web, data, and cloud catalog courses.",
  },
}

async function ensureUser({
  firstName,
  lastName,
  email,
  accountType,
  password,
  about,
}) {
  let user = await User.findOne({ email })

  if (user) {
    return user
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const profile = await Profile.create({
    gender: "Prefer not to say",
    dateOfBirth: "2000-01-01",
    about,
    contactNumber: 9999999999,
  })

  user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    accountType,
    approved: true,
    additionalDetails: profile._id,
    image: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
      `${firstName} ${lastName}`
    )}`,
  })

  return user
}

async function createCourseContent(sections = []) {
  const sectionIds = []

  for (const sectionData of sections) {
    const subSectionIds = []

    for (const lecture of sectionData.lectures) {
      const subSection = await SubSection.create(lecture)
      subSectionIds.push(subSection._id)
    }

    const section = await Section.create({
      sectionName: sectionData.sectionName,
      subSection: subSectionIds,
    })

    sectionIds.push(section._id)
  }

  return sectionIds
}

async function clearCourseContent(course) {
  if (!course) {
    return
  }

  const sections = await Section.find({
    _id: { $in: course.courseContent || [] },
  })

  const subSectionIds = sections.flatMap((section) => section.subSection || [])

  if (subSectionIds.length > 0) {
    await SubSection.deleteMany({
      _id: { $in: subSectionIds },
    })
  }

  if ((course.courseContent || []).length > 0) {
    await Section.deleteMany({
      _id: { $in: course.courseContent },
    })
  }

  await RatingAndReview.deleteMany({ course: course._id })
}

async function seedSampleCourses() {
  const defaultInstructor = await ensureUser({
    firstName: "Demo",
    lastName: "Instructor",
    email: "instructor@example.com",
    accountType: "Instructor",
    password: "Instructor123",
    about: "Demo instructor account for seeded catalog courses.",
  })

  const student = await ensureUser({
    firstName: "Demo",
    lastName: "Student",
    email: "student@example.com",
    accountType: "Student",
    password: "Student123",
    about: "Demo student account for seeded reviews and enrollments.",
  })

  let totalInstructorRevenue = 0
  let totalStudentsTaught = 0
  let createdCourses = 0
  const instructorStats = new Map()

  for (const sampleCourse of sampleCourses) {
    let course = await Course.findOne({
      courseName: sampleCourse.courseName,
    })

    const category = await Category.findOne({ name: sampleCourse.categoryName })

    if (!category) {
      continue
    }

    const instructorConfig =
      instructorOverridesByCategory[sampleCourse.categoryName] || null
    const instructor = instructorConfig
      ? await ensureUser(instructorConfig)
      : defaultInstructor

    if (!instructorStats.has(String(instructor._id))) {
      instructorStats.set(String(instructor._id), {
        instructorId: instructor._id,
        totalEarnings: 0,
        totalStudentsTaught: 0,
      })
    }

    if (course) {
      await clearCourseContent(course)
      await Category.updateMany(
        { courses: course._id },
        { $pull: { courses: course._id } }
      )
    }

    const sectionIds = await createCourseContent(sampleCourse.sections)

    if (!course) {
      course = await Course.create({
        courseName: sampleCourse.courseName,
        courseDescription: sampleCourse.courseDescription,
        instructor: instructor._id,
        whatYouWillLearn: sampleCourse.whatYouWillLearn,
        courseContent: sectionIds,
        price: sampleCourse.price,
        thumbnail: sampleCourse.thumbnail,
        tag: sampleCourse.tag,
        category: category._id,
        studentsEnroled: [student._id],
        instructions: sampleCourse.instructions,
        status: "Published",
        sold: sampleCourse.sold,
      })
    } else {
      course.courseDescription = sampleCourse.courseDescription
      course.instructor = instructor._id
      course.whatYouWillLearn = sampleCourse.whatYouWillLearn
      course.courseContent = sectionIds
      course.price = sampleCourse.price
      course.thumbnail = sampleCourse.thumbnail
      course.tag = sampleCourse.tag
      course.category = category._id
      course.studentsEnroled = [student._id]
      course.instructions = sampleCourse.instructions
      course.status = "Published"
      course.sold = sampleCourse.sold
      course.ratingAndReviews = []
      await course.save()
    }

    const rating = await RatingAndReview.create({
      user: student._id,
      rating: 5,
      review: `Excellent course for ${sampleCourse.categoryName.toLowerCase()} learners.`,
      course: course._id,
    })

    await Course.findByIdAndUpdate(course._id, {
      $push: { ratingAndReviews: rating._id },
    })

    await Category.findByIdAndUpdate(category._id, {
      $addToSet: { courses: course._id },
    })

    await User.updateMany(
      { _id: { $ne: instructor._id } },
      { $pull: { courses: course._id } }
    )

    await User.findByIdAndUpdate(instructor._id, {
      $addToSet: { courses: course._id },
    })

    await User.findByIdAndUpdate(student._id, {
      $addToSet: { courses: course._id },
    })

    const instructorSummary = instructorStats.get(String(instructor._id))
    instructorSummary.totalEarnings += Number(sampleCourse.price || 0)
    instructorSummary.totalStudentsTaught += 1

    totalInstructorRevenue += Number(sampleCourse.price || 0)
    totalStudentsTaught += 1
    createdCourses += 1
  }

  for (const summary of instructorStats.values()) {
    await User.findByIdAndUpdate(summary.instructorId, {
      totalEarnings: summary.totalEarnings,
      totalStudentsTaught: summary.totalStudentsTaught,
    })
  }

  return {
    createdCourses,
    instructorEmail: defaultInstructor.email,
    studentEmail: student.email,
  }
}

module.exports = {
  seedSampleCourses,
}
