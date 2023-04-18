const express = require("express");
const app = express();
const http = require("http");
const expressServer = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(expressServer);

let userslist = new Array();
io.on("connection", (socket) => {
  
  socket.on("group-name", (groupName) => {
    let groupn=groupName[0];
    let usern=groupName[1];


    // make group
    socket.join(groupn);
    let groupSize = io.sockets.adapter.rooms.get(groupName[0]).size;
    io.emit(groupn, [groupSize, userslist]);
  });

  socket.on("disconnect", () => {
    io.emit("leavemsg", "disconnected a user");
  });

  socket.on("chat", (msg) => {
    io.sockets
      .in(msg.groupid)
      .emit("chat-transfer", [msg.textmsg, msg.userid, msg.username]);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/sound", (req, res) => {
  res.sendFile(__dirname + "/Message notification.mp3");
});
app.use(express.static(__dirname + "/public"));

expressServer.listen(3000, () => {
  console.log("server is runnig at http://localhost:3000");
});
