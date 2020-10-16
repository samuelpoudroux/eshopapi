const {} = require('../repository/image');

// Display list of all products.
exports.load = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status('200');
    res.json(products);
  } catch (error) {
    res.status('500');
    res.send(`erreur lors de la récupération, ${error}`);
  }
};
