import { FiLock, FiSettings, FiUser } from "react-icons/fi"
import { useSelector } from "react-redux"

import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

export default function Settings() {
  const { user } = useSelector((state) => state.profile)

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
    <div className="space-y-8 text-slate-900">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-6 px-6 py-8 lg:px-10 lg:py-10">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
              Settings
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-[-0.03em] text-slate-950">
                Profile Settings
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                Manage your public profile, account credentials, and security
                preferences from one clean workspace.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FiUser className="text-lg" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Profile Completion
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {completedFields}/7
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <FiSettings className="text-lg" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Account Type
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {user?.accountType || "Member"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
                <FiLock className="text-lg" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Security
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                Active
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Update your password and account details below.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ChangeProfilePicture />
      <EditProfile />
      <UpdatePassword />
      <DeleteAccount />
    </div>
  )
}
