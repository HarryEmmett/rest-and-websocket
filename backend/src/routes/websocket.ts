// @ts-nocheck
// import { Express } from "express";
// import { verifyToken } from "../util/tokenUtils";
// import { Server } from "socket.io";

export const websocket = (app: Express): void => {

    // const io: Server = app.get("socketio");

    // io.on("connection", (socket: any) => {
    //     console.log(socket.user);
    // });
//         //io.disconnectSockets();
//         console.log("hello");
//         socket.on("login", ({ name, room }, errorCallback) => {
//             console.log(socket.handshake.auth.token, "token");
//             try {
//                 verifyToken(socket.handshake.auth.token);
//                 socket.join("room1");
//                 socket.in("room1").emit("notification", {title: "someone connected", description: "randomuser"})
//             } catch (e) {
//                 errorCallback(e.message);

//             }
//         });

//         // socket.on("login", (test) => {
//         //     console.log(socket.id);
//         //     console.log(test);
//         // });

//         // console.log(a.handshake.auth.token + " connected");
//     });
};
