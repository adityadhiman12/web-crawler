const processQuery = require("../crawler/query");

async function handleQuery(query) {
    return await processQuery(query);
}

module.exports = handleQuery;
