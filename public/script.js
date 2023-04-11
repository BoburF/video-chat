const socket = io();

const videoDiv = document.getElementById("video")
let room = window.location.href.split("/")
room = room[room.length - 1]

const peer = new Peer();

const peers = {}

peer.on("open", userId => {
    socket.emit("join", { userId, room })
})

navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
    const video = document.createElement("video")
    addVideoStream(video, stream)

    peer.on("call", (call) => {
        videoDiv.innerHTML = ""
        call.answer(stream)

        call.on("stream", (userVideo) => {
            const video = document.createElement("video")
            addVideoStream(video, userVideo)
        })
    })

    socket.on("new-connection", userId => {
        newUser(userId, stream)
    })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})


function newUser(userId, stream) {
    console.log("aloooo")
    const call = peer.call(userId, stream)
    const video = document.createElement("video")

    call.on("stream", (videoStream) => {
        addVideoStream(video, videoStream)
    })

    call.on("close", () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    console.log("video...")
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoDiv.append(video)
}