import mongoose from "mongoose";

const VolunteerEventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: 100,
        },
        description: {
            type: String,
            required: true,
            maxlength: 500,
        },
        location: {
            type: String,
            required: true,
            maxlength: 100,
        },
        date: {
            type: Date,
            required: true,
        },
        organizerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

const VolunteerEvent = mongoose.model("VolunteerEvent", VolunteerEventSchema);
export default VolunteerEvent;
