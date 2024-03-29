import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/user";
import { checkValidUsername, generateTokens } from "../util/tokenUtils";
import { authValidation } from "../util/tokenUtils";

const mySecret = "realSecureKey";

const router = express.Router();

router.get("/checkRefreshToken", async (req, res) => {
    const header = req.headers["authorization"] as string;
    const token = header?.split("Bearer ")[1];

    try {
        const vtoken = jwt.verify(token, mySecret) as jwt.JwtPayload;
        const accessToken = jwt.sign({ user: vtoken.user.toLowerCase() }, mySecret, { expiresIn: "5m" });
        const { exp } = jwt.verify(accessToken, mySecret) as jwt.JwtPayload;
        return res.status(200).send(
            {
                accessToken,
                expires: exp
            }
        );
            
    } catch (e) {
        console.log(e);
        return res.status(401).send({ message: "Error with token", error: e.message });
    }
});

router.post("/login", authValidation, async (req, res) => {
    const person = await UserModel.findOne({ "username": req.body.username.toLowerCase() }, "username password profileImage");

    if (person) {
        return bcrypt.compare(req.body.password, person.password as string, function (err, success) {
            if (err) {
                return res.status(400).send({ message: "error", error: "something went wrong" });
            } else {
                if (success) {
                    const tokens = generateTokens(req.body.username);
                    return res.status(200).json(
                        {
                            message: "login successful",
                            jwt: {
                                tokens,
                                username: req.body.username
                            }
                        }
                    );
                }
                return res.status(400).send({ message: "incorrect log in details", error: "login unsuccessful" });
            }
        });
    }

    return res.status(400).send({ message: "incorrect log in details", error: "login unsuccessful" });
});

router.post("/register", authValidation, async (req, res) => {

    const { username, password } = req.body;

    if (username === password) {
        return res.status(400).send({ message: "Inavlid request", error: "Password must be different to username" });
    }

    const saltRounds = 10;

    const person = await UserModel.findOne({ "username": username.toLowerCase() }, "username password");

    if (person) {
        return res.status(400).send({ message: "Inavlid username", error: "The selected username is not available" });
    }

    return bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return;
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                return res.status(400).send({ message: "error", error: "something went wrong" });
            } else {

                const user = new UserModel({
                    username: username.toLowerCase(),
                    password: hash,
                    preferredName: "",
                    profileImage: "",
                    DOB: "",
                    friends: []
                });

                return user.save()
                    .then(() => {
                        const tokens = generateTokens(username);
                        return res.status(200).json({
                            message: "successfully registered",
                            jwt: {
                                tokens,
                                username: username
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

// REFACTOR ???
router.post("/reset", async (req, res) => {

    const { newPassword, oldPassword } = req.body;

    const user = checkValidUsername(newPassword);

    if (!user) {
        return res.status(400).send({
            message: "Invalid format",
            error: "Please provide the correct format"
        });
    }

    const person = await UserModel.findOne({ "username": req.body.username.toLowerCase() }, "username password");

    if (person) {
        return bcrypt.compare(newPassword, person.password as string, function (err, success) {
            if (err) {
                return res.status(400).send({ message: "error", error: "something went wrong" });
            } else {
                if (success) {
                    return res.status(401).send({ message: "error", error: "please provide a new password" });
                } else {
                    return bcrypt.compare(oldPassword, person.password as string, function (err, success) {
                        if (err) {
                            return res.status(400).send({ message: "error", error: "something went wrong" });
                        } else {
                            if (success) {
                                const saltRounds = 10;

                                return bcrypt.genSalt(saltRounds, function (err, salt) {
                                    if (err) return;
                                    bcrypt.hash(req.body.newPassword, salt, async function (err, hash) {
                                        if (err) {
                                            return res.status(400).send({ message: "error", error: "something went wrong" });
                                        } else {
                                            person.password = hash;
                                            await person.save();
                                            return res.status(200).send({ message: "success", error: "password updated" });
                                        }
                                    });
                                });
                            } else {
                                return res.status(401).send({ message: "error", error: "incorrect password" });
                            }
                        }
                    });
                }
            }
        });
    }

    return res.status(400).send({ message: "incorrect log in details", error: "Please provide an existing username" });
});

export { router as authenticationRoute };