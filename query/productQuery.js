let getProductsQuery = "SELECT * FROM products";

let createTableProductQuery = `create table if not exists products(
  id int primary key auto_increment,
  name varchar(255)not null,
  productPrice int not null,
  category varchar(255)not null,
  inStock boolean not null,
  fileName varchar(255),
  shortDescription varchar(255),
  longDescription varchar(255),
  imageUrl varchar(255),
  newNess boolean
)`;

let createTableNotationQuery = `create table if not exists notations(
    id int primary key auto_increment,
    comment varchar(255),
    note int not null,
    notationDate datetime not null,
    productId varchar(255) not null,
    userId int not null )`;

let insertProductQuery = (
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
) =>
  `INSERT INTO products (name, uid, productPrice, stockNumber, category, description, formule, advice, newNess, shortDescription) VALUES ("${name}","${productId}","${productPrice}","${stockNumber}","${category}","${description}","${formule}", "${
    advice ? advice : null
  }", ${newNess === "true" ? newNess : "false"}, "${shortDescription}")`;

let createImagesUrlTableQuery = `create table if not exists imagesUrl(
        id int primary key auto_increment,
        url varchar(255)not null,
        productId varchar(255)
    )`;

let getProductStockNumberByIdQuery = (uid) =>
  `SELECT stockNumber  FROM products  WHERE uid = '${uid}'`;

let getProductQueryByUid = (uid) =>
  `SELECT * FROM products WHERE  uid="${uid}"`;

let updateStockProductQuery = (stockUpdated, productId) =>
  `UPDATE products set stockNumber=${stockUpdated} WHERE uid="${productId}"`;
let getProductByCategoryQuery = (category) =>
  `SELECT * FROM products WHERE  category="${category}"`;

let insertImagesUrlQuery = (image, productId) =>
  `INSERT INTO imagesUrl (url, productId) VALUES ("${image}","${productId}")`;

let setProductAssNewNessQuery = (newNess, uid) =>
  `UPDATE products SET newNess = ${newNess} WHERE uid = ${uid}`;
let getImagesUrlQuery = (productId) =>
  `SELECT * FROM imagesUrl WHERE  productId="${productId}"`;
const userOrdersQuery = (userId) =>
  `SELECT * FROM orders WHERE userId="${userId}"`;

let insertNotationQuery = (comment, note, notationDate, productId, userId) =>
  `INSERT INTO notations (comment, note, notationDate, productId, userId) VALUES ("${comment}","${note}","${notationDate}","${productId}","${userId}")`;

let checkQuery = (productId, userId) =>
  `SELECT * FROM notations WHERE productId="${productId}" AND userId="${userId}"`;

let getProductNotationsQuery = (productId) =>
  `SELECT users.lastName, users.firstName, notations.* FROM notations INNER JOIN users ON users.id = notations.userId where notations.productId="${productId}"`;
let getAverageNotationsQuery = `SELECT productId, AVG(note) as notation FROM notations GROUP BY productId`;

module.exports = {
  getProductsQuery,
  createTableNotationQuery,
  insertProductQuery,
  createImagesUrlTableQuery,
  getProductQueryByUid,
  getProductStockNumberByIdQuery,
  updateStockProductQuery,
  getProductByCategoryQuery,
  insertImagesUrlQuery,
  createTableNotationQuery,
  setProductAssNewNessQuery,
  getImagesUrlQuery,
  userOrdersQuery,
  insertNotationQuery,
  checkQuery,
  getProductNotationsQuery,
  getAverageNotationsQuery,
  createTableProductQuery,
};
