import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { login } from "../../../services/operations/authAPI"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const isInstructorFlow = searchParams.get("role") === "instructor"

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(login(email, password, navigate))
  }

  return (
    <form onSubmit={handleOnSubmit} className="mt-6 flex w-full flex-col gap-y-4">
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-black">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className="form-style w-full text-black"
        />
      </label>

      <label className="relative">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-black">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          className="form-style w-full !pr-10 text-black"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-[10] cursor-pointer"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>
      </label>

      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-caribbeangreen-100 py-[8px] px-[12px] font-medium text-richblack-900"
      >
        Sign In
      </button>

      <Link to="/forgot-password">
        <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
          Forgot Password?
        </p>
      </Link>
      <p className="text-center text-sm text-richblack-900">
        {isInstructorFlow
          ? "Need an instructor account? "
          : "Don't have an account? "}
        <Link
          to={isInstructorFlow ? "/signup?role=instructor" : "/signup"}
          className="font-semibold text-caribbeangreen-200 hover:underline"
        >
          {isInstructorFlow ? "Sign up as instructor" : "Sign up"}
        </Link>
      </p>
    </form>
  )
}

export default LoginForm
