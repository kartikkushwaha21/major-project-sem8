import {
  FiCalendar,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUser,
} from "react-icons/fi"
import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"

function ActionButton({ text, onClick, light = false }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all duration-200 ${
        light
          ? "border border-white/15 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15"
          : "bg-slate-950 text-white hover:-translate-y-0.5 hover:bg-slate-800"
      }`}
    >
      <RiEditBoxLine className="text-base" />
      <span>{text}</span>
    </button>
  )
}

function ProfileMetric({ label, value, dark = false }) {
  return (
    <div
      className={`rounded-[26px] border p-5 ${
        dark
          ? "border-white/10 bg-white/10 text-white"
          : "border-slate-300 bg-white text-slate-950"
      }`}
    >
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.22em] ${
          dark ? "text-slate-300" : "text-slate-500"
        }`}
      >
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold tracking-[-0.04em]">{value}</p>
    </div>
  )
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[24px] border border-slate-300 bg-slate-50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-sm">
          <Icon className="text-lg" />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {label}
          </p>
          <p className="mt-1 text-lg font-bold tracking-[-0.02em] text-slate-950">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value, fullWidth = false }) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
      <div className="mt-2 rounded-[22px] border border-slate-300 bg-white px-5 py-4 text-base font-semibold text-slate-950">
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
    "Add a short biography to make your profile feel complete and more personal."
  const birthDate = user?.additionalDetails?.dateOfBirth
    ? formattedDate(user.additionalDetails.dateOfBirth)
    : "Add date of birth"

  const completedFields = [
    user?.firstName,
    user?.lastName,
    user?.email,
    user?.additionalDetails?.contactNumber,
    user?.additionalDetails?.gender,
    user?.additionalDetails?.dateOfBirth,
    user?.additionalDetails?.about,
  ].filter(Boolean).length

  const contactStatus = user?.additionalDetails?.contactNumber
    ? "Ready"
    : "Pending"
  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() || "U"

  return (
    <div className="space-y-8 text-slate-900">
      <section className="relative overflow-hidden rounded-[42px] border border-slate-800 bg-[linear-gradient(135deg,_#020617_0%,_#111827_45%,_#1d4ed8_100%)] p-6 text-white shadow-[0_34px_90px_rgba(2,6,23,0.4)] lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_26%)]" />
        <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-wrap gap-3">
            <ActionButton
              text="Edit Profile"
              onClick={() => navigate("/dashboard/settings")}
            />
            <ActionButton
              text="Account Settings"
              light
              onClick={() => navigate("/dashboard/settings")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <ProfileMetric
              label="Fields Completed"
              value={`${completedFields}/7`}
              dark
            />
            <ProfileMetric
              label="Contact Status"
              value={contactStatus}
              dark
            />
            <ProfileMetric
              label="Role"
              value={user?.accountType || "Member"}
              dark
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="rounded-[38px] border border-slate-300 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1">
                    <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-cyan-200 bg-[linear-gradient(135deg,_#38bdf8_0%,_#4f46e5_60%,_#1e293b_100%)] text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-sm">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.35),_transparent_40%)]" />
                      <span className="relative">{initials}</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-600">
                      {user?.accountType || "Member"}
                    </span>
                  </div>
                  <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-slate-950">
                    {displayName}
                  </h2>
                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <FiMail className="text-base" />
                    <span>{user?.email || "No email added"}</span>
                  </p>
                </div>
              </div>

              <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-[28px] border-4 border-cyan-100 bg-[linear-gradient(135deg,_#38bdf8_0%,_#4f46e5_55%,_#1e293b_100%)] text-2xl font-bold tracking-[-0.04em] text-white shadow-[0_18px_42px_rgba(37,99,235,0.24)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.35),_transparent_38%)]" />
                <span className="relative">{initials}</span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <InfoTile
                icon={FiPhone}
                label="Phone"
                value={user?.additionalDetails?.contactNumber || "Not added"}
              />
              <InfoTile
                icon={FiCalendar}
                label="Date Of Birth"
                value={birthDate}
              />
              <InfoTile
                icon={FiMapPin}
                label="Gender"
                value={user?.additionalDetails?.gender || "Not added"}
              />
              <InfoTile
                icon={FiUser}
                label="Account Type"
                value={user?.accountType || "Member"}
              />
            </div>
          </div>

          <div className="rounded-[38px] border border-slate-300 bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] lg:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200">
              Biography
            </p>
            <h3 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-white">
              About you
            </h3>
            <p className="mt-5 text-sm leading-8 text-slate-200">{aboutText}</p>

            <div className="mt-8 border-t border-white/10 pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                Profile Highlights
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                  {user?.accountType || "Member"}
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                  {completedFields}/7 fields completed
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                  {contactStatus} contact setup
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[38px] border border-slate-300 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <FiUser className="text-xl" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                  Account Information
                </p>
                <h3 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-slate-950">
                  Personal details
                </h3>
              </div>
            </div>

            <ActionButton
              text="Edit Details"
              light
              onClick={() => navigate("/dashboard/settings")}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <DetailRow label="First Name" value={user?.firstName || "Not added"} />
            <DetailRow label="Last Name" value={user?.lastName || "Not added"} />
            <DetailRow
              label="Email Address"
              value={user?.email || "Not added"}
              fullWidth
            />
            <DetailRow
              label="Phone Number"
              value={user?.additionalDetails?.contactNumber || "Not added"}
            />
            <DetailRow
              label="Gender"
              value={user?.additionalDetails?.gender || "Not added"}
            />
            <DetailRow label="Date Of Birth" value={birthDate} />
            <DetailRow
              label="Account Type"
              value={user?.accountType || "Member"}
            />
          </div>

          <div className="mt-10 rounded-[30px] border border-slate-300 bg-[linear-gradient(135deg,_#ffffff_0%,_#f8fafc_46%,_#eef2ff_100%)] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <FiShield className="text-xl" />
                </div>
                <div>
                  <p className="text-xl font-bold tracking-[-0.03em] text-slate-950">
                    Security and preferences
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    Manage privacy, personal details, and account preferences from one place.
                  </p>
                </div>
              </div>

              <ActionButton
                text="Open Settings"
                onClick={() => navigate("/dashboard/settings")}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
