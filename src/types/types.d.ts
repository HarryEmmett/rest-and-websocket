import { Request } from "express";

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

export interface RequestBody {
    friends: string;
    status: "PENDING" | "ACCEPTED" | "DECLINED"
    preferredName: string,
    profileImage: string,
    DOB: Date;
}