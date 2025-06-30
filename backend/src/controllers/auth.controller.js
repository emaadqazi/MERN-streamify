import User from "../models/Users.js";
import jwt from "jsonwebtoken";

export async function Signup (req, res) {
    const {email,password,fullName} = req.body;

    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({message: "All fields are required"});
        }

        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "Email already exists, please use a different one"});
        }

        const index = Math.floor(Math.random() * 100) + 1; // generates random # from 1-100
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        });

        const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, //prevents XSS attacks 
            sameSite: "strict", //prevent CSRF attacks
            secure: process.env.NODE_ENV == "production"
        })

        res.status(201).json({success:true, user:newUser});

    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({message: "Internal server error"});
    
    }
}

export async function Login (req, res) {
    try {
        const { email, password } = req.body;

        if (!email | !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({message: "Invalid email or password"});
        
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) return res.status(401).json({message: "Invalid email or password"});

        const token = jwt.sign({ userID: user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV == "production",
        });

        res.status(200).json({success: true, user});

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function Logout (req, res) {
    res.clearCookie("jwt"); // we named the token 'jwt'
    res.status(200).json({success: true, message: "Logout successful"});
}