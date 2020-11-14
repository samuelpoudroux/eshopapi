const makeDb = require("./makeDb");
const { v4: uuidv4 } = require("uuid");
// getManagement
const getAllProducts = async () => {
  let createTableProductQuery = `create table if not exists products(
    id int primary key auto_increment,
    uid varchar(255),
    name varchar(255)not null,
    productPrice int not null,
    category varchar(255)not null,
    inStock boolean not null,
    shortDescription varchar(255),
    longDescription varchar(255),
    newNess boolean
)`;

  const db = await makeDb();
  await db.query(createTableProductQuery);
  let getProductsQuery = "SELECT * FROM products";
  const results = await db.query(getProductsQuery);
  db.close();
  return results;
};

const getProductById = async (id) => {
  let getProductQuery = `SELECT * FROM products WHERE  id="${id}"`;
  const db = await makeDb();
  const result = await db.query(getProductQuery);
  db.close();
  return result[0];
};
const getProductByCategory = async (category) => {
  let getProductQuery = `SELECT * FROM products WHERE  category="${category}"`;
  const db = await makeDb();
  const products = await db.query(getProductQuery);
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
      shortDescription,
      longDescription,
      newNess,
    } = product;

    const productId = uuidv4();
    if (!name || !productPrice || !category || !inStock) {
      return { error: "vérifier les champs obligatoires" };
    } else {
      let createTableProductQuery = `create table if not exists products(
        id int primary key auto_increment,
        uid varchar(255),
        name varchar(255)not null,
        productPrice int not null,
        category varchar(255)not null,
        inStock boolean not null,
        shortDescription varchar(255),
        longDescription varchar(255),
        newNess boolean)`;

      let insertProductQuery = `INSERT INTO products (name, uid, productPrice, category, inStock, shortDescription, longDescription, newNess) VALUES ('${name}','${productId}','${productPrice}','${category}',${inStock},'${
        shortDescription ? shortDescription : null
      }', '${longDescription ? longDescription : null}', ${
        newNess === "true" ? newNess : "false"
      })`;

      let createImagesUrlTableQuery = `create table if not exists imagesUrl(
        id int primary key auto_increment,
        url varchar(255)not null,
        productId varchar(255)
    )`;

      const db = await makeDb();
      await db.query(createTableProductQuery);
      await db.query(createImagesUrlTableQuery);
      await db.query(insertProductQuery);
      imagesUrl &&
        imagesUrl.length > 0 &&
        (await Promise.all(
          imagesUrl.map(async (image) => {
            let insertImagesUrlQuery = `INSERT INTO imagesUrl (url, productId) VALUES ('${image}','${productId}')`;
            await db.query(insertImagesUrlQuery);
          })
        ));
      db.close();
      return { message: "enregistré avec succés" };
    }
  } catch (error) {
    throw error;
  }
};
const isProductNewNess = async (id, newNess) => {
  const db = await makeDb();
  let setProductAssNewNessQuery = `UPDATE products SET newNess = ${newNess} WHERE id = ${id}`;
  await db.query(setProductAssNewNessQuery);
  db.close();
};

//updateProductManagement
const updateProduct = async (product, id) => {
  try {
    const { name, productPrice, category } = product;
    if (!name || !productPrice || !category) {
      throw "vérifier les champs obligatoires";
    } else {
      Product.updateProductOne({ id: id }, { $set: product }, function (
        err,
        res
      ) {
        if (err) throw err;
        console.log("1 document updateProductd");
      });
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
    let getImagesUrlQuery = `SELECT * FROM imagesUrl WHERE  productId="${productId}"`;
    const results = await db.query(getImagesUrlQuery);
    db.close();
    return results;
  } catch (error) {
    throw error;
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
};
