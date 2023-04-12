import mongoose from "mongoose";

const { Schema, model } = mongoose;

//schema uses strict: true only lets you place values specified in schema
const user = new Schema({
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
    profileImage: String,
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

const UserModel = model("users", user);

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