const nodemailer = require("nodemailer")
require("dotenv").config()

const getMailConfig = () => {
  const host = process.env.MAIL_HOST
  const port = Number(process.env.MAIL_PORT || 465)
  const secure = String(process.env.MAIL_SECURE || "true") === "true"
  const user = process.env.MAIL_USER
  const pass = process.env.MAIL_PASS
  const fromName = process.env.MAIL_FROM_NAME || "LEARN & IMPROVE"

  if (!host || !user || !pass || user === "your-gmail@gmail.com" || pass === "your-app-password") {
    throw new Error(
      "Email is not configured. Set MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER, MAIL_PASS, and optionally MAIL_FROM_NAME in backend/.env"
    )
  }

  return { host, port, secure, user, pass, fromName }
}

const mailSender = async (email, title, body) => {
  try {
    const { host, port, secure, user, pass, fromName } = getMailConfig()

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    })

    const info = await transporter.sendMail({
      from: `${fromName} <${user}>`,
      to: email,
      subject: title,
      html: body,
    })

    console.log("Email sent: ", info.response)
    return info
  } catch (error) {
    console.log("Error sending email:", error.message)
    throw error
  }
}

module.exports = mailSender
