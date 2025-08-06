import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    caption:{
        type:String,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
},{timestamps:true})

export const Post=mongoose.model("Post",postSchema);