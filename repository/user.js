const makeDb = require("./makeDb");
const bcrypt = require("bcrypt");
const {
  getUserQueryById,
  updatePasswordQuery,
  updateUserQuery,
} = require("../query/userQuery");

const getUserById = async (id, reset = false) => {
  try {
    const db = await makeDb();
    const users = await db.query(getUserQueryById(id));
    delete users[0].role;
    if (!reset) {
      delete users[0].password;
    }
    db.close();
    return users[0];
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (body, id) => {
  try {
    const db = await makeDb();
    const user = await getUserById(id, true);
    const { password } = user;
    const { lastPassword, newPassword } = body;
    const isValid = await bcrypt.compare(lastPassword, password);
    if (!isValid) {
      throw "Ancien mot de passe incorrect";
    } else {
      const hash = await bcrypt.hash(newPassword, 10);
      await db.query(updatePasswordQuery(hash, id));
      db.close();
      return "Mot de passe modifié avec succés";
    }
  } catch (error) {
    throw error;
  }
};

const updateUser = async (body, id) => {
  try {
    const db = await makeDb();
    const getDataToUpdate = async () => {
      const dataToUpdateArray = [];
      for (const [key, value] of Object.entries(body)) {
        dataToUpdateArray.push(`${key + "=" + `'${value}'`}`);
      }
      const dataToUpdate = dataToUpdateArray.join();
      return dataToUpdate;
    };
    const dataQuery = await getDataToUpdate();
    await db.query(updateUserQuery(dataQuery, id));
    db.close();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  updateUser,
  getUserById,
  resetPassword,
};
