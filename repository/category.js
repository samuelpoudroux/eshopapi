const makeDb = require("./makeDb");

const getAllCategories = async () => {
  try {
    const db = await makeDb();
    let getCategoriesQuery = "SELECT * FROM categories";
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
    let createTableCategoriesQuery = `create table if not exists categories(
      id int primary key auto_increment ,
      name varchar(255) not null,
      imageUrl varchar(255) 
  )`;
    await db.query(createTableCategoriesQuery);

    let insertCategoryQuery = `INSERT INTO categories (name, imageUrl) VALUES ('${
      body.name
    }','${
      file && file.originalname ? process.env.URL + file.originalname : null
    }')`;

    let getCategoryQuery = `SELECT * FROM categories WHERE name="${body.name}"`;
    const categories = await db.query(getCategoryQuery);
    console.log(categories);
    if (categories.length === 0) {
      await db.query(insertCategoryQuery);
      db.close();
      return { message: "catégorie enregistré avec succés" };
    } else {
      db.close();
      return { errors: "catégorie déjà existante" };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  getAllCategories,
  createCategory,
};
