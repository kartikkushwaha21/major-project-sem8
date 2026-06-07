import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"

import Sidebar from "../components/core/Dashboard/Sidebar"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] bg-slate-950">
      <Sidebar />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto bg-[radial-gradient(circle_at_top_left,_rgba(30,64,175,0.2),_transparent_20%),radial-gradient(circle_at_top_right,_rgba(34,211,238,0.1),_transparent_16%),linear-gradient(180deg,_#020617_0%,_#0f172a_52%,_#111827_100%)]">
        <div className="mx-auto w-11/12 max-w-[1180px] py-8 lg:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
