const { createTableCategoriesQuery } = require("./query/categoryQuery");
const { createTableOrderQuery } = require("./query/orderQuery");
const {
  createTableProductQuery,
  createTableNotationQuery,
} = require("./query/productQuery");
const { createTableUserQuery } = require("./query/userQuery");
const makeDb = require("./repository/makeDb");

const initDb = async () => {
  console.log("inititation de la base de donnée");
  const db = await makeDb();
  await db.query(createTableUserQuery);
  await db.query(createTableCategoriesQuery);
  await db.query(createTableProductQuery);
  await db.query(createTableOrderQuery);
  await db.query(createTableNotationQuery);
  await db.close();
  console.log("base de donnée établie");
};

module.exports = { initDb };
