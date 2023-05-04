import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/user";
import { generateToken } from "../util/tokenUtils";
import { authValidation } from "../util/tokenUtils";

const mySecret = "realSecureKey";

const router = express.Router();

router.get("/checkToken", (req, res) => {

    const header = req.headers["authorization"] as string;
    const token = header?.split("Bearer ")[1];

    try {
        const vtoken = jwt.verify(token, mySecret) as jwt.JwtPayload;
        return res.status(200).send({ expires: vtoken.exp });
    } catch (e) {
        return res.status(401).send({ message: "Error with token", error: e.message });
    }
});

router.post("/login", authValidation, async (req, res) => {
    const person = await UserModel.findOne({ "username": req.body.username.toLowerCase() }, "username password");

    if (person) {

        return bcrypt.compare(req.body.password, person.password as string, function (err) {
            if (err) {
                return res.status(400).send({ message: "error", error: "password required" });
            } else {
                const token = generateToken(req.body.username);
                return res.status(200).json(
                    {
                        message: "login successful",
                        jwt: {
                            token: token,
                            username: person.username
                        }
                    }
                );
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
                        return res.status(200).json({
                            message: "successfully registered", 
                            jwt: {
                                token: token,
                                username: req.body.username
                            }
                        });
                    })
                    .catch((e) => {
                        return res.status(400).send({ message: "validation error", error: e.message });
                    });
            }
        });
    });
});

// TODO update password route

export { router as authenticationController };