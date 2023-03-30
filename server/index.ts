import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8080;

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", socket => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", data => {
    socket.join(data);
  });

  socket.on("send_message", data => {
    socket.to(data.room).emit("receive_message", data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
