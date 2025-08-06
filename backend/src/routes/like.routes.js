import { Router } from "express";
import { getLikeCount, toggleLike } from "../controllers/likes.controller.js";
import { verifyJWT } from "../middlewares/authmiddleware.js";

const router=Router();

router.use(verifyJWT)

router.route("/toggle-like/:postId").post(toggleLike);
router.route("/get-likes/:postId").get(getLikeCount)

export default router