const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const {randomUUID} = require("crypto")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
    res.redirect("/" + randomUUID())
});

app.get("/:room", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
})


io.on("connection", (socket) => {
    socket.on("join", ({room, userId}) => {
        socket.join(room)
        socket.broadcast.to(room).emit("new-connection", userId)
    })

    socket.on("disconnection", () => {
        console.log("Connection lost...")
    })
})


server.listen(8080, () => {
    console.log("server started working...")
})