import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request } from "../models/request.model.js";
import mongoose from "mongoose";
import { avatars } from "../../public/avatars/avatars.js";





const sendFriendRequest=asyncHandler(async(req,res)=>{
    const currentUser=req.user;
    if(!currentUser || !currentUser._id){
        throw new ApiError(401,"Unauthorized request");
    }
    const {friendId}=req.params

    if(friendId===currentUser._id.toString()){
        throw new ApiError(400,"Cannot send request to urself")
    }

    const recipient=await User.findById(friendId);

    if(!recipient){
        throw new ApiError(404,"Recipient Not Found");
    }

    const isAlreadyFriend =                                               
        currentUser.friends.some(id => id.toString() === friendId) &&
        recipient.friends.some(id => id.toString() === currentUser._id.toString());

    if(isAlreadyFriend){
        throw new ApiError(400,"Cannot send friend request to an existing friend");
    }

    const existingRequest=await Request.findOne({
        $or:[{to:friendId,from:currentUser._id},
            {to:currentUser._id,from:friendId}
        ]
    })

    if(existingRequest){
        throw new ApiError(400,"Request already exists");
    }

    const newRequest=await Request.create({
        to:friendId,
        from:currentUser._id
    })

    return res
    .status(201)
    .json(new ApiResponse(201,newRequest,"Request send successfully"))
})


const acceptRequest=asyncHandler(async(req,res)=>{
    const currentUser=req.user; //recipient
    const {requestId}=req.params;
    if(!currentUser || !currentUser._id){
        throw new ApiError(401,"Unauthorized request");
    }

    if(!requestId){
        throw new ApiError(400,"Request Id required");
    }

    const request=await Request.findById(requestId);

    if(!request){
        throw new ApiError(404,"Request not Found")
    }

    if(!request.to.equals(currentUser._id)){
        throw new ApiError(404,"You are not authorized to accept the request")
    }

    request.accepted=true;
    await request.save();

    await User.findByIdAndUpdate(request.from,{     // add myself to sender's friendlist
        $addToSet:{friends:currentUser._id}
    })

    await User.findByIdAndUpdate(currentUser._id,{       // add the sender to my friend list
        $addToSet:{friends:request.from}
    })

    return res
    .status(200)
    .json(new ApiResponse(200,request,"Request accepted successfully"))
})

const getFriendRequests=asyncHandler(async(req,res)=>{
    const currentUser=req.user;
    if(!currentUser || !currentUser._id){
        throw new ApiError(401,"Unauthorized request");
    }

    const friendRequests=await Request.aggregate([
        {
            $match:{
                to:new mongoose.Types.ObjectId(currentUser._id),
                accepted:false
            }
        },
        {
            $lookup:{
                from:'users',
                localField:"from",
                foreignField:"_id",
                as:"sender",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            fullname:1,
                            avatar:1,
                            humor:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                from:{
                    $first:"$sender"
                }
            }
        },
        {
            $project:{
                from:1,
                accepted:1
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200,friendRequests,"friend Requests fetched successfully"))
})

const getAcceptedRequests=asyncHandler(async(req,res)=>{
    const currentUser=req.user;
    if(!currentUser || !currentUser._id){
        throw new ApiError(401,"Unauthorized request");
    }

    const acceptedRequests=await Request.aggregate([
        {
            $match:{
                from:new mongoose.Types.ObjectId(currentUser._id),
                accepted:true
            }
        },
        {
            $lookup:{
                from:'users',
                localField:'to',
                foreignField:"_id",
                as:"newFriend",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            fullname:1,
                            avatar:1,
                            humor:1
                        }
                    }
                ]
            }
        },
        {
            $unwind:"$newFriend"
        },
        {
            $project:{
                newFriend:1,
                accepted:1
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200,acceptedRequests,"Accepted Requests fetched successfully"))
})

const getOutgoingRequest=asyncHandler(async(req,res)=>{
    const currentUser=req.user;
    if(!currentUser || !currentUser._id){
        throw new ApiError(401,"Unauthorized request");
    }

    const outgoingRequests=await Request.aggregate([
        {
            $match:{
                from:new mongoose.Types.ObjectId(currentUser._id),
                accepted:false
            }
        },
        {
            $lookup:{
                from:"users",
                localField:'to',
                foreignField:"_id",
                as:"toUser",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            fullname:1,
                            avatars:1,
                            humor:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                to:{
                    $first:"$toUser"
                }
            }
        },
        {
            $project:{
                toUser:0
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200,outgoingRequests,"Outgoing Requests fetched successfully"));  
})

export {sendFriendRequest,
        acceptRequest,
        getFriendRequests,
        getAcceptedRequests,
        getOutgoingRequest
}