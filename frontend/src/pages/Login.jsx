import loginImg from "../assets/Images/image.png"
import Template from "../components/core/Auth/Template"
import { useSearchParams } from "react-router-dom"

function Login() {
  const [searchParams] = useSearchParams()
  const isInstructorFlow = searchParams.get("role") === "instructor"

  return (
    <Template
      title={isInstructorFlow ? "Instructor Login" : "Login"}
      description1={
        isInstructorFlow
          ? "Continue to your instructor dashboard and manage your courses"
          : "Continue with your ongoing courses"
      }
      description2={
        isInstructorFlow
          ? "Track courses, students, and earnings in one place"
          : "Change the world with complex thinking"
      }
      image={loginImg}
      formType="login"
    />
  )
}

export default Login
