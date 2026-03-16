const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465, // Secure SSL connection
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // Use an App Password
      },
    });

    let info = await transporter.sendMail({
      from: `LEARN & IMPROVE || Manan <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.log("Error sending email:", error.message);
    return error.message;
  }
};

module.exports = mailSender;
