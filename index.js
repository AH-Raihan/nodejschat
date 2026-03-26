const express = require("express");
const app = express();
const http = require("http");
const expressServer = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(expressServer);

// user tracking
// users[socket.id] = { username, room }
const users = {};

io.on("connection", (socket) => {
  // join a group
  socket.on("group-name", (groupData) => {
    let groupn = groupData.room || groupData[0];
    let usern = groupData.username || groupData[1];

    // leave old room if switching
    if (users[socket.id] && users[socket.id].room !== groupn) {
      socket.leave(users[socket.id].room);
      emitRoomUsers(users[socket.id].room);
    }

    users[socket.id] = { username: usern, room: groupn };
    socket.join(groupn);

    // broadcast new user list
    emitRoomUsers(groupn);
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      const room = users[socket.id].room;
      delete users[socket.id];
      emitRoomUsers(room);
    }
  });

  socket.on("voice", (src) => {
    io.sockets.in(src.groupid).emit("chat-transfer", [src.voicemsg, src.userid, src.username, src.type]);
  });

  socket.on("chat", (msg) => {
    io.sockets.in(msg.groupid).emit("chat-transfer", [msg.textmsg, msg.userid, msg.username, msg.type]);
  });

  socket.on("typing", (msg) => {
    if (msg.status === 1) {
      io.sockets.in(msg.groupid).emit("sometype", msg.username);
    } else {
      io.sockets.in(msg.groupid).emit("sometype", 0);
    }
  });

  function emitRoomUsers(room) {
    const roomUsers = [];
    for (const [id, user] of Object.entries(users)) {
      if (user.room === room) {
        roomUsers.push(user.username);
      }
    }
    // send count and list of names
    io.sockets.in(room).emit(room, [roomUsers.length, roomUsers]);
    // also emit explicit online users event
    io.sockets.in(room).emit("online-users", roomUsers);
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/sound", (req, res) => {
  res.sendFile(__dirname + "/Message notification.mp3");
});

app.use(express.static(__dirname + "/public"));

expressServer.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
});
