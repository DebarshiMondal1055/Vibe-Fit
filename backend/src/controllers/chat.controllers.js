
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { generateStreamToken } from "../utils/createStreamUser.js"

const getStreamToken=asyncHandler(async(req,res)=>{
    const currentUser=req.user;         // stream token is required for start chatting , vidoe calling etc.
    if(!currentUser || !currentUser._id){
        throw new ApiError(401,"Unauthorized request");
    }

    const token=await generateStreamToken(currentUser._id);
    if(!token){
        throw new ApiError(500,"Cannot find Stream token");
    }

    return res.status(200).json(new ApiResponse(200,{token},"user stream token fetched successfully"));
})

export {getStreamToken}