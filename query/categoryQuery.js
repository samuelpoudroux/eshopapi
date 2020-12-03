let createTableCategoriesQuery = `create table if not exists categories(
    id int primary key auto_increment ,
    name varchar(255) not null,
    imageUrl varchar(255) 
)`;

let getCategoriesQuery = "SELECT * FROM categories";
let getCategoryByIdQuery = (id) => `SELECT * FROM categories WHERE  id="${id}"`;
let getCategoryByNameQuery = (name) =>
  `SELECT * FROM categories WHERE name="${name}"`;

let insertCategoryQuery = (name, file) =>
  `INSERT INTO categories (name, imageUrl) VALUES ('${name}','${
    file && file.originalname ? process.env.URL + file.originalname : null
  }')`;

module.exports = {
  getCategoriesQuery,
  createTableCategoriesQuery,
  getCategoryByIdQuery,
  getCategoryByNameQuery,
  insertCategoryQuery,
};
