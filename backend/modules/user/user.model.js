import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true
     },
     email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
     },
     password: {
        type: String,
        required: true,
        minLength: [6, "password must be atleast 6 characters"]
     },
     role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
     }
},{ timestamps: true });

const userModel = mongoose.model("User", userSchema);
export default userModel;