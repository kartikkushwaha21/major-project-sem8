import React from "react"

import CourseCard from "./Course_Card"

function AIRecommendations({
  title,
  description,
  courses = [],
  emptyMessage = "No AI recommendations are available yet.",
}) {
  return (
    <section className="rounded-[32px] border border-slate-300 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:p-8">
      <div className="flex flex-col gap-3">
        <span className="w-fit rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-indigo-700">
          AI Recommendations
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 lg:text-3xl">{title}</h2>
        <p className="max-w-3xl text-sm leading-7 text-slate-700 lg:text-base">
          {description}
        </p>
      </div>

      {courses.length ? (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course._id}
              className="overflow-hidden rounded-[26px] border border-slate-300 bg-slate-50 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.07)]"
            >
              <CourseCard course={course} Height="h-[240px]" />
              {!!course?.recommendationReasons?.length && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Why AI recommends this
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {course.recommendationReasons.map((reason) => (
                      <span
                        key={`${course._id}-${reason}`}
                        className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-base font-medium text-slate-700">{emptyMessage}</p>
      )}
    </section>
  )
}

export default AIRecommendations
