import express from "express";
import { appConfig } from "../config/appConfig";
import { checkToken, validUserRequest } from "../util/tokenUtils";
import UserModel from "../models/user";
import { RequestParams } from "../types/types";
import moment from "moment";

const router = express.Router();

router.get("/getAllUsers", checkToken, async (_, res) => {

    const users = await UserModel.find({}, appConfig.omitValues);

    if (users.length > 0) {
        return res.status(200).send({
            message: "success",
            data: users
        });
    } else {
        return res.sendStatus(204);
    }
});

router.get("/:username/get", checkToken, async (req, res) => {

    const { username } = req.params as unknown as RequestParams;

    if (username) {
        return res.status(400).send({
            message: "bad request", error: "Please provide the correct request body"
        });
    }

    const person = await UserModel.findOne({ "username": username }, appConfig.omitValues);

    if (person) {
        return res.status(200).send({
            message: "success",
            data: person
        });
    } else {
        return res.status(401).send({
            message: "something went wrong",
            error: "error with request"
        });
    }
});

router.put("/:username/edit", checkToken, validUserRequest, async (req, res) => {

    const { username } = req.params as unknown as RequestParams;
    const { DOB, profileImage, preferredName } = req.body;
    let date: Date | undefined;

    if (!DOB || !profileImage || !preferredName) {
        return res.status(400).send({
            message: "bad request", error: "Please provide the correct request body"
        });
    }

    const valid = moment(req.body.DOB, "YYYY-MM-DD", true).isValid();
    if (valid) {
        date = new Date(req.body.DOB);
    } else {
        return res.status(400).send({ message: "bad request", error: "The date needs to be provided in YYYY/MM/DD format" });
    }

    try {
        // // add {lean: true} instead of filtering out values?
        const person = await UserModel.findOneAndUpdate(
            { "username": username },
            {
                $set: { ...req.body, DOB: date },
            },
            { new: true, fields: appConfig.omitValues }
        );

        if (person) {
            return res.status(200).send(person);
        } else {
            return res.status(400).send({ message: "bad request", error: "user not found" });
        }
    } catch (e) {
        return res.status(400).send({ message: "error with validation", error: e.message });
    }
});

router.delete("/:username/delete", checkToken, validUserRequest, async (req, res) => {

    const { username } = req.params as unknown as RequestParams;

    UserModel.deleteOne({ "username": username })
        .then(() => res.sendStatus(204))
        .catch((e) =>
            res.status(400)
                .send({
                    message: "an error occurred",
                    error: e.message
                }));
});

export { router as userProfileController };