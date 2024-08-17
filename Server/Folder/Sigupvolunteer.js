import mongoose from "mongoose";

const SignupVolunteerSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "VolunteerEvent",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        signupDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const SignupVolunteer = mongoose.model("SignupVolunteer", SignupVolunteerSchema);
export default SignupVolunteer;
