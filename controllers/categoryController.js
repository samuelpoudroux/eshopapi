const { getAllCategories } = require('../repository/category');

// Display list of all products.
exports.categories_list = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status('200');
    res.json(categories);
  } catch (error) {
    res.status('500');
    res.send(`erreur lors de la récupération, ${error}`);
  }
};
