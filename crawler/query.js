const { OpenAIEmbeddings, OpenAI } = require("@langchain/openai");
const { loadQAStuffChain } = require("langchain/chains");
const { Pinecone } = require("@pinecone-database/pinecone");
const { Document } = require('@langchain/core/documents');

async function processQuery(query) {
    console.log("Querying Pinecone vector store...");
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY
    });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

    const queryEmbedding = await new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY
    }).embedQuery(query);

    let queryResponse = await pineconeIndex.query({
        topK: 3,
        vector: queryEmbedding,
        includeValues: true,
        includeMetadata: true,
    })
    console.log(`Found ${queryResponse.matches.length} matches`);

    console.log(queryResponse);

    if (queryResponse.matches.length) {
        return askQuestion(queryResponse, query);
    }
    return "No relevant information found."
}

async function askQuestion(queryResponse, query) {
    const llm = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    const chain = loadQAStuffChain(llm);
    const concatenatedPageContent = queryResponse.matches
        .map((match) => match.metadata.pageContent)
        .join(" ");
    const result = await chain.invoke({
        input_documents: [new Document({ pageContent: concatenatedPageContent })],
        question: query,
    });

    console.log(`Answer: ${result.text}`);
    return result;
}

module.exports = processQuery;
