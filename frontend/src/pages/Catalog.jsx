import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

// import CourseCard from "../components/Catalog/CourseCard"
// import CourseSlider from "../components/Catalog/CourseSlider"
import Footer from "../components/Common/Footer"
import AIRecommendations from "../components/core/Catalog/AIRecommendations"
import CourseCard from "../components/core/Catalog/Course_Card"
import CourseSlider from "../components/core/Catalog/Course_Slider"
import { apiConnector } from "../services/apiConnector"
import { categories } from "../services/apis"
import { getCatalogPageData } from "../services/operations/pageAndComponntDatas"
import { getRecommendedCourses } from "../utils/courseRecommendations"
import Error from "./Error"

function Catalog() {
  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams();
  const [active, setActive] = useState(1);
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")
  // Fetch All Categories
  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        const availableCategories = (res?.data?.data || []).filter(
          (category) => category?.courses?.length > 0
        )
        const category_id = availableCategories.filter(
          (ct) => ct.name === catalogName
        )[0]._id
        setCategoryId(category_id)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
    })()
  }, [catalogName])
  useEffect(() => {
    if (categoryId) {
      ;(async () => {
        try {
          const res = await getCatalogPageData(categoryId)
          setCatalogPageData(res)
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [categoryId])

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  const selectedCategoryCourses = catalogPageData?.data?.selectedCategory?.courses || []
  const differentCategoryCourses = catalogPageData?.data?.differentCategory?.courses || []
  const mostSellingCourses = catalogPageData?.data?.mostSellingCourses || []
  const baseCourse = selectedCategoryCourses[0] || mostSellingCourses[0] || null
  const recommendedCourses = getRecommendedCourses({
    courses: [...selectedCategoryCourses, ...differentCategoryCourses, ...mostSellingCourses],
    baseCourse,
    limit: 4,
  })

  return (
    <>
      {/* Hero Section */}
      <div className="box-content bg-richblack-900 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-caribbeangreen-50">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:p-8">
          <div className="flex flex-col gap-2">
            <p className="text-3xl font-bold text-slate-900">Courses to get you started</p>
            <p className="text-base text-slate-600">
              Start with the most relevant courses in {catalogPageData?.data?.selectedCategory?.name}.
            </p>
          </div>
        <div className="my-6 flex border-b border-b-slate-200 text-sm">
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-indigo-500 text-indigo-700"
                : "text-slate-600"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Populer
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-indigo-500 text-indigo-700"
                : "text-slate-600"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div>
          <CourseSlider Courses={selectedCategoryCourses} />
        </div>
        </div>
      </div>

      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-2 lg:max-w-maxContent">
        <AIRecommendations
          title={`Best courses to buy in ${catalogPageData?.data?.selectedCategory?.name}`}
          description="These picks are ranked with an AI-style scoring model using category match, learner ratings, popularity, lesson depth, and price fit so users can quickly see the strongest options."
          courses={recommendedCourses}
          emptyMessage="Add more published courses to this catalog to unlock AI suggestions."
        />
      </div>

      {/* Section 2 */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:p-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-slate-900">Top courses in {catalogPageData?.data?.differentCategory?.name}</h1>
          <p className="mt-2 text-base text-slate-600">
            Explore adjacent skills users often compare before buying.
          </p>
        </div>
        <div className="py-8">
          <CourseSlider Courses={differentCategoryCourses} />
        </div>
        </div>
      </div>

      {/* Section 3 */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:p-8">
        <div className="mb-4">
          <p className="text-3xl font-bold text-slate-900">Frequently Bought</p>
          <p className="mt-2 text-base text-slate-600">
            These are the strongest commercial performers across the platform.
          </p>
        </div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {mostSellingCourses
              ?.slice(0, 4)
              .map((course, i) => (
                <CourseCard course={course} key={i} Height={"h-[400px]"} />
              ))}
          </div>
        </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Catalog
