import express from "express"; 
import { protectRoute } from "../middleware/auth.middleware.js";

import {
    getMyFriends,
    getRecommendedUsers,
    sentFriendRequest,
} from "../controllers/user.controller.js";

const router = express.Router();

// apply auth middleware to all of the routes (protectRoute)
router.use(protectRoute);
router.get("/", getRecommendedUsers)
router.get("/friends", getMyFriends)
router.post("friend-request/:id", sendFriendRequest);
export default router; 