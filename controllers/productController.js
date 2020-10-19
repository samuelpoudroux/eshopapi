const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} = require("../repository/product");

// Display list of all products.
exports.product_list = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status("200");
    res.json(products);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la récupération, ${error}`);
  }
};

// Display detail page for a specific product.
exports.product_detail = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    res.status("200");
    res.json(product);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la récupération du produit, ${error}`);
  }
};

// Handle product createProduct on POST.
exports.product_create = async (req, res, next) => {
  const { body } = req;
  const imageUrl = req.file ? `${process.env.URL + req.file.filename}` : null;
  try {
    const product = await createProduct(body, imageUrl);
    const { error } = product;
    if (!error) {
      res.status("200");
      res.json(product);
    } else {
      console.log("error", error);
      res.json(product);
      res.status("400");
    }
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la création, ${error}`);
  }
};

// Handle product delete on POST.
exports.product_delete = function (req, res) {
  res.send("NOT IMPLEMENTED: product delete POST");
};

// Handle product POST.
exports.product_updateProduct = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    await updateProduct(body, id);
    res.status("200");
    res.send(`produit modifié avec succés`);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la modification, ${error}`);
  }
};

// Handle product POST.
exports.product_delete = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteProduct(id);
    res.status("200");
    res.send(`produit supprimé avec succés`);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la suppression, ${error}`);
  }
};
