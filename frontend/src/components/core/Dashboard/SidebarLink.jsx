import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"

import { resetCourseState } from "../../../slices/courseSlice"

export default function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const dispatch = useDispatch()

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={`flex items-center gap-x-3 rounded-[20px] border px-4 py-3 text-base font-semibold ${
        matchRoute(link.path)
          ? "border-cyan-300/30 bg-[linear-gradient(135deg,_rgba(34,211,238,0.22)_0%,_rgba(59,130,246,0.18)_100%)] text-white shadow-[0_12px_30px_rgba(34,211,238,0.12)]"
          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
      } transition-all duration-200`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          matchRoute(link.path)
            ? "bg-white/15 text-white"
            : "bg-white/10 text-white"
        }`}
      >
        <Icon className="text-base" />
      </span>
      <span className="tracking-[0.01em] text-white">{link.name}</span>
    </NavLink>
  )
}
