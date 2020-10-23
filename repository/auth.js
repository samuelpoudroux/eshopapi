const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validateRegisterInput } = require("../validation/register");
const makeDb = require("./makeDb");
const accessTokenSecret = "spwebTokenJeSuisIndechiffrable";

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

      const accessToken = jwt.sign(
        { email: user[0].email, role: user[0].role },
        accessTokenSecret
      );
      return {
        ...user[0],
        token: accessToken,
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
      phoneNumber varchar(255)not null,
      role varchar(255)not null
  )`;
    let insertUserQuery = `INSERT INTO users (firstName, lastName, email, password,billsAddress,phoneNumber,role) VALUES ('${firstName}','${lastName}','${email}','${hash}', '${billsAddress}','${phoneNumber}','user')`;
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
    return error;
  }
};

module.exports = { login, register };
