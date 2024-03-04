const saveVectorizedData = require("../crawler/saveVectorizedData");
const crawl = require("../crawler/webCrawler");

async function handleWebCrawling(url) {
    const { title, content } = await crawl(url);
    await saveVectorizedData(content, title, url);
}

module.exports = handleWebCrawling;
