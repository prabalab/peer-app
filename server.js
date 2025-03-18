const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

// PeerJS Server
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, { debug: true });

const PORT = process.env.PORT || 3000;

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure Express finds the views folder
app.use(express.static("public"));
app.use("/peerjs", peerServer);

// Generate a random 4-digit room ID
app.get("/", (req, res) => {
    const randomRoom = Math.floor(1000 + Math.random() * 9000);
    res.redirect(`/${randomRoom}`);
});

// Render room page
app.get("/:room", (req, res) => {
    res.render("room", { roomId: req.params.room });
});

// Socket.io events
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join-room", (roomId, userId) => {
        console.log(`User ${userId} joined room ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId);

        // Chat message event
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message);
        });

        // Handle user disconnect
        socket.on("disconnect", () => {
            console.log(`User ${userId} disconnected`);
            socket.to(roomId).emit("user-disconnected", userId);
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
