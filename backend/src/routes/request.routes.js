import { Router } from "express";
import { acceptRequest,
     getAcceptedRequests,
      getFriendRequests, 
      getOutgoingRequest, 
      sendFriendRequest } from "../controllers/request.controllers.js";
import { verifyJWT } from "../middlewares/authmiddleware.js";


const router=Router()

router.route("/send-request/:friendId").post(verifyJWT,sendFriendRequest);
router.route("/friend-request/:requestId/accept").put(verifyJWT,acceptRequest)
router.route("/friend-request/new").get(verifyJWT,getFriendRequests)
router.route("/friend-request/accepted").get(verifyJWT,getAcceptedRequests)
router.route("/friend-request/ongoing").get(verifyJWT,getOutgoingRequest)


export default router