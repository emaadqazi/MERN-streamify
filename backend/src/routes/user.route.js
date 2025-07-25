import express from "express"; 
import { protectRoute } from "../../middleware/auth.middleware.js";

import {
    getMyFriends,
    getRecommendedUsers,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequest,
    outgoingFriendRequests
} from "../controllers/user.controller.js";

const router = express.Router();

// apply auth middleware to all of the routes (protectRoute)
router.use(protectRoute);
router.get("/", getRecommendedUsers)
router.get("/friends", getMyFriends)
router.post("friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest)
router.get("/friend-requests", getFriendRequest)
router.get("/outgoing-friend-requests", outgoingFriendRequests)
export default router; 