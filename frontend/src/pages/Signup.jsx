import signupImg from "../assets/Images/signup.webp"
import Template from "../components/core/Auth/Template"
import { useSearchParams } from "react-router-dom"
import { ACCOUNT_TYPE } from "../utils/constants"

function Signup() {
  const [searchParams] = useSearchParams()
  const isInstructorFlow = searchParams.get("role") === "instructor"

  return (
    <Template
      title={isInstructorFlow ? "Instructor Sign Up" : "Sign Up"}
      description1={
        isInstructorFlow
          ? "Create your instructor account and start publishing courses"
          : "Join our best courses at affordable prices"
      }
      description2={
        isInstructorFlow
          ? "Teach, grow, and earn through your courses"
          : "Bring quality to the world"
      }
      image={signupImg}
      formType="signup"
      accountType={
        isInstructorFlow ? ACCOUNT_TYPE.INSTRUCTOR : ACCOUNT_TYPE.STUDENT
      }
    />
  )
}

export default Signup
