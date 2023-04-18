import mongoose from "mongoose";

const { Schema, model } = mongoose;

const comment = new Schema({
    postId: { type: String, required: true, ref: "posts" },
    parentCommentId: { type: Schema.Types.ObjectId, required: false },
    contents: String,
    userId: String,
    nLikes: { type: String, default: 0 }
});

const CommentModel = model("comments", comment);

export default CommentModel;