let createTableUserQuery = `create table if not exists users(
    id int primary key auto_increment,
    firstName varchar(255)not null,
    lastName varchar(255)not null,
    email varchar(255)not null,
    password varchar(255)not null,
    billsAddress longtext not null,
    dropAddress longtext not null,
    phoneNumber varchar(255)not null,
    role varchar(255)not null
)`;

const getUserQueryByEmail = (email) =>
  `SELECT * FROM users WHERE email= "${email}"`;

let insertUserQuery = (
  firstName,
  lastName,
  email,
  hash,
  billsAddress,
  dropAddress,
  phoneNumber
) =>
  `INSERT INTO users (firstName, lastName, email, password,billsAddress,dropAddress,phoneNumber,role) VALUES ('${firstName}','${lastName}','${email}','${hash}', '${billsAddress}','${dropAddress}','${phoneNumber}','user')`;

let getUserQuery = (email) => `SELECT * FROM users WHERE email="${email}"`;

const getUserQueryById = (id) => `SELECT * FROM users WHERE id= "${id}"`;
let updatePasswordQuery = (hash, id) =>
  `UPDATE users SET  password= '${hash}' WHERE id=${id}`;

let updateUserQuery = (dataQuery, id) =>
  `UPDATE users SET ${dataQuery} WHERE id=${id}`;

module.exports = {
  createTableUserQuery,
  getUserQueryByEmail,
  insertUserQuery,
  getUserQueryById,
  getUserQuery,
  updatePasswordQuery,
  updateUserQuery,
};
