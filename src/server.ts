import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { appConfig } from "./config/appConfig";
import { authenticationRoute } from "./routes/authenticationRoute";
import { userProfileRoute } from "./routes/userProfileRoute";
import { userFriendRoute } from "./routes/userFriendRoute";
import { postRoute } from "./routes/postRoute";
import { websocket } from "./routes/websocket";

const app = express();

// // use middleware
app.use(express.json({limit: "10mb"}));
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"] }));
app.use("/", authenticationRoute);
app.use("/userProfile", userProfileRoute);
app.use("/friends", userFriendRoute);
app.use("/posts", postRoute);

// create server
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: appConfig.clientUrl
    }
});

// app.set("socketio", io);
// websocket(app);

try {
    await mongoose.connect(`${appConfig.mongoUrl}/${appConfig.mongoCollection}`);
    console.log("connected to the database");
} catch (error) {
    console.log("can't connect to the database");
}

server.listen(appConfig.serverPort, () => {
    console.log(`listening on port ${appConfig.serverPort}`);
});