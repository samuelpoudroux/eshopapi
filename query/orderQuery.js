let getOrdersQuery = `SELECT *  FROM orders `;
let getOngGoingOrdersQuery = (userId) =>
  `SELECT *  FROM orders WHERE userId = ${userId} AND status ="ongoing"`;

let getFinishedOrdersQuery = (userId) =>
  `SELECT *  FROM orders WHERE userId =${userId} AND status = 'finished'`;

let modifyOrderNameQuery = (name, id) =>
  `UPDATE orders SET  name= '${name}' WHERE id=${id}`;

let createTableOrderQuery = `create table if not exists orders(
    id int primary key auto_increment,
    name varchar(255),
    products longtext not null,
    userId int not null,
    orderDate datetime not null,
    status varchar(255) not null
)`;

let insertOrderQuery = (keys, values) =>
  `INSERT INTO orders (${keys}) VALUES (${values})`;

module.exports = {
  getOrdersQuery,
  getOngGoingOrdersQuery,
  getFinishedOrdersQuery,
  modifyOrderNameQuery,
  createTableOrderQuery,
  insertOrderQuery,
};
