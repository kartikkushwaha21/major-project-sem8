import React from "react"

import ContactUsForm from "./ContactUsForm"

const ContactForm = () => {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:p-10">
      <div className="max-w-2xl space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
          Send a Message
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
          Tell us what you have in mind
        </h2>
        <p className="text-sm leading-7 text-slate-600">
          Use the same contact workflow as before. We&apos;ve only redesigned the
          presentation to feel cleaner and more professional.
        </p>
      </div>

      <div className="mt-8">
        <ContactUsForm />
      </div>
    </div>
  )
}

export default ContactForm
