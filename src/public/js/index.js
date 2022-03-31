// socket : 연결된 서버 메세지 수신
// window.location.host : 현재 브라우저 주소 위치 (localhost:3000)
const backSocket = new WebSocket(`ws://${window.location.host}`)