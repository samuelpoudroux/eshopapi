const makeDb = require("./makeDb");
const {
  getCategoriesQuery,
  getCategoryByNameQuery,
  getCategoryByIdQuery,
  insertCategoryQuery,
} = require("../query/categoryQuery");

const getAllCategories = async () => {
  try {
    const db = await makeDb();
    const results = await db.query(getCategoriesQuery);
    db.close();
    return results;
  } catch (error) {
    throw error;
  }
};
const createCategory = async (req, res, next) => {
  const { body, file } = req;
  try {
    const db = await makeDb();
    const categories = await db.query(getCategoryByNameQuery(body.name));
    if (categories.length === 0) {
      await db.query(insertCategoryQuery(body.name, file));
      db.close();
      return { message: "catégorie enregistré avec succés" };
    } else {
      db.close();
      return { errors: "catégorie déjà existante" };
    }
  } catch (error) {
    throw error;
  }
};

const getCategoryById = async (id) => {
  const db = await makeDb();
  const result = await db.query(getCategoryByIdQuery(id));
  db.close();
  return result[0];
};

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
};
