import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { apiConnector } from "../../../services/apiConnector"
import { contactusEndpoint } from "../../../services/apis"

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"

const errorClassName = "text-[12px] font-medium text-rose-500"

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  const submitContactForm = async (data) => {
    try {
      setLoading(true)
      await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data)
      setLoading(false)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      })
    }
  }, [reset, isSubmitSuccessful])

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(submitContactForm)}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="firstname"
            className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
          >
            First Name
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter first name"
            className={inputClassName}
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className={errorClassName}>Please enter your name.</span>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="lastname"
            className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter last name"
            className={inputClassName}
            {...register("lastname")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
        >
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address"
          className={inputClassName}
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className={errorClassName}>
            Please enter your email address.
          </span>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500"
        >
          Message
        </label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="7"
          placeholder="Enter your message here"
          className={`${inputClassName} resize-none`}
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className={errorClassName}>Please enter your message.</span>
        )}
      </div>

      <button
        disabled={loading}
        type="submit"
        className={`inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ${
          loading
            ? "cursor-not-allowed bg-slate-400"
            : "bg-indigo-600 shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 hover:bg-indigo-500"
        }`}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}

export default ContactUsForm
