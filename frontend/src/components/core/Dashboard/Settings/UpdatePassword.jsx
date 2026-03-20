import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword } from "../../../../services/operations/SettingsAPI"

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitPasswordForm = async (data) => {
    try {
      await changePassword(token, data)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitPasswordForm)}>
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] lg:p-8">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
            Security
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Change Password
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="relative space-y-2">
            <label
              htmlFor="oldPassword"
              className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
            >
              Current Password
            </label>
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter Current Password"
              className={inputClassName}
              {...register("oldPassword", { required: true })}
            />
            <span
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute right-4 top-[42px] z-[10] cursor-pointer text-slate-400"
            >
              {showOldPassword ? (
                <AiOutlineEyeInvisible fontSize={22} />
              ) : (
                <AiOutlineEye fontSize={22} />
              )}
            </span>
            {errors.oldPassword && (
              <span className="text-[12px] font-medium text-rose-500">
                Please enter your Current Password.
              </span>
            )}
          </div>

          <div className="relative space-y-2">
            <label
              htmlFor="newPassword"
              className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
            >
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              placeholder="Enter New Password"
              className={inputClassName}
              {...register("newPassword", { required: true })}
            />
            <span
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-4 top-[42px] z-[10] cursor-pointer text-slate-400"
            >
              {showNewPassword ? (
                <AiOutlineEyeInvisible fontSize={22} />
              ) : (
                <AiOutlineEye fontSize={22} />
              )}
            </span>
            {errors.newPassword && (
              <span className="text-[12px] font-medium text-rose-500">
                Please enter your New Password.
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
          Update Password
        </button>
      </div>
    </form>
  )
}
