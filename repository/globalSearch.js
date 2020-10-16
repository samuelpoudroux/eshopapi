const makeDb = require("./makeDb");

const buildGlobalSearchResult = async () => {
  const listTableQuery = 'SELECT table_name FROM information_schema.tables WHERE table_schema = "eshop"'
  const db = await makeDb()

  const collectionsListArray = await db.query(listTableQuery)
  // nous transformons le tableau ci dessous en tableau de promesse par flatmap
  const promises = collectionsListArray.flatMap(async (collection) => {
    const {TABLE_NAME} = collection
    if (TABLE_NAME !== 'users') {
      const query = `SELECT * FROM ${TABLE_NAME}`
      return [
        TABLE_NAME,
        await  db.query(query)     
    ];
    } else {
      return [];
    }
  });
  // nous transformons le tableau de promesse en objet pour le retourner
  return Object.fromEntries(await Promise.all(promises));
};
const getResultOfGlobalSearch = async () => {
  try {
    const globalSearch = await buildGlobalSearchResult();
    return globalSearch;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getResultOfGlobalSearch
};



