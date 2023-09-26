import axios from "axios";
import { IUser, IUserProfile } from "../types/types";
import { config } from "../config/config";

export const getProfile = async (user: string, token: string): Promise<IUserProfile> => {

    try {
        const res = await axios.get(`${config.serverUrl}/userProfile/${user}/get`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        
        return res.data.data;
    } catch (e: any) {
        throw new Error(e.response.data.error);
    }
};

export const updateUserProfile = async (details: Partial<IUserProfile>, user: IUser): Promise<{message: string; user: IUserProfile}> => {
    try {
        const res = await axios.put(`${config.serverUrl}/userProfile/${user.username}/edit`, details, {
            headers: {
                "Authorization": "Bearer " + user.token
            },
        });
        
        // everything else returning .data.data but this .data.user change?
        return res.data;
    } catch (e: any) {
        throw new Error(e.response.data.error);
    }
};