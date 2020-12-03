const makeDb = require("./makeDb");
const { v4: uuidv4 } = require("uuid");
const {
  getProductsQuery,
  createTableNotationQuery,
  insertProductQuery,
  createImagesUrlTableQuery,
  getProductQueryByUid,
  getProductStockNumberByIdQuery,
  updateStockProductQuery,
  getProductByCategoryQuery,
  insertImagesUrlQuery,
  setProductAssNewNessQuery,
  getImagesUrlQuery,
  userOrdersQuery,
  insertNotationQuery,
  checkQuery,
  getProductNotationsQuery,
  getAverageNotationsQuery,
} = require("../query/productQuery");

// getManagement
const getAllProducts = async () => {
  const db = await makeDb();
  const results = await db.query(getProductsQuery);
  const products = await getProductsWithNotation(db, results);
  db.close();
  return products;
};

const getProductById = async (uid) => {
  const db = await makeDb();
  const results = await db.query(getProductQueryByUid(uid));
  const product = await getProductsWithNotation(db, results);
  db.close();
  return product[0];
};

const updateProductStockNumber = async (productId, stockNumber, num) => {
  try {
    const db = await makeDb();
    const stockUpdated = stockNumber - num === 0 ? 0 : stockNumber - num;
    await db.query(updateStockProductQuery(stockUpdated, productId));
    await db.close();
  } catch (error) {
    throw error;
  }
};
const getProductByCategory = async (category) => {
  const db = await makeDb();
  const products = await db.query(getProductByCategoryQuery(category));
  db.close();
  return products;
};

//createProduct management
const createProduct = async (product, imagesUrl) => {
  try {
    const {
      name,
      productPrice,
      category,
      inStock,
      description,
      newNess,
      stockNumber,
      advice,
      formule,
      shortDescription,
    } = product;

    const productId = uuidv4();
    if (
      !name ||
      !productPrice ||
      !category ||
      !stockNumber ||
      !shortDescription
    ) {
      throw "vérifier les champs obligatoires";
    } else {
      const db = await makeDb();
      await db.query(createImagesUrlTableQuery);
      await db.query(
        insertProductQuery(
          name,
          productId,
          productPrice,
          stockNumber,
          category,
          description,
          formule,
          advice,
          newNess,
          shortDescription
        )
      );
      imagesUrl &&
        imagesUrl.length > 0 &&
        (await Promise.all(
          imagesUrl.map(async (image) => {
            await db.query(insertImagesUrlQuery(image, productId));
          })
        ));
      db.close();
      return "enregistré avec succés";
    }
  } catch (error) {
    throw error;
  }
};
const isProductNewNess = async (uid, newNess) => {
  const db = await makeDb();
  await db.query(setProductAssNewNessQuery(newNess, uid));
  db.close();
};

//updateProductManagement
const updateProduct = async (product, id) => {
  try {
    const { name, productPrice, category } = product;
    if (!name || !productPrice || !category) {
      throw "vérifier les champs obligatoires";
    } else {
      Product.updateProductOne(
        { id: id },
        { $set: product },
        function (err, res) {
          if (err) throw err;
          console.log("1 document updateProductd");
        }
      );
    }
  } catch (error) {
    throw error;
  }
};

//delete management
const deleteProduct = async (id) => {
  Product.deleteOne({ id: id }, function (err, res) {
    if (err) throw err;
    console.log("1 document updateProductd");
  });
};

const getImagesProduct = async (productId) => {
  try {
    const db = await makeDb();
    const results = await db.query(getImagesUrlQuery(productId));
    db.close();
    return results;
  } catch (error) {
    throw error;
  }
};
const getStockNumber = async (uid) => {
  try {
    const db = await makeDb();
    const num = await db.query(getProductStockNumberByIdQuery(uid));
    db.close();

    if (num.length > 0) {
      return num[0].stockNumber;
    }
  } catch (error) {
    throw error;
  }
};

const checkProductEverOrdered = async (db, userId, productId) => {
  try {
    const orders = await db.query(userOrdersQuery(userId));
    const allProductsOrdered = orders.flatMap((product) =>
      JSON.parse(product.products)
    );
    const productEverOrdered = allProductsOrdered.find(
      (e) => e.uid === productId
    );
    if (productEverOrdered) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("checkProductEverOrdered", error);
  }
};

const createProductNotation = async (
  userId,
  productId,
  note,
  comment,
  notationDate
) => {
  try {
    const db = await makeDb();
    await db.query(createTableNotationQuery);
    const productEverOrdered = await checkProductEverOrdered(
      db,
      userId,
      productId
    );
    if (productEverOrdered) {
      const notationEverDone = await db.query(checkQuery(productId, userId));
      if (notationEverDone.length > 0) {
        db.close();
        return { errors: "Vous avez déjà déposé un avis sur ce produit" };
      }
      await db.query(
        insertNotationQuery(comment, note, notationDate, productId, userId)
      );
      db.close();
      return { message: "Avis deposé avec succés" };
    } else {
      db.close();
      return {
        errors: "Vous devez avoir déjà acheté ce produit pour l'évaluer",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getProductNotations = async (productId) => {
  try {
    const db = await makeDb();
    const notations = await db.query(getProductNotationsQuery(productId));
    db.close();
    return notations;
  } catch (error) {
    throw error.message;
  }
};

const getProductsWithNotation = async (db, products) => {
  try {
    await db.query(createTableNotationQuery);

    const productsNotations = await db.query(getAverageNotationsQuery);
    const productWithNotation = products.map((product) => {
      const productEverEvaluated = productsNotations.find(
        (e) => e.productId === product.uid
      );
      return {
        ...product,
        notation: productEverEvaluated
          ? productEverEvaluated.notation
          : undefined,
      };
    });
    return productWithNotation;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
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
  updateProductStockNumber,
};
