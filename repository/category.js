const makeDb = require("./makeDb");

const getAllCategories = async () => {
  try {
    const db = await makeDb();
    let getCategoriesQuery = "SELECT * FROM categories";
    const results = await db.query(getCategoriesQuery);
    return results;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllCategories,
};
