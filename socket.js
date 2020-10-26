const { socketMessageManagement } = require("./repository/chatManagement");

module.exports = (socket, io) => {
  let messages = [];
  messages.push(
    {
      id: 0,
      firstName: "virtuel",
      message: `bienvenue mr/mme que puis je faire pour vous ?`,
    },
    {
      id: 0,
      firstName: "virtuel",
      message: `Avez vous déjà un compte chez nous ?`,
      type: "choice",
      choice: ["oui", "non"],
    }
  );
  io.to(socket.id).emit("newMessage", messages);

  socket.on("newMessage", (data) => {
    messages.push(data);
    socketMessageManagement(data, messages);
    io.to(socket.id).emit("newMessage", messages);
  });
  //Disconnect
  socket.on("disconnect", (data) => {
    messages = [];
  });
};
