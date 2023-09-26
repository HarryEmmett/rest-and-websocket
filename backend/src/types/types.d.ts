import { Request } from "express";
import { Document } from "mongoose";

export interface JwtToken {
    token: string;
    user: string;
    iat: number;
    exp: number
}
export interface FormattedRequest extends Request {
    token: JwtToken;
}

export interface RequestParams {
    username: string;
}

export interface UpdateDetails {
    [key: string]: string | Date | Buffer;
}

export interface IUser extends Document {
    username: string;
    password: string;
    createdAt: Date;
    friends: {
        createdAt: Date;
        status: string;
        username: string | undefined;
    }[];
    preferredName: string | undefined;
    profileImage: Buffer | undefined;
    DOB: Date | undefined;
}

export interface IFormattedUser {
    username: string;
    password: string;
    createdAt: Date;
    friends: {
        createdAt: Date;
        status: string;
        username?: string;
    }[];
    preferredName?: string;
    profileImage: string;
    DOB?: Date;
}

export interface IUserRequest {
    friends: string;
    status: "PENDING" | "ACCEPTED" | "DECLINED";
    preferredName: string;
    profileImage: string;
    DOB: Date;
}