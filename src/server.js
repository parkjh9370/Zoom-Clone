import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
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
const socketIO = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    }
});
instrument(socketIO, {
    auth: false
});

function publicRooms() {
    // rooms: 공개(생성) 방 + 비밀 방, sids: 비밀 방
    const { rooms, sids } = socketIO.sockets.adapter;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    })
    return publicRooms;
}

// 방에 접속한 사람 수
function countRoom(roomName) {
    // Optional chaining
    // ex) hi?.size => if(hi) { return hi.size } else { undefined }
    return socketIO.sockets.adapter.rooms.get(roomName)?.size;
}

socketIO.on("connection", (socket) => {
    socket["nickname"] = "Anonymous";
    // event : 전달받은 event 이름
    socket.onAny((event) => {
        // console.log(socketIO.sockets.adapter)
        console.log(`Socket Event: ${event}`);
    });
    // msg: 클라이언트에서 보낸 메세지, done: 클라이언트에서 실행시켜줄 함수
    socket.on("enter_room", (roomName, nickname, done)=> {
        // 생성된 방의 고유 아이디
        // console.log(`Room_ID: ${socket.id}`)
        socket["nickname"] = nickname
        socket.join(roomName);
        // console.log(roomName)
        done(countRoom(roomName))
        // 접속한 방에 '나'를 제외하고 모두에게 메세지 emit
        socket.to(roomName).emit("welcome", socket.nickname );
        // 현재 생성된 방에 대한 정보를 전송 (생성)
        socketIO.sockets.emit("room_change", publicRooms());
    });
    // 사용자가 생성된 방을 나갔을 때 해당 이벤트 실행
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room =>
            socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
        )
    })
    // 현재 없어진 방에 대한 정보를 전송
    socket.on("disconnect", () => {
        socketIO.sockets.emit("room_change", publicRooms());
    })
    socket.on("new_message", (msg, roomName, done) => {
        // new_message라는 이벤트로 해당 내용 송신
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