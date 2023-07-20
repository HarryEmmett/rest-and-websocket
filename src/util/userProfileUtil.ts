import { IFormattedUser, IUser } from "../types/types";

export const base64 = (person: IUser): IFormattedUser | IUser => {
   if(!person?.profileImage) return person;

    const base64 = Buffer.from(person.profileImage).toString();
    // toObject returns the _doc values without this will 
    //return loads of values that mongoose filters out as will using the spread operator
    return { ...person.toObject(), profileImage: base64 };

};