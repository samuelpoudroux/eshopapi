const makeDb = require("./makeDb");

// getManagement
const getAllProducts = async () => {
  let createTableProductQuery = `create table if not exists products(
    id int primary key auto_increment,
    name varchar(255)not null,
    productPrice int not null,
    category varchar(255)not null,
    inStock boolean not null,
    fileName varchar(255),
    shortDescription varchar(255),
    longDescription varchar(255),
    imageUrl varchar(255)
)`;

  const db = await makeDb();
  await db.query(createTableProductQuery);
  let getProductsQuery = "SELECT * FROM products";
  const results = await db.query(getProductsQuery);
  return results;
};

const getProductById = async (id) => {
  let getProductQuery = `SELECT * FROM products WHERE  id="${id}"`;
  const db = await makeDb();
  const result = await db.query(getProductQuery);
  return result[0];
};

//createProduct management
const createProduct = async (product, imageUrl) => {
  try {
    const {
      name,
      productPrice,
      category,
      inStock,
      shortDescription,
      longDescription,
    } = product;
    if (!name || !productPrice || !category || !inStock) {
      return { error: "vérifier les champs obligatoires" };
    } else {
      let createTableProductQuery = `create table if not exists products(
                          id int primary key auto_increment,
                          name varchar(255)not null,
                          productPrice int not null,
                          category varchar(255)not null,
                          inStock boolean not null,
                          fileName varchar(255),
                          shortDescription varchar(255),
                          longDescription varchar(255),
                          imageUrl varchar(255)
                      )`;
      let insertProductQuery = `INSERT INTO products (name, productPrice, category, inStock, shortDescription, longDescription, imageUrl) VALUES ('${name}', '${productPrice}', '${category}', ${inStock},'${
        shortDescription ? shortDescription : null
      }', '${longDescription ? longDescription : null}', '${
        imageUrl ? imageUrl : null
      }')`;
      const db = await makeDb();
      await db.query(createTableProductQuery);
      await db.query(insertProductQuery);
      return { message: "enregistré avec succés" };
    }
  } catch (error) {
    throw error;
  }
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

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
};
