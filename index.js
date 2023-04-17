const express = require('express');
const app = express();
const http = require('http');
const expressServer = http.createServer(app);

const {Server} = require('socket.io');
const io = new Server(expressServer);

io.on('connection',(socket)=>{
    socket.on('chat',(msg)=>{
        io.emit('chat-transfer',[msg.textmsg,msg.userid]);
    });
    
});


app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/index.html");
    // res.end();
});
app.get('/sound',(req,res)=>{
    res.sendFile(__dirname+"/Message notification.mp3");
});

expressServer.listen(3000,()=>{
    console.log("server is runnig at http://localhost:3000");
});