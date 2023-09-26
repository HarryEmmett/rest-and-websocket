export interface IUser {
    username: string,
    profileImage: string,
    expires: number | undefined,
    token: string,
    auth: boolean
}

export interface IAuthProvider {
    user: IUser,
    login: (user: IUser) => void,
    logout: () => void;
    editUser: (edit: { [key: string]: string }) => void;
}

export interface IUserProfile {
    username: string;
    DOB: string;
    preferredName: string;
    profileImage: string;
}

export interface ILogin {
    username: string;
    password: string;
}

export interface IUpdateDetails {
    username: string;
    oldPassword: string;
    newPassword: string;
}

export interface IPosts {
    title: string;
    contents: string;
    createdBy: string;
    nLikes: number;
    nComments: number;
    createdAt: string;
    _id: string;
}

export interface IPostsResponse {
    posts: IPosts[];
    total: number;
}