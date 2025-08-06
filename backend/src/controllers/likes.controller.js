import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Like } from "../models/likes.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const toggleLike=asyncHandler(async(req,res)=>{
    const currentUser=req.user;
    if(!currentUser || !currentUser._id){
        throw new ApiError(401,"Unauthorized request");
    }


    const {postId}=req.params;

    if(!postId || !mongoose.Types.ObjectId.isValid(postId)){
        throw new ApiError(400,"Invalid post Id");
    }


    const existing=await Like.findOne({post:postId,owner:currentUser._id});

    if(!existing){
        const newLike=await Like.create({
            post:postId,
            owner:currentUser._id
        })
        if(!newLike){
            throw new ApiError(500,"Failed to create the Like");
        }

        return res
        .status(201)
        .json(new ApiResponse(201,newLike,"Liked post"));
    }
    else{
        const deletedLike=await Like.findByIdAndDelete(existing._id);
        if(!deletedLike){
            throw new ApiError(500,"Failed to unlike");
        }

        return res
        .status(200)
        .json(new ApiResponse(200,deletedLike,"Unliked post"))
    }
})

const getLikeCount=asyncHandler(async(req,res)=>{
    const currentUser=req.user;
    if(!currentUser || !currentUser._id){
        throw new ApiError(404,"Unauthorized request");
    }
    const {postId}=req.params;

    if(!postId || !mongoose.Types.ObjectId.isValid(postId)){
        throw new ApiError(400,"Invalid post Id");
    }

    const likedPost=await Like.findOne({post:postId,owner:currentUser._id})

    const likesCount=await Like.countDocuments({post:postId});

    return res
    .status(200)
    .json(new ApiResponse(200,{likesCount,isLiked:!!likedPost},"Likes Count fetched succesfully"));
})

export {
    toggleLike,
    getLikeCount
}