import express from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/user";
import { generateToken } from "../util/tokenUtils";
import { authValidation } from "../util/tokenUtils";

const router = express.Router();

router.post("/login", authValidation, async (req, res) => {
    const person = await UserModel.findOne({ "username": req.body.username.toLowerCase() }, "username password");

    if (person) {

        return bcrypt.compare(req.body.password, person.password as string, function (err, result) {
            if (err) {
                return res.status(400).send({ message: "error", error: "password required" });
            } else {
                const token = generateToken(req.body.username);
                return res.status(200).json({ message: "login successful", token: token });
            }
        });
    }

    return res.status(400).send({ message: "incorrect log in details", error: "The username or password entered is incorrrect" });
});

router.post("/register", authValidation, async (req, res) => {

    const saltRounds = 10;

    const person = await UserModel.findOne({ "username": req.body.username.toLowerCase() }, "username password");

    if (person) {
        return res.status(400).send({ message: "Inavlid username", error: "The selected username is not available" });
    }

    return bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return;
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) {
                return res.status(400).send({ message: "error", error: "password required" });
            } else {

                const user = new UserModel({
                    username: req.body.username.toLowerCase(),
                    password: hash,
                    preferredName: "",
                    profileImage: "",
                    DOB: "",
                    friends: []
                });

                return user.save()
                    .then(() => {
                        const token = generateToken(req.body.username);
                        return res.status(200).json({ message: "successfully registered", token: token });
                    })
                    .catch((e) => {
                        return res.status(400).send({ message: "validation error", error: e.message });
                    });
            }
        });
    });
});

export { router as authenticationController };