import { Router } from "express";
import { loginUser, logoutUser,
     onBoardUser,
     registerUser } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/authmiddleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { upload } from "../middlewares/multer.middleware.js";


const router=Router();



router.route("/signup").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/onboard").post(verifyJWT,
    upload.single("avatar"),
     onBoardUser)
router.route("/me").get(verifyJWT,asyncHandler(async(req,res)=>{
     return res.status(200).json(new ApiResponse(200,req.user,"User fetched successfully"));
}))


export default router;