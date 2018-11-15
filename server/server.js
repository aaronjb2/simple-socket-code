const app = require("express")();
const bodyParser = require("body-parser");
const socket = require("socket.io");

app.use(bodyParser.json());

const io = socket(app.listen(3213, () => console.log("Listening Port 3213")));

io.on("connection", socket => {
  console.log("A user has connected with my Socket");

  socket.on("send-message", message => {
    io.sockets
      .in(message.room)
      .emit("message-to-users", { message: message.message });
  });

  socket.on("room-change", roomObj => {
    socket.join(roomObj.room);
    io.sockets
      .in(roomObj.room)
      .emit("joined-room", { message: "someone joined the room" });
  });

  socket.on("typing", roomObj => {
    io.sockets.in(roomObj.room).emit("someone-typing");
  });
});
