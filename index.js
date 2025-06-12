import express from "express";
import http from "http";
import cors from "cors";
import {config} from "dotenv";
import mongoose from 'mongoose';
import {Server} from "socket.io"

import { socketHandler } from "./point/socketHandler.js";
config();
const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const PORT = process.env.PORT || 4001;
const io = new Server(server, {
    cors : {
        origin : "*",
        methods : ["GET", "POST"]
    }
})
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("DB connected");
    } catch (error) {
        console.log(error);
    }
}
connectDB();

io.on("connection", socket => {
    socketHandler(socket, io);
})

server.listen(PORT, () => console.log(`server is runing in http://localhost:${PORT}`));