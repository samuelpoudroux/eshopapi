const socketMessageManagement = (data, messages) => {
  switch (true) {
    case data.message === "oui" &&
      data.questionOrigin === `Avez vous déjà un compte chez nous ?`:
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Que souhaitez vous faire ?`,
        type: "choice",
        choice: [
          "Finaliser ma commande",
          "Gérer mes favoris",
          "Gérer mon panier",
          "Modifier mes informations",
        ],
      });
      return messages;
      break;
    case data.message === "non" &&
      data.questionOrigin === `Avez vous déjà un compte chez nous ?`:
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Souhaitez vous vous inscrire ?`,
        type: "choice",
        choice: ["oui", "non"],
      });
      return messages;
      break;
    case data.message === "non" &&
      data.questionOrigin === `Vous voulez découvrir nos produits ?`:
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Souhaitez vous nous contacter ?`,
        type: "choice",
        choice: ["oui", "non"],
      });
      return messages;
      break;
    case data.message === "oui" &&
      data.questionOrigin === `Souhaitez vous vous inscrire ?`:
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Nous vous dirigons vers la page de création`,
      });
      return messages;
      break;
    case data.message === "non" &&
      data.questionOrigin === `Souhaitez vous vous inscrire ?`:
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Nous vous laissons donc découvrir notre site tranquillement, vous pouvez trouver nos coordonnées via le formulaire de contact. à bientôt spweb`,
      });
      return messages;
      break;
    case data.message === "oui" &&
      data.questionOrigin === `Souhaitez vous nous contacter ?`:
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Nous vous redirigeons vers notre page contact`,
      });
      return messages;
      break;
    case data.message === "non" &&
      data.questionOrigin === `Souhaitez vous nous contacter ?`:
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Nous restons à votre disposition à bientôt`,
      });
      return messages;
      break;
    case data.message === "Gérer mon panier" &&
      data.questionOrigin === `Que souhaitez vous faire ?`:
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Voici votre panier`,
      });
      return messages;
      break;
    case data.message === "Gérer mes favoris" &&
      data.questionOrigin === `Que souhaitez vous faire ?`:
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Voici vos favoris`,
      });
      return messages;
      break;
    case data.message === "Finaliser ma commande" &&
      data.questionOrigin === `Que souhaitez vous faire ?`:
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Nous vous dirigeons vers la page de paiement`,
      });
      return messages;
      break;
    case data.message === "Modifier mes informations" &&
      data.questionOrigin === `Que souhaitez vous faire ?`:
      messages.push({
        id: 0,
        firstName: "virtuel",
        message: `Nous vous dirigeons vers la page de gestion du compte`,
      });
      return messages;
      break;
    default:
      return messages;
  }
};

module.exports = { socketMessageManagement };
