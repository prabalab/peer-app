const express = require("express");
const { ExpressPeerServer } = require("peer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 443;

// Enable CORS for all origins
app.use(cors());

// Create HTTP server
const server = app.listen(PORT, () => {
    console.log(`✅ PeerJS Server running on port ${PORT}`);
});

// Initialize PeerJS Server
const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: "/peerjs",
    allow_discovery: true
});

// Use PeerJS Server Middleware
app.use("/peerjs", peerServer);

// Graceful Shutdown for Render
process.on("SIGTERM", () => {
    console.log("🔴 Shutting down PeerJS server...");
    server.close(() => {
        console.log("🛑 Server closed.");
        process.exit(0);
    });
});
