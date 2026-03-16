const mongoose=require('mongoose');
require('dotenv').config();
const connect=()=>{
    return mongoose.connect(process.env.DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        family:4
    }).then(()=>{
        console.log("DB CONNECTED")
    }).catch((error)=>{
        console.log("ERROR IN DB "+error)
        process.exit(1);
    })
}
module.exports=connect;
