import { useEffect, useState } from "react"
import { FiCreditCard, FiDollarSign, FiTrendingUp, FiUsers } from "react-icons/fi"
import { useSelector } from "react-redux"

import { getInstructorEarnings } from "../../../services/operations/profileAPI"
import { formatDate } from "../../../services/formatDate"

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0)

export default function Earnings() {
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)
  const [earningsData, setEarningsData] = useState({
    totalRevenue: 0,
    totalEnrollments: 0,
    transactions: [],
  })

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const result = await getInstructorEarnings(token)
      setEarningsData(result)
      setLoading(false)
    })()
  }, [token])

  const averageTicketSize =
    earningsData.totalEnrollments > 0
      ? Math.round(earningsData.totalRevenue / earningsData.totalEnrollments)
      : 0

  return (
    <div className="space-y-8 text-slate-900">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
              Revenue Center
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.03em] text-slate-950">
              Tutor Earnings
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Review verified Razorpay purchases, learner details, and the
              income generated from the courses you own.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <FiDollarSign className="text-xl" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Total Revenue
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {formatCurrency(earningsData.totalRevenue)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FiUsers className="text-xl" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Total Sales
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {earningsData.totalEnrollments}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <FiTrendingUp className="text-xl" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Avg. Ticket
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {formatCurrency(averageTicketSize)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-emerald-300">
                <FiCreditCard className="text-xl" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                Transactions
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {earningsData.transactions.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] lg:p-8">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Transaction History
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">
            Verified Razorpay payments
          </h2>
        </div>

        {loading ? (
          <div className="grid min-h-[280px] place-items-center">
            <div className="spinner"></div>
          </div>
        ) : earningsData.transactions.length > 0 ? (
          <div className="mt-8 overflow-hidden rounded-[24px] border border-slate-200">
            <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_140px_150px] gap-4 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <p>Course</p>
              <p>Student</p>
              <p>Amount</p>
              <p>Date</p>
            </div>
            <div className="divide-y divide-slate-200">
              {earningsData.transactions.map((transaction, index) => (
                <div
                  key={`${transaction.paymentId || transaction.orderId}-${index}`}
                  className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_140px_150px] gap-4 px-5 py-4"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <img
                      src={transaction.course?.thumbnail}
                      alt={transaction.course?.courseName}
                      className="h-14 w-20 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {transaction.course?.courseName}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        Order {transaction.orderId}
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {transaction.student
                        ? `${transaction.student.firstName} ${transaction.student.lastName}`
                        : "Student"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {transaction.student?.email || "No email"}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-emerald-600">
                    {formatCurrency(transaction.amount)}
                  </p>

                  <p className="text-sm text-slate-600">
                    {formatDate(transaction.verifiedAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
              No earnings yet
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
              Once students purchase your courses through Razorpay, the verified
              payments will appear here automatically.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
