const makeDb = require("./makeDb");
const product = require("./product");
const {
  getProductById,
  getStockNumber,
  updateProductStockNumber,
} = require("./product");

const getOrders = async () => {
  try {
    const db = await makeDb();
    let getOrdersQuery = `SELECT *  FROM orders `;
    const orders = await db.query(getOrdersQuery);
    db.close();
    return orders;
  } catch (error) {
    throw error;
  }
};

const buildOrdersWithAllProducts = async (order) => {
  let { products } = order;

  order.products = await Promise.all(
    JSON.parse(products).map(async (product) => {
      const productDetails = await getProductById(product.uid);
      return { ...productDetails, num: product.num };
    })
  );
  return order;
};

const getOngoingOrdersByUserId = async (userId) => {
  try {
    const db = await makeDb();
    let getOrdersQuery = `SELECT *  FROM orders WHERE userId = ${userId} AND status ="ongoing"`;
    let orders = await db.query(getOrdersQuery);
    await Promise.all(
      orders.map(async (order) => {
        return await buildOrdersWithAllProducts(order);
      })
    );
    db.close();
    return orders;
  } catch (error) {
    throw error;
  }
};
const getHistoryOrdersByUserId = async (userId) => {
  try {
    const db = await makeDb();
    let getOrdersQuery = `SELECT *  FROM orders WHERE userId =${userId} AND status = 'finished'`;
    const orders = await db.query(getOrdersQuery);
    await Promise.all(
      orders.map(async (order) => {
        return await buildOrdersWithAllProducts(order);
      })
    );
    db.close();
    return orders;
  } catch (error) {
    throw error;
  }
};
const alterName = async (id, name) => {
  try {
    const db = await makeDb();
    let modifyOrderNameQuery = `UPDATE orders SET  name= '${name}' WHERE id=${id}`;
    await db.query(modifyOrderNameQuery);
    db.close();
    return "Commande modifiée avec succés";
  } catch (error) {
    throw error;
  }
};

const getDataToInsertQuery = async (body) => {
  try {
    const dataToInsertArrayValues = [];
    const dataToInsertArrayKeys = [];
    for (const [key, value] of Object.entries(body)) {
      if (key === "products") {
        const products = Object.keys(value).map(function (key) {
          return value[key];
        });
        await Promise.all(
          products.map(async (product) => {
            const stockNumber = await getStockNumber(product.uid);
            await updateProductStockNumber(
              product.uid,
              stockNumber,
              product.num
            );
          })
        );
      }
      dataToInsertArrayValues.push(`'${value}'`);
      dataToInsertArrayKeys.push(key);
    }
    const keys = dataToInsertArrayKeys.join();
    return { keys, dataToInsertArrayValues };
  } catch (error) {
    console.log("getDataToInsertQuery", error);
  }
};

const create = async (body) => {
  try {
    let createTableOrderQuery = `create table if not exists orders(
        id int primary key auto_increment,
        name varchar(255),
        products longtext not null,
        userId int not null,
        orderDate datetime not null,
        status varchar(255) not null
    )`;
    const db = await makeDb();
    await db.query(createTableOrderQuery);
    const keysAndValues = await getDataToInsertQuery(body);
    let insertOrderQuery = `INSERT INTO orders (${keysAndValues.keys}) VALUES (${keysAndValues.dataToInsertArrayValues})`;
    await db.query(insertOrderQuery);
    db.close();
    return "Commande validée";
  } catch (error) {
    console.log("create", error);
    throw error;
  }
};

module.exports = {
  getOrders,
  getHistoryOrdersByUserId,
  getOngoingOrdersByUserId,
  alterName,
  create,
};
