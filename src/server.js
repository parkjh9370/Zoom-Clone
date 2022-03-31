import http from "http";
import { WebSocketServer } from "ws";
import express from "express";

const app = express();

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
const frontSocket = new WebSocketServer({ server });

// 콜백으로 전달되는 (socket) : 연결된 브라우저 메세지 수신
function handleConnection(socket) {
    console.log(socket);
}
frontSocket.on("connection", handleConnection);

server.listen(3000, handleListen);