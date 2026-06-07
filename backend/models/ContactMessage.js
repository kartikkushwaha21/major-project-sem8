const mongoose = require("mongoose")

const contactMessageSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phoneNo: {
      type: String,
      trim: true,
      default: "",
    },
    countrycode: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["received", "emailed", "failed"],
      default: "received",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("ContactMessage", contactMessageSchema)
