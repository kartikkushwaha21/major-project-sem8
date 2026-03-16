const Tag=require("../models/tags");

//creating controller
exports.Tags=async(req,res)=>{
    try{
        //fetch data from req body
        const{name,description}=req.body;
        //validate data
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        //create entry in db
        const createTag=await Tag.create({name,description})
        return res.status(200).json({
            success:true,
            message:"Tag created successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while creating tag"
        })
    }
}

exports.getAllTags=async(req,res)=>{
    try{
        //get all tags from dbb
        const allTags=await Tag.find({},{name:true,description:true}) //make sure name and description should be there
        return res.status(200).json({
            success:true,
            message:"All tags returned successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while getting all tags"
        })
    }
}