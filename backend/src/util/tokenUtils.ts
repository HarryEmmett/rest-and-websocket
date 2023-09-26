import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { FormattedRequest, JwtToken } from "../types/types";

const mySecret = "realSecureKey";

const invalidTokenMessage = {
    message: "Invalid token provided",
    error: "Please provide a valid Bearer token"
};

export const generateTokens = (username: string): { refreshToken: string, accessToken: string } => {

    const refreshToken = jwt.sign({ user: username.toLowerCase() }, mySecret, { expiresIn: "30m" });
    const accessToken = jwt.sign({ user: username.toLowerCase() }, mySecret, { expiresIn: "5m" });

    return { refreshToken, accessToken };
};

export const checkAccessToken = (
    req: Request, res: Response, next: NextFunction
): Response | void => {
    const header = req.headers["authorization"] as string;
    const token = header?.split("Bearer ")[1];

    if (token) {
        try {
            const validToken = jwt.verify(token, mySecret) as jwt.JwtPayload;
            (req as FormattedRequest).token = { token, ...validToken } as JwtToken;
            next();
        } catch (e) {
            return res.status(401).send({ message: "Error with token", error: e.message });
        }
    } else {
        return res.status(401).send({ message: "Error with token", error: invalidTokenMessage });
    }
};

export const authValidation = (
    req: Request, res: Response, next: NextFunction
): Response | void => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({
            message: "Please provide a username and password",
            error: "Either a username or password was not provided"
        });
    }

    if (typeof req.body.password !== "string" || typeof req.body.username !== "string") {
        return res.status(400).send({
            message: "Invalid username or password format",
            error: "The password or username needs to a type of string"
        });
    }

    const user = checkValidUsername(req.body.username);
    const pass = checkValidPassword(req.body.password);

    if (!user || !pass) {
        return res.status(400).send({
            message: "Invalid format",
            error: "Please provide the correct format"
        });
    }

    next();
};

export const validUserRequest = (
    req: Request, res: Response, next: NextFunction
): Response | void => {

    // TODO not sending the editing profile name here does this even need to
    // check for this can only edit yours anyway

    const { username } = req.params;
    const { user } = (req as FormattedRequest).token;

    if (username !== user) {
        return res.status(401).send({ message: "unauthorized access", error: "You can only edit your own items" });
    }

    next();
};

export const checkValidUsername = (credential: string): boolean => {
    const regex = /^[A-Za-z0-9]*$/;
    return regex.test(credential);
};

export const checkValidPassword = (credential: string): boolean => {
    const regex = /^[A-Za-z0-9]*$/; // todo change to password one
    return regex.test(credential);
};