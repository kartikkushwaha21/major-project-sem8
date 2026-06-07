// Importing necessary modules and packages
require("dotenv").config()
const express = require("express")
const app = express()
const userRoutes = require("./routes/user")
const profileRoutes = require("./routes/profile")
const courseRoutes = require("./routes/Course")
const paymentRoutes = require("./routes/Payments")
const contactUsRoute = require("./routes/Contact")
const database = require("./config/database")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const { cloudinaryConnect } = require("./config/cloudinary")
const fileUpload = require("express-fileupload")
const { default: mongoose } = require("mongoose")
const { createDummyUser } = require("./controllers/Auth")
const { seedDefaultCategories } = require("./utils/seedDefaultData")
const { seedSampleCourses } = require("./utils/seedSampleData")
const PORT=process.env.PORT;
// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({useTempFiles:true,tempFileDir:"/tmp"}))

cloudinaryConnect();

app.listen(PORT,()=>{
    console.log(`App is running at port no ${PORT}`)
})
const dbConnect=require('./config/database');
dbConnect().then(() => {
    seedDefaultCategories().catch((error) => {
        console.error("Default category seed failed", error);
    });
    // Create dummy user after database connection
    createDummyUser();
    seedSampleCourses().catch((error) => {
        console.error("Sample course seed failed", error);
    });
});

//routes
app.use("/api/v1/auth",userRoutes)
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/course",courseRoutes)
app.use("/api/v1/payment",paymentRoutes)
app.use("/api/v1/reach",contactUsRoute)

//default route
app.get('/',(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Default route working successfully"
    })
})
