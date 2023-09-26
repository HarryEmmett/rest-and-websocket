import axios from "axios";
import { IPostsResponse } from "../types/types";
import { config } from "../config/config";

export const getNumberOfPosts = async (token: string, paginationBody: { from: number, to: number }): Promise<IPostsResponse> => {
    try {
        const res = await axios.post(`${config.serverUrl}/posts/getNumPosts`, paginationBody, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        return res.data.data;
    } catch (e: any) {
        throw new Error(e.response.data);
    }
};