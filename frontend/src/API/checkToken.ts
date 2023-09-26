import axios from "axios";
import { IUser } from "../types/types";
import { config } from "../config/config";

export const checkToken = async (token: string | null):
    Promise<Pick<IUser, "expires" | "username" | "token" | "profileImage">> => {
    try {
        const res = await axios.get(`${config.serverUrl}/checkToken`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const diff = res.data.expires * 1000 - new Date().getTime();
        return {
            expires: diff,
            username: res.data.username,
            profileImage: res.data.profileImage,
            token: res.data.token
        };
    } catch (e: any) {
        throw new Error(e);
    }
};