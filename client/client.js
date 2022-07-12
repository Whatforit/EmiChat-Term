const io = require("socket.io-client");
const socket = io("https://emichat-term-production.up.railway.app:443");
//const socket = io("http://localhost:443")
const readline = require("readline");

var username = null

console.log("Connecting to server...");

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

socket.on("connect", () => {
    username = process.argv[2];
    console.log("[SERVER]: Connected as " + username);
    socket.emit("join", {"sender": username, "action": "join"});
});

socket.on("disconnect", () => {
    console.log("[SERVER]: Disconnected, reason: %s", reason);
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("line", (input) => {
    if(input.startsWith("/") === true){
        var strArr = input.split(" ");
        var command = str[0]
        switch(command){
            case "/ls":
                socket.emit("list", {"sender": username, "action": "list"});
                break;
            case "/quit":
                socket.emit("quit", {"sender": username, "action": "quit"});
                break;
            case "/trace":
                socket.emit("trace");
                break;
            case "/wsp":
               var msg = strArr.slice(2).join(" ");
               socket.emit("wsp", {"sender": username, "action": "wsp", "receiver": strArr[1], "msg": msg});
            case "/help":
                console.log("/ls - list users");
                console.log("/quit - quit");
                console.log("/trace - trace");
                console.log("/help - help");
                break;
            default:
                console.log("[SERVER]: Unknown command");
        }
    }else{
        var str = input;
        socket.emit("broadcast", {"sender": username, "action": 
        "broadcast", "message": str});
    }
});

socket.on("broadcast", (data) => {
    console.log("%s: %s", data.sender, data.message);
});

socket.on("join", (data) => {
    console.log("[SERVER]: %s joined the chat", data.sender);
});

socket.on("list", (data) => {
    console.log("[SERVER]: List of users:");
    for(var i = 0; i < data.users.length; i++){
        console.log("%s", data.users[i]);
    }
});

socket.on("quit", (data) => {
    console.log("[SERVER]: %s left the chat", data.sender);
});

socket.on("wsp", (data) => {
    console.log("[%s] wispered: %s", data.sender, data.receiver, data.msg);
});