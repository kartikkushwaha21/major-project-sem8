import { useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../Common/ConfirmationModal"
import SidebarLink from "./SidebarLink"

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  )
  const { loading: authLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)
  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() || "U"

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[240px] items-center border-r border-slate-200 bg-slate-50">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] min-w-[290px] flex-col justify-between border-r border-slate-800 bg-[linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-4 py-6 shadow-[0_10px_40px_rgba(2,6,23,0.35)]">
        <div className="flex flex-col gap-6">
          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,_rgba(255,255,255,0.08)_0%,_rgba(15,23,42,0.94)_50%,_rgba(30,64,175,0.38)_100%)] p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[22px] border-4 border-cyan-300/80 bg-[linear-gradient(135deg,_#38bdf8_0%,_#4f46e5_52%,_#1e293b_100%)] text-2xl font-bold tracking-[-0.04em] text-white shadow-[0_16px_34px_rgba(8,47,73,0.45)] ring-2 ring-cyan-200/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.35),_transparent_38%)]" />
                <span className="relative drop-shadow-sm">{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-xl font-bold text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
                  {user?.accountType}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-200">
              Keep your learning space organized and jump back into the right next action quickly.
            </p>
          </div>

          <div className="flex flex-col gap-3">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            )
          })}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="flex items-center gap-x-3 rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
              <VscSignOut className="text-lg" />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
