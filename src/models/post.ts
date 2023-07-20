import mongoose from "mongoose";

const { Schema, model } = mongoose;

const post = new Schema({
    contents: { type: String, required: true },
    createdBy: { type: String, required: true },
    nLikes: { type: Number, default: 0 },
    nComments: { type: Number, default: 0 },
    createdAt: { 
        type: Date, 
        default: Date.now,
        required: false,
        trim: true
      }
});

const PostModel = model("posts", post);

export default PostModel;