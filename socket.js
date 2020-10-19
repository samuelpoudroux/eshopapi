module.exports = (socket, io) => {
  let messages = [];
  messages.push(
    {
      id: 0,
      firstName: "virtuel",
      message: `bienvenue mr/mme que puis je faire pour vous`,
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
    if (
      data.message === "oui" &&
      data.questionOrigin === `Avez vous déjà un compte chez nous ?`
    ) {
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Vous voulez découvrir nos produits ?`,
        type: "choice",
        choice: ["oui", "non"],
      });
    } else if (
      data.message === "non" &&
      data.questionOrigin === `Avez vous déjà un compte chez nous ?`
    ) {
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Souhaitez vous vous inscrire ?`,
        type: "choice",
        choice: ["oui", "non"],
      });
    } else if (
      data.message === "oui" &&
      data.questionOrigin === `Vous voulez découvrir nos produits ?`
    ) {
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Nous vous dirigeons vers nos produits`,
        redirect: "products",
      });
    } else if (
      data.message === "non" &&
      data.questionOrigin === `Vous voulez découvrir nos produits ?`
    ) {
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Souhaitez vous nous contacter ?`,
        type: "choice",
        choice: ["oui", "non"],
      });
    } else if (
      data.message === "oui" &&
      data.questionOrigin === `Souhaitez vous vous inscrire ?`
    ) {
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Nous vous dirigons vers la page associée`,
        redirect: "register",
      });
    } else if (
      data.message === "non" &&
      data.questionOrigin === `Souhaitez vous vous inscrire ?`
    ) {
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Nous vous laissons donc découvrir notre site tranquillement, vous pouvez trouver nos coordonnées via le formulaire de contact. à bientôt spweb`,
      });
    } else if (
      data.message === "oui" &&
      data.questionOrigin === `Souhaitez vous nous contacter ?`
    ) {
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Nous vous redirigeons vers notre page contact`,
        redirect: "contact",
      });
    } else if (
      data.message === "non" &&
      data.questionOrigin === `Souhaitez vous nous contacter ?`
    ) {
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Nous vous laissons donc découvrir notre site tranquillement, vous pouvez trouver nos coordonnées via le formulaire de contact. à bientôt spweb`,
      });
    }
    io.to(socket.id).emit("newMessage", messages);
  });
  //Disconnect
  socket.on("disconnect", (data) => {
    messages = [];
  });
};
