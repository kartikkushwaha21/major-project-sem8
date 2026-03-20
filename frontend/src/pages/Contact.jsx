import React from "react"

import Footer from "../components/Common/Footer"
import ContactDetails from "../components/core/ContactUsPage/ContactDetails"
import ContactForm from "../components/core/ContactUsPage/ContactForm"
import contactUsImage from "../assets/Images/image copy.png"

const Contact = () => {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl" />

        <div className="relative mx-auto flex w-11/12 max-w-7xl flex-col gap-8 px-0 pb-16 pt-20 lg:pb-20 lg:pt-24">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
              Contact
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.03em] text-slate-950 md:text-6xl">
              Let&apos;s build the right learning experience together.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              Reach out for product questions, course support, onboarding help,
              or partnership discussions. The existing contact flow remains the
              same, now with a cleaner interface.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-6 w-11/12 max-w-7xl pb-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={contactUsImage}
                  alt="Contact support"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-3 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                  Support Desk
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  We respond with clarity and speed.
                </h2>
                <p className="text-sm leading-7 text-slate-600">
                  Share the issue, idea, or request. We&apos;ll route it to the
                  right team without changing how your current form works.
                </p>
              </div>
            </div>

            <ContactDetails />
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Contact
