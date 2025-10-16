// server.js
import { Server } from "socket.io";
import http from "http";

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {

  // Simulate live driver updates
  let lat = 28.6315, lng = 77.2167;

setInterval(() => {
  // Simulate small movement
  lat += 0.0001; // chhota increment for smoother motion
  lng += 0.0001;

  // Emit new location to client
  socket.emit("emi", { latitude: lat, longitude: lng });
}, 1000); // every 1 second

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("🚀 Socket.IO server running on port 3000");
});
