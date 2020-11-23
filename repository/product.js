const makeDb = require("./makeDb");
const { v4: uuidv4 } = require("uuid");

// getManagement
const getAllProducts = async () => {
  const db = await makeDb();
  let getProductsQuery = "SELECT * FROM products";
  const results = await db.query(getProductsQuery);
  const products = await getProductsWithNotation(db, results);
  db.close();
  return products;
};

const getProductById = async (uid) => {
  let getProductQuery = `SELECT * FROM products WHERE  uid="${uid}"`;
  const db = await makeDb();
  const results = await db.query(getProductQuery);
  const product = await getProductsWithNotation(db, results);
  db.close();
  return product[0];
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
      description,
      newNess,
      stockNumber,
      advice,
      formule,
    } = product;

    const productId = uuidv4();
    if (!name || !productPrice || !category || !stockNumber) {
      throw "vérifier les champs obligatoires";
    } else {
      let createTableProductQuery = `create table if not exists products(
        id int primary key auto_increment,
        uid varchar(255),
        name varchar(255)not null,
        productPrice float not null,
        stockNumber int not null,
        category varchar(255)not null,
        description longtext not null,
        formule longtext not null,
        advice longtext,
        newNess boolean)`;

      let insertProductQuery = `INSERT INTO products (name, uid, productPrice, stockNumber, category, description, formule, advice, newNess) VALUES ("${name}","${productId}","${productPrice}","${stockNumber}","${category}","${description}","${formule}", "${
        advice ? advice : null
      }", ${newNess === "true" ? newNess : "false"})`;

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
            let insertImagesUrlQuery = `INSERT INTO imagesUrl (url, productId) VALUES ("${image}","${productId}")`;
            await db.query(insertImagesUrlQuery);
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
  let setProductAssNewNessQuery = `UPDATE products SET newNess = ${newNess} WHERE uid = ${uid}`;
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
    let getImagesUrlQuery = `SELECT * FROM imagesUrl WHERE  productId="${productId}"`;
    const results = await db.query(getImagesUrlQuery);
    db.close();
    return results;
  } catch (error) {
    throw error;
  }
};
const getStockNumber = async (uid) => {
  try {
    const db = await makeDb();
    let getProductByIdQuery = `SELECT stockNumber  FROM products  WHERE uid = '${uid}'`;
    const num = await db.query(getProductByIdQuery);
    db.close();

    if (num.length > 0) {
      return num[0].stockNumber;
    }
  } catch (error) {
    throw error;
  }
};

const checkProductEverOrdered = async (db, userId, productId) => {
  const userOrdersQuery = `SELECT * FROM orders WHERE userId="${userId}"`;
  const orders = await db.query(userOrdersQuery);
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
    let createTableNotationQuery = `create table if not exists notations(
      id int primary key auto_increment,
      comment varchar(255),
      note int not null,
      notationDate datetime not null,
      productId varchar(255) not null,
      userId int not null )`;

    let insertNotationQuery = `INSERT INTO notations (comment, note, notationDate, productId, userId) VALUES ("${comment}","${note}","${notationDate}","${productId}","${userId}")`;
    let checkQuery = `SELECT * FROM notations WHERE productId="${productId}" AND userId="${userId}"`;

    await db.query(createTableNotationQuery);
    const productEverOrdered = await checkProductEverOrdered(
      db,
      userId,
      productId
    );
    if (productEverOrdered) {
      const notationEverDone = await db.query(checkQuery);
      if (notationEverDone.length > 0) {
        db.close();
        return { errors: "Vous avez déjà déposé un avis sur ce produit" };
      }
      await db.query(insertNotationQuery);
      db.close();
      return { message: "Avis deposé avec succés" };
    } else {
      db.close();
      return {
        errors: "Vous devez avoir déjà acheté ce produit pour l'évaluer",
      };
    }
  } catch (error) {
    throw error;
  }
};
const getProductNotations = async (productId) => {
  try {
    const db = await makeDb();
    let getProductNotationsQuery = `SELECT users.lastName, users.firstName, notations.* FROM notations INNER JOIN users ON users.id = notations.userId where notations.productId="${productId}"`;
    const notations = await db.query(getProductNotationsQuery);
    db.close();
    return notations;
  } catch (error) {
    throw error.message;
  }
};

const getProductsWithNotation = async (db, products) => {
  try {
    let createTableNotationQuery = `create table if not exists notations(
      id int primary key auto_increment,
      comment varchar(255),
      note int not null,
      notationDate datetime not null,
      productId varchar(255) not null,
      userId int not null )`;
    await db.query(createTableNotationQuery);

    let getAverageNotationsQuery = `SELECT productId, AVG(note) as notation FROM notations GROUP BY productId`;
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
};
