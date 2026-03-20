import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/operations/SettingsAPI"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <section className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.04)] lg:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <FiTrash2 className="text-3xl" />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-500">
            Danger Zone
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Delete Account
          </h2>
          <div className="max-w-2xl space-y-1 text-sm leading-7 text-slate-600">
            <p>Would you like to delete account?</p>
            <p>
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the contain associated with it.
            </p>
          </div>
          <button
            type="button"
            className="pt-2 text-sm font-semibold italic text-rose-600 transition-colors duration-200 hover:text-rose-500"
            onClick={handleDeleteAccount}
          >
            I want to delete my account.
          </button>
        </div>
      </div>
    </section>
  )
}
