import signupImg from "../assets/Images/signup.webp"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <Template
      title="Sign Up"
      description1="Join our best courses at affordable prices"
      description2="Bring quality to the world"
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup
