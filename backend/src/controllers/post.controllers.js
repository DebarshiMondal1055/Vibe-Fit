import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {deleteInCloudinary, uploadInCloudinary} from "../utils/cloudinary.js"
import { Post } from "../models/post.model.js";
import mongoose from "mongoose";

const uploadPost=asyncHandler(async(req,res)=>{
    const currentUser=req.user;
    if(!currentUser || !currentUser._id){
        throw new ApiError(401,"Unauthorized request");
    }
    const {caption}=req.body;

    const imagePath=req.file?.path;

    if(!imagePath){
        throw new ApiError(400,"Post not Found");
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

const deletePost=asyncHandler(async(req,res)=>{
    const currentUser=req.user;
    if(!currentUser || !currentUser._id){
        throw new ApiError(401,"Unauthorized request");
    }
    
    const {postId}=req.params;

    const post=await Post.findById(postId)

    if(!post){
        throw new ApiError(404,"No such post Found");
    }

    if(!post.owner.equals(currentUser._id)){
        throw new ApiError(401,"Unauthorized to delete post");
    
    }
    
    const deletedPost=await Post.findByIdAndDelete(postId);
    
    const removedPost=await deleteInCloudinary(deletedPost.image,'image');
    if(!removedPost){
        throw new ApiError(500,"Failed to delete from Cloudinary")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,deletedPost,"Post deleted successfully"));
})


const getUserPost=asyncHandler(async(req,res)=>{
    const {userId}=req.params;

    if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
        throw new ApiError(400,"Invalid user ID");
    }
    const posts=await Post.find({owner:userId});

    return res
    .status(200)
    .json(new ApiResponse(200,posts,"Post fetched successfully"))
})


export {
    uploadPost,
    deletePost,
    getUserPost
}