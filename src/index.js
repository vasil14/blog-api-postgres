const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const userRout = require("./users/userRout");
const postRout = require("./posts/postRout");
const commentRout = require("./comments/commentRout");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

app.use(express.json());
app.use(userRout);
app.use(postRout);
app.use(commentRout);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.emit("message", "Welcome");

  socket.emit("output-posts");

  socket.on("commentMsg", (msg) => {
    io.emit("append-comments", msg);
  });

  socket.on("post", (post) => {
    console.log(post);
    io.emit("appendPost", post);
  });

  socket.on("replyMsg", (reply) => {
    io.emit("appendReply", reply);
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
