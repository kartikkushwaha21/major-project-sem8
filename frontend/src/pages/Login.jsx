import loginImg from "../assets/Images/image.png"
import Template from "../components/core/Auth/Template"

function Login() {
  return (
    <Template
      title="Login  "
      description1="Continue with your ongoing courses"
      description2="Change the world with complex thinking"
      image={loginImg}
      formType="login"
    />
  )
}

export default Login
