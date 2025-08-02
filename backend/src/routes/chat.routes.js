import { Router } from "express";
import { verifyJWT } from "../middlewares/authmiddleware.js";
import { getStreamToken } from "../controllers/chat.controllers.js";

const router=Router();
router.use(verifyJWT);
router.route("/token").get(getStreamToken)

export default router;