const { Pinecone } = require("@pinecone-database/pinecone");

async function initialisePinecone() {
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY
    });
    const name = process.env.PINECONE_INDEX;
    await createPineconeIndex(pinecone, name)
    console.log(`Pinecone index ${name} is created`);
}

async function createPineconeIndex(pinecone, name) {
    const index = pinecone.index('quickstart');

}

module.exports = initialisePinecone;
