const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validateRegisterInput } = require("../validation/register");
const {
  getUserQueryByEmail,
  insertUserQuery,
  getUserQueryById,
} = require("../query/userQuery");
const makeDb = require("./makeDb");

const { ACCESS_TOKEN } = process.env;

const login = async (email, password) => {
  try {
    const db = await makeDb();
    const user = await db.query(getUserQueryByEmail(email));
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
      delete user[0].role;
      db.close();
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

    const users = await db.query(getUserQuery(email));
    if (users.length === 0) {
      await db.query(
        insertUserQuery(
          firstName,
          lastName,
          email,
          hash,
          billsAddress,
          dropAddress,
          phoneNumber
        )
      );
      db.close();
      return { message: "Utilisateur enregistré avec succés" };
    } else {
      db.close();
      return { errors: "utilisateur déjà existant" };
    }
  } catch (error) {
    throw error;
  }
};

const getRole = async (id) => {
  const db = await makeDb();
  const user = await db.query(getUserQueryById(id));
  db.close();
  if (user && user.length > 0 && user[0] && user[0].role === "admin") {
    return true;
  } else {
    return false;
  }
};

module.exports = { login, register, getRole };
