const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});
//function to send mail before db entry
async function sendVerificationEmail(email,otp){
	try{
		const mailResponse=await mailSender(email,"Verification mail from LEARN & IMPROVE platform ",otp);
		console.log("Email sent successfully",mailResponse)

	}catch(error){
		console.log("Error occured while sending mail ",error)
	}
}
OTPSchema.pre("save",async function(next){
	console.log("INSIDE PRE HOOK")
	await sendVerificationEmail(this.email,this.otp);
	next();
})
module.exports=mongoose.model("OTP",OTPSchema)