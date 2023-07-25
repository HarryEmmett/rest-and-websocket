import express from "express";
import PostModel from "../models/post";
import LikeModel from "../models/like";
import CommentModel from "../models/comment";
import { checkToken, validUserRequest } from "../util/tokenUtils";

const router = express.Router();

// get all
router.get("/getPosts", checkToken, async (req, res) => {
    try {
        const posts = await PostModel.find({});
        return res.status(200).send(posts);
    } catch (e) {
        return res.status(400).send(e.message);
    }
});

// get number of posts#
// post request as auto scroll request body
router.post("/getNumPosts", checkToken, async (req, res) => {
    const { from, to } = req.body;
    try {
        // TODO -- format date into hours ago
        const posts = await PostModel.find({}).sort({ createdAt: 1 }).skip(parseInt(from)).limit(parseInt(to));
        const total = await PostModel.countDocuments({});
        return res.status(200).send(
            { messgae: "success", data: { posts, total } });
    } catch (e) {
        return res.status(400).send(e.message);
    }
});

// get by id
router.get("/posts/:id", checkToken, async (req, res) => {
    const { id } = req.params;

    const post = await PostModel.findById(id);
    const comments = await CommentModel.aggregate([
        {
            $match:
            {
                postId: id,
                parentCommentId: null,
            },
        },
        {
            $graphLookup: {
                from: "comments",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parentCommentId",
                as: "nestedFields",
                depthField: "depth",
            },
        },
        {
            $unwind: {
                path: "$nestedFields",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $sort: {
                "nestedFields.depth": 1
            }
        },
        {
            $group: {
                "_id": {
                    "_id": "$_id",
                    "postId": "$postId",
                    "contents": "$contents",
                    "userId": "$userId",
                    "nLikes": "$nLikes"
                },
                "commentReplies": {
                    "$push": "$nestedFields"
                }
            }
        }
    ]);

    res.send({ post, comments });

});
// create post
router.post("/createPost", checkToken, async (req, res) => {
    try {
        const post = new PostModel({
            contents: req.body.contents,
            createdBy: req.body.username,
        });

        await post.save();
        return res.sendStatus(200);
    } catch (e) {
        return res.status(400)
            .send({
                message: "an error occurred",
                error: e.message
            });
    }
});
// like post
router.post("/likePost/:id", checkToken, async (req, res) => {

    const { id } = req.params;
    const post = await PostModel.findById(id);

    if (!post) {
        res.status(400).send("No post");
    }

    const liked = await LikeModel.find(
        {
            // match both field query
            $and:
                [
                    { postId: { $regex: req.params.id, $options: "i" } },
                    { userId: { $regex: req.body.username, $options: "i" } }
                ]
        }
    );

    if (liked.length) {
        res.status(400).send(
            {
                message: "User has already liked the post",
                error: "already liked"
            }
        );
    }

    if (post) {
        const like = new LikeModel({
            liked: true,
            postId: req.params.id,
            userId: req.body.username
        });

        post.nLikes = post.nLikes + 1;
        await post.save();
        await like.save();
        res.sendStatus(200);
    }
});
// comment on post
router.post("/commentPost/:id", checkToken, async (req, res) => {

    const { id } = req.params;
    const { contents } = req.body;
    const post = await PostModel.findById(id);

    if (!post) {
        res.status(400).send("No post");
    }

    if (post) {
        const comment = new CommentModel({
            contents: contents,
            postId: req.params.id,
            userId: req.body.username
        });

        post.nComments = post.nComments + 1;
        await post.save();
        await comment.save();
        res.sendStatus(200);
    }
});

router.post("/commentReply/:id/:commentId", checkToken, async (req, res) => {
    const { id } = req.params;
    const { commentId } = req.params;
    const { contents } = req.body;
    const { username } = req.body;
    const post = await PostModel.findById(id);

    if (!post) {
        return res.status(400).send("No post");
    }

    if (post) {
        const comment = new CommentModel({
            contents: contents,
            postId: id,
            userId: username,
            parentCommentId: commentId
        });

        post.nComments = post.nComments + 1;
        await post.save();
        await comment.save();
        return res.sendStatus(200);
    }

    return;
});

// delete post
router.delete("/deletePost/:username/:id", checkToken, validUserRequest, async (req, res) => {

    const { id } = req.params;

    PostModel.deleteOne({ "_id": id })
        .then(() => res.sendStatus(204))
        .catch((e) =>
            res.status(400)
                .send({
                    message: "an error occurred",
                    error: e.message
                }));
});

// update comment
// remove like
// update post

export { router as postRoute };