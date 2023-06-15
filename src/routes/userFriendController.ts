import express from "express";
import UserModel from "../models/user";
import { checkToken, validUserRequest } from "../util/tokenUtils";
import { FormattedRequest, IUser, RequestParams } from "../types/types";

const router = express.Router();

router.post("/:username/add", checkToken, validUserRequest, async (req, res) => {

    const { username } = req.params as unknown as RequestParams;
    const { friends } = req.body as IUser;

    if (friends) {
        try {
            // check if the requested user is in the db
            const requestedUser = await UserModel.findOne({ username: friends }, "username -_id");

            if (!requestedUser) {
                // request user not in db
                return res.status(400).send({ message: "bad request", error: `user ${friends} does not exist` });
            }

            if (requestedUser.username === (req as FormattedRequest).token.user) {
                // trying to add own user id
                return res.status(400).send({ message: "bad request", error: "cannot add yourself as a friend" });
            }

            // // find the main user to update the friends list
            const updateUser = await UserModel.findOne({ username: username });
            const checkFriends = updateUser?.friends.some(user => user.username === friends);

            if (checkFriends) {
                // friend already exists
                return res.status(400).send({ message: "bad request", error: `user ${friends} already in friends list` });
            }

            updateUser?.friends.push(
                {
                    username: friends
                }
            );

            await updateUser?.save();
            return res.status(200).send({ message: `success user ${friends} was added` });

        } catch (e) {
            return res.status(400).send({ message: "Bad request", error: e.message });
        }
    } else {
        return res.status(400).send({ message: "Bad request", error: "no friends key was provided" });
    }
});

router.put("/:username/delete", checkToken, validUserRequest, async (req, res) => {

    const { username } = req.params as unknown as RequestParams;
    const { friends } = req.body as IUser;

    await UserModel.updateOne(
        { "username": username },
        {
            $pull: {
                friends: {
                    username: friends
                },
            },
        }
    )
        .then(() => {
            res.status(204).send({
                message: `success ${friends} deleted from your friends list`
            });
        })
        .catch((e) =>
            res.status(400)
                .send({
                    message: "an error occurred",
                    error: e.message
                }));
});

router.put("/:username/request", checkToken, validUserRequest, async (req, res) => {
    const { username } = req.params as unknown as RequestParams;
    const { status, friends } = req.body as IUser;

    if (status && friends) {
        const updateUser = await UserModel.findOne({ username: username });

        const checkFriends = updateUser?.friends.find(user => user.username === friends);

        if (!checkFriends) {
            // friend request hasn't been made
            return res.status(400).send({ message: "bad request", error: `user ${friends} has not created a friend request` });
        }

        if (checkFriends.status === "DECLINED") {
            // user had already declined the request
            return res.status(400).send({ message: "bad request", error: `user ${friends} has already declined the request` });
        }

        try {
            checkFriends.status = status;

            await updateUser?.save();
            return res.status(200).send({ message: `success user ${friends} was added` });
        } catch (e) {
            return res.status(400).send({ message: "bad request", error: e.message });
        }
    } else {
        return res.status(400).send({
            message: "bad request",
            error: "please provide a key of status and friends in the request body"
        });
    }
});
export { router as userFriendController };

// const updatedPerson = await UserModel.findOneAndUpdate({ "username": username },
//     {
//         $addToSet: {
//             friends: {
//                 username: friends
//             },
//         },
//     },
//     {
//         new: true,
//         rawResult: true,
//         fields: appConfig.omitValues,
//     }
// );