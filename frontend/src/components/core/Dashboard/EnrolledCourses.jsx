import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { FiBookOpen, FiClock, FiTrendingUp } from "react-icons/fi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import AIRecommendations from "../Catalog/AIRecommendations"
import { getAllCourses } from "../../../services/operations/courseDetailsAPI"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import { getRecommendedCourses } from "../../../utils/courseRecommendations"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [allCourses, setAllCourses] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const [res, courses] = await Promise.all([
          getUserEnrolledCourses(token),
          getAllCourses(),
        ])

        // Filtering the published course out
        const filterPublishCourse = res.filter((ele) => ele.status !== "Draft")
        // console.log(
        //   "Viewing all the couse that is Published",
        //   filterPublishCourse
        // )

        setEnrolledCourses(filterPublishCourse)
        setAllCourses(courses || [])
      } catch (error) {
        console.log("Could not fetch enrolled courses.")
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const averageProgress = enrolledCourses?.length
    ? Math.round(
        enrolledCourses.reduce(
          (total, course) => total + Number(course?.progressPercentage || 0),
          0
        ) / enrolledCourses.length
      )
    : 0

  const nextCourse =
    enrolledCourses
      ?.filter((course) => Number(course?.progressPercentage || 0) < 100)
      ?.sort((left, right) => (right?.progressPercentage || 0) - (left?.progressPercentage || 0))?.[0] ||
    null

  const recommendedCourses = getRecommendedCourses({
    courses: allCourses,
    baseCourse: nextCourse || enrolledCourses?.[0] || null,
    excludeCourseIds: (enrolledCourses || []).map((course) => course?._id),
    limit: 4,
  })

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] lg:px-8">
        <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
              Learning Library
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">
              Enrolled Courses
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Keep your active courses, progress, and next buying opportunities visible in one place.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                Total Courses
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {enrolledCourses?.length || 0}
              </p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                Avg Progress
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">{averageProgress}%</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                Next Focus
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {nextCourse?.courseName || "Choose a course"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-indigo-700">
            <FiBookOpen className="text-2xl" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-slate-950">
            You have not enrolled in any course yet
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Start with a course from the catalog and this dashboard will begin tracking progress and recommendations automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                <FiTrendingUp className="text-xl" />
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">Average learning progress</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{averageProgress}%</p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <FiClock className="text-xl" />
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">Current focus course</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {nextCourse?.courseName || "All courses completed"}
              </p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-medium text-slate-500">AI buying insight</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                Recommended courses are now personalized from your enrolled subjects.
              </p>
            </div>
          </section>

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5">
            <p className="w-[45%] text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Course
            </p>
            <p className="w-1/4 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Duration
            </p>
            <p className="flex-1 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Progress
            </p>
          </div>
          {/* Course Names */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex items-center border-b border-slate-200 ${
                i === arr.length - 1 ? "border-b-0" : ""
              }`}
              key={i}
            >
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-6 py-5 transition-colors duration-200 hover:bg-slate-50"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  )
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold text-slate-950">{course.courseName}</p>
                  <p className="text-xs leading-6 text-slate-500">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>
              <div className="w-1/4 px-2 py-3">
                <p className="font-medium text-slate-700">{course?.totalDuration}</p>
              </div>
              <div className="flex w-1/5 flex-col gap-2 px-4 py-3">
                <p className="font-medium text-slate-700">
                  Progress: {course.progressPercentage || 0}%
                </p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                  bgColor="#4f46e5"
                  baseBgColor="#e2e8f0"
                />
              </div>
            </div>
          ))}
          </div>

          <AIRecommendations
            title="Recommended courses to buy from your dashboard"
            description="These suggestions combine your enrolled-course history, active progress, course popularity, and price fit to help you choose the most relevant next purchase."
            courses={recommendedCourses}
            emptyMessage="Add more published catalog courses to unlock student buying recommendations here."
          />
        </div>
      )}
    </div>
  )
}
