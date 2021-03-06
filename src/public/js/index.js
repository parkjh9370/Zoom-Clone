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

function changNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("chang_nick", input.value, () => {
        input.value = "";
    });
}

// 채팅방 상태 입장
function showRoom(countUser) {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${countUser})`;
    // 이벤트 리스너 등록
    const msgForm = room.querySelector("#msg");
    const changNickform = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    changNickform.addEventListener("submit", changNicknameSubmit);
};

// input,value이름으로 채팅방 생성하고, 초기 채팅방 생성 함수 호출
function handleRoomeSubmit(event) {
    event.preventDefault();
    const roomNameInput = form.querySelector("#roomName");
    const nickNameInput = form.querySelector("#name");
   
    socket.emit("enter_room",
        roomNameInput.value, nickNameInput.value,
        showRoom
    );
    roomName = roomNameInput.value;
    roomNameInput.value = "";
}

const form = welcome.querySelector("form");
form.addEventListener("submit", handleRoomeSubmit);


// 사용자가 입장했을 때 '나'를 제외한 모든 사람에게 메세지 
socket.on("welcome", (user) => {
    
    addMessage(`${user} arrived!`)
    }
);

socket.on("new_message", (msg) => {
    // msg: `${socket.nickname}: ${msg}`
    addMessage(msg)
})

socket.on("bye", (user) => {
    addMessage(`${user} left;`);
})

// 현재 생성된 방에 대한 정보를 수신
socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerText = "";
    // 방이 없을 때 해당 함수 실행
    if (rooms.length === 0) {
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
});

socket.on("room_change", (rooms) => {
    console.log(rooms)
})