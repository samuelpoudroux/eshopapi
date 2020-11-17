const makeDb = require("./makeDb");

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

const getOngoingOrdersByUserId = async (userId) => {
  try {
    const db = await makeDb();
    let getOrdersQuery = `SELECT *  FROM orders WHERE (userId LIKE '%${userId}%') AND (status LIKE '%ongoing%')`;
    const orders = await db.query(getOrdersQuery);
    db.close();
    return orders;
  } catch (error) {
    throw error;
  }
};
const getHistoryOrdersByUserId = async (userId) => {
  try {
    const db = await makeDb();
    let getOrdersQuery = `SELECT *  FROM orders WHERE (userId LIKE '%${userId}%') AND (status LIKE '%finished%')`;
    const orders = await db.query(getOrdersQuery);
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
    const getDataToInsert = async () => {
      const dataToInsertArrayValues = [];
      const dataToInsertArrayKeys = [];
      for (const [key, value] of Object.entries(body)) {
        dataToInsertArrayKeys.push(key);
        dataToInsertArrayValues.push(`'${value}'`);
      }
      const keys = dataToInsertArrayKeys.join();
      const values = dataToInsertArrayValues.join();
      return { keys, values };
    };
    const keysAndValues = await getDataToInsert();
    let insertOrderQuery = `INSERT INTO orders (${keysAndValues.keys}) VALUES (${keysAndValues.values})`;
    await db.query(insertOrderQuery);
    db.close();
    return "Commande validée";
  } catch (error) {
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
