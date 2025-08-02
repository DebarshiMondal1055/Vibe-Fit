import { Router } from "express";
import { getMyFriends,
     getRecommendedUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/authmiddleware.js";



const router=Router()
router.use(verifyJWT)


router.route("/").get(getRecommendedUser)
router.route("/friends").get(getMyFriends)

export default router;