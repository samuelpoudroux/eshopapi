const makeDb = require("./makeDb");
const bcrypt = require("bcrypt");

const getUserById = async (id, reset = false) => {
  try {
    const db = await makeDb();
    let getUserQuery = `SELECT *  FROM users WHERE id = ${id}`;
    const users = await db.query(getUserQuery);
    delete users[0].role;
    if (!reset) {
      delete users[0].password;
    }
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
      let updatePasswordQuery = `UPDATE users SET  password= '${hash}' WHERE id=${id}`;
      await db.query(updatePasswordQuery);
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
    let updateUserQuery = `UPDATE users SET ${dataQuery} WHERE id=${id}`;
    await db.query(updateUserQuery);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  updateUser,
  getUserById,
  resetPassword,
};
