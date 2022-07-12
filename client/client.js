const io = require("socket.io-client");
const socket = io("http://node-http-module-production-3865.up.railway.app");
const readline = require("readline");

var username = null

console.log("Connecting to server...");

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
        var str = input.slice(1);
        switch(str){
            case "ls":
                socket.emit("list", {"sender": username, "action": "list"});
            case "quit":
                socket.emit("quit", {"sender": username, "action": "quit"});
            case "trace":
                socket.emit("trace");
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