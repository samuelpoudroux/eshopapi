const makeDb = require("./makeDb");

const buildGlobalSearchResult = async () => {
  const db = await makeDb()
  const listTableQuery = `SHOW TABLES FROM ${process.env.DATABASE}`
  const collectionsListArray = await db.query(listTableQuery)
  // nous transformons le tableau ci dessous en tableau de promesse par flatmap
  const promises = collectionsListArray.flatMap(async (collection) => {
    const tableIn = `Tables_in + ${process.env.DATABASE}`
    const {tableIn} = collection
    if (tableIn !== 'users') {
      const query = `SELECT * FROM ${tableIn}`
      return [
        tableIn,
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



