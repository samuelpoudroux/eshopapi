const {
  updateUser,
  getUserById,
  resetPassword,
} = require("../repository/user");

// Display detail page for a specific product.
exports.user_detail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    res.status("200");
    res.json(user);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la récupération de l'utilisateur, ${error}`);
  }
};

// Handle product POST.
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    await updateUser(body, id);
    res.status("200");
    res.send(`produit modifié avec succés`);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la modification, ${error}`);
  }
};
// Handle product POST.
exports.reset_password = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    await resetPassword(body, id);
    res.status("200");
    res.send(`Mot de passe modifié avec succés`);
  } catch (error) {
    res.status("500");
    res.send(`${error}`);
  }
};
