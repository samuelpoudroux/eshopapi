const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validateRegisterInput } = require("../validation/register");
const makeDb = require("./makeDb");

const { ACCESS_TOKEN } = process.env;

const login = async (email, password) => {
  try {
    const db = await makeDb();
    const getUserQueryByEmail = `SELECT * FROM users WHERE email= "${email}"`;
    const user = await db.query(getUserQueryByEmail);

    if (user.length === 0) {
      return { error: "utilisateur inexistant" };
    } else if (user) {
      const isValid = await bcrypt.compare(password, user[0].password);
      if (!isValid) {
        return { error: "mot de passe ou identifiant incorrect" };
      }
      delete user[0].password;
      const accessToken = jwt.sign(
        {
          sub: user[0].id,
          role: user[0].role,
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        ACCESS_TOKEN
      );
      return {
        userData: user[0],
        accessToken,
        error: null,
      };
    }
  } catch (e) {
    throw e.message;
  }
};

const register = async (body) => {
  try {
    const { errors, isValid } = await validateRegisterInput(body);
    if (!isValid) {
      return { errors };
    }
    const {
      firstName,
      lastName,
      email,
      password,
      billsAddress,
      dropAddress,
      phoneNumber,
    } = body;
    const hash = await bcrypt.hash(password, 10);

    let createTableUserQuery = `create table if not exists users(
      id int primary key auto_increment,
      firstName varchar(255)not null,
      lastName varchar(255)not null,
      email varchar(255)not null,
      password varchar(255)not null,
      billsAddress varchar(255)not null,
      dropAddress varchar(255)not null,
      phoneNumber varchar(255)not null,
      role varchar(255)not null
  )`;
    let insertUserQuery = `INSERT INTO users (firstName, lastName, email, password,billsAddress,dropAddress,phoneNumber,role) VALUES ('${firstName}','${lastName}','${email}','${hash}', '${billsAddress}','${dropAddress}','${phoneNumber}','user')`;
    const db = await makeDb();
    await db.query(createTableUserQuery);
    let getUserQuery = `SELECT * FROM users WHERE email="${email}"`;
    const users = await db.query(getUserQuery);
    if (users.length === 0) {
      await db.query(insertUserQuery);
      return { message: "Utilisateur enregistré avec succés" };
    } else {
      return { errors: "utilisateur déjà existant" };
    }
  } catch (error) {
    throw error;
  }
};

const getRole = async (id) => {
  const db = await makeDb();
  const getUserQueryByEmail = `SELECT * FROM users WHERE id= "${id}"`;
  const user = await db.query(getUserQueryByEmail);
  if (user && user.length > 0 && user[0] && user[0].role === "admin") {
    return true;
  } else {
    return false;
  }
};

module.exports = { login, register, getRole };
