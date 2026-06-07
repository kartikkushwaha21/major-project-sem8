const normalizeText = (value = "") => String(value).trim().toLowerCase()

const normalizeList = (items = []) =>
  items
    .map((item) => normalizeText(item))
    .filter(Boolean)

const countMatchingItems = (left = [], right = []) => {
  const rightSet = new Set(normalizeList(right))
  return normalizeList(left).filter((item) => rightSet.has(item)).length
}

const getAverageRating = (reviews = []) => {
  if (!reviews.length) return 0
  const total = reviews.reduce((sum, review) => sum + Number(review?.rating || 0), 0)
  return total / reviews.length
}

const getLectureCount = (course) =>
  (course?.courseContent || []).reduce(
    (total, section) => total + (section?.subSection?.length || 0),
    0
  )

const formatPriceBand = (currentPrice, candidatePrice) => {
  if (!currentPrice || !candidatePrice) return "A strong value pick for this catalog."

  if (candidatePrice <= currentPrice) {
    return "Costs less than the course you are viewing."
  }

  const percentDifference = Math.round(
    ((candidatePrice - currentPrice) / currentPrice) * 100
  )

  if (percentDifference <= 20) {
    return "Priced close to your current course, with comparable depth."
  }

  return "A premium option if you want a broader learning path."
}

export const buildCourseRecommendationReason = (course, baseCourse) => {
  const reasons = []
  const categoryName = course?.category?.name

  if (baseCourse?.category?._id && course?.category?._id === baseCourse?.category?._id) {
    reasons.push(`Matches your interest in ${categoryName || "this category"}.`)
  } else if (categoryName) {
    reasons.push(`Popular in ${categoryName}.`)
  }

  const sharedTags = countMatchingItems(baseCourse?.tag, course?.tag)
  if (sharedTags > 0) {
    reasons.push(`Shares ${sharedTags} skill focus${sharedTags > 1 ? " areas" : ""}.`)
  }

  const lectureCount = getLectureCount(course)
  if (lectureCount > 0) {
    reasons.push(`${lectureCount} lessons included for steady progress.`)
  }

  const rating = getAverageRating(course?.ratingAndReviews)
  if (rating >= 4) {
    reasons.push(`Highly rated by learners at ${rating.toFixed(1)}/5.`)
  } else if ((course?.ratingAndReviews?.length || 0) > 0) {
    reasons.push(`${course.ratingAndReviews.length} learner reviews available.`)
  }

  reasons.push(formatPriceBand(baseCourse?.price, course?.price))

  return reasons.slice(0, 3)
}

export const getRecommendedCourses = ({
  courses = [],
  baseCourse = null,
  excludeCourseIds = [],
  limit = 4,
}) => {
  const excludedIds = new Set(excludeCourseIds.map(String))
  const baseCategoryId = String(baseCourse?.category?._id || "")
  const baseInstructorId = String(baseCourse?.instructor?._id || baseCourse?.instructor || "")

  return courses
    .filter((course) => course?._id && !excludedIds.has(String(course._id)))
    .map((course) => {
      const categoryScore =
        baseCategoryId && String(course?.category?._id || course?.category) === baseCategoryId
          ? 40
          : 0
      const tagScore = countMatchingItems(baseCourse?.tag, course?.tag) * 12
      const ratingScore = Math.round(getAverageRating(course?.ratingAndReviews) * 8)
      const popularityScore = Math.min(Number(course?.studentsEnroled?.length || course?.sold || 0), 40)
      const lectureScore = Math.min(getLectureCount(course), 20)
      const instructorScore =
        baseInstructorId &&
        String(course?.instructor?._id || course?.instructor) === baseInstructorId
          ? 8
          : 0
      const priceGap = Math.abs(Number(baseCourse?.price || 0) - Number(course?.price || 0))
      const priceScore =
        baseCourse?.price && course?.price
          ? Math.max(0, 18 - Math.round(priceGap / 250))
          : 10

      return {
        ...course,
        recommendationScore:
          categoryScore +
          tagScore +
          ratingScore +
          popularityScore +
          lectureScore +
          instructorScore +
          priceScore,
        recommendationReasons: buildCourseRecommendationReason(course, baseCourse),
      }
    })
    .sort((left, right) => right.recommendationScore - left.recommendationScore)
    .slice(0, limit)
}
