import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();

app.use(express.json())
app.set("view engine", "pug");
app.set('views', __dirname + "/views");
// public url 생성해 해당 파일 유저에게 공유
// http://localhost:3000/public/js/index.js
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));
 
//http server
const httpServer = http.createServer(app);
// http://localhost:3000/socket.io/socket.io.js
// url 유저(브라우저)에게 제공, 브라우저에 socket.io 설치 시
// 해당 Socket.io 임포트 해서 사용가능
const socketIO = new Server(httpServer);

socketIO.on("connection", (socket) => {
    socket["nickname"] = "Anonymous";
    // event : 전달받은 event 이름
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    // msg: 클라이언트에서 보낸 메세지, done: 클라이언트에서 실행시켜줄 함수
    socket.on("enter_room", (roomName, nickname, done)=> {
        // 생성된 방의 고유 아이디
        // console.log(`Room_ID: ${socket.id}`)
        socket["nickname"] = nickname
        socket.join(roomName);
        console.log(roomName)
        done();
        // 접속한 방에 '나'를 제외하고 모두에게 메세지 emit
        socket.to(roomName).emit("welcome", socket.nickname);
    });
    // 사용자가 생성된 방을 나갔을 때 해당 이벤트 실행
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname));
    })
    socket.on("new_message", (msg, roomName, done) => {
        socket.to(roomName).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    })
    socket.on("nickname", (nickname, done) => {
        // console.log(nickname)
        socket["nickname"] = nickname
        done();
    });
    socket.on("chang_nick", (nickname, done) => {
        socket["nickname"] = nickname
        done();
    })
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);



/*
socketIO.on("connection", (socket) => {
    // event : 전달받은 event 이름
     // roomName: 클라이언트에서 보낸 메세지, done: 클라이언트에서 실행시켜줄 함수
    socket.on("enter_room", (roomName, done)=> {
        console.log(socket.id)
        console.log(socket.rooms)
        // roomName 으로 socket.rooms에 입장
        socket.join(roomName);
        console.log(socket.rooms);
        setTimeout(() => {
            done("hello from the backend");
        }, 1000);

    });
*/