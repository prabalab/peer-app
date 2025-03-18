const express = require("express");
const http = require("http");
const { ExpressPeerServer } = require("peer");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Enhanced CORS configuration
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));

// PeerJS Server Configuration
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/peerjs",
  proxied: true, // Critical for cloud deployments
  allow_discovery: true
});

// Handle discovery endpoint
peerServer.on('discovery', (request) => {
  // This enables the /peerjs/id endpoint
  request.respond({});
});

app.use("/peerjs", peerServer);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`ℹ️  PeerJS endpoint: http://localhost:${PORT}/peerjs`);
});
