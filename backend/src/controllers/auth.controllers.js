import path from "path";
import { ApiResponse } from "../utils/ApiResponse.js";
import { avatars } from "../../public/avatars/avatars.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadInCloudinary } from "../utils/cloudinary.js";
import { createStreamUser } from "../utils/createStreamUser.js";

const generateAccessAndRefreshToken=async(userId)=>{
        try{
            const user=await User.findById(userId);
            const accessToken=user.generateAccessToken();
            const refreshToken=user.generateRefreshToken();
            user.refreshToken=refreshToken;
            await user.save({ validateBeforeSave:false })
            return {accessToken,refreshToken}
        }
        catch(error){
            throw new ApiError(500,"Token generation failed");
        }
}

const registerUser=asyncHandler(async(req,res)=>{
    const {fullname,username,email,password}=req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!fullname || !username || ! email || !password || password.length<8 || !emailRegex.test(email)){
        throw new ApiError(400,"All fields are required or invalid format");
    }

    const exists=await User.findOne({
        $or:[{username},{email}]
    })

    if(exists){
        throw new ApiError(400,"Username/Email already taken");
    }

    const idx=Math.floor(Math.random()*12);

    const randomAvatar=`https://api.dicebear.com/9.x/adventurer/svg?seed=${avatars[idx]}`;
    
    const options = {
  httpOnly: true,
  sameSite: "None", // ✅ Required for cross-site cookies
  secure: true,     // ✅ Must be true when using sameSite: "None"
};


    const user=await User.create({
        fullname,
        username:username.toLowerCase(),
        email,
        password,
        avatar:randomAvatar
    })
    
    if(!user){
        throw new ApiError(500,"Failed to create new User in database");
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
    
    const newUser=await User.findById(user._id).select("-password -refreshToken");

    if(!newUser){
        throw new ApiError(500,"User creation failed");
    }

    const streamClientUser=await createStreamUser({
        id:newUser._id.toString(),
        name:newUser.fullname,
        image:newUser.avatar||""
    })

    if(!streamClientUser){
        throw new ApiError(500,"Failed to create new client in Stream")
    }

    console.log(streamClientUser)
    return res
    .status(201)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(201,newUser,"User created successfully"))
})

const loginUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body;

    if((!username && !email) || !password){
        throw new ApiError(400,"Required fields not present");
    }
    const normalisedUsername=username?.toLowerCase();
    const user=await User.findOne({
        $or:[{username:normalisedUsername},{email}]         // mongoDb queries take only attribute names not variables..
    });

    if(!user){
        throw new ApiError(404,"No user present");     //404 not found
    }

    const isPasswordCorrect=await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(401,"Incorrect password or username")        //401 unauthorized
    };

    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
    const options = {
        httpOnly: true,
        sameSite: "None", // ✅ Required for cross-site cookies
        secure: true,     // ✅ Must be true when using sameSite: "None"
        };

    const LoggedInUser=await User.findById(user._id).select("-password -refreshToken");
    
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,LoggedInUser,"User logged in successfully"))

})


const logoutUser=asyncHandler(async(req,res)=>{
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized or user not found");
    }
    await User.findByIdAndUpdate(req.user?._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly: true,
        sameSite: "None", // ✅ Required for cross-site cookies
        secure: true,     // ✅ Must be true when using sameSite: "None"
        };

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out successfully"))

})


const onBoardUser=asyncHandler(async(req,res)=>{
    const userId=req.user._id;

    if(!userId){
        throw new ApiError(401,"Unauthorized request");
    }

    const {bio,humor,location}=req.body;
    

    
    if(!bio || !humor || !location){
        throw new ApiError(400,"All fields are required to be onboarded",[
            !bio && "bio",
            !humor && "humor",
            !location && "location"
        ].filter(Boolean));     //to get only the true values
    }

    let avatarLocalPath;
    if(req.file){
        avatarLocalPath=req.file.path;
    }

    const avatar=await uploadInCloudinary(avatarLocalPath);
    console.log(avatar)
    if(avatarLocalPath && !avatar){
        throw new ApiError(500,"Failed to upload in cloudindary");
    }

    const updateData = {
        bio,
        humor:humor.split(","),
        location,
        isOnBoarded: true,
        };


    if(avatar) {
        updateData.avatar = avatar;
    }


    const updatedUser=await User.findByIdAndUpdate(userId,{
        $set:updateData
    },{new:true}).select("-password -refreshToken")     //new=true will give you the object after the updates has been applied

    if(!updatedUser){
        throw new ApiError(500,"Failed to onboard user");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updatedUser,"User onboarded successfully"));


})



export {registerUser,
    loginUser,
    logoutUser,
    onBoardUser
};