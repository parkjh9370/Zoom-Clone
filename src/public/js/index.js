// socket.io 실행 서버 : function io() {}
const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
  }

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${input.value}`);
        input.value = "";
    });
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}

// 채팅방 상태 입장
function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nickForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nickForm.addEventListener("submit", handleNicknameSubmit);
};

// input,value이름으로 채팅방 생성하고, 초기 채팅방 생성 함수 호출
function handleRoomeSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    // room 이벤트 emit
    // 1. Event 이름, 2. 보낼 payload (여러 개도 가능)
    // 3. 서버에서 호출할 수 있는 function
    //     -> 서버에서 호출 시 해당 함수를 실행시켜 준다.
    socket.emit("enter_room",
        input.value,
        // server에서 전달받은 인자로 해당 함수를 실행시킨다.
        showRoom
    );
    roomName = input.value;
    input.value = "";
}

const form = welcome.querySelector("form");
form.addEventListener("submit", handleRoomeSubmit);


// 사용자가 입장했을 때 '나'를 제외한 모든 사람에게 메세지 
socket.on("welcome", (user) => {
    addMessage(`${user} arrived!`)
    }
);

socket.on("new_message", (msg) => {
    addMessage(msg)
})

socket.on("bye", (user) => {
    addMessage(`${user} left;`);
})