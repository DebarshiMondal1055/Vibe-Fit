import mongoose from "mongoose";


const requestSchema=new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    accepted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})


export const Request=mongoose.model("Request",requestSchema)