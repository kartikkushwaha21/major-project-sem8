import { useEffect, useState } from "react"
import {
  FiArrowRight,
  FiBookOpen,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { formatDate } from "../../../services/formatDate"
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import { COURSE_STATUS } from "../../../utils/constants"
import InstructorChart from "./InstructorDashboard/InstructorChart"

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0)

export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState([])
  const [instructorSummary, setInstructorSummary] = useState(null)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token)

      setInstructorData(instructorApiData?.courses || [])
      setInstructorSummary(instructorApiData?.summary || null)

      if (result) {
        setCourses(result)
      }

      setLoading(false)
    })()
  }, [])

  const totalAmount =
    instructorSummary?.totalEarnings ||
    instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0) ||
    0

  const totalStudents =
    instructorSummary?.totalStudentsTaught ||
    instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0) ||
    0

  const publishedCourses = courses.filter(
    (course) => course.status === COURSE_STATUS.PUBLISHED
  ).length
  const draftCourses = courses.length - publishedCourses
  const averageStudentsPerCourse =
    courses.length > 0 ? Math.round(totalStudents / courses.length) : 0

  return (
    <div className="space-y-8 text-slate-900">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-cyan-50 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-6 px-6 py-8 lg:px-10 lg:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                Tutor Dashboard
              </p>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-[-0.03em] text-slate-950">
                  Hi {user?.firstName}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600">
                  Track course performance, monitor learner activity, and keep
                  your dashboard clean and balanced.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/dashboard/add-course"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <FiBookOpen />
                <span>Add Course</span>
              </Link>
              <Link
                to="/dashboard/my-courses"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
              >
                <span>Manage Library</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="grid min-h-[320px] place-items-center rounded-[28px] border border-slate-200 bg-white">
          <div className="spinner"></div>
        </div>
      ) : courses.length > 0 ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FiBookOpen className="text-xl" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Total Courses
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {courses.length}
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <FiUsers className="text-xl" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Total Students
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {totalStudents}
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <FiDollarSign className="text-xl" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Total Income
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {formatCurrency(totalAmount)}
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
                <FiTrendingUp className="text-xl" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Avg. Students
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {averageStudentsPerCourse}
              </p>
              <p className="mt-3 text-sm text-slate-400">
                {publishedCourses} published and {draftCourses} draft courses
              </p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
            {totalAmount > 0 || totalStudents > 0 ? (
              <InstructorChart courses={instructorData || []} />
            ) : (
              <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Performance
                </p>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                  Not enough data to visualize yet
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                  As learners enroll and your catalog starts generating income,
                  the chart will appear here automatically.
                </p>
              </div>
            )}

            <aside className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Snapshot
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                Portfolio health at a glance
              </h2>

              <div className="mt-8 space-y-5">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Published Courses
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">
                    {publishedCourses}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Draft Courses
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">
                    {draftCourses}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Latest Course
                  </p>
                  <p className="mt-3 text-lg font-semibold text-slate-950">
                    {courses[0]?.courseName}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Created {formatDate(courses[0]?.createdAt)}
                  </p>
                </div>
              </div>
            </aside>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] lg:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Recent Courses
                </p>
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                  Your latest course cards
                </h2>
              </div>

              <Link
                to="/dashboard/my-courses"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors duration-200 hover:text-indigo-500"
              >
                <span>View all courses</span>
                <FiArrowRight />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.slice(0, 3).map((course) => {
                const isDraft = course.status === COURSE_STATUS.DRAFT

                return (
                  <article
                    key={course._id}
                    className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute left-4 top-4">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            isDraft
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isDraft ? "Drafted" : "Published"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      <div>
                        <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                          {course.courseName}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">
                          {course.studentsEnroled?.length || 0} students
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
                        <span className="font-semibold text-indigo-600">
                          {formatCurrency(course.price)}
                        </span>
                        <span className="text-slate-500">
                          {formatDate(course.createdAt)}
                        </span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </>
      ) : (
        <section className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm">
            <FiBookOpen className="text-[28px]" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
            You have not created any courses yet
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
            Start with your first course and this dashboard will populate with
            analytics, student counts, and revenue insights automatically.
          </p>
          <Link
            to="/dashboard/add-course"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <FiBookOpen />
            <span>Create a course</span>
          </Link>
        </section>
      )}
    </div>
  )
}
