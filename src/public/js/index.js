// socket : 연결된 서버 메세지 수신
// window.location.host : 현재 브라우저 주소 위치 (localhost:3000)
const socket = new WebSocket(`ws://${window.location.host}`)
 
// socket.addEventListener("open", () => {
//     console.log("Connected to Server 😀 ");
// });

// socket.addEventListener("message", (message) => {
//     console.log("New Message: ", message.data );
// })

//10 초 후 서버로 해당 메세지 전송
// setTimeout(() => {
//     socket.send("hello from the brwoser!");
// }, 10000)

// socket.addEventListener("close", () => {
//     console.log("Disconnected from Server ❌ ");
// });

socket.onopen = () => {
    console.log("Connected to the server 😀 ");
    };

socket.onmessage = (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
};

socket.onclose = () => {
    console.log(`Disconnected from the server ❌ `);
};

// --------------------------------------------------

const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = '';
}

function handleSubmit(event) {
    // submit 이벤트 사용 시 새로고침 되는 현상 막아줌
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value))
    input.value = '';
}

nickForm.addEventListener("submit", handleNickSubmit)
messageForm.addEventListener("submit", handleSubmit)
