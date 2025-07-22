import express from "express";
import { Signup, Logout, Login, Onboard } from "../controllers/auth.controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = express.Router()

// POST methods are for routes that are going to change the server's state 
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/onboarding", protectRoute, Onboard)

// Route to check if user is currently logged in
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({success: true, user: req.user});
});

export default router;