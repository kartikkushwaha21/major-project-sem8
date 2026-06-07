const mongoose = require("mongoose")
const coursesSchema = new mongoose.Schema({
  courseName: { 
    type: String,
    required: true,
    trim: true,
 },
  courseDescription: { 
    type: String,
    required: true,
    trim: true,
 },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  thumbnail: {
    type: String,
  },
  tag: {
    type: [String],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  studentsEnroled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  sold: {
    type: Number,
    default: 0,
    min: 0,
  },
  instructions: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
    default: "Draft",
  },
  createdAt: { type: Date, default: Date.now },
})

// Export the Courses model
module.exports = mongoose.model("Course", coursesSchema)
