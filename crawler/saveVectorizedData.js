const { OpenAIEmbeddings } = require("@langchain/openai");
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { Pinecone } = require("@pinecone-database/pinecone");
/**
// const word2vec = require('word2vec');
// const fs = require('fs');
// const path = require('path');
**/
async function saveVectorizedData(content, title, url) {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
  });
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
  });
  console.log("Splitting text into chunks...");
  const chunks = await textSplitter.createDocuments([content]);

  console.log(`Creating OpenAI Embeddings with ${chunks.length} text chunks...`);
  const embeddings = await new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY
  }).embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
  )
  console.log("Finished embeddings creation");
  console.log(`Creating ${chunks.length} vectors array with id, values, and metadata...`);
  await upsertChunksToPinecone(chunks, title, embeddings, url, pineconeIndex);
}

/**
// async function saveVectorizedData(content, title, url) {
//   const pinecone = new Pinecone({
//     apiKey: process.env.PINECONE_API_KEY
//   });
//   const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
//   const textSplitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 1000,
//   });
//
//   console.log("Splitting text into chunks...");
//   const chunks = await textSplitter.createDocuments([content]);
//
//   console.log("Generating word embeddings...");
//   const embeddings = await new Promise((resolve, reject) => {
//     word2vec.word2vec(chunks.map(chunk => chunk.pageContent.replace(/\n/g, " ")), (err, result) => {
//       if (err) {
//         reject(err);
//       }
//       else {
//         // Extract relevant word vectors for each chunk
//         const chunkEmbeddings = chunks.map(chunk => {
//           const words = chunk.pageContent.split(/\s+/);
//           const chunkVector = words.reduce((acc, word) => {
//             if (result[word]) {
//               acc = (acc || []).concat(result[word]); // Concatenate word vectors
//             }
//             return acc;
//           }, []);
//           return chunkVector;
//         });
//         resolve(chunkEmbeddings);
//       }
//     });
//   });
//
//   console.log("Finished embeddings creation");
//   console.log(`Creating ${chunks.length} vectors array with id, values, and metadata...`);
//   await upsertChunksToPinecone(chunks, title, embeddings, url, pineconeIndex);
// }

// async function saveVectorizedData(content, title, url) {
//   const pinecone = new Pinecone({
//     apiKey: process.env.PINECONE_API_KEY
//   });
//   const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
//   const textSplitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 1000,
//   });
//
//   console.log("Splitting text into chunks...");
//   const chunks = await textSplitter.createDocuments([content]);
//
//   console.log("Generating word embeddings...");
//   try {
//     // Create temporary file paths with unique names
//     const tempDir = path.join(__dirname, 'files'); // Replace with your desired temporary directory
//     const inputFilePath = path.join(tempDir, `wordlist_${Date.now()}.txt`);
//     const outputFilePath = path.join(tempDir, `embeddings_${Date.now()}.txt`);
//
//     // Ensure temporary directory exists
//     if (!fs.existsSync(tempDir)) {
//       fs.mkdirSync(tempDir, { recursive: true });
//     }
//
//     // Write word list to temporary file
//     await fs.promises.writeFile(inputFilePath, chunks.map(chunk => chunk.pageContent.replace(/\n/g, " ")).join('\n'));
//
//     await word2vec.word2vec(inputFilePath, outputFilePath);
//     word2vec.loadModel( outputFilePath, async function (error, model) {
//       const embeddings = model.getVectors();
//       await upsertChunksToPinecone(chunks, title, embeddings, url, pineconeIndex);
//     });
//   } catch (error) {
//     console.error("Error generating word embeddings:", error);
//   }
// }
**/

async function upsertChunksToPinecone(chunks, title, embeddings, url, pineconeIndex) {
  const batchSize = 100;
  let batch = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const id = `${title}_${Date.now()}_${i}`;
    const vector = {
      id,
      values: embeddings[i],
      metadata: {
        title,
        url,
        pageContent: chunk.pageContent,
      }
    };
    batch.push(vector);
    if (batch.length === batchSize || i === chunks.length - 1) {
      await pineconeIndex.upsert(batch);
      batch = [];
    }

    console.log(`Pinecone index updated with vectors`);
  }
}

module.exports = saveVectorizedData;
