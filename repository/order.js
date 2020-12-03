const makeDb = require("./makeDb");
const {
  getProductById,
  getStockNumber,
  updateProductStockNumber,
} = require("./product");
const {
  getOrdersQuery,
  getOngGoingOrdersQuery,
  getFinishedOrdersQuery,
  modifyOrderNameQuery,
  insertOrderQuery,
} = require("../query/orderQuery");

const getOrders = async () => {
  try {
    const db = await makeDb();
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
    let orders = await db.query(getOngGoingOrdersQuery(userId));
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
    const orders = await db.query(getFinishedOrdersQuery(userId));
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
    await db.query(modifyOrderNameQuery(name, id));
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
        dataToInsertArrayValues.push(`'${JSON.stringify(value)}'`);
      } else {
        dataToInsertArrayValues.push(`'${value}'`);
      }
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
    const db = await makeDb();
    const keysAndValues = await getDataToInsertQuery(body);
    await db.query(
      insertOrderQuery(
        keysAndValues.keys,
        keysAndValues.dataToInsertArrayValues
      )
    );
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
