import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../../../../YouDemy/BACKEND/src/utils/ApiResponse.js";
import {uploadInCloudinary} from "../utils/cloudinary.js"
import { Post } from "../models/post.model.js";

const uploadPost=asyncHandler(async(req,res)=>{
    const currentUser=req.use;
    if(!currentUser || currentUser._id){
        throw new ApiError(401,"Unauthorized request");
    }
    const {caption}=req.body;

    const imagePath=req.files?.path;

    if(!imagePath){
        throw new ApiError(404,"Post not Found");
    }

    const post=await uploadInCloudinary(imagePath);
    if(!post){
        throw new ApiError(500,"Failed to upload in cloudinary");
    }

    const newPost=await Post.create({
        image:post.url,
        caption:caption||"",
        owner:currentUser._id
    })

    if(!newPost){
        throw new ApiError(500,"Failed to post");
    }

    return res
    .status(201)
    .json(new ApiResponse(201,newPost,"Posted successfully"))

})

export {
    uploadPost
}