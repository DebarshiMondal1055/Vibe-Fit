import {Router} from "express"
import { verifyJWT } from "../middlewares/authmiddleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deletePost, getUserPost, uploadPost } from "../controllers/post.controllers.js";

const router=Router();


router.use(verifyJWT);


router.route("/upload").post(upload.single("image"),uploadPost)
router.route("/delete-post/:postId").post(deletePost);
router.route("/user-posts/:userId").get(getUserPost)

export default router