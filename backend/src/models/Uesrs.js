import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String, 
        required: true,
    },
    email: {
        type: String,
        required: true,
        unioque: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    bio: {
        type: String,
        default: "",
    },
    profilePic: {
        type: String,
        default: "",
    },
    nativeLanguage: {
        type: String,
        default: "",
    },
    learningLanguage: {
        type: String,
        default: "",
    },
    isOnBoarded: {
        type: Boolean,
        default: false,
    },
    friends: [
        {
            type: mongoose.Schenma.Types.ObjectId,
            ref: "User",
        }
    ],
}, 
{timestamps:true}
); 

const User = mongoose.model("User", userSchema);

// Making the pre hook and hashing the password for User
userSchema.pre("save", async function(next) {

    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error)
    }
});

export default User;