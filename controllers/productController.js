const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  isProductNewNess,
  getProductByCategory,
  getImagesProduct,
  getStockNumber,
  createProductNotation,
  getProductNotations,
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
// Display list of all products.
exports.is_Product_NewNess = async (req, res) => {
  try {
    const { newNess } = req.body;
    const { uid } = req.params;
    await isProductNewNess(uid, newNess);
    res.status(200);
    res.send("ajout avec succés");
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la récupération, ${error}`);
  }
};
// Display list of all products.
exports.product_By_Category = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await getProductByCategory(category);
    res.status(200);
    res.json(products);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la récupération, ${error}`);
  }
};

// Display detail page for a specific product.
exports.product_detail = async (req, res) => {
  try {
    const { uid } = req.params;
    const product = await getProductById(uid);
    res.status("200");
    res.json(product);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la récupération du produit, ${error}`);
  }
};

exports.stockNumber = async (req, res) => {
  try {
    const { uid } = req.params;
    const num = await getStockNumber(uid);
    res.status("200");
    res.json(num);
  } catch (error) {
    res.status("500");
    res.send(
      `erreur lors de la récupération des produits disponibles, ${error}`
    );
  }
};

// Handle product createProduct on POST.
exports.product_create = async (req, res, next) => {
  const { body } = req;
  const imagesUrl = req.files
    ? req.files.map((file) => `${process.env.URL + file.originalname}`)
    : null;
  try {
    const product = await createProduct(body, imagesUrl);
    res.status("200");
    res.json(product);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la création, ${error}`);
  }
};
// Handle product createProduct on POST.
exports.product_images_url = async (req, res, next) => {
  const { id } = req.params;
  try {
    const imagesUrl = await getImagesProduct(id);
    res.status("200");
    res.json(imagesUrl);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la récupération d'images du produits, ${error}`);
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

exports.create_product_notation = async (req, res) => {
  const { userId, productId } = req.params;
  const { comment, note, notationDate } = req.body;
  try {
    const response = await createProductNotation(
      userId,
      productId,
      note,
      comment,
      notationDate
    );
    const { errors } = response;
    if (errors) {
      res.json(response);
      res.status("400");
    } else {
      res.status("200");
      res.json(response);
    }
  } catch (error) {
    res.status("500");
    res.send(error);
  }
};
exports.get_product_notations = async (req, res) => {
  const { productId } = req.params;
  try {
    const notations = await getProductNotations(productId);
    res.status("200");
    res.json(notations);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la notation, ${error}`);
  }
};
