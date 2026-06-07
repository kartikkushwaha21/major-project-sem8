import { useEffect, useMemo, useState } from "react"
import { FiArrowRight, FiCompass, FiStar, FiZap } from "react-icons/fi"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { getAllCourses } from "../../../services/operations/courseDetailsAPI"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import { getRecommendedCourses } from "../../../utils/courseRecommendations"

const trimText = (value = "", limit = 120) =>
  value.length > limit ? `${value.slice(0, limit)}...` : value

function RecommendationCard({ course, index }) {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="group overflow-hidden rounded-[30px] border border-slate-700 bg-slate-900 shadow-[0_24px_70px_rgba(2,6,23,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.courseName}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.02)_0%,rgba(2,6,23,0.82)_100%)]" />
        <div className="absolute left-5 top-5 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-950">
          Pick {index + 1}
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-2xl font-bold tracking-[-0.04em] text-white">
            {course.courseName}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5 text-white">
        <p className="text-sm leading-7 text-slate-300">
          {trimText(course.courseDescription)}
        </p>

        {!!course.recommendationReasons?.length && (
          <div className="flex flex-wrap gap-2">
            {course.recommendationReasons.map((reason) => (
              <span
                key={`${course._id}-${reason}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200"
              >
                {reason}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          <p className="text-2xl font-bold tracking-[-0.04em] text-white">
            Rs. {course.price}
          </p>
          <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-slate-950">
            View Course
            <FiArrowRight />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function StudentRecommendations() {
  const { token } = useSelector((state) => state.auth)
  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [allCourses, setAllCourses] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const [enrolled, courses] = await Promise.all([
          getUserEnrolledCourses(token),
          getAllCourses(),
        ])

        setEnrolledCourses(
          (enrolled || []).filter((course) => course.status !== "Draft")
        )
        setAllCourses(courses || [])
      } catch (error) {
        console.log("Could not load student recommendations.", error)
        setEnrolledCourses([])
        setAllCourses([])
      }
    })()
  }, [token])

  const recommendations = useMemo(() => {
    const courses = enrolledCourses || []
    const inProgressCourse = courses
      .filter((course) => Number(course?.progressPercentage || 0) < 100)
      .sort(
        (left, right) =>
          Number(right?.progressPercentage || 0) -
          Number(left?.progressPercentage || 0)
      )[0]

    return getRecommendedCourses({
      courses: allCourses,
      baseCourse: inProgressCourse || courses[courses.length - 1] || allCourses[0] || null,
      excludeCourseIds: courses.map((course) => course?._id),
      limit: 6,
    })
  }, [allCourses, enrolledCourses])

  if (!enrolledCourses) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 text-white">
      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(135deg,_#020617_0%,_#111827_40%,_#0f766e_100%)] p-6 shadow-[0_32px_90px_rgba(2,6,23,0.45)] lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_26%)]" />
        <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-cyan-200">
              AI Recommendations
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-[-0.06em] text-white md:text-[4rem] md:leading-[0.94]">
              Courses chosen for what you should buy next.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-200 md:text-base">
              These suggestions are matched against your enrolled subjects,
              momentum, category fit, and value so the next course feels relevant.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalog/Development"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-200 hover:-translate-y-0.5"
              >
                Explore Catalog
                <FiCompass />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                <FiStar className="text-xl" />
              </div>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">
                Recommendation Mode
              </p>
              <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white">
                Personalized
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                <FiZap className="text-xl" />
              </div>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">
                Picks Available
              </p>
              <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white">
                {recommendations.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {recommendations.length ? (
        <section className="grid gap-6 xl:grid-cols-2">
          {recommendations.map((course, index) => (
            <RecommendationCard key={course._id} course={course} index={index} />
          ))}
        </section>
      ) : (
        <section className="rounded-[32px] border border-dashed border-slate-700 bg-slate-900 p-8 text-center">
          <p className="text-2xl font-bold tracking-[-0.04em] text-white">
            Recommendations will appear here as more courses are published
          </p>
          <p className="mt-3 text-sm leading-8 text-slate-300">
            We need more published courses in the catalog to generate stronger AI suggestions.
          </p>
        </section>
      )}
    </div>
  )
}
