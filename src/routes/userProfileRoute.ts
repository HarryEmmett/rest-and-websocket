import express from "express";
import { appConfig } from "../config/appConfig";
import { checkAccessToken, validUserRequest } from "../util/tokenUtils";
import UserModel from "../models/user";
import { IFormattedUser, IUser, RequestParams, UpdateDetails } from "../types/types";
import moment from "moment";
import { base64 } from "../util/userProfileUtil";

const router = express.Router();

router.get("/getAllUsers", checkAccessToken, async (_, res) => {

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

router.get("/:username/get", checkAccessToken, async (req, res) => {

    const { username } = req.params as unknown as RequestParams;

    if (!username) {
        return res.status(400).send({
            message: "bad request", error: "Please provide the correct request body"
        });
    }

    const person: IUser | null = await UserModel.findOne({ "username": username }, appConfig.omitValues);

    if (person) {
        return res.status(200).send({
            message: "success",
            data: base64(person)
        });
    } else {
        return res.status(404).send({
            message: "something went wrong",
            error: "No user found"
        });
    }
});

router.put("/:username/edit", checkAccessToken, validUserRequest, async (req, res) => {
    const userProfileKeys = ["DOB", "preferredName", "profileImage"];
    const { username } = req.params as unknown as RequestParams;

    let date: Date | undefined;
    const updateDetails: UpdateDetails = {};

    const badKey = Object.keys(req.body).filter((r) =>
        !userProfileKeys.includes(r) || typeof req.body[r] !== "string"
    );

    if (badKey.length) {
        return res.status(400).send({ message: "bad request", error: "Please provide the correct keys & format" });
    }

    const reqBody: (UpdateDetails | undefined)[] = userProfileKeys.map((key) => {
        if (req.body[key]) {
            return { [key]: req.body[key] };
        }

        return undefined;
    }).filter((obj) => obj !== undefined);

    // no blank correct keys allowed or ignore for partial update by filtering undefined?
    // if (reqBody.includes(undefined)) {
    //     return res.status(400).send({ message: "bad request", error: "Updating details must not be blank" });
    // }

    for (let i = 0; i < reqBody.length; i++) {
        if (Object.keys(reqBody[i] as Partial<IFormattedUser>).toString() === "DOB") {
            const valid = moment((reqBody[i] as Partial<IFormattedUser>)["DOB"], "YYYY-MM-DD", true).isValid();
            if (valid) {
                date = new Date((reqBody[i] as UpdateDetails)["DOB"] as string);
                // todo trim date
                updateDetails.DOB = date;

            } else {
                return res.status(400).send({ message: "bad request", error: "The date needs to be provided in YYYY/MM/DD format" });
            }
        }
        // could use continue to skip rest of code inside if
        const key = Object.keys(reqBody[i] as UpdateDetails).toString();
        updateDetails[key] = (reqBody[i] as UpdateDetails)[key];
    }

    try {
        const person: IUser | null = await UserModel.findOneAndUpdate(
            { "username": username },
            {
                $set: updateDetails,
            },
            { new: true, fields: appConfig.omitValues }
        );

        if (person) {
            return res.status(200).send({user: base64(person), message: "successfully updated"});
        } else {
            return res.status(400).send({ message: "bad request", error: "user not found" });
        }
    } catch (e) {
        return res.status(400).send({ message: "error with validation", error: e.message });
    }
});

router.delete("/:username/delete", checkAccessToken, validUserRequest, async (req, res) => {

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

export { router as userProfileRoute };