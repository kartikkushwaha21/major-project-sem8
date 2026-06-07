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
      <section className="overflow-hidden rounded-[32px] border border-slate-700 bg-[linear-gradient(135deg,_#020617_0%,_#111827_42%,_#1d4ed8_100%)] shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="flex flex-col gap-6 px-6 py-8 lg:px-10 lg:py-10">
          <div className="rounded-[28px] border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">
              Settings
            </p>
            <div className="mt-4 space-y-4">
              <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-white md:text-5xl">
                Profile Settings
              </h1>
              <p className="max-w-2xl rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base font-semibold leading-8 text-white shadow-[0_10px_30px_rgba(2,6,23,0.18)]">
                Manage your public profile, account credentials, and security
                preferences from one clean workspace.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                <FiUser className="text-lg" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Profile Completion
              </p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                {completedFields}/7
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                <FiSettings className="text-lg" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Account Type
              </p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                {user?.accountType || "Member"}
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-5 text-white">
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
