const { socketMessageManagement } = require("./repository/chatManagement");

module.exports = (socket, io) => {
  let messages = [];

  socket.on("notRegistered", (data) => {
    messages.push({
      id: 0,
      firstName: "virtuel",
      message: `Bienvenue en quoi puis-je vous aider ?`,
    });
    messages.push({
      id: 0,
      firstName: "virtuel",
      message: `Avez vous déjà un compte chez nous ?`,
      type: "choice",
      choice: ["oui", "non"],
    });
    io.to(socket.id).emit("newMessage", messages);
  });
  socket.on("alreadyRegistered", (data) => {
    messages.push({
      id: 0,
      firstName: "virtuel",
      message: `Bienvenue en quoi puis-je vous aider ?`,
      type: "choice",
      choice: [
        "Gérer mes favoris",
        "Gérer mon panier",
        "Finaliser ma commande",
        "Modifier mes informations",
        "Nous contacter",
      ],
    });
    io.to(socket.id).emit("newMessage", messages);
  });

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
