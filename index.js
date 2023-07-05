import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "./configs/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import messageRoutes from "./routes/messages.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { log } from "console";

const app = express();
dotenv.config();

// const httpServer = createServer(app);
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/message", messageRoutes);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const httpServer = app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    connect();
    console.log("connected to backend!");
  }
});
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
});
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  console.log(onlineUsers);
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
