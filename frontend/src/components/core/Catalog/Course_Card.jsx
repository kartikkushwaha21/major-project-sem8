import React, { useEffect, useState } from "react"
// Icons
import { FaRegStar, FaStar } from "react-icons/fa"
import ReactStars from "react-rating-stars-component"
import { Link } from "react-router-dom"

import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../Common/RatingStars"

function Course_Card({ course, Height }) {
  // const avgReviewCount = GetAvgRating(course.ratingAndReviews)
  // console.log(course.ratingAndReviews)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews)
    setAvgReviewCount(count)
  }, [course])
  // console.log("count............", avgReviewCount)

  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
          <div className="overflow-hidden rounded-[20px]">
            <img
              src={course?.thumbnail}
              alt="course thumnail"
              className={`${Height} w-full rounded-[20px] object-cover`}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-4">
            <p className="text-xl font-semibold text-slate-900">{course?.courseName}</p>
            <p className="text-sm text-slate-600">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">{avgReviewCount || 0}</span>
              <ReactStars
                count={5}
                value={avgReviewCount || 0}
                size={20}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<FaRegStar />}
                fullIcon={<FaStar />}
              />
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-slate-500">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl font-bold text-slate-900">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </>
  )
}

export default Course_Card;
