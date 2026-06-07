import { useEffect, useMemo, useState } from "react"
import {
  FiArrowRight,
  FiBookOpen,
  FiCompass,
  FiPlay,
  FiTarget,
  FiZap,
} from "react-icons/fi"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { getAllCourses } from "../../../services/operations/courseDetailsAPI"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import { getRecommendedCourses } from "../../../utils/courseRecommendations"

const trimText = (value = "", limit = 130) =>
  value.length > limit ? `${value.slice(0, limit)}...` : value

function MetricCard({ label, value, caption, dark = false }) {
  return (
    <div
      className={`rounded-[30px] border p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)] ${
        dark
          ? "border-white/10 bg-slate-950 text-white"
          : "border-slate-300 bg-white text-slate-950"
      }`}
    >
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.24em] ${
          dark ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {label}
      </p>
      <p className="mt-4 text-4xl font-bold tracking-[-0.05em]">{value}</p>
      <p className={`mt-3 text-sm leading-7 ${dark ? "text-slate-300" : "text-slate-700"}`}>
        {caption}
      </p>
    </div>
  )
}

function RecommendationCard({ course, rank }) {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="group overflow-hidden rounded-[32px] border border-slate-300 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.14)]"
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.courseName}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.05)_0%,rgba(2,6,23,0.7)_100%)]" />
        <div className="absolute left-5 top-5 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-950">
          AI Pick {rank}
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-2xl font-bold tracking-[-0.04em] text-white">
            {course.courseName}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <p className="text-sm leading-7 text-slate-700">
          {trimText(course.courseDescription, 115)}
        </p>

        {!!course.recommendationReasons?.length && (
          <div className="flex flex-wrap gap-2">
            {course.recommendationReasons.map((reason) => (
              <span
                key={`${course._id}-${reason}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {reason}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
          <p className="text-2xl font-bold tracking-[-0.04em] text-slate-950">
            Rs. {course.price}
          </p>
          <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">
            View Course
            <FiArrowRight />
          </span>
        </div>
      </div>
    </Link>
  )
}

function StudentDashboard() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

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
        console.log("Could not load student dashboard data.", error)
        setEnrolledCourses([])
        setAllCourses([])
      }
    })()
  }, [token])

  const dashboardData = useMemo(() => {
    const courses = enrolledCourses || []
    const inProgressCourse = courses
      .filter((course) => Number(course?.progressPercentage || 0) < 100)
      .sort(
        (left, right) =>
          Number(right?.progressPercentage || 0) -
          Number(left?.progressPercentage || 0)
      )[0]

    const avgProgress = courses.length
      ? Math.round(
          courses.reduce(
            (total, course) => total + Number(course?.progressPercentage || 0),
            0
          ) / courses.length
        )
      : 0

    const completedCourses = courses.filter(
      (course) => Number(course?.progressPercentage || 0) >= 100
    ).length

    const recommendationBase =
      inProgressCourse || courses[courses.length - 1] || allCourses[0] || null

    const recommendations = getRecommendedCourses({
      courses: allCourses,
      baseCourse: recommendationBase,
      excludeCourseIds: courses.map((course) => course?._id),
      limit: 4,
    })

    return {
      inProgressCourse,
      avgProgress,
      completedCourses,
      totalCourses: courses.length,
      recommendations,
    }
  }, [allCourses, enrolledCourses])

  if (!enrolledCourses) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  const {
    inProgressCourse,
    avgProgress,
    completedCourses,
    totalCourses,
    recommendations,
  } = dashboardData

  const focusLabel = avgProgress >= 70 ? "High focus" : avgProgress >= 35 ? "Good rhythm" : "Build momentum"

  return (
    <div className="space-y-8 text-slate-900">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-[linear-gradient(135deg,_#020617_0%,_#111827_48%,_#1e3a8a_100%)] px-6 py-8 text-white shadow-[0_36px_100px_rgba(2,6,23,0.45)] lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_24%)]" />
          <div className="absolute -left-10 top-10 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-indigo-400/15 blur-3xl" />

          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-cyan-200">
              Student Dashboard
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-[-0.07em] text-white md:text-[4.4rem] md:leading-[0.92]">
              Learn better. Buy smarter. See everything clearly.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-200 md:text-base">
              {user?.firstName || "Learner"}, this space is now designed to feel
              focused and premium, with a clear next step, stronger contrast, and
              AI-guided course suggestions.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/dashboard/enrolled-courses"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-200 hover:-translate-y-0.5"
              >
                Open My Courses
                <FiArrowRight />
              </Link>
              <Link
                to="/catalog/Development"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-white/15"
              >
                Browse Catalog
                <FiCompass />
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <MetricCard
                label="Enrolled"
                value={totalCourses}
                caption="Courses currently attached to your learning path."
                dark
              />
              <MetricCard
                label="Progress"
                value={`${avgProgress}%`}
                caption="Average completion across all active learning."
                dark
              />
              <MetricCard
                label="Completed"
                value={completedCourses}
                caption="Courses you have fully finished already."
                dark
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <MetricCard
            label="Learning Mood"
            value={focusLabel}
            caption="Your current pace based on course completion and active work."
          />

          <div className="rounded-[34px] border border-slate-300 bg-[linear-gradient(135deg,_#ffffff_0%,_#eef2ff_46%,_#ecfeff_100%)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <FiZap className="text-xl" />
            </div>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Smart Buying Tip
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-slate-950">
              Buy the next skill, not the next random course.
            </h2>
            <p className="mt-4 text-sm leading-8 text-slate-700">
              Your AI suggestions prioritize category fit, nearby skill growth,
              popularity, and price alignment so the next purchase feels useful,
              not noisy.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[40px] border border-slate-300 bg-white p-6 shadow-[0_26px_70px_rgba(15,23,42,0.08)] lg:p-8">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                Continue Learning
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-slate-950">
                Your active course
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <FiPlay className="text-xl" />
            </div>
          </div>

          {inProgressCourse ? (
            <div className="mt-6 grid gap-5 lg:grid-cols-[240px_1fr]">
              <div className="overflow-hidden rounded-[30px] bg-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
                <img
                  src={inProgressCourse.thumbnail}
                  alt={inProgressCourse.courseName}
                  className="h-full min-h-[260px] w-full object-cover"
                />
              </div>

              <div className="rounded-[34px] bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200">
                  Most Active Right Now
                </p>
                <h3 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-white">
                  {inProgressCourse.courseName}
                </h3>
                <p className="mt-4 text-sm leading-8 text-slate-200">
                  {trimText(inProgressCourse.courseDescription, 180)}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">
                      Progress
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">
                      {inProgressCourse.progressPercentage || 0}%
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">
                      Duration
                    </p>
                    <p className="mt-2 text-xl font-bold tracking-[-0.03em] text-white">
                      {inProgressCourse.totalDuration || "Self-paced"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/view-course/${inProgressCourse?._id}/section/${inProgressCourse.courseContent?.[0]?._id}/sub-section/${inProgressCourse.courseContent?.[0]?.subSection?.[0]?._id}`
                    )
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Resume Course
                  <FiArrowRight />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-[32px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <FiBookOpen className="text-2xl" />
              </div>
              <h3 className="mt-5 text-2xl font-bold tracking-[-0.04em] text-slate-950">
                Start your first course
              </h3>
              <p className="mt-3 text-sm leading-8 text-slate-700">
                Once you enroll, this area becomes your high-contrast launch panel
                for continuing progress and unlocking better recommendations.
              </p>
              <Link
                to="/catalog/Development"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-slate-800"
              >
                Explore Courses
                <FiArrowRight />
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-[40px] border border-slate-300 bg-white p-6 shadow-[0_26px_70px_rgba(15,23,42,0.08)] lg:p-8">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                Focus Board
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-slate-950">
                What matters now
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <FiTarget className="text-xl" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-[28px] border border-slate-300 bg-slate-50 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Current Focus
              </p>
              <p className="mt-3 text-2xl font-bold tracking-[-0.04em] text-slate-950">
                {inProgressCourse?.courseName || "No active course yet"}
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950 p-5 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Momentum
              </p>
              <p className="mt-3 text-2xl font-bold tracking-[-0.04em] text-white">
                {focusLabel}
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-300 bg-[linear-gradient(135deg,_#ffffff_0%,_#f8fafc_46%,_#eef2ff_100%)] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Recommendation Engine
              </p>
              <p className="mt-3 text-2xl font-bold tracking-[-0.04em] text-slate-950">
                Personalized from your learning path
              </p>
              <p className="mt-3 text-sm leading-8 text-slate-700">
                Suggestions are ranked to feel visually clear and practically relevant, not generic.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[40px] border border-slate-300 bg-white p-6 shadow-[0_26px_70px_rgba(15,23,42,0.08)] lg:p-8">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-indigo-700">
            AI Recommendations
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.05em] text-slate-950">
            Courses worth buying next
          </h2>
          <p className="max-w-3xl text-sm leading-8 text-slate-700">
            These recommendations are shaped around your current learning so the
            next purchase adds real momentum, not just more content.
          </p>
        </div>

        {recommendations.length ? (
          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            {recommendations.map((course, index) => (
              <RecommendationCard
                key={course._id}
                course={course}
                rank={index + 1}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[32px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-2xl font-bold tracking-[-0.04em] text-slate-950">
              Recommendations will appear here as the catalog grows
            </p>
            <p className="mt-3 text-sm leading-8 text-slate-700">
              More published courses will let the dashboard create better AI-driven next-buy suggestions.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default StudentDashboard
