const { getResultOfGlobalSearch } = require('../repository/globalSearch');

// Display result of globalSearch.
exports.globalSearchResult = async (req, res) => {
  try {
    const globalSearchResult = await getResultOfGlobalSearch();
    res.status('200');
    res.json(globalSearchResult);
  } catch (error) {
    res.status('500');
    res.send(`erreur lors de la recherche globale, ${error}`);
  }
};
