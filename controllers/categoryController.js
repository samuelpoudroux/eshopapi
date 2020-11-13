const { getAllCategories, createCategory } = require("../repository/category");

// Display list of all products.
exports.categories_list = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status("200");
    res.json(categories);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la récupération, ${error}`);
  }
};
exports.category_create = async (req, res) => {
  try {
    const category = await createCategory(req);
    const { errors } = category;
    console.log("errors", category);
    if (errors) {
      res.json(category);
      res.status("400");
    } else {
      res.status("200");
      res.json(category);
    }
  } catch (err) {
    res.status("500");
    res.send(`erreur lors de la création de la catégorie, ${err}`);
  }
};
