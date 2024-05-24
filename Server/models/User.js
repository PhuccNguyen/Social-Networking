import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minlength: 2,  
            maxlength: 50, 
        },
        lastName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50,
        },
        userName: {
            type: String,
            required: true,
            maxlength: 25,
            unique: true,
        },
        mobile: {
            type: String,
            required: true,
            maxlength: 20,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            maxlength: 50,
            unique: true,
        },
        intro: {
            type: String,
            required: true,
            maxlength: 100,
            unique: true,
        },
        address: {
            type: String,
            required: true,
            maxlength: 100,
        },
        gender: {
            type: String,
            required: true,
            maxlength: 50,
        },
        birthday: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            required: true,
            maxlength: 50,
        },
        password: {
            type: String,
            required: true,
            minlength: 5,
        },
        picturePath: {
            type: String,
            default: "",    
        },
        friends: {
            type: Array,
            default: [],
        },
        location: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number,


        lastLogin: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
