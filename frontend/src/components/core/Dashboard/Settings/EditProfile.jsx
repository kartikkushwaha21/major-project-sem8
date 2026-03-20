import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateProfile } from "../../../../services/operations/SettingsAPI"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitProfileForm = async (data) => {
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitProfileForm)}>
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] lg:p-8">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
            Account Information
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Profile Information
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter first name"
              className={inputClassName}
              {...register("firstName", { required: true })}
              defaultValue={user?.firstName}
            />
            {errors.firstName && (
              <span className="text-[12px] font-medium text-rose-500">
                Please enter your first name.
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter last name"
              className={inputClassName}
              {...register("lastName", { required: true })}
              defaultValue={user?.lastName}
            />
            {errors.lastName && (
              <span className="text-[12px] font-medium text-rose-500">
                Please enter your last name.
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="dateOfBirth"
              className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
            >
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              className={inputClassName}
              {...register("dateOfBirth", {
                required: {
                  value: true,
                  message: "Please enter your Date of Birth.",
                },
                max: {
                  value: new Date().toISOString().split("T")[0],
                  message: "Date of Birth cannot be in the future.",
                },
              })}
              defaultValue={user?.additionalDetails?.dateOfBirth}
            />
            {errors.dateOfBirth && (
              <span className="text-[12px] font-medium text-rose-500">
                {errors.dateOfBirth.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="gender"
              className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
            >
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              className={inputClassName}
              {...register("gender", { required: true })}
              defaultValue={user?.additionalDetails?.gender}
            >
              {genders.map((ele, i) => {
                return (
                  <option key={i} value={ele}>
                    {ele}
                  </option>
                )
              })}
            </select>
            {errors.gender && (
              <span className="text-[12px] font-medium text-rose-500">
                Please enter your Date of Birth.
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contactNumber"
              className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
            >
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              id="contactNumber"
              placeholder="Enter Contact Number"
              className={inputClassName}
              {...register("contactNumber", {
                required: {
                  value: true,
                  message: "Please enter your Contact Number.",
                },
                maxLength: { value: 12, message: "Invalid Contact Number" },
                minLength: { value: 10, message: "Invalid Contact Number" },
              })}
              defaultValue={user?.additionalDetails?.contactNumber}
            />
            {errors.contactNumber && (
              <span className="text-[12px] font-medium text-rose-500">
                {errors.contactNumber.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="about"
              className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
            >
              About
            </label>
            <input
              type="text"
              name="about"
              id="about"
              placeholder="Enter Bio Details"
              className={inputClassName}
              {...register("about", { required: true })}
              defaultValue={user?.additionalDetails?.about}
            />
            {errors.about && (
              <span className="text-[12px] font-medium text-rose-500">
                Please enter your About.
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            navigate("/dashboard/my-profile")
          }}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-slate-950"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}
