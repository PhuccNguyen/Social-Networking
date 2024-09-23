import mongoose from "mongoose";
 
const PostSchema = new mongoose.Schema (
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: String,
        destination: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        createDate: Date,
        status: String,
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: [
            {
                userId: String,
                firstName: String,
                userPicturePath: String,
                commentText: String,
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            }
        ],
    },
    { timestamps: true}
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
