const {
  getOrders,
  getOngoingOrdersByUserId,
  getHistoryOrdersByUserId,
  getProducts,
  alterName,
  create,
} = require("../repository/order");

exports.list = async (req, res) => {
  try {
    const order = await getOrders();
    res.status("200");
    res.json(order);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de la récupération des commandes, ${error}`);
  }
};

exports.detailOngoingOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const ordersByUserId = await getOngoingOrdersByUserId(userId);
    res.status("200");
    res.json(ordersByUserId);
  } catch (error) {
    res.status("500");
    res.send(
      `erreur lors de la récupération des commandes de l'utilisateur, ${error}`
    );
  }
};

exports.detailHistoryOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const ordersByUserId = await getHistoryOrdersByUserId(userId);
    res.status("200");
    res.json(ordersByUserId);
  } catch (error) {
    res.status("500");
    res.send(
      `erreur lors de la récupération des commandes de l'utilisateur, ${error}`
    );
  }
};

exports.create = async (req, res) => {
  try {
    const { body } = req;
    const order = await create(body);
    res.status("200");
    res.json(order);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de votre commande, ${error}`);
  }
};
exports.alterOrderName = async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;
    const response = await alterName(id, body.name);
    res.status("200");
    res.json(response);
  } catch (error) {
    res.status("500");
    res.send(`erreur lors de votre commande, ${error}`);
  }
};
