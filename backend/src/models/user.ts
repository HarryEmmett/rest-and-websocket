import mongoose from "mongoose";
import { IUser } from "../types/types";

const { Schema, model } = mongoose;

//schema uses strict: true only lets you place values specified in schema
const user: mongoose.Schema<IUser> = new Schema({
    username: { 
      required: true, 
      type: String, 
      index: 
      { 
        unique: true 
      }
    },
    password: { 
      required: true, 
      type: String 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    preferredName: String,
    profileImage: Buffer,
    DOB: { 
      type: Date,
      default: undefined,
      trim: true,
    },
    friends: { 
      type: [
        {
          username: {
            type: String
          },
          status: {
            type: String, 
            enum: ["PENDING", "ACCEPTED", "DECLINED"],
            default: "PENDING",
            required: false
          },
          createdAt: { 
            type: Date, 
            default: Date.now,
            required: false,
            trim: true
          }
        }
      ], 
    }
});

const UserModel: mongoose.Model<IUser> = model("users", user);

export default UserModel;

// validate: 
// {
//     validator: (arr: any) => {
//       console.log(arr);
//       const s = new Set(arr.map(String));
//       console.log(s);
//       return "hello";
//     },
    
//     message: (p: any) => `The values provided for '${ p.path }', ` +
//                   `[${ p.value }], contains duplicates.`,
//   }

// }
//    friends: [String]