import { Router } from "express";
import { getMyFriends,
     getRecommendedUser, 
     getUserProfile} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/authmiddleware.js";



const router=Router()
router.use(verifyJWT)


router.route("/").get(getRecommendedUser)
router.route("/friends").get(getMyFriends)
router.route("/get-user-profile/:userId").get(getUserProfile)

export default router;