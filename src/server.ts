import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { appConfig } from "./config/appConfig";
import { authenticationController } from "./routes/authenticationController";
import { userProfileController } from "./routes/userProfileController";
import { userFriendController } from "./routes/userFriendController";
import { postController } from "./routes/postController";
import { websocket } from "./routes/websocket";

const app = express();

// create server
const server = http.createServer(app);

// add socket io server on top
const io = new Server(server, {
    cors: {
        origin: appConfig.clientUrl
    }
});

try {
    await mongoose.connect(`${appConfig.mongoUrl}/${appConfig.mongoCollection}`);
    console.log("connected to the database");
} catch (error) {
    console.log("can't connect to the database");
}

app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"] }));
app.set("socketio", io);
app.use("/", authenticationController);
app.use("/userProfile", userProfileController);
app.use("/friends", userFriendController);
app.use("/posts", postController);
websocket(app);

server.listen(appConfig.serverPort, () => {
    console.log(`listening on port ${appConfig.serverPort}`);
});