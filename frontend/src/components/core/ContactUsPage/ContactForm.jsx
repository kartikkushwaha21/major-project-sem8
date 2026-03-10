import React from "react";
import ContactUsForm from "./ContactUsForm";
import HighlightText from "../HomePage/HighlightText";

const ContactForm = () => {
  return (
    <div className="border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14 flex gap-3 flex-col">
      <h1 className="text-4xl leading-10 font-semibold text-black">
       <HighlightText text={"Contact Us"}></HighlightText> 
      </h1>
      <p className="">
        Tell us what you got in mind ?
      </p>

      <div className="mt-7">
        <ContactUsForm />
      </div>
      {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1718.5889549396381!2d76.6575015887491!3d30.51600800436314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fc32344a6e2d7%3A0x81b346dee91799ca!2sChitkara%20University!5e0!3m2!1sen!2sin!4v1745908070471!5m2!1sen!2sin" width="400" height="300"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
    </div>
  );
};

export default ContactForm;
