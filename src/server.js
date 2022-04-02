import http from "http";
import { WebSocketServer } from "ws";
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
 
const handleListen = () => console.log(`Listening on http://localhost:3000`);
 
//http server
const server = http.createServer(app)

// Websocket server + http server
// http 서버에서 websocket 서버를 만들 수 있음
// http://localhost:3000 + ws//localhost:3000
// 즉 같은 포트에서 2개의 프로토콜(http, ws) 동작 
const socket = new WebSocketServer({ server });

const sockets = [];

// 콜백으로 전달되는 (socket) : 연결된 브라우저 메세지 수신
socket.on("connection", (socket) => {
    // 연결된 브라우저(크롬, 파이어폭스 등) 배열안에 넣기
    sockets.push(socket);
    // 채팅 닉네임 디폴트 설정
    socket["nickname"] = "Anonymous";
    console.log("Connected to Browser 😀 ");
    // 브라우저 창 닫혔을 때 실행
    socket.on("close", () => {
        console.log("Disconnected from Browser ❌ ")
        }
    )

    socket.on("message", msg => {
        // 연결된 부라우저 모두에게 메세지 보내주기
        // console.log(message.toString("utf-8"));
        const message = JSON.parse(msg)
        // console.log(message)
        switch (message.type) {
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break
            case "nickname":
                socket["nickname"] = message.payload;
                break
        }  
        // 브라우저에서 받아온 메세지 돌려주기
        // socket.send(message.toString('utf-8'));
    })
    
});

server.listen(3000, handleListen);