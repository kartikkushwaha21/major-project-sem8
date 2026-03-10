import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../Common/IconBtn"

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl border border-richblack-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-richblack-400">
        {label}
      </p>
      <p className="text-sm font-semibold text-black">{value}</p>
    </div>
  )
}

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
  const aboutText = user?.additionalDetails?.about ?? "Write Something About Yourself"

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-black">My Profile</h1>
        <p className="mt-2 text-sm text-richblack-500">
          View and manage your personal details
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-richblack-200 bg-gradient-to-r from-customYellow via-white to-customYellow/70 p-6 shadow-sm transition-all duration-200 hover:shadow-md md:p-8">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-caribbeangreen-100/10 blur-2xl"></div>
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user?.image}
              alt={`profile-${user?.firstName}`}
              className="aspect-square w-[84px] rounded-full border-2 border-white object-cover shadow-sm"
            />
            <div className="space-y-1">
              <p className="text-xl font-semibold text-black">{fullName || "Your Name"}</p>
              <p className="text-sm text-richblack-500">{user?.email}</p>
              <p className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-richblack-500 shadow-sm">
                {user?.accountType || "Member"}
              </p>
            </div>
          </div>
          <IconBtn
            text="Edit Profile"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
            customClasses="self-start md:self-auto"
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
      </div>

      <div className="my-8 rounded-2xl border border-richblack-200 bg-customYellow p-6 shadow-sm transition-all duration-200 hover:shadow-md md:p-8">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-black">About</p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p className="mt-5 rounded-xl border border-richblack-200 bg-white p-4 text-sm font-medium leading-6 text-black">
          {aboutText}
        </p>
      </div>

      <div className="my-8 rounded-2xl border border-richblack-200 bg-customYellow p-6 shadow-sm transition-all duration-200 hover:shadow-md md:p-8">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-black">Personal Details</p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <DetailItem label="First Name" value={user?.firstName || "Not Added"} />
          <DetailItem label="Last Name" value={user?.lastName || "Not Added"} />
          <DetailItem label="Email" value={user?.email || "Not Added"} />
          <DetailItem
            label="Phone Number"
            value={user?.additionalDetails?.contactNumber || "Add Contact Number"}
          />
          <DetailItem label="Gender" value={user?.additionalDetails?.gender || "Add Gender"} />
          <DetailItem
            label="Date Of Birth"
            value={formattedDate(user?.additionalDetails?.dateOfBirth) || "Add Date Of Birth"}
          />
        </div>
      </div>
    </>
  )
}
