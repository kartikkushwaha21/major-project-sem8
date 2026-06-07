import React, { useEffect, useMemo, useState } from "react";
import CourseCard from "./CourseCard";
import HighlightText from "./HighlightText";
import { apiConnector } from "../../../services/apiConnector";
import { categories, courseEndpoints } from "../../../services/apis";

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [currentCard, setCurrentCard] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExploreData = async () => {
      try {
        setLoading(true);
        const [categoryResponse, coursesResponse] = await Promise.all([
          apiConnector("GET", categories.CATEGORIES_API),
          apiConnector("GET", courseEndpoints.GET_ALL_COURSE_API),
        ]);

        const availableCategories = (categoryResponse?.data?.data || [])
          .filter((category) => category?.courses?.length > 0)
          .sort((a, b) => (b?.courses?.length || 0) - (a?.courses?.length || 0))
          .slice(0, 5);

        const publishedCourses = coursesResponse?.data?.data || [];

        setCategoryOptions(availableCategories);
        setAllCourses(publishedCourses);

        if (availableCategories.length > 0) {
          setCurrentTab(availableCategories[0].name);
        }
      } catch (error) {
        console.log("Could not load homepage explore data.", error);
      } finally {
        setLoading(false);
      }
    };

    loadExploreData();
  }, []);

  const courses = useMemo(() => {
    if (!currentTab) return [];

    return allCourses
      .filter((course) => course?.category?.name === currentTab)
      .sort((a, b) => {
        const soldDiff = (b?.sold || 0) - (a?.sold || 0);
        if (soldDiff !== 0) return soldDiff;
        return (b?.ratingAndReviews?.length || 0) - (a?.ratingAndReviews?.length || 0);
      })
      .slice(0, 3);
  }, [allCourses, currentTab]);

  useEffect(() => {
    if (courses.length > 0) {
      setCurrentCard(courses[0]._id);
    }
  }, [courses]);

  const setMyCards = (value) => {
    setCurrentTab(value);
  };

  return (
    <div>
      {/* Explore more section */}
      <div className="">
        <div className="text-4xl font-semibold text-center my-10 text-black ">
          Learn like a
          <HighlightText text={"Pro"} />
          <p className="text-center text-richblack-300 text-lg font-semibold mt-1">
          Your Brain Will Thank You Later
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="hidden lg:flex gap-5 -mt-5 mx-auto w-max max-w-full flex-wrap justify-center bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
        {categoryOptions.map((ele, index) => {
          return (
            <div
              className={` text-[16px] flex flex-row items-center gap-2 ${
                currentTab === ele.name
                  ? "bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200"
              } px-7 py-[7px] rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5`}
              key={index}
              onClick={() => setMyCards(ele.name)}
            >
              {ele.name}
            </div>
          );
        })}
      </div>
      <div className="hidden lg:block lg:h-[200px]"></div>

      {/* Cards Group */}
      <div className=" lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {loading ? (
          <div className="text-lg font-semibold text-black">Loading courses...</div>
        ) : courses.length > 0 ? (
          courses.map((ele, index) => {
          return (
            <CourseCard
              key={index}
              cardData={ele}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
          })
        ) : (
          <div className="text-lg font-semibold text-black">
            No featured courses available right now.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreMore;
