const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")
const ContactMessage = require("../models/ContactMessage")

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
  console.log(req.body)
  let submission = null
  try {
    submission = await ContactMessage.create({
      firstName: firstname,
      lastName: lastname,
      email,
      message,
      phoneNo,
      countrycode,
      status: "received",
    })

    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )

    submission.status = "emailed"
    await submission.save()

    console.log("Email Res ", emailRes)
    return res.json({
      success: true,
      message: "Email send successfully",
    })
  } catch (error) {
    if (submission) {
      submission.status = "failed"
      await submission.save()
    }
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}
