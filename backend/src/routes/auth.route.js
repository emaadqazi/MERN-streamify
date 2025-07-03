import express from "express";
import { Signup, Logout, Login, Onboard } from "../controllers/auth.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = express.Router()

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/onboarding", protectRoute, Onboard)

export default router;