import React from "react";
import { Link } from "react-router-dom";

// Importing React Icons
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";
import GetAvgRating from "../../../utils/avgRating";

const CourseCard = ({cardData, currentCard, setCurrentCard}) => {
  const avgRating = GetAvgRating(cardData?.ratingAndReviews || []);

  return (
    <Link
      to={`/courses/${cardData?._id}`}
      className={`w-[360px] lg:w-[30%] border rounded-xl overflow-hidden ${
        currentCard === cardData?._id
          ? "bg-gray shadow-[12px_12px_0_0] shadow-caribbeangreen-100"
          : "bg-gray"
      } text-black min-h-[360px] box-border cursor-pointer`}
      onClick={() => setCurrentCard(cardData?._id)}
    >
      <img
        src={cardData?.thumbnail}
        alt={cardData?.courseName}
        className="h-40 w-full object-cover"
      />
      <div className="border-b-[2px] border-richblack-400 border-dashed min-h-[180px] p-6 flex flex-col gap-3">
        <div
          className={` ${
            currentCard === cardData?._id && "text-richblack-800"
          } font-semibold text-[20px]`}
        >
          {cardData?.courseName}
        </div>

        <div className="max-h-24 overflow-hidden text-sm text-richblack-400">
          {cardData?.courseDescription}
        </div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-caribbeangreen-200">
          {cardData?.category?.name || "Course"}
        </div>
      </div>

      <div
        className={`flex justify-between ${
          currentCard === cardData?._id ? "text-blue-300" : "text-richblack-300"
        } px-6 py-3 font-medium`}
      >
        <div className="flex items-center gap-2 text-[16px]">
          <HiUsers />
          <p>{cardData?.studentsEnroled?.length || 0} learners</p>
        </div>

        <div className="flex items-center gap-2 text-[16px]">
          <ImTree />
          <p>{avgRating || 0} rating</p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
