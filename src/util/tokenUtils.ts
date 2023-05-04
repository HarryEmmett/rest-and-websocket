import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { FormattedRequest, JwtToken } from "../types/types";

const mySecret = "realSecureKey";

const invalidTokenMessage = {
    message: "Invalid token provided",
    error: "Please provide a valid Bearer token"
};

export const generateToken = (username: string): string => {

    const token = jwt.sign({ user: username.toLowerCase() }, mySecret, { expiresIn: "10m" });

    return token;
};

export const checkToken = (
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

    if (req.body.password.length < 5 || req.body.username.length < 5) {
        return res.status(400).send({
            message: "Password or Username too short",
            error: "The password & username needs to be greater than 5 characters"
        });
    }

    next();
};

export const validUserRequest = (
    req: Request, res: Response, next: NextFunction
): Response | void => {

    const { username } = req.params;
    const { user } = (req as FormattedRequest).token;

    if (username !== user) {
        return res.status(401).send({ message: "unauthorized access", error: "You can only edit your own items" });
    }

    next();
};