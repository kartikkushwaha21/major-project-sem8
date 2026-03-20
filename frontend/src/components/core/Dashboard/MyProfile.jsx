import { FiCalendar, FiMail, FiShield, FiUser } from "react-icons/fi"
import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"

function ProfileActionButton({ text, onClick, subtle = false }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
        subtle
          ? "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-950"
          : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 hover:bg-indigo-500"
      }`}
    >
      <RiEditBoxLine className="text-base" />
      <span>{text}</span>
    </button>
  )
}

function DetailItem({ label, value, fullWidth = false }) {
  return (
    <div className={`space-y-2 ${fullWidth ? "md:col-span-2" : ""}`}>
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </p>
      <div className="rounded-2xl bg-white px-5 py-4 text-base font-semibold text-slate-950 ring-1 ring-slate-200">
        {value}
      </div>
    </div>
  )
}

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
  const displayName = fullName || "Your Name"
  const aboutText =
    user?.additionalDetails?.about ||
    "Add a short biography to help students and collaborators understand your background and teaching style."
  const birthDate = user?.additionalDetails?.dateOfBirth
    ? formattedDate(user.additionalDetails.dateOfBirth)
    : "Add Date Of Birth"

  const profileFacts = [
    user?.accountType || "Member",
    user?.additionalDetails?.gender,
    user?.additionalDetails?.contactNumber ? "Contact Ready" : null,
  ].filter(Boolean)

  const completedFields = [
    user?.firstName,
    user?.lastName,
    user?.email,
    user?.additionalDetails?.contactNumber,
    user?.additionalDetails?.gender,
    user?.additionalDetails?.dateOfBirth,
    user?.additionalDetails?.about,
  ].filter(Boolean).length

  return (
    <div className="space-y-10 text-slate-900">
      <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-cyan-50 px-6 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:px-10 lg:py-10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-100/70 blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-cyan-100/70 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="relative mx-auto md:mx-0">
              <div className="h-32 w-32 overflow-hidden rounded-[28px] border-4 border-white bg-slate-100 shadow-[0_18px_50px_rgba(15,23,42,0.12)] md:h-40 md:w-40">
                <img
                  src={user?.image}
                  alt={`profile-${user?.firstName}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                onClick={() => navigate("/dashboard/settings")}
                className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-lg shadow-slate-300/60 transition-all duration-200 hover:bg-indigo-600 hover:text-white"
              >
                <RiEditBoxLine className="text-lg" />
              </button>
            </div>

            <div className="space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                {profileFacts.map((fact) => (
                  <span
                    key={fact}
                    className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-600 ring-1 ring-slate-200"
                  >
                    {fact}
                  </span>
                ))}
              </div>

              <div>
                <h1 className="text-4xl font-semibold tracking-[-0.03em] text-slate-950 md:text-[2.9rem]">
                  {displayName}
                </h1>
                <p className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-600 md:justify-start">
                  <FiMail className="text-base" />
                  <span>{user?.email || "No email added"}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <ProfileActionButton
              text="Edit Profile"
              onClick={() => navigate("/dashboard/settings")}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-5">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                  Biography
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  About
                </h2>
              </div>
              <ProfileActionButton
                text="Edit"
                subtle
                onClick={() => navigate("/dashboard/settings")}
              />
            </div>

            <p className="mt-6 text-sm leading-8 text-slate-600">{aboutText}</p>

            <div className="mt-8 border-t border-slate-200 pt-8">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                Profile Highlights
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  {user?.accountType || "Member"}
                </span>
                <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  {completedFields}/7 fields completed
                </span>
                <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  {user?.additionalDetails?.contactNumber
                    ? "Contact info added"
                    : "Contact pending"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[24px] bg-indigo-600 p-6 text-white shadow-lg shadow-indigo-500/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <FiUser className="text-xl" />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight">
                {completedFields}
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-100">
                Profile Entries
              </p>
            </div>

            <div className="rounded-[24px] bg-emerald-600 p-6 text-white shadow-lg shadow-emerald-500/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <FiCalendar className="text-xl" />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight">
                {user?.additionalDetails?.dateOfBirth ? "Ready" : "Pending"}
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-100">
                Birth Date Status
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                  <FiUser className="text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                    Account Information
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    Personal Details
                  </h2>
                </div>
              </div>

              <ProfileActionButton
                text="Edit Details"
                subtle
                onClick={() => navigate("/dashboard/settings")}
              />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
              <DetailItem label="First Name" value={user?.firstName || "Not Added"} />
              <DetailItem label="Last Name" value={user?.lastName || "Not Added"} />
              <DetailItem
                label="Email Address"
                value={user?.email || "Not Added"}
                fullWidth
              />
              <DetailItem
                label="Phone Number"
                value={user?.additionalDetails?.contactNumber || "Add Contact Number"}
              />
              <DetailItem
                label="Gender"
                value={user?.additionalDetails?.gender || "Add Gender"}
              />
              <DetailItem label="Date Of Birth" value={birthDate} />
              <DetailItem
                label="Account Type"
                value={user?.accountType || "Member"}
              />
            </div>

            <div className="mt-10 flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <FiShield className="text-xl" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-950">
                    Security & Privacy
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Manage your account settings and keep your profile details up
                    to date.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/dashboard/settings")}
                className="text-sm font-semibold text-indigo-600 transition-colors duration-200 hover:text-indigo-500"
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
        <p className="text-sm text-slate-600">
          Want to update privacy preferences or refine your account settings?
        </p>
        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
          <ProfileActionButton
            text="Platform Preferences"
            subtle
            onClick={() => navigate("/dashboard/settings")}
          />
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Open Settings
          </button>
        </div>
      </section>
    </div>
  )
}
