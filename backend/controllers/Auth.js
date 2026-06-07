const bcrypt = require("bcryptjs")
const User = require("../models/User")
const Otp = require("../models/Otp")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const otpTemplate = require("../mail/templates/emailVerificationTemplate")
const Profile = require("../models/Profile")
require("dotenv").config()

const generateUniqueOtp = async () => {
  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  })

  let existingOtp = await Otp.findOne({ otp })

  while (existingOtp) {
    otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    existingOtp = await Otp.findOne({ otp })
  }

  return otp
}

const sendOtpEmail = async (email, otp, subject = "OTP Verification Email") => {
  const emailResponse = await mailSender(email, subject, otpTemplate(otp))
  console.log("Email sent successfully:", emailResponse.response)
}

// Function to create dummy user if not exists
const createDummyUser = async () => {
  try {
    const dummyEmail = "testuser@example.com"
    const existingUser = await User.findOne({ email: dummyEmail })
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("TestPassword123", 10)
      const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null,
      })
      await User.create({
        firstName: "Test",
        lastName: "User",
        email: dummyEmail,
        password: hashedPassword,
        accountType: "Student",
        approved: true,
        additionalDetails: profileDetails._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=Test%20User`,
      })
      console.log("Dummy user created successfully")
    }
  } catch (error) {
    console.error("Error creating dummy user:", error)
  }
}

module.exports.createDummyUser = createDummyUser
exports.signup=async (req,res)=>{
    try{
        const {firstName,lastName,email,password,confirmPassword,otp,accountType}=req.body;
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(400).json({
                success:false,
                message:"Fill all input fields"
            })
        }
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirmPassword doesnot match"
            })
        }
        const checkUser=await User.findOne({email});
        if(checkUser){
            return res.status(401).json({
                success:false,
                message:"User already exists"
            })
        }

        const recentOtpRecords = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1)
        if (!recentOtpRecords.length) {
          return res.status(400).json({
            success: false,
            message: "OTP not found or expired. Please request a new OTP.",
          })
        }

        if (recentOtpRecords[0].otp !== otp) {
          return res.status(400).json({
            success: false,
            message: "Invalid OTP",
          })
        }

        //hashing password
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log("Hashed password ",hashedPassword);
        // Create the user
        const approved = true

        // Create the Additional Profile For User
        const profileDetails = await Profile.create({
          gender: null,
          dateOfBirth: null,
          about: null,
          contactNumber: null,
        })
        const normalizedAccountType = accountType === "Instructor" ? "Instructor" : "Student"
        const user = await User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          accountType: normalizedAccountType,
          approved: approved,
          additionalDetails: profileDetails._id,
          image: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(firstName + " " + lastName)}`,

        })

        // Generate JWT token for auto-login after signup
        const token = jwt.sign(
          { email: user.email, id: user._id, role: user.accountType },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        )

        // Save token to user document in database
        user.token = token
        user.password = undefined

        // Set cookie for token
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        }
        res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: "User registered successfully",
        })
      } catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "User cannot be registered. Please try again.",
        })
      }
    }


//login
exports.login = async (req, res) => {
    try {
      // Get email and password from request body
      const { email, password } = req.body
  
      // Check if email or password is missing
      if (!email || !password) {
        // Return 400 Bad Request status code with error message
        return res.status(400).json({
          success: false,
          message: `Please Fill up All the Required Fields`,
        })
      }
  
      // Find user with provided email
      const user = await User.findOne({ email }).populate("additionalDetails")
  
      // If user not found with provided email
      if (!user) {
        // Return 401 Unauthorized status code with error message
        return res.status(401).json({
          success: false,
          message: `User is not Registered with Us Please SignUp to Continue`,
        })
      }
  
      // Generate JWT token and Compare Password
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { email: user.email, id: user._id, role: user.accountType },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        )
  
        // Save token to user document in database
        user.token = token
        user.password = undefined
        // Set cookie for token and return success response
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        }
        res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: `User Login Success`,
        })
      } else {
        return res.status(401).json({
          success: false,
          message: `Password is incorrect`,
        })
      }
    } catch (error) {
      console.error(error)
      // Return 500 Internal Server Error status code with error message
      return res.status(500).json({
        success: false,
        message: `Login Failure Please Try Again`,
      })
    }
  }
    
//send otp commented out for direct signup
// exports.sendotp = async (req, res) => {
//   try {
//     const { email } = req.body

//     // Check if user is already present
//     // Find user with provided email
//     const checkUserPresent = await User.findOne({ email })
//     // to be used in case of signup

//     // If user found with provided email
//     if (checkUserPresent) {
//       // Return 401 Unauthorized status code with error message
//       return res.status(401).json({
//         success: false,
//         message: `User is Already Registered`,
//       })
//     }

//     var otp = otpgenerator.generate(6, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     })
//     const result = await Otp.findOne({ otp: otp })
//     console.log("Result is Generate OTP Func")
//     console.log("OTP", otp)
//     console.log("Result", result)
//     while (result) {
//       otp = otpgenerator.generate(6, {
//         upperCaseAlphabets: false,
//       })
//     }
//     const otpPayload = { email, otp }
//     const otpBody = await Otp.create(otpPayload)
//     console.log("OTP Body", otpBody)
//     res.status(200).json({
//       success: true,
//       message: `OTP Sent Successfully`,
//       otp,
//     })
//   } catch (error) {
//     console.log("ERROR",error.message)
//     return res.status(500).json({ success: false, error: error.message })
//   }
// }

// Send OTP for email verification
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body

    // Check if user is already present
    const checkUserPresent = await User.findOne({ email })

    // If user found with provided email
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    const otp = await generateUniqueOtp()
    const otpPayload = { email, otp }
    const otpBody = await Otp.create(otpPayload)
    console.log("OTP Body", otpBody)

    // Send email
    try {
      await sendOtpEmail(email, otp)
    } catch (error) {
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    console.log("ERROR", error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
}

// Controller for Changing Password
exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body
  
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
        console.log("Email sent successfully:", emailResponse.response)
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
  }
  
