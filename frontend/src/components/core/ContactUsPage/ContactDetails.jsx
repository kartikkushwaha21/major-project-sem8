import React from "react"
import * as Icon1 from "react-icons/bi"
import * as Icon2 from "react-icons/io5"
import * as Icon3 from "react-icons/hi2"

const contactDetails = [
  {
    icon: "HiChatBubbleLeftRight",
    heading: "Chat with us",
    description: "Our support team is here to help with product and learning questions.",
    details: "info@studynotion.com",
  },
  {
    icon: "BiWorld",
    heading: "Visit us",
    description: "Come and say hello at our office headquarters.",
    details:
      "Akshya Nagar 1st Block 1st Cross, Rammurthy Nagar, Bangalore-560016",
  },
  {
    icon: "IoCall",
    heading: "Call us",
    description: "Mon - Fri from 8am to 5pm",
    details: "+123 456 7869",
  },
]

const ContactDetails = () => {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:p-8">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
          Contact Channels
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Reach the right team directly
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {contactDetails.map((item, index) => {
          const Icon = Icon1[item.icon] || Icon2[item.icon] || Icon3[item.icon]

          return (
            <div
              key={index}
              className="flex gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Icon size={22} />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-950">
                  {item.heading}
                </h3>
                <p className="text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {item.details}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContactDetails
