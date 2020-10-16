const makeDb = require("./makeDb");

const getAllCategories = async () => {
  const db = await makeDb()
  let getCategoriesQuery = "SELECT * FROM categories";
  const results = await db.query(getCategoriesQuery)
 return results
};


module.exports = {
  getAllCategories
};
