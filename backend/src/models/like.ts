import mongoose from "mongoose";

const { Schema, model } = mongoose;

const like = new Schema({
    liked: Boolean,
    postId: String,
    userId: String,
});

const LikeModel = model("likes", like);

export default LikeModel;