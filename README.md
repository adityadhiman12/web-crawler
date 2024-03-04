# High Level: Web Data Crawling and Vectorisation Assignment:
This system capable of crawling data from a provided web URL,
vectorizing the crawled data, and enabling users to submit queries to retrieve and visualize
relevant information.

## Requirements
* Implement a web crawling mechanism in JavaScript or TypeScript to fetch and
extract data from any provided URL or website. 
* Ensure that your solution is capable of handling dynamic content or elements
loaded asynchronously on the web page. 
* Implement a method to convert the crawled textual data into vectorized
representations. Choose an appropriate vectorization technique (eg. Word
Embeddings) and store the data in a Vector DB. 
* Develop a system where the user submits text queries, vectorizing them using
the same technique, and providing the top 3 relevant crawled data.
## Fallback option:
    - As OpenAI accounts require credit card usage and may not allow to use the API calls, other implementation with npm library [word2vec](https://www.npmjs.com/package/word2vec) is also written and commented down but it will require more change and more time as this project was built in 1 day only.
## Prerequisites
    - Make sure you have node js installed with version `>=18.0.0` and npm version `>=8.0.0 <10.0.0`
    - You create should create Pinecone vector databse account and generate api key [pinecone-api-link](https://docs.pinecone.io/docs/quickstart#2-get-your-api-key).
    - You create should create OpenAI account and generate api key [openapi-link](https://platform.openai.com/account/api-keys).
1. **Install node js dependencies**
    - Go to the project's root folder and run
   ```sh
   $ npm install
   ```
2. **Configuration**
    - Create `.env` file in project's root folder with given template below and provide api keys mentioned below. You can tweak config according to your need.
        ```
      ENV=dev
      PORT=3005
      URL=http://127.0.0.1:3005
      OPENAI_API_KEY=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
      PINECONE_API_KEY=3d2e1064-5803-4e95-bff5-3cafea0a7ffb
      PINECONE_ENVIRONMENT=gcp-starter
      PINECONE_INDEX=highlevel-index
        ```
3. **Run App**
    - To start express server just run
        ```sh
        $ node app.js
        ```